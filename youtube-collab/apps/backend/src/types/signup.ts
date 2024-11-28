import z from "zod"

export const signUpSchema =z.object({
    username: z.string(),
    password: z.string(),
    email: z.string().email()

})

export const signInSchema = z.object({
    email: z.string().email(),
    password: z.string()
})

export const channelSchema = z.object({
    name: z.string(),
    description: z.string(),
    slug: z.string()
})

const videoSchema = z.instanceof(File).refine((file)=>{
  const allowedVideoTypes = ['video/mp4'];
  return allowedVideoTypes.includes(file.type)
},{
  message: 'File must be a valid video format (mp4)',
})

export const uploadSchema = z.object({
  title: z.string(),
  description: z.string(),
  category: z.string(),
  file: videoSchema
})

export interface video{
  page: number
  limit: number
}

export interface videoResponse {
  id: string
  title: string
  description: string
  creator: {
    id: string
    username: string
  };
  status?: string
  videoUrl?: object
  view_count?: number           
  current_timestamp?: number 
}

declare global {
    namespace Express {
      export interface Request {
        userId?: string;
        email?: string;
      }
    }
}
