import mongoose from "mongoose";
import bcrypt from "bcrypt";


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


userSchema.pre("save" , async function (next){
    if(!this.isModified("password")) return next();
    try {
        const hashedpasssword=await bcrypt.hash(this.password ,10);
        this.password=hashedpasssword;
        next();
    } catch (error) {
        console.log("incryption of password failed , data not saved , ERROR:" , error);
        next(error);
    }
});

export const User = mongoose.model("User" , userSchema);