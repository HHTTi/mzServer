
const express = require('express')
const pool = require('./pool')
const cors = require("cors")
const qs = require('querystring')
const path = require('path');
const session = require('express-session')
const bodyParser = require('body-parser');


const log4js = require('./src/middleware/logger')

// const logger = log4js.getLogger()//根据需要获取logger
const errlog = log4js.getLogger('err')
const infolog = log4js.getLogger('info')


const wx_subscription = require('./src/wx_subscription');
const mp_remind_list_timer = require('./src/mp_remind_list_timer')
const wework_access_token = require('./src/wework_access_token')
// const send_sms = require('./src/send_sms')

const CronJob = require('cron').CronJob

const config = {
    wechat: {
        //      订阅号 -- 人为拙
        //   appID: 'wxb2cc31675638526f', 
        //   AppSecret: 'b9658d5f13d98a90a4e99a2b14cc79f4',  
        //   token: '2333'  
        //      订阅号  -- 图图大人
        appID: 'wxa34cf52c5af17457',
        AppSecret: '6b6b785d9b3523d12d87e4e76bbfa40d',
        token: '2333'
    },
    mp: {
        appID: 'wx33f95de10fd07a5f',
        AppSecret: '320148ec073b171d80a5a33b6d24d99b',
        token: '2333'
    },
    //
    sansi: {
        appKey: 'c4c90c3095a511e9b61a5254002f1020',
        appSecret: 'bsoVHjlVE9EesSu5NySizkWkFRyjviJP0nDAkzw0'
    },
    sansiled: {
        appKey: '8d0543aad6c311e8899e52540005f435',
        appSecret: 'KQdV1GihMrdQVPEbqrRKjwW8x3epJLqBDWOScVsu'
    },
    updataTime: 1000 * 60 * 60 * 24
}

// new wework_access_token(config.sansiled.appKey,config.sansiled.appSecret).getThreads()

// 获取文章列表, 写入数据库;
new CronJob('1 0 0 * * *', function () {
    console.log('You will see this message 1 0 0 * * *:', this);

    new wx_subscription(config.wechat.appID, config.wechat.AppSecret).syncLatestArticle();

    new mp_remind_list_timer(config.mp.appID, config.mp.AppSecret).getRemindList()

}, null, true, 'Asia/Shanghai');


/*引入路由模块*/
var index = require("./routes/index");
var products = require("./routes/products");
var users = require("./routes/users");
var upload = require("./routes/upload");
// 小程序 api
var wx = require("./routes/wx");
var wework = require('./routes/wework')


const app = express();

log4js.useLogger(app)

app.use(express.static(path.resolve(__dirname, '../client/public')));
app.use(express.static(path.resolve(__dirname, './uploadFiles/wework')));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.use(express.static(path.join(__dirname, 'public')));


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(session({
    secret: 'ddddddd',
    resave: false,
    saveUninitialized: true
}));
app.listen(3000);





/*路由器路由*/
app.use("/index", index);
app.use("/products", products);
app.use("/users", users);
app.use("/wx", wx);
app.use("/upload", upload);
app.use("/wework", wework)









// 更新文章列表
app.get('/update_wx_subscription', (req, res) => {
    let query = req.query;
    infolog.info('update_wx_subscription:', query);

    const { appID, AppSecret, token } = config.wechat;

    if (query.token && query.token === token) {

        new wx_subscription(appID, AppSecret).syncLatestArticle();
        res.send({ 'code': 1, 'msg': 'updateSuccess' })
    } else {
        res.send({ 'code': 0 })
    }

})
// 更新提醒列表
app.get('/update_mp_subscribe_list', (req, res) => {
    let query = req.query;
    infolog.info('update_mp_subscribe_list:', query);

    const { appID, AppSecret, token } = config.mp;

    if (query.token && query.token === token) {

        new mp_remind_list_timer(appID, AppSecret).getRemindList()

        res.send({ 'code': 1, 'msg': 'updateSuccess' })
    } else {
        res.send({ 'code': 0 })
    }

})