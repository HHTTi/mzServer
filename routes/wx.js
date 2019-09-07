var express=require("express");
var router=express.Router();
var pool=require("../pool");
const crypto = require('crypto'); // node内置的加密模块

const config = {
    wechat: {
      appID: 'wxb2cc31675638526f', 
      AppSecret: 'b9658d5f13d98a90a4e99a2b14cc79f4',  
      token: '2333'  
    }
}
function sha1(str){
    var sha = crypto.createHash("sha1");
    sha.update(str);
    str = sha.digest("hex");
    return str;
}
// 微信 token 验证
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