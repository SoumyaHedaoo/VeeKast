import { Router } from "express";
import { verifyJwtToken } from "../middlewares/auth.middleware.js";
import { createTweet, editTweet } from "../controllers/tweet.controller.js";


const router = Router();

router.route("/create-tweet").post(verifyJwtToken , createTweet);

router.route("/edit-tweet").post(verifyJwtToken , editTweet);


export default router;