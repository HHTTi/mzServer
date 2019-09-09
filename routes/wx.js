var express = require("express");
var router = express.Router();
var pool = require("../pool");
const crypto = require('crypto'); // node内置的加密模块
const axios = require('axios');
const wx_access_token = require('../src/wx_access_token');

const config = {
    wechat: {
        appID: 'wxb2cc31675638526f',
        AppSecret: 'b9658d5f13d98a90a4e99a2b14cc79f4',
        token: '2333'
    },
    mini_programs: {
        appID: 'wx4d78fee2c7b83f97',
        AppSecret: 'fd79eb19ce1811f3f7964f91bf2435c5',
    }
}
// 小程序 获取用户 openId
async function getUserOpenId(code) {
    try {

        const href = `https://api.weixin.qq.com/sns/jscode2session?appid=${config.mini_programs.appID}&secret=${config.mini_programs.AppSecret}&js_code=${code}&grant_type=authorization_code`;

        const { status, data } = await axios.get(href);

        return data;
    } catch (e) {
        console.error('getUserOpenId出错：', e);
    }
}
function sha1(str) {
    var sha = crypto.createHash("sha1");
    sha.update(str);
    str = sha.digest("hex");
    return str;
}
//  公众号 token 验证
router.get("/token", (req, res) => {
    console.log('wx.test.req', req);
    var query = req.query;

    var signature = query.signature;
    var echostr = query.echostr;
    var timestamp = query['timestamp'];
    var nonce = query.nonce;
    var oriArray = new Array();
    oriArray[0] = nonce;
    oriArray[1] = timestamp;
    oriArray[2] = "2333"
    oriArray.sort();
    var original = oriArray.join('');
    console.log("Original str : " + original);
    console.log("Signature : " + signature);
    var scyptoString = sha1(original);
    if (signature == scyptoString) {
        res.send(echostr);
        console.log("Confirm and send echo back"); ``
    } else {
        res.send("false");
        console.log("Failed!");
    }

})

//get 用户openId 
router.post('/user_openId', (req, res) => {

    req.on("data", function (buf) {
        var data = JSON.parse(buf.toString());

        console.log('this req', data)
        if (!data) return;

        getUserOpenId(data.code).then(result => {
            console.log(result, '====');
            var sql = 'SELECT uid  from user_info where openId = ?'
            pool.query(sql, [result.openid], (err, resul) => {
                if (err) throw err;
                console.log('getUserOpenId result:', resul);
                resul.length > 0 ?
                    result.hasInfoData = true
                    :
                    result.hasInfoData = false

                res.send({ 'code': 1, msg: result })

            })
        });

    })
})
/** 保存用户openId 
 * @param openId       openId
 * @param uname       uname
 * @param avatarUrl       avatarUrl
 *      
 */
router.post('/add_user_info_data', (req, res) => {

    req.on("data", function (buf) {
        var data = JSON.parse(buf.toString());
        console.log('add_user_info_data', data);
        if (!data) return;

        const sql = `INSERT INTO user_info ( openId , uname, avatarUrl ) VALUES( ? , ? , ? )`
        pool.query(sql, [data.openid, data.userInfo.nickName, data.userInfo.avatarUrl], (err, result) => {
            if (err) throw err;
            console.log('add_user_info_data result:', result);
            if (result.affectedRows > 0) {
                res.send({ 'code': 1 })
            } else {
                res.send({ 'code': 0 })
            }
        })
    })
})


// 获取文章列表
router.post('/article_list', (req, res) => {
    var query = req.query;
    console.log('query:', req)
    req.on("data", function (buf) {
        var data = JSON.parse(buf.toString());
        console.log('article_list', data, data.name);
        if (!data) return;

        var sql = 'SELECT blog_id,title,thumb_url,thumb_media_id,author,digest,url,create_time from article_list where  blog_id < 20'
        pool.query(sql, (err, result) => {
            if (err) throw err;
            console.log('article_list_result:', result)
            if (result.length > 0) {

                res.send({ 'code': 1, 'msg': result })
            } else
                res.send({ 'code': 0, 'msg': 'no article' })
        })

    })
})


// 获取文章的 评论列表 点赞数量 用户点赞
/**
 * @param blog_id       blog_id
 * @param openId         用户openId
 */
