import { Response } from "express"
import _ from "lodash"
import { getErrorStatusCode } from "./getErrorStatusCode"

export function sendError({
  error,
  res,
  overrideStatusCode = null,
  additionalMessage,
}: {
  error: any
  res: Response
  overrideStatusCode?: number | null
  additionalMessage?: string
}): void {
  let statusCode = overrideStatusCode
  if (!_.isFinite(statusCode)) {
    statusCode = getErrorStatusCode(error)
  }
  const errMessage = _.isString(error?.message) ? (error.message as string) : ""
  const message = _.isString(additionalMessage) ? additionalMessage : ""
  res.status(statusCode as number).json({
    error,
    message: `${errMessage} ${message}`,
  })
}
