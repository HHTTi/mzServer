
const axios = require('axios')


class mp_cloud_http_api {
    constructor(appID,appSecret){
        this.wx_access_token = new wx_access_token(appID,appSecret)
    }
    async databaseMigrateExport(){

    }
    async databaseQuery(token,que){
        let url = `https://api.weixin.qq.com/tcb/databasequery?access_token=${token}`,
            code = 0;
            
        try{
            let {status,data} = await axios.post(url,que)
            if(status === 200 && !data.errcode) {
                code = 1 
                return {
                    code,
                    pager: data.pager,
                    data:data.data
                }
            }else {
                errlog.error('databaseQuery axios.post ERR:',status,data)
                return {code};
            }
            
        }catch(err){
            errlog.error('databaseQuery err:',err)
        }
    }
    async databaseAdd(token,que){
        let url = `https://api.weixin.qq.com/tcb/databaseadd?access_token=${token}`,
            code = 0;
        
        try{
            let {status,data} = await axios.post(url,que)
            if(status === 200 && !data.errcode) {
                code = 1 
                return {
                    code,
                    id_list: data.id_list
                }
            }else {
                errlog.error('databaseAdd axios.post ERR:',status,data)
                return {code};
            }

        }catch(e){
            errlog.error('databaseAdd err:',e)
        }
    }
}

module.exports = mp_cloud_http_api;