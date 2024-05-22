const request = require("supertest");
const app = require("../server");

describe("Order Microservice", () => {
  beforeAll((done) => {
    done();
  });

  afterAll((done) => {
    // Closing the DB connection allows Jest to exit successfully.
    redisClient.disconnect();
    done();
  });
  it("should return 200 for health check", async () => {
    const res = await request(app).get("/health");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("status", "UP");
  });
});
