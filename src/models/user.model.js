import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userName :{
        type : String,
        required : true,
        unique : true,
        trim : true,
        index: true,
    },
    email :{
        type : String,
        unique : true,
        required : true,
        trim :true,
    },
    fullName :{
        type :String,
        required:true,
        trim :true,
    },
    avatar :{
        type :String,
        required:true,
    },
    coverImage :{
        type : String,
    },
    watchHistory :[
        {
        type: mongoose.Schema.ObjectId,
        ref: "Video"
        }
    ],
    password :{
        type : String,
        required :true,
    },
    refreshToken:{
        type:String,
    }

},{timestamps :true});


export const User = mongoose.model("User" , userSchema);