const express = require('express');
const app = express();
const bodyparser = require('body-parser');
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({
    extended: true
}));

// var path = require('path');
// var alert = require('alert');
var mysql = require('mysql2');
// var html = require("html");
// const flash = require('connect-flash');
var value
const pool = mysql.createPool({
    host: "bzmtp4coydev3qwrg16u-mysql.services.clever-cloud.com",
    user: "uw87hxhz3gbulen3",
    password: "RdSMAXhXyaiOBIo4VH8e",
    database: 'bzmtp4coydev3qwrg16u',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
const cors=require("cors");
const corsOptions ={
   origin:'*', 
   credentials:true,            
   optionSuccessStatus:200,
}
app.use(cors(corsOptions))




var email;
var today = new Date();
var t=today.toUTCString()
var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();


const port = process.env.PORT || 3002;

app.post('/login', function(req, res) {
    pool.getConnection(function(err, con) {
        if (err) throw err;
         email=Object.keys(req.body)[0]
        pool.releaseConnection(con);
    });
});


app.post('/todopage',(req,res)=>{
    var completed=Object.keys(req.body)[0]
    var array=completed.split(',')
    pool.getConnection(function(err,con)
    {
        if (err) throw err;
        var sql=`INSERT INTO tasks (email,tasks,createdon) VALUES ('${email}','${array[0]}','${array[1]},${array[2]}');`
        if(email!=''){
        con.query(sql,function(err,result)
        {
           if (err) throw err;
           console.log("inserted"); 
        })}
        else{console.log("no");}
        pool.releaseConnection(con)
    })

})


app.post('/delete', function(req, res) {
    var completed=Object.keys(req.body)[0]
    var array=completed.split(',')
    console.log(array);
    pool.getConnection(function(err, con) {
        if (err) throw err;
        var sqldel=`DELETE FROM tasks WHERE email='${email}' AND tasks='${array[0]}' AND createdon='${array[1]},${array[2]}';`
        //console.log(sqldel);
        con.query(sqldel,function(err,resu)
        {
            if (err) throw err;
            console.log("deleted"); 
        })
        pool.releaseConnection(con);
    });
});


app.post('/completed', function(req, res) {
    var completed=Object.keys(req.body)[0]
    var array=completed.split(',')
    pool.getConnection(function(err, con) {
        if (err) throw err;
        var sqldel=`UPDATE tasks SET completed=true   WHERE email='${email}' AND createdon='${array[1]},${array[2]}';`
        con.query(sqldel,function(err,resu)
        {
            if (err) throw err;
            console.log("completed"); 
        })
        pool.releaseConnection(con);
    });
});

app.post('/showtask',function(req,res){
    pool.getConnection(function(err, con) {
        if (err) throw err;
        var sqlshow=`SELECT * FROM tasks WHERE email='${email}' ;`
        con.query(sqlshow,function(err,resu)
        {
            res.send(resu)
            if (err) throw err; 
        })
        pool.releaseConnection(con);
    });

})

app.listen(port)