import mongoose from "mongoose";


const tweetSubscription = new mongoose.Schema({
    owner : {
        type : mongoose.Schema.ObjectId,
        ref : "User"
    },
    content : {
        type : String,
        required : true,
    }
},{timestamps : true});

export const Tweet = mongoose.model("Tweet" , tweetSubscription);