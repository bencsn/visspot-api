import { Response } from "express"
import prisma from "../../utils/db/prisma"
import { handleAnyError } from "../../utils/error/handleAnyError"
import logger from "../../utils/logging/logger"
import { IExtendedRequest } from "../../utils/types"

export const listMyProjects = async (
  req: IExtendedRequest,
  res: Response
): Promise<void> => {
  const userId = req.userId

  try {
    const projects = await prisma.project.findMany({
      where: {
        users: {
          some: {
            id: userId,
          },
        },
      },
      include: {
        users: true,
      },
    })

    res.status(200).json({ projects })
  } catch (error) {
    logger.error(error)
    handleAnyError(error, res)
  }
}
