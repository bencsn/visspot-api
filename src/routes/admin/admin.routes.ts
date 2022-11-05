import express from "express"

const adminRouter = express.Router()

adminRouter.get("/", (req, res) => {
  req.log.info("Hello admin")
  res.json({ message: "This is home" })
})

export default adminRouter
