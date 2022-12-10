// Write a middleware to verify the token

import { NextFunction, Request, Response } from "express"
import { isString } from "lodash"
import jwt from "jsonwebtoken"

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token = req.header("authorization")
  if (!isString(token)) {
    res.status(401).json({ message: "Access Denied" })
    return
  }

  //   split the token into an array and get the second element
  const tokenArray = token.split(" ")
  const tokenValue = tokenArray[1]

  if (!isString(tokenValue)) {
    res.status(401).json({ message: "Access Denied" })
    return
  }

  const jwtSecret = process.env.JWT_SECRET
  if (!isString(jwtSecret)) {
    res.status(500)
    res.json({
      message:
        "No jwt secret. Did you set the JWT_SECRET environment variable?",
    })
    return
  }

  try {
    const verifiedToken = jwt.verify(tokenValue, jwtSecret)
    req.log.info({ verifiedToken })
    next()
  } catch (error) {
    res.status(401).json({ message: "Access denied" })
  }
}
