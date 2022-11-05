import express from "express";
import adminRouter from "./routes/admin/admin.routes";
import homeRouter from "./routes/index/index.routes";
import healthcheckRouter from './routes/healthcheck/healthcheck.routes';

export function registerRoutes(app: express.Application): void {
  app.use("/", homeRouter);
  app.use("/healthcheck", healthcheckRouter)
  app.use("/admin", adminRouter);
}
