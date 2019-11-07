
const log4js = require('./middleware/logger')
const errlog = log4js.getLogger('err')
const infolog = log4js.getLogger('info')

const wx_access_token = require('./wx_access_token');
const axios = require('axios');



class mp_subscribe_messageg {
    constructor(appID, appSecret){
        this.wx_access_token = new wx_access_token(appID, appSecret)
    }
    async send(data){
        let access_token = await this.wx_access_token.getAccessToken(),
            url = `https://api.weixin.qq.com/cgi-bin/message/subscribe/send?access_token=${access_token}`,
            code = 0

        infolog.info('send mp_subscribe_messagegdata to wx:',access_token,data)

        try{
            let res = await axios.post(url,data)

            infolog.info('send mp_subscribe_messageg result:',res.status,res.data)

            if(res.status === 200) {

                code = 1
            }

        }catch (err){
            errlog.error('send subscribeMessageto wx:',err )
        }

        return {code}
    }

}

module.exports = mp_subscribe_messageg