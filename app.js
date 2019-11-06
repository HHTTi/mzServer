
const express = require('express')
const pool = require('./pool')
const cors = require("cors")
const qs = require('querystring')
const path = require('path');
const session = require('express-session')
var bodyParser = require('body-parser');

const wx_subscription = require('./src/wx_subscription');
const mp_remind_list_timer = require('./src/mp_remind_list_timer')

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
    updataTime: 1000*60*60*24
}


// 获取文章列表, 写入数据库;
    
new CronJob('1 1 0 * * *', function() {
    console.log('You will see this message 1 1 0 * * *:',this);

    new wx_subscription(config.wechat.appID,config.wechat.AppSecret).syncLatestArticle();

    new mp_remind_list_timer(config.mp.appID,config.mp.AppSecret).getRemindList()

    }, null, true, 'Asia/Shanghai');

    
/*引入路由模块*/
var index = require("./routes/index");
var products = require("./routes/products");
var users = require("./routes/users");
var upload = require("./routes/upload");

// 小程序 api
var wx = require("./routes/wx");

var app = express();

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




// 更新文章列表
app.get('/update_wx_subscription', (req, res) => {
    let query = req.query ;
    console.log('update_wx_subscription:', query);
    
    const { appID, AppSecret, token } = config.wechat;

    if( query.token && query.token === token ){

        new wx_subscription(appID,AppSecret).syncLatestArticle();
        res.send({'code':1,'msg':'updateSuccess'})
    }else{
        res.send({'code':0})
    }
   
})