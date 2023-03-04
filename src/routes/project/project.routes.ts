import { Router } from "express"
import { verifyToken } from "../../utils/middleware/verifyToken"
import { createProject } from "./createProject.controller"

const projectRouter = Router()

projectRouter.post("/", verifyToken, createProject)

export default projectRouter
