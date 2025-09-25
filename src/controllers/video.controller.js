import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { cloudinaryUpload } from "../utils/cloudinaryUpload.js";
import { expressAsyncHandler } from "../utils/expressAsyncHandler.js";

const publishVideo = expressAsyncHandler(async(req , res)=>{
   console.log("req file array : " , req.files);
   
    const videoFileLocalPath = req.files?.videoFile[0].path;
    const thumbnailLocalPath = req.files?.thumbnail[0].path;
    //console.log("req files object : " , req.files);
    

    if(!videoFileLocalPath || !thumbnailLocalPath) throw new ApiError(404 , "either videoFile or thumbnail not found");

    const{title , description} = req.body;

    const videoObject=await cloudinaryUpload(videoFileLocalPath);
    const thumbnailObject =await cloudinaryUpload(thumbnailLocalPath);

    //console.log("cloudinary response object videoFile : " , videoObject);
    //console.log("cloudinary response object thumbnail : " , thumbnailObject);

    if(!videoObject) throw new ApiError(401 , "unable to upload video on cloudinary");
    if(!thumbnailObject) throw new ApiError(401 , "unable to upload thumbnail on cloudinary");

    const video = await Video.create({
            title : title ,
            videoFile : videoObject.playback_url ,
            thumbnail : thumbnailObject.secure_url ,
            description : description ,
            duration : videoObject.duration ,
            views : 0 ,
            isPublished : false ,
            owner : req.user ,
    });

    const createdVideo = await Video.findById(video._id);

    if(!createdVideo) throw new ApiError(500 , "unable to create video");


    return res
            .status(200)
            .json(
                new ApiResponse(
                    200 ,
                    createdVideo ,
                    "Video ceated successfully"
                )
            )
})

const getVideo = expressAsyncHandler(async(req , res)=>{
    const {videoId} = req.params;

    const video = await Video.findById(videoId);

    if(!video) throw new ApiError(404 , "unable to find video")

    return res
            .status(200)
            .json(new ApiResponse(200 , video , "video fetched successfully"))
})

const updateVideoDetails = expressAsyncHandler(async(req , res)=>{
    const {videoId} = req.params;

    const {title , description }=req.body;
    const thumbnailLocalFilePath = req.file?.path;

    if(!title || !description || !thumbnailLocalFilePath) throw new ApiError(404 , "input paramaters not found");

    const cloudinaryThumbnail = await cloudinaryUpload(thumbnailLocalFilePath);
    
    if(!cloudinaryThumbnail) throw new ApiError(500 , "unable to upload on cloudinary");

    const video = await Video.findByIdAndUpdate(videoId , {
        $set : {
            title : title ,
            description : description ,
            thumbnail : cloudinaryThumbnail.secure_url ,
        }
    },{new : true});

    return res
            .status(200)
            .json(new ApiResponse(200 , video , "data updated succesfully!!!"))

})

const toggleVideoPublishStatus = expressAsyncHandler(async(req , res)=>{

    const {videoId} = req.params;

    const video =await  Video.findByIdAndUpdate(videoId , {
        $set : {
            isPublished : true,
        }
    } , {new : true});

    return res
            .status(200)
            .json(new ApiResponse(200 , video , "video published succesfully"));
})

export {
    publishVideo , 
    getVideo , 
    updateVideoDetails ,
    toggleVideoPublishStatus ,
}