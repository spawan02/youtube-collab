import dotenv from "dotenv"
dotenv.config()

const requiredEnvVars = ['JWT_PASSWORD', "DO_SPACES_NAME", "DO_SPACES_SECRET", "DO_SPACES_KEY", "DO_SPACES_ENDPOINT", "DO_SPACES_REGION"];

function checkEnvs(){
    requiredEnvVars.forEach((varName)=>{
        if(!process.env[varName]){
            throw new Error("Env variable is missing");   
        }
    })
}
try{
    checkEnvs()
}catch(e){
    console.log(e)
    process.exit(1)
}

export const JWT_PASSWORD=process.env.JWT_PASSWORD!
export const DO_SPACES_NAME= process.env.DO_SPACES_NAME!
export const DO_SPACES_KEY = process.env.DO_SPACES_KEY!
export const DO_SPACES_ENDPOINT = process.env.DO_SPACES_ENDPOINT!
export const DO_SPACES_SECRET = process.env.DO_SPACES_SECRET!
export const DO_SPACES_REGION = process.env.DO_SPACES_REGION!




// const getFileFromAWS = async()=>{
//     const spaceName = DO_SPACES_NAME
//     const videoFile = "fileStream"
//     const uploadParams = {
//         Bucket: DO_SPACES_NAME, 
//         Key: videoFile,           
//       };
//     const command = new GetObjectCommand(uploadParams);
//     const data =  await s3client.send(command)
//     const localFilePath = path.join(__dirname, "../static/videos/test.mp4")
//     const writeStream = fs.createWriteStream(localFilePath);

// }

// const file = path.join(__dirname, "../static/videos/test.mp4")
// const fileStream = fs.createReadStream(file)

// console.log(getFileFromAWS())
