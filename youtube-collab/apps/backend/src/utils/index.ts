import bcrypt from "bcrypt"
import client from "@repo/db/client"
import { video } from "../types/signup";


export const hashPassword = async (password:string) => {
   try{
       const salt = await bcrypt.genSalt(10);
       const hashValue = await bcrypt.hash(password,salt)
       
       return hashValue
    }catch(error){
        throw new Error("Error generating the bcrypt")
    }
}

export const comparePassword = async(password:string, hashedPassword:string)=>{
    const value = await bcrypt.compare(password,hashedPassword)
    return value
}



export const getVideos = async({page, limit}:video)=>{
    const videos = await client.video.findMany({
        where: {},
        take:limit,
        orderBy:{
            createdAt: 'desc'
        },
        include:{
            creator:{
                select:{
                    id: true, 
                    username: true
                    
                }
            },
        },
    })
    const total_videos = await client.video.count({
        where:{}
    })
    const total_page = Math.ceil(total_videos/limit)
    return {
        videos,
        current_page: page,
        total_page
    }
}