import express from "express"
import { homeController } from "./index.controllers";

const homeRouter = express.Router()

homeRouter.get("/", homeController)

export default homeRouter
