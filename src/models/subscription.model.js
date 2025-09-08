import mongoose, { Schema } from "mongoose";

const subscriptionSchema = new mongoose.Schema({
    subscriber :{
        type : mongoose.Schema.ObjectId,
        ref : "User"
    },
    channel : {
        type : mongoose.Schema.ObjectId,
        ref : "User"
    }

})

export const Subscription = mongoose.model("Subscription" , subscriptionSchema);