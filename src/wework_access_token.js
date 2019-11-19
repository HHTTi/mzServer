
const path = require('path');
const fe = require('fs-extra');
const axios = require('axios');

const log4js = require('./middleware/logger')
const errlog = log4js.getLogger('err')
const infolog = log4js.getLogger('info')



// POST https://lxapi.lexiangla.com/cgi-bin/token

class wework_access_token {

    constructor(appID,appSecret) {
        this.appID = appID;
        this.appSecret = appSecret;
    }

    /**
     *读取本地磁盘上access_token
     */
    getAccessTokenForLocalDisk(){
        let accessTokenFile = null;
        try {
            //读取当前目录下config/token文件中的token文件
            accessTokenFile = fe.readJsonSync(path.resolve('config','token',`${this.appID}.json`));
        } catch(e) {
            //如果文件不存在则创建一个空的access_token对象
            accessTokenFile = {
                access_token : '',
                expires_time : 0
            }
        }
        return accessTokenFile;
    }

    /**
     * 获取access_token
     */
    async getAccessToken() {
        const href = `https://lxapi.lexiangla.com/cgi-bin/token`;
        //获取本地存储的access_token
        const body = {
            grant_type: 'client_credentials',
            app_key: this.appID,
            app_secret: this.appSecret
        }
        const accessTokenFile = this.getAccessTokenForLocalDisk();
        
        const currentTime = Date.now();
        //如果本地文件中的access_token为空 或者 access_token的有效时间小于当前时间 表示access_token已过期
        if(accessTokenFile.access_token === '' || accessTokenFile.expires_time < currentTime) {
            try {
                //获取acccess_token
                const {data} = await axios.post(href,body);
                infolog.info('lxapi.lexiangla.com/cgi-bin/token:',data)
                if(data.access_token && data.expires_in) {
                    //将access_token保存到本地文件中
                    accessTokenFile.access_token = data.access_token;
                    accessTokenFile.expires_time = Date.now() + (parseInt(data.expires_in) - 180) * 1000;
                    // 有效期1小时57分钟
                    //将access_token写到本地文件中
                    const file = path.resolve('config','token',`${this.appID}.json`);
                    fe.ensureFileSync(file);
                    fe.outputJsonSync(file,accessTokenFile);
                    return data.access_token;
                } else {
                    throw new Error(JSON.stringify(data));
                }
            } catch (e) {
                errlog.error('请求获取access_token出错:',e);
            }
        }
        //access_token 没有过期，则直接返回本地存储的token
        else {
            return accessTokenFile.access_token;
        }
    }
    

}

module.exports = wework_access_token;