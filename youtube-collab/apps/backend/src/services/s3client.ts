import { S3Client } from "@aws-sdk/client-s3";
import { DO_SPACES_ENDPOINT, DO_SPACES_KEY, DO_SPACES_REGION, DO_SPACES_SECRET } from "../config";


const s3client = new S3Client({
    endpoint:DO_SPACES_ENDPOINT,
    region: DO_SPACES_REGION,
    credentials:{
        accessKeyId: DO_SPACES_KEY,
        secretAccessKey: DO_SPACES_SECRET
    }
})

export default s3client