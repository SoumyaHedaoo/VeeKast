import { ApiError } from "../utils/ApiError.js";
import { expressAsyncHandler } from "../utils/expressAsyncHandler.js";
import { User } from "../models/user.model.js";
import { cloudinaryUpload } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncTCWrapper } from "../utils/tryCatchWrapper.js";
import jwt from "jsonwebtoken";

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

const loginUser = expressAsyncHandler(async(req , res)=>{
   //get data from req.body , destructure it
   //validate 01- check if data fields are empty
   //validate 02- find the enty with same credetial
   //throw error if not found
   //if found generate access token and refresh token , return token via secure cookies

   const {email , userName , password } = req.body;

   if(!email && !userName){
      throw new ApiError(404 , "email or userName not found");
   }

   const user = await User.findOne({
      $or :[{userName} , {email}]
   })

   if(!user){
      throw new ApiError(404 , "wrong credentials entered");
   }

   const passwordCheck = user.isPassCorrect(password);
   if(!passwordCheck){
      throw new ApiError(400 , "wrong password entered");
   }

   const {accessToken , refreshToken} = await generateAccessTokenandRefreshToken(user._id);

   const loggedinUser = await User.findById(user._id).select("-password -refreshToken")

   const options={
      httpOnly : true,
      secure : true,
   }

   return res
            .status(200)
            .cookie("accessToken" , accessToken , options)
            .cookie("refreshToken" , refreshToken , options)
            .json(new ApiResponse(200 , {
               user: loggedinUser,
               accessToken,
               refreshToken,
            } , "loggedIn successfull"))





})

const logoutUser = expressAsyncHandler(async(req , res)=>{
   const user = req.user;

   if(!user) throw new ApiError(401 , "unouthorised assecc token");

   await User.findByIdAndUpdate(user._id , {
      $set : {
         refreshToken : undefined,
      }
   },{
      new : true,
   })

   const options={
      httpOnly : true,
      secure : true,
   }

   res
      .status(200)
      .clearCookie("accessToken" , options)
      .clearCookie("refreshToken" , options)
      .json(new ApiResponse(200 , {} , "user logout successfully"))
   
})

const refreshAccessToken = expressAsyncHandler(async(req , res)=>{

   const incomingRefreshToken = req.cookies?.refreshToken || req.body.refreshToken;

   if(!incomingRefreshToken) throw new ApiError(404 , "refreshToken not found");

   const decodedToken = jwt.verify(incomingRefreshToken , process.env.REFRESH_TOKEN_SECRET_KEY);

   const user=await User.findById(decodedToken?._id);

   if(!user) throw new ApiError(401 , "refresh token expire or used");

   if(incomingRefreshToken !== user.refreshToken) throw new ApiError(401 , "refreshtoken not matched");

   const {accessToken , refreshToken} = generateAccessTokenandRefreshToken(user._id);

   const options = {
      secure: true,
      httpOnly: true,
   }

   return res
            .status(200)
            .cookie("refreshToken" , refreshToken , options)
            .cookie("accessToken" , accessToken , options)
            .json(new ApiResponse(200 , {refreshToken , accessToken}, "redestributed accesstoken successfully"))
})

const updatePassword = expressAsyncHandler(async(req , res)=>{
   const {oldPassword , newPassword} = req.body;

   const user = await User.find(req.user?._id);

   if(!user) throw new ApiError(401 , "user not loggedin");

   const validPassword=await user.isPassCorrect(oldPassword);

   if(!validPassword) throw new ApiError(400 , "old password is incorrect");

   user.password = newPassword;
   user.save({validateBeforeSave : false});

   res
      .status(200)
      .json(new ApiResponse(200 , {} , "password updated successfully"));

})

const getUser = expressAsyncHandler(async (req , res)=>{
   res
      .status(200)
      .json(new ApiResponse(200 , req.user , "user fetched successfully"))
})

const updateDetails = expressAsyncHandler(async(req , res)=>{
   const {userName , email} = req.body;

   const user = await User.findByIdAndUpdate(req.user?._id , {
      $set : {
         userName : userName , 
         email : email
      }
   } , {new : true}).select("-password -refreshToken")

   res
      .status(200)
      .json(new ApiResponse(200 , {user} , "user updated successfully"));

})

const updateAvatarImage = expressAsyncHandler(async(req , res)=>{
   if(!req.user) throw new ApiError(404 , "user not found");

   const avatarLocalPath = req.file?.avatar[0]?.path;

   if(!avatarLocalPath) throw new ApiError(404 , "new avatar image not found");

   const avatarCloudinary = cloudinaryUpload(avatarLocalPath);

   if(!avatarCloudinary) throw new ApiError(500 , "ubale to upload item to cloudinary");

   const user = await User.findByIdAndUpdate(req.user._id , {
      $set: {
         avatar : avatarCloudinary.url
      }
   } , {new : true}).select("-password -refreshToken")

   res
      .status(200)
      .json(new ApiResponse(200 , user , "Avatar upated successfully"))
})

const updateCoverImage = expressAsyncHandler(async(req , res)=>{
   if(!req.user) throw new ApiError(404 , "user not found");

   const coverImageLocalPath = req.file?.coverImage[0]?.path;

   if(!coverImageLocalPath) throw new ApiError(404 , "new cover  image not found");

   const coverImageCloudinary = cloudinaryUpload(coverImageLocalPath);

   if(!coverImageCloudinary) throw new ApiError(500 , "unable to upload item to cloudinary");

   const user = await User.findByIdAndUpdate(req.user._id , {
      $set: {
         coverImage : coverImageCloudinary.url
      }
   } , {new : true}).select("-password -refreshToken")

   res
      .status(200)
      .json(new ApiResponse(200 , user , "CoverImage upated successfully"))
})

export {
   registerUser  , 
   loginUser , 
   logoutUser , 
   refreshAccessToken , 
   updatePassword , 
   getUser ,
   updateDetails , 
   updateAvatarImage ,
   updateCoverImage ,
}