router.post('/article_user_message', (req, res) => {
    req.on("data", function (buf) {
        const data = JSON.parse(buf.toString());
        const { openId, blog_id } = data
        console.log('article_user_message 评论列表:', data);
        if (!data) return;

        var sql = `SELECT u_message_id,openId,user_nickName,user_avatarUrl,user_message,author_message,is_top,is_show,like_number FROM user_message WHERE blog_id = ? `
        pool.query(sql, [blog_id], (err, result) => {
            if (err) throw err;
            console.log('article_user_message sql:', result);

            result.forEach(ele => {
                if (!openId && ele.openId == openId) {
                    ele.isCurrentUser = true;
                }
                delete ele.openId;
            });
            res.send({ 'code': 1, 'msg': result })
        })

    })
})

// 提交评论 
/**
 * @param openId                用户openId
 * @param blog_id            blog_id
 * @param user_message       user_message
 * @param user_message       user_message
 * 
 */
router.post('/add_user_message', (req, res) => {
    req.on("data", function (buf) {
        var data = JSON.parse(buf.toString());
        console.log('add_user_message:', data)
        if (!data) return;

        const { openId, blog_id, user_message, user_nickName, user_avatarUrl } = data;
        var sql = 'INSERT INTO user_message ( openId , blog_id,user_nickName,user_avatarUrl, user_message ) VALUES( ? , ? , ?,?,? )'
        pool.query(sql, [openId, blog_id, user_nickName, user_avatarUrl, user_message], (err, result) => {
            if (err) throw err;
            console.log('add_user_message--:', result)
            if (result.affectedRows > 0) {
                res.send({ 'code': 1 })
            } else {
                res.send({ 'code': 0 })
            }
        })

    })
})

// 用户是否点过赞
function can_add_u_msg_like(openid, cb) {
    var sql = `SELECT u_message_id FROM user_message_likes WHERE openid = ?`;
    pool.query(sql, [openid], (err, result) => {
        if (err) throw err;
        console.log('can_add_u_msg_like:', result)

        cb(result);

    })
}
// 用户已经点赞的评论
/**
* @param openId                用户openId
* @param blog_id            blog_id
* 
*/
router.get('/current_u_msg_like', (req, res) => {
    var query = req.query ;
    console.log('current_u_msg_like:', query);
    if (!query) return;

    const { openId, blog_id } = query;

    can_add_u_msg_like(openId, (result) =>{
        if(result.length>0)
            res.send({'code':1,'msg':result})
        else    
            res.send({'code':0,'msg':result})
    })
})


//点赞 (在能点赞的情况下)
/**
* @param openId                用户openId
* @param blog_id            blog_id
* @param u_message_id       user_message
* 
*/
router.get('/add_u_msg_like', (req, res) => {
    var query = req.query, isSend = 0;
    console.log('add_u_msg_like.req', query);
    if (!query) return;

    const { openId, blog_id, u_message_id } = query;
    const like_date = new Date();

    can_add_u_msg_like(openId,(result)=>{
        if (result.length > 0 && result[0].u_message_id == u_message_id) {
            res.send({ 'code': 0 });
        }else {
            var sql = `INSERT INTO user_message_likes (openId,blog_id,u_message_id,like_date)  VALUES ( ?,?,?,? ) `;
            var sql2 = `SELECT like_number FROM user_message WHERE u_message_id = ?`;
            var sql3 = `UPDATE user_message SET like_number= ?  WHERE u_message_id = ?`;
        
            pool.query(sql, [openId, blog_id, u_message_id, like_date], (err, result) => {
                if (err) throw err;
                console.log('add_u_msg_like sql1:', result);
                if (result.affectedRows > 0) {
                    isSend += 50;
                    isSend == 100 ? res.send({ 'code': 1 }) : ''
                }
            });
        
            pool.query(sql2, [u_message_id], (err, result) => {
                if (err) throw err;
                let num = Number(result[0].like_number);
                num += 1;
        
                console.log('like_number sql2:', num)
        
                pool.query(sql3, [num, u_message_id], (err, resul) => {
                    if (err) throw err;
                    console.log('sql3', resul);
                    if (resul.affectedRows > 0) {
                        isSend += 50;
                        isSend == 100 ? res.send({ 'code': 1 }) : ''
                    }
                })
            })
        }
    });



})



module.exports = router;