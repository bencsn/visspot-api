import express from "express"

import {
  logIn,
  logInCallback,
  refreshTokenController,
} from "./login.controllers"

const loginRouter = express.Router()

loginRouter.get("/", logIn)

loginRouter.get("/callback", logInCallback)

loginRouter.post("/refresh-token", refreshTokenController)

export default loginRouter
