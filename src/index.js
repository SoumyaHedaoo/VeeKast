import dotenv from "dotenv"; // helper package that helps node to find and read .env variables and inject them into process object
import connectDB from "./db/index.js";


dotenv.config({ path: './.env' }) // used to load env variables in to process object 

connectDB()





/*

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
    */
