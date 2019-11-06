
const wx_access_token = require('./wx_access_token');
const axios = require('axios');

const default_config = {
    env: 'remind',
    name: 'openapi',
    POSTBODY: '' //云函数的传入参数
}

class mp_subscribe_messageg {
    constructor(appID, appSecret){
        this.wx_access_token = new wx_access_token(appID, appSecret)
    }
    async send(data){
        let access_token = await this.wx_access_token.getAccessToken(),
            url = `https://api.weixin.qq.com/cgi-bin/message/subscribe/send?access_token=${access_token}`,
            code = 0

        console.log('mp_subscribe_messagegdata',access_token,data);
        try{
            let res = await axios.post(url,data)
            console.log('status,data',res.status,res.data)
            if(res.status === 200) {

                code = 1
            }

        }catch (err){
            console.log('send subscribeMessage err==>',err )
        }

        return {code}
    }

}

module.exports = mp_subscribe_messageg