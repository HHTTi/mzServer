
const express = require('express')
const pool = require('./pool')
const cors = require("cors")
const qs = require('querystring')
const path = require('path');
const session = require('express-session')

//  wx 公众号  
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
    }
}
// const wx_access_token = require('./src/wx_access_token');
const wx_subscription = require('./src/wx_subscription');

// 获取文章列表, 写入数据库；
const sub = new wx_subscription(config.wechat.appID,config.wechat.AppSecret);

    sub.syncLatestArticle();


    
/*引入路由模块*/
var index = require("./routes/index");
var products = require("./routes/products");
var users = require("./routes/users");
// 小程序 api
var wx = require("./routes/wx");

var app = express();

app.use(express.static('public'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session({
    secret: 'ddddddd',
    resave: false,
    saveUninitialized: true
}));
app.listen(3000);

app.use(express.static(path.join(__dirname, 'public')));

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

/*路由器路由*/
app.use("/index", index);
app.use("/products", products);
app.use("/users", users);
app.use("/wx", wx);
