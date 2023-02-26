import express from "express"
import { config as dotenvConfig } from "dotenv"
import { registerRoutes } from "./registerRoutes"
import logger from "./utils/logging/logger"
import cors from "cors"

dotenvConfig()
const app = express()


app.use(express.json())
app.use(
  cors({
    origin: "*",
  })
)

registerRoutes(app)

const port = process.env.SERVER_PORT ?? 8082
const host = process.env.SERVER_HOST ?? "localhost"
const server = app.listen(Number(port), host, () => {
  // eslint-disable-next-line no-console
  logger.info(`🚀 Server is listening on ${host}:${port}`)
})

export default server
