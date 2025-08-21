import mongoose from "mongoose";
import { dbName } from "../constant.js";


/**
 * establish connection with mongoes databse using mongoose
 * 
 * 
 * @async
 * @connectDB
 * @returns {promise<void>} returns an empty promise when mongodb connection is successfull
 * @throws {Error} mongoose throws an error  when connection fails
 */
const connectDB =async ()=>{
    const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${dbName}`);
    console.log(`mogoDB connected  , connection instance :${connectionInstance.connection.host}`);
}

export default connectDB;









/** 
* connect to mongoDB Database


* @returns {promise<void>} resolves when connection is success
* @throws {Error} if mongoDB connection fails
*/
/*
const connectDB = async ()=>{
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${dbName}`);

        console.log(`mogoDB connected  , connection instance :${connectionInstance.connection.host}`);
        console.log("connection instance" , connectionInstance); 
        
        
    } catch (error) {
        console.error("DB not connected , Error : " , error);
        process.exit(1); // .exit is used when we have to hard stop the program . it means program will stop here and no further lines of code or pending task will be executed . 
        //process : a process in node is a global object that represent a currently running node.js project
    }
}

export default connectDB;

*/