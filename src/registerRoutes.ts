import express from "express"
import homeRouter from "./routes/index/index.routes"
import healthcheckRouter from "./routes/healthcheck/healthcheck.routes"
import loginRouter from "./routes/login/login.routes"
import userRouter from "./routes/user/user.routes"
import projectRouter from "./routes/project/project.routes"
import { queryRouter } from "./routes/query/query.routes"

export function registerRoutes(app: express.Application): void {
  app.use("/", homeRouter)
  app.use("/healthcheck", healthcheckRouter)
  app.use("/login", loginRouter)
  app.use("/user", userRouter)
  app.use("/projects", projectRouter)
  app.use("/queries", queryRouter)
}
