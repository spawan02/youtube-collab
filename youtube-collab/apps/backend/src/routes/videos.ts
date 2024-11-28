import express from "express"
import client from "@repo/db/client"
import { getVideos } from "../utils"
import fs from "fs"
import AWS from "aws-sdk"
import { DO_SPACES_ENDPOINT, DO_SPACES_KEY, DO_SPACES_NAME, DO_SPACES_SECRET } from "../config"
import { uploadSchema, videoResponse } from "../types/signup"
import { userMiddleware } from "../middlewares/user"
import { uploadFileToAWS } from "../services/upload"

const router = express.Router()

router.get("/feed", async (req,res)=>{
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

   try {
    const videoFeedData = await getVideos({page, limit})
    if(!videoFeedData){
        res.status(404).json({
            message: "Video not found"
        })
        return
    }
    res.status(201).json({
        videos: videoFeedData.videos.map((video)=>({
            video: video.id,
            title: video.title,
            thumbnail_url: video.thumbnailUrl,
            creator: {
                id: video.creator.id,
                username: video.creator.username
            },
            view_count: video.viewCount,
            created_at: video.createdAt
        })),
        total_pages: videoFeedData.total_page,
        current_page: videoFeedData.current_page
    })
   }catch(e){
    res.json({
        message: "Internal server error"
    })
   }
})

router.post("/upload", userMiddleware,async(req,res)=>{
    const validation = uploadSchema.safeParse(req.body)
    if(!validation.success){
        res.status(400).json({
            message: "Invalid entry"
        })
        return
    }
    const channel = await client.video.findFirst({
        where: {
            userId: req.userId
        }
    })
    if(!channel){
        res.status(401).json({
            message: "No channel found"
        })
        return
    }
    const video = await client.video.create({
        data:{
            title: validation.data.title,
            description: validation.data.description,
            userId: req.userId!,
            channelId: channel.id,
            qualities: ["240p", "480p", "720p"],
        }
    })
    const fileToBeUploaded = validation.data.file
    console.log(typeof(fileToBeUploaded))
    const videoId = video.id
    console.log(videoId)
    const response = await uploadFileToAWS(DO_SPACES_NAME, videoId, fileToBeUploaded)

    const updatedVideoUrl = await client.video.update({
        where: {
            id: videoId
        }, 
        data:{
            fileUrl: response?.fileUrl
        }
    })


})


router.get("/:videoId", async(req,res)=>{
    const videoId = req.params.videoId
    const data = await client.video.findFirst({
        where: {
            id: videoId
        }, 
        include:{
            creator:{
                select:{
                    id: true,
                    username: true
                }
            }
        }
    })
    if(!data){
        res.status(404).json({
            message: "video not found"
        })
        return
    }
    let response: videoResponse = {
        id: data.id,
        title: data.title,
        description: data.description,
        creator: {
            id: data.creator.id,
            username: data.creator.username
        },
    }
    if(data.status==="TRANSCODED"){
       response={
        ...response,
        videoUrl: { urls:data.videoUrls },
        status: data.status,
        view_count: data.viewCount,
        current_timestamp: data.currentTimestamp!
       }
    }
    res.status(201).json(response)
})

export default router