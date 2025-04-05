const mongoose=require('mongoose');
const express=require('express');
const session=require('express-session');
const connectMongo = require('connect-mongo');
const cors=require('cors'); 
//const bodyParser = require("body-parser");
require("dotenv").config();
const approute=require('../backend/Allroutes');
const app=express();
app.use(express.json({ limit: "50mb" })); // For parsing application/json
app.use(express.urlencoded({ limit: "50mb", extended: true }));



app.use(cors({
    origin: "*", 
    methods: "GET,POST,PUT,DELETE", 
    credentials: true 
  }));


const uri=process.env.MONGO_URI;
mongoose.connect(uri);
const connection=mongoose.connection;
connection.once('open',()=>{
    console.log("mongodb connected");
})



app.use(express.json());
app.use("/en",approute);


app.listen(3000,()=>{
    console.log("server is running");
})
