
const express = require('express');

const {createPool} = require("mysql");

const pool = createPool({
    host:"localhost",
    user : "root",
    password : "n3u3da!",
    database : "portfolio_manager",
    connectionLimit : "10"
});

pool.query("Select * from stock_prices where price_id = ?",['8'],(err,result,fields)=>{
    if(err){
        return err;
    }
    console.log(result);
})



