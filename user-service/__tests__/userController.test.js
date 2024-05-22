const request = require("supertest");
const app = require("../app");
const sequelize = require("../config/database");
const { User } = require("../models");

describe("User Microservice", () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
    await User.create({
      username: "testuser",
      password: "hashedpassword",
      email: "testuser@example.com",
    });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("should fetch a user by ID", async () => {
    const res = await request(app).get("/api/users/1");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("username", "testuser");
  });

  it("should return 404 for non-existent user", async () => {
    const res = await request(app).get("/api/users/999");
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty("error", "User not found");
  });
});
