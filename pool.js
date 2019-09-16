
const mysql=require('mysql');
var pool=mysql.createPool({
    host:'0.0.0.0',
    port:3306,
    user:'root',
    password:'Sansi1226',
    database:'meizu',
    charset : 'utf8mb4',
    connectionLimit:10
});

module.exports=pool;