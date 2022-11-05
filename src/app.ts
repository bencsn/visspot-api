import express from "express"
import pino from "pino-http"
import config from "config"
import { registerRoutes } from "./registerRoutes"

const app = express()

app.use(
  pino({
    transport: {
      target: "pino-pretty",
    },
    redact: ["req", "res"],
    
  })
)

registerRoutes(app)

const port = config.get<number>("server.port")
const server = app.listen(port, () => {
  // eslint-disable-next-line no-console
  return console.log(`🚀 Server is listening on ${port}`)
})

export default server
