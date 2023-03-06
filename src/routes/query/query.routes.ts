import { Router } from "express"
import { submitQuery } from "./submitQuery.controller"

const queryRouter = Router()

queryRouter.post("/", submitQuery)

export { queryRouter }
