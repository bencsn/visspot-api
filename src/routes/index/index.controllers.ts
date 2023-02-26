import { Request, Response } from "express"
import logger from "../../utils/logging/logger"

export const homeController = async (req: Request, res: Response): Promise<void> => {
  logger.info("Visspot API")
  res.json({ message: "Welcome to the Visspot API" })
}
