const log4js = require('./middleware/logger')
const errlog = log4js.getLogger('err')
const infolog = log4js.getLogger('info')


const sms = require("qcloudsms_js");

// 短信应用SDK AppID
// 短信应用SDK AppKey
// 需要发送短信的手机号码
// 短信模板ID，需要在短信应用中申请
// 签名
const qcSmsConfig = {
    appid: 1400282268,
    appkey : "3e1d6697e3ffe25f703d9757f4ce3b61",
    templateId : 466595,
    smsSign : "HHTTi"
}

// 实例化QcloudSms
var qcloudsms = sms(qcSmsConfig.appid, qcSmsConfig.appkey);

// 设置请求回调处理, 这里只是演示，用户需要自定义相应处理回调
function callback(err, res, resData) {
    if (err) {
        errlog.error("SmsSingleSender: ", err);
    } else {
        infolog.info("SmsSingleSender request data: ", res.req);
        infolog.info("SmsSingleSender response data: ", resData);
    }
}

class sendSms {
    constructor(){
       
    }
    async tcSms(phone,params){
        let {templateId,smsSign} = qcSmsConfig,
            code = 0,
            ssender = qcloudsms.SmsSingleSender();

        await ssender.sendWithParam(
            86, 
            phone, 
            templateId,
            params, 
            smsSign, 
            "", "", 
            (err, res, resData) => {
                if (err) {
                    errlog.error("SmsSingleSender: ", err);
                } else {
                    code = 1
                    infolog.info("SmsSingleSender request data: ", res.req);
                    infolog.info("SmsSingleSender response data: ", resData);
                }
            }
        ); 
        return code ;
    }
}

module.exports = sendSms;