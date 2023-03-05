import { isString } from "lodash"
import jwt from "jsonwebtoken"
import { User } from "@prisma/client"

export const getTokenForUser = async (user: User): Promise<string> => {
  const jwtSecret = process.env.JWT_SECRET
  if (!isString(jwtSecret)) {
    throw new Error(
      "No jwt secret. Did you set the JWT_SECRET environment variable?"
    )
  }

  const accessToken = jwt.sign(
    {
      sub: user.id,
      name: user.name,
      email: user.email,
    },
    jwtSecret,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN ?? "15m",
    }
  )

  return accessToken
}
