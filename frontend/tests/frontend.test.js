const request = require("supertest");
const app = require("../server");

describe("Frontend", () => {
  it("should return 200 for health check", () => {
    const res = request(app).get("/health");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("status", "UP");
  });
});
