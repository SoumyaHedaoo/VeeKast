import mongoose from "mongoose";


const videoSchema = new mongoose.Schema({
    title:{
        type : String,
        required: true,
    },
    videoFile:{
        type : String,
        required : true,
    },
    thumbnail:{
        type: String,
        required:true,
    },
    Description :{
        type: String,
        required:true,
    },
    durartion:{
        type: Number,
        required:true,
    },
    views:{
        type: Number,
        required:true,
    },
    isPublished:{
        type: Boolean,
        required:true,
    },
    owner:{
        type: mongoose.Schema.ObjectId,
        ref: "User"
    }
},{timestamps :true})

export const Video = mongoose.model("Video" , videoSchema);