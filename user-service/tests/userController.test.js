const request = require("supertest");
const app = require("../server");

describe("User Microservice", () => {
  it("should return 500 for non-existent user", () => {
    const res = request(app).get("/api/users/999");
    expect(res.statusCode).toEqual(500);
  });

  it("should return 200 for health check", () => {
    const res = request(app).get("/health");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("status", "UP");
  });
});
