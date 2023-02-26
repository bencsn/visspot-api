// Write a middleware to verify the token

import { NextFunction, Request, Response } from "express"
import { isString } from "lodash"
import jwt from "jsonwebtoken"
import logger from '../logging/logger';

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  logger.info("Verifying user token")
  const token = req.header("authorization")
  if (!isString(token)) {
    logger.error("Authorization header is not a string or is undefined")
    res.status(401).json({ message: "Access Denied" })
    return
  }

  //   split the token into an array and get the second element
  const tokenArray = token.split(" ")
  const tokenValue = tokenArray[1]

  if (!isString(tokenValue)) {
    logger.error("Token value is not a string or is undefined")
    res.status(401).json({ message: "Access Denied" })
    return
  }

  const jwtSecret = process.env.JWT_SECRET
  if (!isString(jwtSecret)) {
    logger.error("JWT_SECRET is not a string or is undefined")
    res.status(500)
    res.json({
      message:
        "No jwt secret. Did you set the JWT_SECRET environment variable?",
    })
    return
  }

  try {
    jwt.verify(tokenValue, jwtSecret)
    // get userinfo
    const decodedToken = jwt.decode(tokenValue)
    if (!isString(decodedToken?.sub)) {
      logger.error("User id is not a string or is undefined")
      res.status(401).json({ message: "Access Denied" })
      return
    }

    (req as any).userId = decodedToken?.sub

    next()
  } catch (error) {
    res.status(401).json({ message: "Access denied" })
  }
}
