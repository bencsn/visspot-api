import express from "express"

const healthcheckRouter = express.Router()

healthcheckRouter.get("/", (req, res) => {
  res.json({ message: "OK" })
})

export default healthcheckRouter
