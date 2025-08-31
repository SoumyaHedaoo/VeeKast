import { ApiError } from "../utils/ApiError.js";
import { expressAsyncHandler } from "../utils/expressAsyncHandler.js";
import { User } from "../models/user.model.js";
import { cloudinaryUpload } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncTCWrapper } from "../utils/tryCatchWrapper.js";

const generateAccessTokenandRefreshToken = asyncTCWrapper(async(id)=>{

   const user = await User.findById(id);
   
   const accessToken = user.generateAccessToken();
   const refreshToken = user.generateRefreshToken();

   user.refreshToken=refreshToken;
   await user.save({validateBeforeSave : false})

   return({accessToken , refreshToken});
})

const registerUser =expressAsyncHandler(async(req , res)=>{
   
   //get data from front end : destructure data from req.body
   //validate: check if data is null or empty
   //validate-02: check if user already exists
   //create a user and store data in db
   //handle files - images , avatar
   //check user creation
   //return response

   //destructing req.body to get required fields
   const {userName , fullName , email , password} = req.body;
   
   //check if all fields are not empty
   if([userName , fullName , email , password].some(ele=>ele?.trim()=="")){
      throw new ApiError(400 , "all fields are required");
   }

   //check if username or email already present i.e : user exist condition
   if(await User.findOne({userName : userName})){
      throw new ApiError(409 , "userName already exists");
   }
   if(await User.findOne({email : email})){
      throw new ApiError(409 , "email already exists");
   }

   //localpath of images form multer
   const avatarLocalPath = req.files?.avatar[0]?.path;
   const coverImageLocalPath =req.files?.coverImage[0]?.path;

   //upolad on cloudinary
   const avatarCloudinary = await cloudinaryUpload(avatarLocalPath);
   const coverImageCloudinary = coverImageLocalPath? await cloudinaryUpload(coverImageLocalPath): null;

   if(!avatarCloudinary){
      throw new ApiError(500 , "unable to upload avatar ");
   }


   const user = await User.create({
      userName :userName,
      email:email,
      fullName:fullName,
      avatar : avatarCloudinary.url || "",
      coverImage : coverImageCloudinary?.url || "",
      password : password
   })

   const createdUser = await User.findById(user._id).select(" -password -refreshToken");

   if(!createdUser){
      throw new ApiError(500 , "ubale to create user");
   }

   return res.status(201).json(
      new ApiResponse(
         200,
         createdUser,
         "new user created successfully"
      )
   )
})


export {registerUser}