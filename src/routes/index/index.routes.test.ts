import { testCleanup, getServerForTesting, testSetup } from '../../testSetups';

const server = getServerForTesting()

beforeAll(() => {
  testSetup()
})

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
});
