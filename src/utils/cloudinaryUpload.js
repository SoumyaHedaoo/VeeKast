import { CHUNK_SIZE, LARGE_UPLOAD_THRESHOLD_BYTES } from "../constant.js";
import cloudinary from "./cloudinaryClient.js";
import fs from "fs/promises"

const cloudinaryUpload=async (localFilePath)=>{
    if(!localFilePath) return null;
    const fileSize = await fs.stat(localFilePath)?.size;
    
    try {
        let uploadResponse;
        if(fileSize >= LARGE_UPLOAD_THRESHOLD_BYTES){
            uploadResponse = await cloudinary.uploader.upload_large(localFilePath , {
                resource_type : 'auto' ,
                chunk_size : CHUNK_SIZE ,
            });
        }else{
            uploadResponse = await cloudinary.uploader.upload(localFilePath , {
                resource_type :'auto'
            })
        }

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