import { Prisma } from "@prisma/client"
import { Response } from "express"
import logger from "../logging/logger"

export function handleAnyError(e: any, res?: Response, additionalMessage?:string): void {
  //   handle all types of prisma errors
  if (e instanceof Prisma.PrismaClientKnownRequestError) {
    logger.error(e)
    // handle known error codes https://www.prisma.io/docs/reference/api-reference/error-reference#error-codes
    if (e.code === "P2002") {
      if (res !== undefined) {
        res.status(409)
        res.json({
          message: `Unique constraint failed. ${additionalMessage ?? ""}`,
        })
      }
    } else if (e.code === "P2001") {
      if (res !== undefined) {
        res.status(404)
        res.json({
          message: `The record searched for was not found. ${additionalMessage ?? ""}`,
        })
      }
    } else {
      if (res !== undefined) {
        res.status(500)
        res.json({
          message: `${e.message}. ${additionalMessage ?? ""}`,
        })
      }
    }
  } else {
    logger.error(e)
    if (res !== undefined) {
      res.status(500)
      res.json({
        message: `Something went wrong: ${e.message as string}. ${additionalMessage ?? ""}`,
      })
    }
  }
}
