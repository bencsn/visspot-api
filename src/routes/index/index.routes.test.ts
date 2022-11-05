import { testCleanup, getServerForTesting } from '../../testSetups';

const server = getServerForTesting()

afterAll(() => {
  testCleanup()
})

describe("GET /", () => {
  it("should return 200 OK", (cb) => {
    server
      .get("/")
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
      .get("/")
      .then((response) => {
        expect(response.body).toEqual({ message: "Welcome to Visspot API" })
        cb()
      })
      .catch((err) => {
        cb(err)
      })
  })
})
