import express from "express"
import { channelSchema } from "../types/signup"
import { userMiddleware } from "../middlewares/user"
import client from "@repo/db/client"

const router = express.Router()

router.post("/", userMiddleware, async (req, res)=>{
    const validation = channelSchema.safeParse(req.body)
    if(!validation.success){
        res.status(400).json({
            message: "Invalid entries"
        })
        return
    }

    const [existingSlug, existingUserChannel] = await Promise.all([
        client.channel.findFirst({
            where:{
                slug: validation.data.slug
            }
        }),
        client.channel.findFirst({
            where:{
                userId: req.userId
            }
        })
    ])

    if(existingUserChannel){
        res.status(411).json({
            message: "Channel already exists"
        })
        return
    }
    if(existingSlug){
        res.status(409).json({
            message: "Slug already exists"
        })
        return
    }

    const channel = await client.channel.create({
        data:{
            userId: req.userId!,
            name: validation.data.name,
            description: validation.data.description,
            slug: validation.data.slug
        }
    })
    res.status(201).json({
        channel:{
            channel_id: channel.id,
            creator: channel.userId,
            created_at: channel.createdAt
        }
    })
})

router.get("/:slug", userMiddleware, async(req,res)=>{
    const slug = req.params.slug
    const channelDetails = await client.channel.findFirst({
        where:{
            slug: slug
        }, 
        include:{
            videos:{
                select:{
                    id: true,
                    title: true,
                    thumbnailUrl: true
                }
            }
        }
    })
    if(!channelDetails){
        res.status(404).json({
            message: "no slug found"
        })
        return
    }
    res.status(200).json({
        id: channelDetails.id,
        name: channelDetails.name,
        desciption: channelDetails.description,
        subscriber_count: channelDetails.subscriberCount,
        videos: channelDetails.videos.map((video)=>({
            id: video.id,
            title: video.title,
            thumbnail_url: video.thumbnailUrl
        }))
    })
})

export default router