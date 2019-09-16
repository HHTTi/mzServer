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
    },
    admin_openid:{
        openId:'oJ4kB5Zk7tbkdcv0Fbd2SHffrpyQ',//qiu

    },
    simple_token:{
        admin:'simple_token'
    }

}
// 小程序 获取用户 openId
async function getUserOpenId(code) {
    try {

        const href = `https://api.weixin.qq.com/sns/jscode2session?appid=${config.mini_programs.appID}&secret=${config.mini_programs.AppSecret}&js_code=${code}&grant_type=authorization_code`;

        const { status, data } = await axios.get(href);

        return data;
    } catch (e) {
        console.log('getUserOpenId出错：', e);
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
        console.log("Confirm and send echo back");
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
        if (!data) {
            res.send({'code':0,'msg':'参数错误'});
            return
        };

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
        if (!data) {
            res.send({'code':0,'msg':'参数错误'});
            return
        };

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
        if (!data) {
            res.send({'code':0,'msg':'参数错误'});
            return
        };

        var sql = 'SELECT blog_id,title,thumb_url,thumb_media_id,author,digest,url,create_time from article_list where  blog_id < 20 ORDER BY create_time DESC'
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
        if (!data) {
            res.send({'code':0,'msg':'参数错误'});
            return
        };

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
 * @param openId             用户openId
 * @param blog_id            blog_id
 * @param user_message       user_message
 * @param user_nickName       user_nickName
 * @param user_avatarUrl       头像
 * 
 */
router.post('/add_user_message', (req, res) => {
    req.on("data", function (buf) {
        var data = JSON.parse(buf.toString());
        console.log('add_user_message:', data)
        if (!data) {
            res.send({'code':0,'msg':'参数错误'});
            return
        };
        const { openId, blog_id, user_message, user_nickName, user_avatarUrl } = data;

        var sql = 'INSERT INTO user_message ( openId , blog_id,user_nickName,user_avatarUrl, user_message,title ) VALUES( ? , ? , ?,?,?,? )'
        var sql2 = `SELECT title FROM article_list WHERE blog_id = ?`;

        pool.query(sql2,[blog_id],(err,resul)=>{
            if (err) throw err;
            console.log('SELECT title FROM article_list:',resul)
            if(resul.length >0 && resul[0].title){
                pool.query(sql, [openId, blog_id, user_nickName, user_avatarUrl, user_message,resul[0].title], (err, result) => {
                    if (err) throw err;
                    console.log('add_user_message--:', result)
                    if (result.affectedRows > 0) {
                        res.send({ 'code': 1 })
                    } else {
                        res.send({ 'code': 0 })
                    }
                })
            }
        })

    })
})


// 用户已经点赞的评论
/**
* @param openId                用户openId
* @param blog_id            blog_id
* 
*/
router.get('/current_u_msg_like', (req, res) => {
    var query = req.query ;
    console.log('current_u_msg_like:', query);
    if (!query) {
        res.send({'code':0,'msg':'参数错误'});
        return
    };

    const { openId, blog_id } = query;
    var sql = `SELECT u_message_id FROM user_message_likes WHERE openid = ? AND blog_id = ? `;
    pool.query(sql, [openId,blog_id], (err, result) => {
        if (err) throw err;
        console.log('current_u_msg_like:', result);

        if( result.length > 0 ){
            res.send({'code':1,'msg':result});
        }else    
            res.send({'code':0,'msg':result})

    })

})

// 用户是否点过赞
function can_add_u_msg_like(openid,u_message_id, cb) {
    var sql = `SELECT u_message_id FROM user_message_likes WHERE openid = ? AND u_message_id = ?`;
    pool.query(sql, [openid,u_message_id], (err, result) => {
        if (err) throw err;
        console.log('can_add_u_msg_like:', result)

        cb(result);

    })
}
// 修改 user_message 中 点赞数
function change_like_number(openId,u_message_id,number ,cb) {
    var sql2 = `SELECT like_number FROM user_message WHERE u_message_id = ? `;
    var sql3 = `UPDATE user_message SET like_number= ?  WHERE u_message_id = ?`;

    pool.query(sql2, [u_message_id], (error, result) => {
        if (error) throw err;
        console.log('result[0]:',result[0])

        let num = Number(result[0].like_number);
        num += Number(number);

        console.log('like_number sql2:', num)

        pool.query(sql3, [num, u_message_id], (err, resul) => {
            if (err) throw err;
            console.log('sql3', resul);
                cb(resul);
        })
    })

}
//点赞  或者 取消点赞
/**
* @param openId                用户openId
* @param blog_id            blog_id
* @param u_message_id       user_message
* 
*/
router.get('/add_u_msg_like', (req, res) => {
    var query = req.query, isSend = 0;
    console.log('add_u_msg_like.req', query);
    if (!query) {
        res.send({'code':0,'msg':'参数错误'});
        return
    };

    const { openId, blog_id, u_message_id } = query;
    const like_date = new Date();

    can_add_u_msg_like(openId,u_message_id,(result)=>{
        // && result[0].u_message_id == u_message_id
        if (result.length > 0 ) {
            var sql4 = `DELETE FROM user_message_likes WHERE u_message_id = ? `;
            pool.query(sql4,[u_message_id],(err,result) => {
                if (err) throw err;
                console.log('DELETE FROM user_message_likes:',result);
                change_like_number(openId,u_message_id,-1,(resul)=> {
                    if(resul.affectedRows > 0)
                        res.send({ 'code': 1 });
                    else 
                        res.send({ 'code': 0 ,'msg':resul});
                })
            })
        }else {
            var sql = `INSERT INTO user_message_likes (openId,blog_id,u_message_id,like_date)  VALUES ( ?,?,?,? ) `;
        
            pool.query(sql, [openId, blog_id, u_message_id, like_date], (err, result) => {
                if (err) throw err;
                console.log('add_u_msg_like sql1:', result);
                if (result.affectedRows > 0) {
                    isSend += 50;
                    isSend == 100 ? res.send({ 'code': 1 }) : ''
                }
            });
            change_like_number(openId,u_message_id,1,(resul)=> {
                if(resul.affectedRows > 0){
                    isSend += 50;
                    isSend == 100 ? res.send({ 'code': 1 }) : ''
                }else 
                    res.send({ 'code': 0 ,'msg':resul});
            })
            // pool.query(sql2, [u_message_id,openId], (err, result) => {
            //     if (err) throw err;
            //     let num = Number(result[0].like_number);
            //     num += 1;
        
            //     console.log('like_number sql2:', num)
        
            //     pool.query(sql3, [num, u_message_id], (err, resul) => {
            //         if (err) throw err;
            //         console.log('sql3', resul);
            //         if (resul.affectedRows > 0) {
            //             isSend += 50;
            //             isSend == 100 ? res.send({ 'code': 1 }) : ''
            //         }
            //     })
            // })
        }
    });
})

//用户所有的评论 
/**
* @param openId                用户openId
* 
*/
router.get('/current_u_msg_all', (req, res) => {
    var query = req.query ;
    if (!query) {
        res.send({'code':0,'msg':'参数错误'});
        return
    };

    const { openId } = query;
    console.log('current_u_msg_all:', openId);

    var sql = `SELECT u_message_id,blog_id,user_message,author_message,like_number,title FROM user_message WHERE openid = ? `;
    
    pool.query(sql, [openId], (err, result) => {
        if (err) throw err;
        console.log('current_u_msg_all:', result);

        if( result.length > 0 ){
            res.send({'code':1,'msg':result});
           
        }else    
            res.send({'code':0,'msg':result})
    })

})

// 用户删除评论
/**
* @param openId                用户openId
* @param blog_id               blog_id
* @param u_message_id          u_message_id
* 
*/
router.get('/current_u_msg_delete', (req, res) => {
    var query = req.query ;
    if (!query) {
        res.send({'code':0,'msg':'参数错误'});
        return
    };
    const { openId,blog_id,u_message_id } = query;
    console.log('current_u_msg_delete:', query);
    var sql = `DELETE FROM user_message WHERE openId = ? AND blog_id = ? AND u_message_id = ? `;
    pool.query(sql,[openId,blog_id,u_message_id],(err,resul)=> {
        if (err) throw err;
        if(resul.affectedRows > 0)
            res.send({ 'code': 1 });
        else 
            res.send({ 'code': 0 ,'msg':resul});
    })

})

// 管理员登录后台
/**
* @param openId                用户openId
* 
*/
router.get('/is_admin', (req, res) => {
    var query = req.query ;
    if (!query) {
        res.send({'code':0,'msg':'参数错误'});
        return
    };

    const { openId } = query;
    console.log('is_admin:',openId === config.admin_openid.openId,query);
    if(openId === config.admin_openid.openId){
        res.send({'code':1})
    }else {
        res.send({'code':0})
    }
})

router.post('/admin_login', (req, res) => {
    req.on("data", function (buf) {
        var data = JSON.parse(buf.toString());
        console.log('admin_login:', data);
        if(!data){
            res.send({'code':0,'msg':'参数错误'});
            return
        }
        if(data.name === 'admin' && data.pass === '123')
            res.send({'code':1,'msg':{'token':config.simple_token.admin}});
        else 
            res.send({'code':0});

    })
})
// 管理员查看评论
/**
* @param token          请求携带simple_token
* @param page           页数
* @param size           条数
* 
*/
router.get('/admin_all_message', (req, res) => {
    var query = req.query ;
    const { token, page, size } = query;
    console.log('admin_all_message:', token);

    if (!query || token != config.simple_token.admin) {
        res.send({'code':0,'msg':'参数错误'});
        return
    };

    var sql = `SELECT u_message_id,blog_id,user_message,author_message,like_number,title FROM user_message ORDER BY u_message_id DESC limit ?,? ;`;

    var p = Number((page-1)*size), s = Number(size);
    
    pool.query(sql, [p,s], (err, result) => {
        if (err) throw err;
        console.log('admin_all_message:', result);

        if( result.length > 0 ){
            res.send({'code':1,'msg':result});
        }else    
            res.send({'code':0,'msg':result})
    })

})

// 管理员删除评论
/**
* @param token                 token
* @param blog_id               blog_id
* @param u_message_id          u_message_id
* 
*/
router.get('/admin_msg_delete', (req, res) => {
    var query = req.query ;
    const { blog_id,u_message_id,token } = query;
    console.log('admin_msg_delete:', query);

    if (!query || token != config.simple_token.admin) {
        res.send({'code':0,'msg':'参数错误'});
        return
    };
    
    var sql = `DELETE FROM user_message WHERE blog_id = ? AND u_message_id = ? `;
    pool.query(sql,[blog_id,u_message_id],(err,resul)=> {
        if (err) throw err;
        if(resul.affectedRows > 0)
            res.send({ 'code': 1 });
        else 
            res.send({ 'code': 0 ,'msg':resul});
    })

})

// 管理员回复留言
/**
 * @param blog_id               blog_id
 * @param u_message_id          u_message_id
 * @param reply                 author_message
 * @param token                 token
 * 
 */
router.post('/admin_reply_message', (req, res) => {
    req.on("data", function (buf) {
        var data = JSON.parse(buf.toString());
        const { blog_id,u_message_id, reply,token } = data;

        console.log('admin_reply_message:', data)

        if (!data|| token != config.simple_token.admin) {
            res.send({'code':0,'msg':'参数错误'});
            return
        };
        var sql = 'UPDATE user_message SET author_message= ? WHERE blog_id = ? AND u_message_id = ? '

        pool.query(sql,[reply,blog_id,u_message_id],(err,result)=>{
            if (err) throw err;

            console.log('admin_reply_message--:', result)
            if (result.affectedRows > 0) {
                res.send({ 'code': 1 })
            } else {
                res.send({ 'code': 0 })
            }
        })

    })
})

// 管理员置顶留言
/**
* @param token                 token
* @param blog_id               blog_id
* @param u_message_id          u_message_id
* 
*/
router.get('/admin_to_top_message', (req, res) => {
    var query = req.query ;
    const { blog_id,u_message_id,token } = query;
    console.log('admin_to_top_message:', query);

    if (!query || token != config.simple_token.admin) {
        res.send({'code':0,'msg':'参数错误'});
        return
    };
    var sql = `SELECT is_top FROM user_message WHERE blog_id = ? AND u_message_id = ?`
    var sql2 = `UPDATE user_message SET is_top= ? WHERE blog_id = ? AND u_message_id = ?`;
    pool.query(sql,[blog_id,u_message_id],(err,resul)=> {
        if (err) throw err;
        if(resul.length > 0){
            let isTop = resul[0];
            pool.query(sql2,[!isTop,blog_id,u_message_id],(err,result)=> {
                if (err) throw err;
                if(result.affectedRows > 0)
                    res.send({ 'code': 1 ,msg:{'isTop':!isTop}});
                else 
                    res.send({ 'code': 0 ,'msg':result});
            })
        }else {
            res.send({ 'code': 0 ,'msg':resul});
        }

    })

})


module.exports = router;