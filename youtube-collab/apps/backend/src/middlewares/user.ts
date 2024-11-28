import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"
import JWT_PASSWORD from "../config";

export const userMiddleware = (req: Request,res: Response,next: NextFunction)=>{
    const header = req.header("authorization")
    const token = header?.split(" ")[1]
    if(!token){
        res.status(401).json({
            message: "Invalid token"
        })
        return
    }
    try {
        const decoded = jwt.verify(token,JWT_PASSWORD) as {userId: string, email: string}
        req.userId = decoded.userId
        next()

    }catch{
        res.status(401).json({
            message: "Invalid access"
        })
    }
}