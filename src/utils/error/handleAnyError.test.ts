import { Prisma } from "@prisma/client"
import { testCleanup, testSetup } from "../../testSetups"
import logger from "../logging/logger"
import { handleAnyError } from "./handleAnyError"

beforeAll(() => {
  testSetup()
})

afterAll(() => {
  testCleanup()
})

// Test file: src/utils/error/handleAnyError.test.ts

describe("handleAnyError", () => {
  beforeEach(() => {
    jest.spyOn(logger, "error").mockImplementation(() => {})
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it("should handle prisma errors without sending a response", () => {
    const error = new Prisma.PrismaClientKnownRequestError("P2002", {
      code: "P2002",
      meta: {
        target: ["name"],
      },
    } as any)
    handleAnyError(error)
    expect(logger.error).toHaveBeenCalledTimes(1)
    expect(logger.error).toHaveBeenCalledWith(error)
  })

  it("should handle prisma errors with sending a response", () => {
    const error = new Prisma.PrismaClientKnownRequestError("P2002", {
      code: "P2002",
      meta: {
        target: ["name"],
      },
    } as any)
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    } as any
    handleAnyError(error, res)
    expect(logger.error).toHaveBeenCalledTimes(1)
    expect(logger.error).toHaveBeenCalledWith(error)
    expect(res.status).toHaveBeenCalledTimes(1)
    expect(res.status).toHaveBeenCalledWith(409)
    expect(res.json).toHaveBeenCalledTimes(1)
    expect(res.json).toHaveBeenCalledWith({
      message: "Unique constraint failed. ",
    })
  })

  it("should handle other errors", () => {
    const error = new Error("some error")
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    } as any
    handleAnyError(error, res)
    expect(logger.error).toHaveBeenCalledTimes(1)
    expect(logger.error).toHaveBeenCalledWith(error)
    expect(res.status).toHaveBeenCalledTimes(1)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledTimes(1)
    expect(res.json).toHaveBeenCalledWith({
      message: "some error ",
      error
    })
  })

  it("should handle undefined errors", () => {
    const error = undefined
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    } as any
    handleAnyError(error, res)
    expect(logger.error).toHaveBeenCalledTimes(0)
    expect(res.status).toHaveBeenCalledTimes(0)
    expect(res.json).toHaveBeenCalledTimes(0)
  })
})
