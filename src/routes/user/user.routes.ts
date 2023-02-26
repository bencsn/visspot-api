import express from "express"
import { verifyToken } from "../../utils/middleware/verifyToken"
import { meController } from "./user.controllers"

const userRouter = express.Router()


userRouter.get("/me", verifyToken, meController)

export default userRouter
