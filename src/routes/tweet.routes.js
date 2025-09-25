import { Router } from "express";
import { verifyJwtToken } from "../middlewares/auth.middleware.js";
import { createTweet } from "../controllers/tweet.controller.js";


const router = Router();

router.route("/create-tweet").post(verifyJwtToken , createTweet);


export default router;