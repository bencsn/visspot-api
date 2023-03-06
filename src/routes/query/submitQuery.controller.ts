import { Response } from "express"
import { z } from "zod"
import { IExtendedRequest } from "../../utils/types"
import logger from "../../utils/logging/logger"
import { handleAnyError } from "../../utils/error/handleAnyError"
import _ from "lodash"

export const submitQuery = async (
  req: IExtendedRequest,
  res: Response
): Promise<void> => {
  const body = req.body
  const bodySchema = z.object({
    query: z.string().min(2).max(150),
    projectId: z.string(),
  })

  try {
    const validatedBody = bodySchema.parse(body)
    const { query, projectId } = validatedBody
    logger.info(`Query: ${query}`)
    logger.info(`ProjectId: ${projectId}`)

    const searchEndpoint = process.env.SEARCH_ENDPOINT

    if (!_.isString(searchEndpoint)) {
      throw new Error("Search endpoint not set")
    }

    const completeSearchEndpoint = new URL('/query', searchEndpoint).toString()

    const response = await fetch(completeSearchEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        indexNamespace: projectId,
        query,
      }),
    })

    if (!response.status.toString().startsWith("2")) {
      logger.error(response)
      throw new Error("Error querying the search index")
    }

    const data = await response.json()

    res.status(200).json({ ...data })
  } catch (error) {
    logger.error(error)
    handleAnyError(error, res)
  }
}
