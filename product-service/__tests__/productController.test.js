const request = require("supertest");
const app = require("../server"); // Adjust the path as necessary

jest.mock("../models"); // This will use the mocked Sequelize models

describe("Product Microservice", () => {
  it("should return UP status for health check", async () => {
    const res = await request(app).get("/health");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("status", "UP");
  });
});
