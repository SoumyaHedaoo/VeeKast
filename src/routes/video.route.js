import { Router } from "express";
import { verifyJwtToken } from "../middlewares/auth.middleware.js";
import { publishVideo } from "../controllers/video.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router=Router();

router.route("/publishVideo").post( upload.fields([
    {
        name : "videoFile",
        maxCount : 1,
    },
    {
        name : "thumbnail",
        maxCount :1,
    }
]) , verifyJwtToken , publishVideo);

export default router;