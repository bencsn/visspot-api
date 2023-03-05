/* eslint-disable no-extra-boolean-cast */
import { Prisma } from "@prisma/client"
import { Response } from "express"
import { ZodError } from "zod"
import logger from "../logging/logger"
import { sendError } from "./sendError"

/**
 *
 * @param e error object
 * @param res  response object. If undefined, the error will not be sent to the client
 * @param additionalMessage  additional message to send to the client
 */
export function handleAnyError(
  e: any,
  res?: Response,
  additionalMessage?: string
): Response<any, Record<string, any>> | undefined {
  if (!(Boolean(e))) {
    return
  }

  if (e instanceof ZodError) {
    logger.error(e)
    if (res !== undefined) {
      res.status(400)
      return res.json({
        message:`${e.errors.map(e => {
          return e.message
        }).join(", ")}\n ${additionalMessage ?? ""}`
      })
    }
  }
  //   handle all types of prisma errors
  if (e instanceof Prisma.PrismaClientKnownRequestError) {
    logger.error(e)
    // handle known error codes https://www.prisma.io/docs/reference/api-reference/error-reference#error-codes
    if (e.code === "P2002") {
      if (res !== undefined) {
        res.status(409)
        return res.json({
          message: `Unique constraint failed. ${additionalMessage ?? ""}`,
        })
      }
    } else if (e.code === "P2001") {
      if (res !== undefined) {
        res.status(404)
        return res.json({
          message: `The record searched for was not found. ${
            additionalMessage ?? ""
          }`,
        })
      }
    } else {
      if (res !== undefined) {
        res.status(500)
        return res.json({
          message: `${e.message}. ${additionalMessage ?? ""}`,
        })
      }
    }
  } else {
    logger.error(e)
    if (res !== undefined) {
      sendError({ error: e, res, additionalMessage })
    }
  }
}
