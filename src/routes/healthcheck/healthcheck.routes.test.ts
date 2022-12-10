import { getServerForTesting, testCleanup, testSetup } from "../../testSetups"

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
