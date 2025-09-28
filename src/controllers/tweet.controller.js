import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js";
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
});

const editTweet = expressAsyncHandler(async(req , res)=>{
    const {tweetId} = req.params;

    const {content} = req.body;

    const tweet = await Tweet.findByIdAndUpdate(tweetId , {
        $set : {
            content : content,
        }
    } , {new : true})

    return res
            .status(200)
            .json(new ApiResponse(200 , tweet , "tweet edited succesfully"))
})

const deleteTweet = expressAsyncHandler(async(req , res)=>{
    const {tweetId} = req.params;

    const tweet =await Tweet.findByIdAndDelete(tweetId);
    
    if(!tweet) throw new ApiError(404 , "tweet with this ID not found");
    return res
            .status(200)
            .json(new ApiResponse(200 , {} , "tweet deleted successfully"));
})

const getAllTweets = expressAsyncHandler(async(req , res)=>{
    const {userId} = req.params;

    const user = await User.findById(userId);

    if(!user) throw new ApiError(404 , "user do not exits");

    const allTweets = await Tweet.find({owner : user})

    return res
            .status(200)
            .json(new ApiResponse(200 , allTweets , "all tweets fetched successfully"))
})

export {
    createTweet ,
    editTweet ,
    deleteTweet ,
    getAllTweets
}