const log4js = require('./middleware/logger')
const errlog = log4js.getLogger('err')
const infolog = log4js.getLogger('info')


const axios = require('axios')

const wx_access_token = require('./wx_access_token');
const mp_subscribe_messageg = require('./mp_subscribe_message')
const send_sms = require('./send_sms')
const calendarJs = require('./compoments/calendar')
// const ca = new calendarJs

const CronJob = require('cron').CronJob

const MAX_LIMIT = 100

class mp_remind_list_timer {
    constructor(appID,appSecret){
        this.wx_access_token = new wx_access_token(appID,appSecret)
        this.mp_subscribe_messageg = new mp_subscribe_messageg(appID,appSecret)
        this.send_sms = new send_sms()
        this.ca = new calendarJs
    }

    async getRemindList() {

        let total, batchTimes,
            access_token = await this.wx_access_token.getAccessToken(),
            url = 'https://api.weixin.qq.com/tcb/databasequery?access_token=' + access_token,
            que = {
                env:'remind-oxwth',
                // query:`db.collection('remind').count()`
                query: "db.collection(\"remind\").limit(100).get()"
            }

        // t = await db_remind.count()
        try{
            let {status,data} = await axios.post(url,que)

            if(status === 200 && !data.errcode && data.pager) {
                total = data.pager.Total
                batchTimes = Math.ceil(total / 100)

                this.mapList(data.data)

                if(batchTimes <= 1){
                    return;
                }
                for (let i = 1; i < batchTimes; i++) {
                    let que2 = {
                        env:'remind-oxwth',
                        query: `db.collection(\"remind\")skip(${i * MAX_LIMIT}).limit(${MAX_LIMIT}).get()`
                    }
                    await axios.post(url,que2).then(res => {
                        if(res.data && res.data.data && res.data.data.length > 0){
                            this.mapList(res.data.data)
                        }
                    })
                    
                }
            }else {
                errlog.error('getRemindList axios.post:',status,data)
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
    async creatCronFn(time, tmplIds, nextBirthday, content, nickname, phone, openid, _id){
        let _this = this,smsres;
        infolog.info('creat  mp subscribeMessage at:',time)
        return new CronJob(time, async function () {

            //计划人 {{name4.DATA}}
            // 计划时间 {{date1.DATA}}
            // 温馨提示 {{thing3.DATA}}
            let data = {
                touser: openid,
                page: 'pages/remind/remind',
                data: {
                    name4: {
                    value: nickname
                  },
                  date1: {
                    value: nextBirthday
                  },
                  thing3: {
                    value: content || "请留意~"
                  }
                },
                template_id:tmplIds
            },
            params = [nextBirthday,nickname,content];

            phone = Number(phone)

            try {
                if(_this.isPhone(phone)) {
                    smsres = await _this.send_sms.tcSms(phone,params)
                    
                }
                const result = await _this.mp_subscribe_messageg.send(data)

                infolog.info('try send subscribeMessage, result:',result)

                return result
          
              } catch (err) {
                errlog.error('openapi--sendSubscribeMessage err:', err)
              }
            this.stop()
          }, null, true, 'Asia/Shanghai');

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