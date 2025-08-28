import { v2 as cloudinary } from "cloudinary";
import {promises as fs} from "fs";




    const cloudinaryUpload=async (localFilePath)=>{
        // Configuration
        cloudinary.config({ 
            cloud_name:process.env.CLOUDINARY_CLOUD_NAME, 
            api_key:process.env.CLOUDINARY_API_KEY, 
            api_secret:process.env.CLOUDINARY_API_SECRET,
        });

        try {
            if(!localFilePath) return null;

            const uploadResponse = await cloudinary.uploader.upload(localFilePath , {
                resource_type :'auto'
            })

            console.log("file uploaded successfully!!");
            return uploadResponse;

        } catch (error) {
            console.log("unable to upload on cloudinary ,ERROR: " ,error );
            return null;
        }finally{
            try {
                await fs.unlink(localFilePath)
            } catch (error) {
                console.log("unlink operation failed , ERROR : " , error);   
            }
        }
    }

export {cloudinaryUpload};