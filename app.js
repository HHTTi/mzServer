
const express = require('express')
const pool = require('./pool')
const cors = require("cors")
const qs = require('querystring')
const path = require('path');
const session = require('express-session')

const https = require('https');

/*引入路由模块*/
var index = require("./routes/index");
var products = require("./routes/products");
var users = require("./routes/users");

var app = express();

app.use(express.static('public'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session({
    secret: '128位字符串',
    resave: false,
    saveUninitialized: true
}));
app.listen(3000);

app.use(express.static(path.join(__dirname, 'public')));

//小程序路由
app.get('/text1', (req, res) => {
    var id = req.query.id
    var age = req.query.age
    res.send(id + age)
})

/*路由器管理路由*/
app.use("/index", index);
app.use("/products", products);
app.use("/users", users);