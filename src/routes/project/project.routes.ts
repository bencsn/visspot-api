import { Router } from "express"
import { verifyToken } from "../../utils/middleware/verifyToken"
import { createProject } from "./createProject.controller"
import { listMyProjects } from './listMyProjects.controller';

const projectRouter = Router()

projectRouter.post("/", verifyToken, createProject)
projectRouter.get("/", verifyToken, listMyProjects)

export default projectRouter
