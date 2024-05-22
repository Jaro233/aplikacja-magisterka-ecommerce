const request = require("supertest");
const app = require("../server");

describe("Cart Microservice", () => {
  // it("should return 500 for non-existent cart", async () => {
  //   const res = await request(app).get("/api/cart");
  //   expect(res.statusCode).toEqual(500);
  // });

  it("should return 200 for health check", async () => {
    const res = await request(app).get("/health");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("status", "UP");
  });
});
