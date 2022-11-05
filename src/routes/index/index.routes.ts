import express from "express"

const homeRouter = express.Router()

homeRouter.get("/", (req, res) => {
  res.json({ message: "Welcome to Visspot API" })
})

export default homeRouter
