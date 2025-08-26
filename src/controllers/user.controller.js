import { expressAsyncHandler } from "../utils/expressAsyncHandler.js";

const registerUser =expressAsyncHandler(async(req , res)=>{
    res.status(200).json({
        message : "ok"
    })
})

export {registerUser}