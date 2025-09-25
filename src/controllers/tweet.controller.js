import { Tweet } from "../models/tweet.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { expressAsyncHandler } from "../utils/expressAsyncHandler.js";

const createTweet = expressAsyncHandler(async(req , res)=>{

    const user = req.user;
    console.log(user);
    
    if(!user) throw new ApiError(400 , "user not logged in");

    const {content} =req.body;

    const tweet = await Tweet.create({
        content : content ,
        owner : user,
    })

    const createdTweet = await Tweet.findById(tweet._id);

    if(!createdTweet) throw new ApiError(500 , "unable to create new tweet");

    return res
            .status(200)
            .json(new ApiResponse(200 , createdTweet , "tweet created successfully"));
})


export {
    createTweet ,
}