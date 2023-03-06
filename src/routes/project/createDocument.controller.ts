import { Response } from "express"
import _ from "lodash"
import { z } from "zod"
import prisma from "../../utils/db/prisma"
import { handleAnyError } from "../../utils/error/handleAnyError"
import logger from "../../utils/logging/logger"
import { IExtendedRequest } from "../../utils/types"

export const createDocument = async (
  req: IExtendedRequest,
  res: Response
): Promise<void> => {
  const userId = req.userId
  const projectId = req.params.id
  const body = req.body
  const bodySchema = z.object({
    content: z.string(),
    type: z.string(),
  })

  let validatedBody: z.infer<typeof bodySchema>
  try {
    validatedBody = bodySchema.parse(body)
  } catch (error) {
    res.status(400).json({ message: "Invalid body" })
    return
  }
  const { content, type } = validatedBody

  try {
    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
      },
      include: {
        users: true,
      },
    })

    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!project) {
      res.status(404).json({ message: "Project not found" })
      return
    }

    const userIsInProject = project.users.some((user) => user.id === userId)

    if (!userIsInProject) {
      res.status(403).json({ message: "Access denied" })
      return
    }

    const document = await prisma.document.create({
      data: {
        content,
        type,
        name: "",
        project: {
          connect: {
            id: projectId,
          },
        },
      },
    })

    const searchEndpoint = process.env.SEARCH_ENDPOINT
    if (!_.isString(searchEndpoint)) {
      res
        .status(500)
        .json({ message: "SEARCH_ENDPOINT environment variable is not set" })
      return
    }

    const insertEndpoint = `${searchEndpoint}/insert`
    const response = await fetch(insertEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        indexNamespace: project.id,
        texts: [
          {
            id: document.id,
            text: content,
          },
        ],
      }),
    })

    if (!response.status.toString().startsWith("2")) {
      res
        .status(response.status ?? 500)
        .json({ message: "Error inserting to the search index" })
      return
    }

    res.status(201).json({ document })
  } catch (error) {
    logger.error(error)
    handleAnyError(error, res)
  }
}
