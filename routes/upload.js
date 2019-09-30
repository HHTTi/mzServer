const express=require("express");
const router=express.Router();

const path = require('path');
const fe = require('fs-extra');

const pool = require("../pool");

var uploadFiles = __dirname+'uploadFiles'

router.post('/uploadImg',(req,res)=>{
    req.on("data", function (buf) {
        // var data = JSON.parse(buf.toString());
        var data = buf.toString();
        console.log('uploadFiles:',uploadFiles)
        // console.log('uploadImg:',data)
        
        res.send({'code':1})
    })
})



module.exports = router;
