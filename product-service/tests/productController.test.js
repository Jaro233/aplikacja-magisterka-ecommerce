const request = require("supertest");
const app = require("../server");

describe("Product Microservice", () => {
  it("should return 200 for health check", async () => {
    const res = await request(app).get("/health");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("status", "UP");
  });
});
