import { Request, Response } from "express"
import { z } from "zod"
import prisma from "../../utils/db/prisma"
import logger from "../../utils/logging/logger"
import { handleAnyError } from "../../utils/error/handleAnyError"
import _ from "lodash"

export const createProject = async (
  req: Request,
  res: Response
): Promise<void> => {
  const body = req.body

  const schema = z.object({
    name: z.string().min(1).max(255),
  })

  const searchEndpoint = process.env.SEARCH_ENDPOINT
  if (!_.isString(searchEndpoint)) {
    res
      .status(500)
      .json({ message: "SEARCH_ENDPOINT environment variable is not set" })
    return
  }

  try {
    const validatedBody = schema.parse(body)

    const project = await prisma.project.create({
      data: {
        name: validatedBody.name,
        users: {
          connect: {
            id: (req as any).userId,
          },
        },
      },
    })

    // populate the project with the user
    const projectWithUser = await prisma.project.findUnique({
      where: {
        id: project.id,
      },
      include: {
        users: true,
      },
    })


    // return project
    res
      .status(200)
      .json({ project: projectWithUser, message: "Project created" })
  } catch (error) {
    logger.error(error)
    handleAnyError(error, res)
  }
}
