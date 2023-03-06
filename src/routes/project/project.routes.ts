import { Router } from "express"
import { verifyToken } from "../../utils/middleware/verifyToken"
import { createProject } from "./createProject.controller"
import { listMyProjects } from './listMyProjects.controller';
import { getProjectById } from './getProjectById.controller';
import { createDocument } from './createDocument.controller';
import { listDocuments } from "./listDocuments.controller";

const projectRouter = Router()

projectRouter.post("/", verifyToken, createProject)
projectRouter.get("/", verifyToken, listMyProjects)
projectRouter.get("/:id", verifyToken, getProjectById)
projectRouter.post("/:id/documents", verifyToken, createDocument)
projectRouter.get("/:id/documents", verifyToken, listDocuments)


export default projectRouter
