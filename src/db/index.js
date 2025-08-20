import mongoose from "mongoose";
import { dbName } from "../constant.js";


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