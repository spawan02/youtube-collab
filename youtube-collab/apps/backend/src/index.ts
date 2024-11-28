import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import router from "./routes/index"

const app = express()
dotenv.config()

app.use(cors())
app.use(express.json())
app.use("/api", router)


app.listen(3000,()=>{console.log("server listening on 3000")})