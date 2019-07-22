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
            {name:'魅族 16th',img:'http://127.0.0.1:3000/list-phone/p101.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'},
            {name:'魅族 16th plus',img:'http://127.0.0.1:3000/list-phone/p102.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'},
            {name:'魅族 16x',img:'http://127.0.0.1:3000/list-phone/p103.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'},
            {name:'魅族 15',img:'http://127.0.0.1:3000/list-phone/p104.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'},
            {name:'魅族 15 plus',img:'http://127.0.0.1:3000/list-phone/p105.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'},
            {name:'魅族 M15',img:'http://127.0.0.1:3000/list-phone/p106.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'},
            {name:'魅族 6',img:'http://127.0.0.1:3000/list-phone/p107.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'},
            {name:'魅族 Note8',img:'http://127.0.0.1:3000/list-phone/p108.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'}
        ],
        [
            {name:'JBL入耳耳机',img:'http://127.0.0.1:3000/list-headset/h101.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'},
            {name:'铁三角aa',img:'http://127.0.0.1:3000/list-headset/h102.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'},
            {name:'JBL蓝牙音箱',img:'http://127.0.0.1:3000/list-headset/h103.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'},
            {name:'Beats头戴式耳机',img:'http://127.0.0.1:3000/list-headset/h104.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'},
            {name:'先锋HiFi耳机',img:'http://127.0.0.1:3000/list-headset/h105.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'},
            {name:'Skullcandy ink',img:'http://127.0.0.1:3000/list-headset/h106.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'},
            {name:'Jabra蓝牙耳机',img:'http://127.0.0.1:3000/list-headset/h107.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'},
            {name:'JBL 蓝牙运动耳机',img:'http://127.0.0.1:3000/list-headset/h108.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'}
        ],
        [
            {name:'JBL入耳耳机',img:'http://127.0.0.1:3000/list-life/l101.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'},
            {name:'铁三角aa',img:'http://127.0.0.1:3000/list-life/l102.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'},
            {name:'JBL蓝牙音箱',img:'http://127.0.0.1:3000/list-life/l103.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'},
            {name:'Beats头戴式耳机',img:'http://127.0.0.1:3000/list-life/l104.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'},
            {name:'先锋HiFi耳机',img:'http://127.0.0.1:3000/list-life/l105.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'},
            {name:'Skullcandy ink',img:'http://127.0.0.1:3000/list-life/l106.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'},
            {name:'Jabra蓝牙耳机',img:'http://127.0.0.1:3000/list-life/l107.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'},
            {name:'JBL 蓝牙运动耳机',img:'http://127.0.0.1:3000/list-life/l108.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'}
        ],
        [
            {name:'魅族 16th',img:'http://127.0.0.1:3000/list-phone/p101.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'},
            {name:'魅族 16th plus',img:'http://127.0.0.1:3000/list-phone/p102.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'},
            {name:'魅族 16x',img:'http://127.0.0.1:3000/list-phone/p103.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'},
            {name:'魅族 15',img:'http://127.0.0.1:3000/list-phone/p104.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'},
            {name:'魅族 15 plus',img:'http://127.0.0.1:3000/list-phone/p105.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'},
            {name:'魅族 M15',img:'http://127.0.0.1:3000/list-phone/p106.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'},
            {name:'魅族 6',img:'http://127.0.0.1:3000/list-phone/p107.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'},
            {name:'魅族 Note8',img:'http://127.0.0.1:3000/list-phone/p108.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'}
        ],
        [
            {name:'JBL入耳耳机',img:'http://127.0.0.1:3000/list-headset/h101.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'},
            {name:'铁三角aa',img:'http://127.0.0.1:3000/list-headset/h102.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'},
            {name:'JBL蓝牙音箱',img:'http://127.0.0.1:3000/list-headset/h103.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'},
            {name:'Beats头戴式耳机',img:'http://127.0.0.1:3000/list-headset/h104.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'},
            {name:'先锋HiFi耳机',img:'http://127.0.0.1:3000/list-headset/h105.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'},
            {name:'Skullcandy ink',img:'http://127.0.0.1:3000/list-headset/h106.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'},
            {name:'Jabra蓝牙耳机',img:'http://127.0.0.1:3000/list-headset/h107.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'},
            {name:'JBL 蓝牙运动耳机',img:'http://127.0.0.1:3000/list-headset/h108.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'}
        ],
        [
            {name:'JBL入耳耳机',img:'http://127.0.0.1:3000/list-life/l101.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'},
            {name:'铁三角aa',img:'http://127.0.0.1:3000/list-life/l102.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'},
            {name:'JBL蓝牙音箱',img:'http://127.0.0.1:3000/list-life/l103.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'},
            {name:'Beats头戴式耳机',img:'http://127.0.0.1:3000/list-life/l104.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'},
            {name:'先锋HiFi耳机',img:'http://127.0.0.1:3000/list-life/l105.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'},
            {name:'Skullcandy ink',img:'http://127.0.0.1:3000/list-life/l106.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'},
            {name:'Jabra蓝牙耳机',img:'http://127.0.0.1:3000/list-life/l107.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'},
            {name:'JBL 蓝牙运动耳机',img:'http://127.0.0.1:3000/list-life/l108.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'}
        ],
        [
            {name:'魅族 16th',img:'http://127.0.0.1:3000/list-phone/p101.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'},
            {name:'魅族 16th plus',img:'http://127.0.0.1:3000/list-phone/p102.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'},
            {name:'魅族 16x',img:'http://127.0.0.1:3000/list-phone/p103.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'},
            {name:'魅族 15',img:'http://127.0.0.1:3000/list-phone/p104.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'},
            {name:'魅族 15 plus',img:'http://127.0.0.1:3000/list-phone/p105.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'},
            {name:'魅族 M15',img:'http://127.0.0.1:3000/list-phone/p106.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'},
            {name:'魅族 6',img:'http://127.0.0.1:3000/list-phone/p107.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'},
            {name:'魅族 Note8',img:'http://127.0.0.1:3000/list-phone/p108.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'}
        ],
        [
            {name:'JBL入耳耳机',img:'http://127.0.0.1:3000/list-headset/h101.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'},
            {name:'铁三角aa',img:'http://127.0.0.1:3000/list-headset/h102.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'},
            {name:'JBL蓝牙音箱',img:'http://127.0.0.1:3000/list-headset/h103.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'},
            {name:'Beats头戴式耳机',img:'http://127.0.0.1:3000/list-headset/h104.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'},
            {name:'先锋HiFi耳机',img:'http://127.0.0.1:3000/list-headset/h105.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'},
            {name:'Skullcandy ink',img:'http://127.0.0.1:3000/list-headset/h106.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'},
            {name:'Jabra蓝牙耳机',img:'http://127.0.0.1:3000/list-headset/h107.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'},
            {name:'JBL 蓝牙运动耳机',img:'http://127.0.0.1:3000/list-headset/h108.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'}
        ],
        [
            {name:'JBL入耳耳机',img:'http://127.0.0.1:3000/list-life/l101.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'},
            {name:'铁三角aa',img:'http://127.0.0.1:3000/list-life/l102.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'},
            {name:'JBL蓝牙音箱',img:'http://127.0.0.1:3000/list-life/l103.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'},
            {name:'Beats头戴式耳机',img:'http://127.0.0.1:3000/list-life/l104.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'},
            {name:'先锋HiFi耳机',img:'http://127.0.0.1:3000/list-life/l105.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'},
            {name:'Skullcandy ink',img:'http://127.0.0.1:3000/list-life/l106.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'},
            {name:'Jabra蓝牙耳机',img:'http://127.0.0.1:3000/list-life/l107.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'},
            {name:'JBL 蓝牙运动耳机',img:'http://127.0.0.1:3000/list-life/l108.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'}
        ],
        
    ]
    var obj=[
        {id:"1",href:'http://127.0.0.1:8080/#/home/goodsinfo/101',banner_url:"http://127.0.0.1:3000/img/banner1.jpg"},
        {id:"2",href:'http://127.0.0.1:8080/#/home/goodsinfo/101',banner_url:"http://127.0.0.1:3000/img/banner2.jpg"},
        {id:"3",href:'http://127.0.0.1:8080/#/home/goodsinfo/101',banner_url:"http://127.0.0.1:3000/img/banner3.jpg"},
        {id:"4",href:'http://127.0.0.1:8080/#/home/goodsinfo/101',banner_url:"http://127.0.0.1:3000/img/banner4.jpg"},
		{id:"5",href:'http://127.0.0.1:8080/#/home/goodsinfo/101',banner_url:"http://127.0.0.1:3000/img/banner5.jpg"},
		{id:"6",href:'http://127.0.0.1:8080/#/home/goodsinfo/101',banner_url:"http://127.0.0.1:3000/img/banner6.jpg"},
        {id:"7",href:'http://127.0.0.1:8080/#/home/goodsinfo/101',banner_url:"http://127.0.0.1:3000/img/banner7.jpg"},
        {id:"8",href:'http://127.0.0.1:8080/#/home/goodsinfo/101',banner_url:"http://127.0.0.1:3000/img/banner3.jpg"},
        {id:"9",href:'http://127.0.0.1:8080/#/home/goodsinfo/101',banner_url:"http://127.0.0.1:3000/img/banner4.jpg"},
    ];
    res.send({r1:left,r2:right,r3:obj})
})




module.exports=router;