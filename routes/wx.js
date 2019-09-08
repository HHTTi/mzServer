var express=require("express");
var router=express.Router();
var pool=require("../pool");
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
async function getUserOpenId(code){
    try{

        const href = `https://api.weixin.qq.com/sns/jscode2session?appid=${config.mini_programs.appID}&secret=${config.mini_programs.AppSecret}&js_code=${code}&grant_type=authorization_code`;
        
        const {status,data} = await axios.get(href);
        
        return data;
    } catch(e) {
        console.error('getUserOpenId出错：',e);
    }
}
function sha1(str){
    var sha = crypto.createHash("sha1");
    sha.update(str);
    str = sha.digest("hex");
    return str;
}
//  公众号 token 验证
router.get("/token",(req,res)=>{
    console.log('wx.test.req',req);
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
    console.log("Signature : " + signature );
    var scyptoString = sha1(original);
    if(signature == scyptoString){
        res.send(echostr);
        console.log("Confirm and send echo back");``
    }else {
        res.send("false");
        console.log("Failed!");
    }

})

// 用户openId 
router.post('/user_openId',(req,res)=>{

    req.on("data",function(buf){
        var data = JSON.parse(buf.toString());
        
        // console.log('user_openId',data)
        console.log('this req',data)

        getUserOpenId(data.code).then(result => {
            console.log(result,'====');
           
            res.send({'code':1,msg: result})
        });


        var sql = 'SELECT blog_id,title,thumb_url,thumb_media_id,author,digest,url,create_time from article_list where  blog_id < 20'
        // pool.query(sql ,(err,result)=>{
        //     if(err) throw err
        //     console.log('article_list_result:',result)
        //     if(result.length >0){
                
        //         res.send({'code':1,'msg':result})
        //     }else 
        //         res.send({'code':0,'msg':'no article'})
        // })
    })
})



// 获取文章列表
router.post('/article_list',(req,res)=>{
    var query = req.query;
    console.log('query:',req)
    req.on("data",function(buf){
        var data = JSON.parse(buf.toString());
        
        console.log('article_list',data,data.name)
        var sql = 'SELECT blog_id,title,thumb_url,thumb_media_id,author,digest,url,create_time from article_list where  blog_id < 20'
        pool.query(sql ,(err,result)=>{
            if(err) throw err
            console.log('article_list_result:',result)
            if(result.length >0){
                
                res.send({'code':1,'msg':result})
            }else 
                res.send({'code':0,'msg':'no article'})
        })

    })
})


// 获取文章的 评论列表 点赞数量 用户点赞
/**
 * @param appID       开发者ID(AppID)
 * @param appSecret   开发者密码(AppSecret)
 */
router.post('/article_user_message',(req,res)=>{
    req.on("data",function(buf){
        var data = JSON.parse(buf.toString());
        
        console.log('article_list',data)
        var sql = 'SELECT blog_id,title,thumb_url,thumb_media_id,author,digest,url,create_time from article_list where  blog_id < 20'
        pool.query(sql ,(err,result)=>{
            if(err) throw err
            console.log('article_list_result:',result)
            if(result.length >0){
                
                res.send({'code':1,'msg':result})
            }else 
                res.send({'code':0,'msg':'no article'})
        })

    })
})


router.post('/login',(req,res)=>{
    req.on("data",function(buf){
        var data = {}
        var arr = buf.toString().split("&")
        for( var i=0;i < arr.length;i++){
            data[arr[i].split('=')[0]] = arr[i].split('=')[1]
        }
        console.log(data)
        var sql = 'select * from meizu_user where uname = ? and upwd = ?'
        pool.query(sql,[data.uname ,data.upwd],(err,result)=>{
            if(err) throw err
            console.log(result)
            if(result.length >0){
                var user = result[0]
                req.session['uid'] = user['uid']
                console.log(req.session['uid'])
                res.send({'code':1,'msg':user.uname})
            }
            else res.send({'code':0,'msg':'登陆失败'})
        })
        
    })
})




module.exports=router;