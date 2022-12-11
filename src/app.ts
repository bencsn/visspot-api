import express from "express"
import pino from "pino-http"
import { config as dotenvConfig } from "dotenv"
import { registerRoutes } from "./registerRoutes"
import { verifyToken } from './utils/middleware/verifyToken';

dotenvConfig()
const app = express()

app.use(express.json())

app.use(
  pino({
    transport: {
      target: "pino-pretty",
    },
    redact: ["req", "res"],
  })
)

registerRoutes(app)

const port = process.env.SERVER_PORT ?? 8082
const server = app.listen(port, () => {
  // eslint-disable-next-line no-console
  return console.log(`🚀 Server is listening on ${port}`)
})

export default server
