import express from "express"

const homeRouter = express.Router()

homeRouter.get("/", (req, res) => {
  req.log.info("Hello home")
  res.json({ message: "Hello home" })
})

export default homeRouter
