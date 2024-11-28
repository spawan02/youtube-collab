import { PutObjectCommand } from "@aws-sdk/client-s3";
import s3client from "./s3client";

//@ts-ignore
export const uploadFileToAWS = async(bucketName, videoId, uploadFile) =>{
    const videoKey =`${videoId}/original/${videoId}.mp4`
    try{
        const uploadParams = {
            Bucket: bucketName, 
            Key: videoKey,           
            Body: uploadFile,   
          };

        const command = new PutObjectCommand(uploadParams);
        const uploadObject = await s3client.send(command);
        const videoURL = `https://youtube-collab.blr1.digitaloceanspaces.com/${videoId}/original/${videoId}.mp4`
        return {
            fileUrl: videoURL
        }
    }catch(e){
        console.log("error",e)
    }
}
