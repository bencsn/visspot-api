import express from "express"
import homeRouter from "./routes/index/index.routes"
import healthcheckRouter from "./routes/healthcheck/healthcheck.routes"
import loginRouter from "./routes/login/login.routes"
import userRouter from "./routes/user/user.routes"

export function registerRoutes(app: express.Application): void {
  app.use("/", homeRouter)
  app.use("/healthcheck", healthcheckRouter)
  app.use("/login", loginRouter)
  app.use("/user", userRouter)
}
