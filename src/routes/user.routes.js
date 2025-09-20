import { Router } from "express";
import { 
    loginUser , 
    logoutUser , 
    registerUser , 
    refreshAccessToken, 
    updatePassword,
    getUser,
    updateDetails,
    updateAvatarImage,
    updateCoverImage,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJwtToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(upload.fields([
    {
        name : "avatar",
        maxCount :1,
    },
    {
        name: "coverImage",
        maxCount : 1
    }
]) ,registerUser);

router.route("/login").post(loginUser);

router.route("/logout").post(verifyJwtToken , logoutUser);

router.route("/refresh-tokens").post(refreshAccessToken);

router.route("/password-change").post(verifyJwtToken , updatePassword);

router.route("/get-user").get(verifyJwtToken , getUser);

router.route("/update-user").post(verifyJwtToken , updateDetails);

router.route("/update-avatar").post(upload.single('avatar') ,verifyJwtToken ,  updateAvatarImage);

router.route('/update-coverImage').post(upload.single('coverImage') , verifyJwtToken , updateCoverImage);


export default router;