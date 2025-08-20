import mongoose from "mongoose";
import { dbName } from "./constant.js";




import express from "express";
const app=express();
//connecting database through IIFE 
//used iife , trycatch block , async-await
//will not use this approach because it pollutes index page

;(async()=>{
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${dbName}`);

        app.on("error" , (error)=>{
            console.log("db connected then ERR :" , error);
            throw error;
        })
        
        app.listen(process.env.PORT , ()=>{console.log(`app Listning on port ${process.env.PORT}`)});

    } catch (error) {
        console.error("error in db connection ERR :" , error);
        throw error;
    }
})()
