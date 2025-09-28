import { Router } from "express";
import { verifyJwtToken } from "../middlewares/auth.middleware.js";
import { createTweet, deleteTweet, editTweet, getAllTweets } from "../controllers/tweet.controller.js";


const router = Router();

router.route("/create-tweet").post(verifyJwtToken , createTweet);

router.route("/edit-tweet").post(verifyJwtToken , editTweet);

router.route("/allTweets/:userId").get(getAllTweets);

router.route("/delete-tweet/:tweetId").post(verifyJwtToken , deleteTweet);

export default router;