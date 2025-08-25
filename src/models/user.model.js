import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


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

userSchema.methods.isPassCorrect= async function(password){
    return await bcrypt.compare(password , this.password);
}

userSchema.methods.generateAccessToken= function () {
    return jwt.sign(
        {
            _id : this._id,
            userName:this.userName,
            email:this.email,
        },
        process.env.ACCESS_TOKEN_SECRET_KEY,
        {expiresIn : process.env.ACCESS_TOKEN_EXPIRY}
    )
}
userSchema.methods.generateRefreshToken= function () {
    return jwt.sign(
        {
            _id : this._id,
        },
        process.env.REFRESH_TOKEN_SECRET_KEY,
        {expiresIn : process.env.REFRESH_TOKEN_EXPIRY}
    )
}
export const User = mongoose.model("User" , userSchema);