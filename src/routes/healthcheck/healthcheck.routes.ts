import express from "express"
import { verifyToken } from '../../utils/middleware/verifyToken';

const healthcheckRouter = express.Router()

healthcheckRouter.get("/", (req, res) => {
  res.json({ message: "OK" })
})

healthcheckRouter.get("/private", verifyToken, (req, res) => {
  return res.json({ message: "OK" })
})

export default healthcheckRouter
