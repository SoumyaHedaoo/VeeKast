import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"; // package that makes pagination easier when using aggrigation queries


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
    description :{
        type: String,
        required:true,
    },
    duration:{
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

videoSchema.plugin(mongooseAggregatePaginate);
export const Video = mongoose.model("Video" , videoSchema);