const request = require("supertest");
const app = require("../server");

describe("Order Microservice", () => {
  it("should return 500 for non-existent user", async () => {
    const res = await request(app).get("/api/orders/999");
    expect(res.statusCode).toEqual(500);
  });

  it("should return 200 for health check", async () => {
    const res = await request(app).get("/health");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("status", "UP");
  });
});
