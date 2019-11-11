const log4js = require('./middleware/logger')
const errlog = log4js.getLogger('err')
const infolog = log4js.getLogger('info')


const axios = require('axios')

const wx_access_token = require('./wx_access_token');
const mp_subscribe_messageg = require('./mp_subscribe_message')
const mp_cloud_http_api = require('./mp_cloud_http_api')
const send_sms = require('./send_sms')
const calendarJs = require('./compoments/calendar')
// const ca = new calendarJs

const CronJob = require('cron').CronJob

const env = "remind-oxwth"
const MAX_LIMIT = 100

class mp_remind_list_timer {
    constructor(appID,appSecret){
        this.wx_access_token = new wx_access_token(appID,appSecret)
        this.mp_cloud_http_api = new mp_cloud_http_api()
        this.mp_subscribe_messageg = new mp_subscribe_messageg(appID,appSecret)
        this.send_sms = new send_sms()
        this.ca = new calendarJs
    }

    async getRemindList() {

        let total, batchTimes,
            access_token = await this.wx_access_token.getAccessToken(),
            que = {
                env,
                query: "db.collection(\"remind\").limit(100).get()"
            }

        // t = await db_remind.count()
        try{
            let res = this.mp_cloud_http_api.databaseQuery(access_token,que)

            if(res.code && res.pager) {
                total = res.pager.Total
                batchTimes = Math.ceil(total / 100)

                if( total > 0 && res.data.length > 0 ){
                    this.mapList(res.data)
                }

                if(batchTimes <= 1){
                    return;
                }
                for (let i = 1; i < batchTimes; i++) {
                    que = {
                        env,
                        query: `db.collection(\"remind\")skip(${i * MAX_LIMIT}).limit(${MAX_LIMIT}).get()`
                    }
                    res = await this.mp_cloud_http_api.databaseQuery(access_token,que)
                    
                    if(res.code && res.data && res.data.length > 0) {
                        this.mapList(res.data)
                    }
                }
            }else {
                errlog.error('getRemindList axios.post:',res)
            }
            
        }catch(err){
            errlog.error('axios.post(db.collection(\"remind\").limit(20).get()) err:',err)
        }

    }

    async mapList(list){
        let code = 0,
        now  = new Date(),
        thisYear = now.getFullYear(),
        thisMonth = now.getMonth(),
        thisDay = now.getDate(),
        thisHourse = now.getHours(),
        thisMinutes = now.getMinutes();
        if(!Array.isArray(list) && list.length <= 0) {
            return code;
        }
        list.map(item => {

            let { birthday, calendar, content, isLeapMonth, nickname, openid, remind_date, phone, remind_time, _id, tmplIds } = JSON.parse(item),
                next;

            next = this.ca.getBirthday(calendar, birthday, isLeapMonth);

            let { nextBirthday, fromToday } = next;

            infolog.info('next::', next,'remind_time:',remind_time)

            switch (remind_date) {
                case '前一天': {
                fromToday -= 1
                break;
                }
                case '前两天': {
                fromToday -= 2
                break;
                }
                case '前三天': {
                fromToday -= 3
                break;
                }
                case '前一周': {
                fromToday -= 7
                break;
                }
                default:
                null;
            }
            if (fromToday === 0) {
                let t = remind_time.split(":"),
                    time = `0 ${t[1]} ${t[0]} ${thisDay} ${thisMonth} *`;
                
                if( thisHourse < Number(t[0]) || (thisHourse === Number(t[0]) && thisMinutes < Number(t[1])) ) {

                    this.creatCronFn(time, tmplIds, nextBirthday, content, nickname, phone, openid, _id)
                    code = 1
                }
            }

        })
        return code;
    }
    async creatCronFn(time, tmplIds, nextBirthday, content, nickname, phone, openid, _id) {
        infolog.info('creat  mp subscribeMessage at:',time)
        
        let _this = this,
            smsres,sid
            msgres
            newCron,
            access_token = await this.wx_access_token.getAccessToken();

        newCron  =  new CronJob(
            time, 
            async function () {
                // 提醒人{{name1.DATA}}
                // 提醒日期{{date2.DATA}}
                // 提醒事项{{thing3.DATA}}
                let data = {
                    touser: openid,
                    page: 'pages/remind/remind',
                    data: {
                        name1: {
                        value: nickname
                    },
                    date2: {
                        value: nextBirthday
                    },
                    thing3: {
                        value: content || "请留意~"
                    }
                    },
                    template_id:tmplIds
                },
                params = [nextBirthday,nickname,content ? content : '无' ];

                phone = Number(phone)

                try {
                    // 发送订阅消息
                    msgres = await _this.mp_subscribe_messageg.send(data)
                    // 发送短信
                    if(_this.isPhone(phone)) {
                        smsres = await _this.send_sms.tcSms(phone,params)
                        if(smsres.code) {
                            sid = res.sid
                        }
                    }
                    if(msgres.code || sid ) {
                        // TODO: 记录到数据库
                        let  que = {
                            env,
                            query:`db.collection('send_remind').add({
                                data:[{
                                    openid:'${openid}',
                                    remind_id:'${remind_id}',
                                    nextBirthday:'${nextBirthday}',
                                    nickname:'${nickname}',
                                    content:'${content}',
                                    phone:'${phone}',
                                    sid:'${sid}'
                                }]
                            })`
                        }

                        let  res = _this.mp_cloud_http_api.databaseAdd(access_token,que)
                        
                        infolog.info('try send subscribeMessage, result:',res)

                    }

                } catch (err) {
                    errlog.error('openapi--sendSubscribeMessage err:', err)
                }
                this.stop()
                }, 
            null, 
            true, 
            'Asia/Shanghai'
        );

        return newCron;
    }

    isPhone(phone) {
        let r=/^[1][3,4,5,6,7,8,9][0-9]{9}$/;
        if (!r.test(phone)) {
            return false;
        } else {
            return true;
        }
    }

}

module.exports = mp_remind_list_timer;