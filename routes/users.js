var express=require("express");
var router=express.Router();
var pool=require("../pool");

//登陆 ------session id == user id-----
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
//登陆状态
router.get('/isLogin',(req,res)=>{
    var uid = req.session["uid"]
    if(uid === undefined){
        res.send({"code": 0 ,"msg": "未登陆"})
    }else{
        var sql = 'select uname from meizu_user where uid = ?'
        pool.query(sql,[uid],(err,result)=>{
            if(err) throw err;
            var user = result[0].uname
            console.log(user)
            res.send({"code" : 1 , "msg": user})
        })
    }
})
//注销
router.get("/loginout",(req,res)=>{
    delete req.session.uid;
    res.send();
  })
//注册
router.post('/register',(req,res)=>{
    req.on('data',(buf)=>{
        var data = {}
        var arr = buf.toString().split("&")
        for( var i=0;i < arr.length;i++){
            data[arr[i].split('=')[0]] = arr[i].split('=')[1]
        }
        console.log(data)
        var sql = "INSERT INTO `meizu_user` ( `uname`, `upwd`) VALUES ( ? ,? )"
        pool.query(sql,[data.name ,data.pwd],(err,result)=>{
            if(err) throw err
            console.log(result)
            if(result.affectedRows >0) res.send({'code':1,msg:'注册成功'})
            else res.send({'code':0,msg:'注册失败'})
        })
    })
})
//加购物车
router.get('/addshopcart',(req,res)=>{
    var uid = req.session["uid"]
    var pid = req.query.pid
    var family_name = req.query.family_name
    var color = req.query.color
    var price = req.query.price
    var spec = req.query.spec
    var number = req.query.number
    var url = req.query.url
    var sql = "INSERT INTO `meizu_shopcart`(`uid`,`pid`,`family_name`,`color`,`price`,`spec`,`number`,`url`) VALUES (?, ?, ?, ?, ?, ?, ?, ?);"
    console.log(uid,req.query)
    pool.query(sql,[uid,pid,family_name,color,price,spec,number,url],(err,result)=>{
        if(err) throw err;
        console.log(result)
        if(result. affectedRows > 0){
            res.send({code:1,msg:"加入购物车成功"})
        }else{
            res.send({code:0,msg:"加入购物车失败"})
        }
    })
})
//查询购物车
router.post('/selectshopcart',(req,res)=>{
    var uid = req.session["uid"]
    var sql = "SELECT * FROM `meizu_shopcart` WHERE uid = ?"
    console.log(uid)
    pool.query(sql,[uid],(err,result)=>{
        if(err) throw err;
        console.log(result)
        if(result.length > 0){
            res.send({code:1,msg:{result}})
        }else res.send({code:0,msg:'购物车为空'})
    })
})




module.exports=router;