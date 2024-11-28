import express from "express"
import { signInSchema, signUpSchema } from "../types/signup"
import { comparePassword, hashPassword } from "../utils"
import client from "@repo/db/client"
import jwt from "jsonwebtoken"
import videosRouter from "./videos"
import channelRouter from "./channel"
import { JWT_PASSWORD } from "../config"

const router = express.Router()

router.get("/",(_,res)=>{
    res.json({
        message: "server healthy"
    })
})

router.post('/auth/signup', async(req,res)=>{
    const validation = signUpSchema.safeParse(req.body)
    if(!validation.success){
        res.status(400).json({
            message: "Invalid entry"
        })
        return
    }

    const hashedPassword = await hashPassword(validation.data.password)
    if(!hashedPassword) {
        res.status(400).json({message: "internal server error"})
        return
    }
    try{ 
        const existingUser = await client.user.findUnique({
            where: {
                email: validation.data.email 
            }
        })
        if(existingUser){
            res.status(409).json({
                message: "User already exist"
            })
            return
        }
        const user = await client.user.create({
            data:{
                username: validation.data.username,
                password: hashedPassword,
                email: validation.data.email
            }
        })
        res.status(201).json({
            userId: user.id
        })
    }catch(e){
        res.status(400).json({
            message: "user already exists"
        })
    }

})

router.post('/auth/login', async(req,res)=>{
    
    const validation = signInSchema.safeParse(req.body)

    if(!validation.success){
        res.status(404).json({
            message: "Incorrect Details"
        })
        return
    }

    try{
        const user = await client.user.findUnique({
            where:{
                email: validation.data.email
            }
        })

        if(!user){
            res.status(404).json({
                message: "User not found"
            })
            return
        }

        const valid = await comparePassword(validation.data.password, user.password)
        if(!valid){
            console.log("here not valid");
            
            res.status(404).json({
                mes: "Incorrect password"
            })
            return
        }

        const token = jwt.sign({
            userId: user.id,
            email: user.email
        },JWT_PASSWORD)

        res.cookie("Authentication", token, {
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === 'production',
        })

        res.status(200).json({
            "access_token": token,
            "user":{
                "id": user.id,
                "username": user.username,
                "email": user.email
            }
        })

    }catch(e){
        res.status(400).json({  
            message: "Internal Error"
        })
    }
    
})

router.use("/videos", videosRouter)
router.use("/channels", channelRouter)
export default router