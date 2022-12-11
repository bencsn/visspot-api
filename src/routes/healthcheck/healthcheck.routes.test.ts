import { User } from "@prisma/client"
import { getServerForTesting, testCleanup, testSetup } from "../../testSetups"
import { getTokenForUser } from "../../utils/tests/getTokenForUser"

export const server = getServerForTesting()

beforeAll(() => {
  testSetup()
})

afterAll(() => {
  testCleanup()
})

describe("GET /healthcheck", () => {
  it("should return 200 OK", (cb) => {
    server
      .get("/healthcheck")
      .then((response) => {
        expect(response.status).toBe(200)
        cb()
      })
      .catch((err) => {
        cb(err)
      })
  })

  it("should return a json with a message", (cb) => {
    server
      .get("/healthcheck")
      .then((response) => {
        expect(response.body).toEqual({ message: "OK" })
        cb()
      })
      .catch((err) => {
        cb(err)
      })
  })
})

describe("GET /healthcheck/private", () => {
  it("should return 401 Unauthorized", (cb) => {
    server
      .get("/healthcheck/private")
      .then((response) => {
        expect(response.status).toBe(401)
        cb()
      })
      .catch((err) => {
        cb(err)
      })
  })

  it("should return a json with a message", (cb) => {
    const fakeUser: User = {
      id: "auth0|123456789",
      name: "John Doe",
      email: "1994benc@gmail.com",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    getTokenForUser(fakeUser)
      .then((token) => {
        server
          .get("/healthcheck/private")
          .set("Authorization", `Bearer ${token}`)
          .then((response) => {
            expect(response.body).toEqual({ message: "OK" })
            cb()
          })
          .catch((err) => {
            cb(err)
          })
      })
      .catch((err) => {
        cb(err)
      })
  })
})
