import { Request, Response } from "express"
import prisma from "../../utils/db/prisma"

/**
 * Get the user object for the logged in user (i.e. the user who made the request)
 * @param req  Request object from Express framework (https://expressjs.com/en/api.html#req)
 * @param res  Response object from Express framework (https://expressjs.com/en/api.html#res)
 * @returns void
 */
export const meController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = (req as any).userId

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  })

  if (user === null) {
    res.status(404)
    res.json({
      message: "User not found",
    })
    return
  }

  res.status(200)
  res.send(user)
}
