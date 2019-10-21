var express=require("express");
var router=express.Router();
var pool=require("../pool");

//首页--banner
router.get("/bannerList",(req,res)=>{
    var obj=[
        {id:"1",href:'/#/home/goodsinfo/321',banner_url:"/img/banner1.jpg"},
        {id:"2",href:'/#/home/goodsinfo/311',banner_url:"/img/banner2.jpg"},
        {id:"3",href:'/#/home/goodsinfo/301',banner_url:"/img/banner3.jpg"},
        {id:"4",href:'/#/home/goodsinfo/302',banner_url:"/img/banner4.jpg"},
		{id:"5",href:'/#/home/goodsinfo/106',banner_url:"/img/banner5.jpg"},
		{id:"6",href:'/#/home/goodsinfo/201',banner_url:"/img/banner6.jpg"},
		{id:"7",href:'/#/home/goodsinfo/101',banner_url:"/img/banner7.jpg"},
    ];
   /* res.writeHead(200,{
        "Content-Type":"application/json;charset=utf-8",
        "Access-Control-Allow-Origin":"*"
      })
      res.write(JSON.stringify(obj));
      res.end();
      */
     res.send(obj)
})
//首页--
router.get("/grids",(req,res)=>{
    var obj=[
        {id:"1",grid:"/img/grid1.jpg",href:'#/home/goodsinfo/201'},
        {id:"2",grid:"/img/grid2.jpg",href:'#/home/goodsinfo/101'},
        {id:"3",grid:"/img/grid3.jpg",href:'#/home/goodsinfo/301'}
    ];
    res.send(obj)
})
//首页--手机列表
router.get("/phoneList",(req,res)=>{
    var obj=[
        {id:"1",phone:"/img/phone-sell1.jpg"},
        {id:"2",phone:"/img/phone1.jpg",pname:'魅族 V8 标配版',pinfo:'5.7 英寸 HD + 全面屏',price:799},
        {id:"3",phone:"/img/phone2.jpg",pname:'魅族 16 X',pinfo:'骁龙710 轻奢旗舰',price:2098},
        {id:"4",phone:"/img/phone3.jpg",pname:'魅族 16th',pinfo:'骁龙845 屏幕下指纹',price:2698},
        {id:"5",phone:"/img/phone4.jpg",pname:'魅族 V8 高配版',pinfo:'指纹+人脸双解锁',price:1098},
        {id:"6",phone:"/img/phone5.jpg",pname:'魅族 V8 标配版',pinfo:'魅族 V8 标配版',price:799}
    ];
    res.send(obj)
})



module.exports=router;