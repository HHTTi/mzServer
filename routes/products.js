var express=require("express");
var router=express.Router();
var pool=require("../pool");

//商品详情页
router.get("/goodsInfo",(req,res)=>{
    var id= req.query.id
    console.log(id)
    var sql = " SELECT pid,family_id,family_name,subtitle,color,price,spec from meizu_product where family_id = ( SELECT family_id from meizu_product where pid = ? ) "
    var sql2 = " select * from meizu_product_pic where family_id = ( SELECT family_id from meizu_product where pid = ? )"
    var s = [] ,sum = 0;
    pool.query(sql,[id],(err,result)=>{
        if(err) throw err;
        console.log(result)
        s[0] = result
        sum+=50
        if(sum == 100)
         res.send(s)
    })
    pool.query(sql2,[id],(err,result)=>{
        if(err) throw err;
        console.log(result)
        s[1] = result
        sum+=50
        if(sum == 100)
         res.send(s)
    })
   
})
//给better-scroll组件的数据
router.get('/betterscroll',(req,res)=>{
    var left = [
        '推荐','手机','耳机','生活','智能','游戏','配件','居家','个护'
    ]
    var right = [
        [
            {name:'魅族 16th',img:'/list-phone/p101.jpg',href:'/#/home/goodsinfo/101'},
            {name:'魅族 16th plus',img:'/list-phone/p102.jpg',href:'/#/home/goodsinfo/101'},
            {name:'魅族 16x',img:'/list-phone/p103.jpg',href:'/#/home/goodsinfo/101'},
            {name:'魅族 15',img:'/list-phone/p104.jpg',href:'/#/home/goodsinfo/101'},
            {name:'魅族 15 plus',img:'/list-phone/p105.jpg',href:'/#/home/goodsinfo/101'},
            {name:'魅族 M15',img:'/list-phone/p106.jpg',href:'/#/home/goodsinfo/101'},
            {name:'魅族 6',img:'/list-phone/p107.jpg',href:'/#/home/goodsinfo/101'},
            {name:'魅族 Note8',img:'/list-phone/p108.jpg',href:'/#/home/goodsinfo/101'}
        ],
        [
            {name:'JBL入耳耳机',img:'/list-headset/h101.jpg',href:'/#/home/goodsinfo/101'},
            {name:'铁三角aa',img:'/list-headset/h102.jpg',href:'/#/home/goodsinfo/101'},
            {name:'JBL蓝牙音箱',img:'/list-headset/h103.jpg',href:'/#/home/goodsinfo/101'},
            {name:'Beats头戴式耳机',img:'/list-headset/h104.jpg',href:'/#/home/goodsinfo/101'},
            {name:'先锋HiFi耳机',img:'/list-headset/h105.jpg',href:'/#/home/goodsinfo/101'},
            {name:'Skullcandy ink',img:'/list-headset/h106.jpg',href:'/#/home/goodsinfo/101'},
            {name:'Jabra蓝牙耳机',img:'/list-headset/h107.jpg',href:'/#/home/goodsinfo/101'},
            {name:'JBL 蓝牙运动耳机',img:'/list-headset/h108.jpg',href:'/#/home/goodsinfo/101'}
        ],
        [
            {name:'JBL入耳耳机',img:'/list-life/l101.jpg',href:'/#/home/goodsinfo/101'},
            {name:'铁三角aa',img:'/list-life/l102.jpg',href:'/#/home/goodsinfo/101'},
            {name:'JBL蓝牙音箱',img:'/list-life/l103.jpg',href:'/#/home/goodsinfo/101'},
            {name:'Beats头戴式耳机',img:'/list-life/l104.jpg',href:'/#/home/goodsinfo/101'},
            {name:'先锋HiFi耳机',img:'/list-life/l105.jpg',href:'/#/home/goodsinfo/101'},
            {name:'Skullcandy ink',img:'/list-life/l106.jpg',href:'/#/home/goodsinfo/101'},
            {name:'Jabra蓝牙耳机',img:'/list-life/l107.jpg',href:'/#/home/goodsinfo/101'},
            {name:'JBL 蓝牙运动耳机',img:'/list-life/l108.jpg',href:'/#/home/goodsinfo/101'}
        ],
        [
            {name:'魅族 16th',img:'/list-phone/p101.jpg',href:'/#/home/goodsinfo/101'},
            {name:'魅族 16th plus',img:'/list-phone/p102.jpg',href:'/#/home/goodsinfo/101'},
            {name:'魅族 16x',img:'/list-phone/p103.jpg',href:'/#/home/goodsinfo/101'},
            {name:'魅族 15',img:'/list-phone/p104.jpg',href:'/#/home/goodsinfo/101'},
            {name:'魅族 15 plus',img:'/list-phone/p105.jpg',href:'/#/home/goodsinfo/101'},
            {name:'魅族 M15',img:'/list-phone/p106.jpg',href:'/#/home/goodsinfo/101'},
            {name:'魅族 6',img:'/list-phone/p107.jpg',href:'/#/home/goodsinfo/101'},
            {name:'魅族 Note8',img:'/list-phone/p108.jpg',href:'/#/home/goodsinfo/101'}
        ],
        [
            {name:'JBL入耳耳机',img:'/list-headset/h101.jpg',href:'/#/home/goodsinfo/101'},
            {name:'铁三角aa',img:'/list-headset/h102.jpg',href:'/#/home/goodsinfo/101'},
            {name:'JBL蓝牙音箱',img:'/list-headset/h103.jpg',href:'/#/home/goodsinfo/101'},
            {name:'Beats头戴式耳机',img:'/list-headset/h104.jpg',href:'/#/home/goodsinfo/101'},
            {name:'先锋HiFi耳机',img:'/list-headset/h105.jpg',href:'/#/home/goodsinfo/101'},
            {name:'Skullcandy ink',img:'/list-headset/h106.jpg',href:'/#/home/goodsinfo/101'},
            {name:'Jabra蓝牙耳机',img:'/list-headset/h107.jpg',href:'/#/home/goodsinfo/101'},
            {name:'JBL 蓝牙运动耳机',img:'/list-headset/h108.jpg',href:'/#/home/goodsinfo/101'}
        ],
        [
            {name:'JBL入耳耳机',img:'/list-life/l101.jpg',href:'/#/home/goodsinfo/101'},
            {name:'铁三角aa',img:'/list-life/l102.jpg',href:'/#/home/goodsinfo/101'},
            {name:'JBL蓝牙音箱',img:'/list-life/l103.jpg',href:'/#/home/goodsinfo/101'},
            {name:'Beats头戴式耳机',img:'/list-life/l104.jpg',href:'/#/home/goodsinfo/101'},
            {name:'先锋HiFi耳机',img:'/list-life/l105.jpg',href:'/#/home/goodsinfo/101'},
            {name:'Skullcandy ink',img:'/list-life/l106.jpg',href:'/#/home/goodsinfo/101'},
            {name:'Jabra蓝牙耳机',img:'/list-life/l107.jpg',href:'/#/home/goodsinfo/101'},
            {name:'JBL 蓝牙运动耳机',img:'/list-life/l108.jpg',href:'/#/home/goodsinfo/101'}
        ],
        [
            {name:'魅族 16th',img:'/list-phone/p101.jpg',href:'/#/home/goodsinfo/101'},
            {name:'魅族 16th plus',img:'/list-phone/p102.jpg',href:'/#/home/goodsinfo/101'},
            {name:'魅族 16x',img:'/list-phone/p103.jpg',href:'/#/home/goodsinfo/101'},
            {name:'魅族 15',img:'/list-phone/p104.jpg',href:'/#/home/goodsinfo/101'},
            {name:'魅族 15 plus',img:'/list-phone/p105.jpg',href:'/#/home/goodsinfo/101'},
            {name:'魅族 M15',img:'/list-phone/p106.jpg',href:'/#/home/goodsinfo/101'},
            {name:'魅族 6',img:'/list-phone/p107.jpg',href:'/#/home/goodsinfo/101'},
            {name:'魅族 Note8',img:'/list-phone/p108.jpg',href:'/#/home/goodsinfo/101'}
        ],
        [
            {name:'JBL入耳耳机',img:'/list-headset/h101.jpg',href:'/#/home/goodsinfo/101'},
            {name:'铁三角aa',img:'/list-headset/h102.jpg',href:'/#/home/goodsinfo/101'},
            {name:'JBL蓝牙音箱',img:'/list-headset/h103.jpg',href:'/#/home/goodsinfo/101'},
            {name:'Beats头戴式耳机',img:'/list-headset/h104.jpg',href:'/#/home/goodsinfo/101'},
            {name:'先锋HiFi耳机',img:'/list-headset/h105.jpg',href:'/#/home/goodsinfo/101'},
            {name:'Skullcandy ink',img:'/list-headset/h106.jpg',href:'/#/home/goodsinfo/101'},
            {name:'Jabra蓝牙耳机',img:'/list-headset/h107.jpg',href:'/#/home/goodsinfo/101'},
            {name:'JBL 蓝牙运动耳机',img:'/list-headset/h108.jpg',href:'/#/home/goodsinfo/101'}
        ],
        [
            {name:'JBL入耳耳机',img:'/list-life/l101.jpg',href:'/#/home/goodsinfo/101'},
            {name:'铁三角aa',img:'/list-life/l102.jpg',href:'/#/home/goodsinfo/101'},
            {name:'JBL蓝牙音箱',img:'/list-life/l103.jpg',href:'/#/home/goodsinfo/101'},
            {name:'Beats头戴式耳机',img:'/list-life/l104.jpg',href:'/#/home/goodsinfo/101'},
            {name:'先锋HiFi耳机',img:'/list-life/l105.jpg',href:'/#/home/goodsinfo/101'},
            {name:'Skullcandy ink',img:'/list-life/l106.jpg',href:'/#/home/goodsinfo/101'},
            {name:'Jabra蓝牙耳机',img:'/list-life/l107.jpg',href:'/#/home/goodsinfo/101'},
            {name:'JBL 蓝牙运动耳机',img:'/list-life/l108.jpg',href:'/#/home/goodsinfo/101'}
        ],
        
    ]
    var obj=[
        {id:"1",href:'/#/home/goodsinfo/101',banner_url:"/img/banner1.jpg"},
        {id:"2",href:'/#/home/goodsinfo/101',banner_url:"/img/banner2.jpg"},
        {id:"3",href:'/#/home/goodsinfo/101',banner_url:"/img/banner3.jpg"},
        {id:"4",href:'/#/home/goodsinfo/101',banner_url:"/img/banner4.jpg"},
		{id:"5",href:'/#/home/goodsinfo/101',banner_url:"/img/banner5.jpg"},
		{id:"6",href:'/#/home/goodsinfo/101',banner_url:"/img/banner6.jpg"},
        {id:"7",href:'/#/home/goodsinfo/101',banner_url:"/img/banner7.jpg"},
        {id:"8",href:'/#/home/goodsinfo/101',banner_url:"/img/banner3.jpg"},
        {id:"9",href:'/#/home/goodsinfo/101',banner_url:"/img/banner4.jpg"},
    ];
    res.send({r1:left,r2:right,r3:obj})
})




module.exports=router;