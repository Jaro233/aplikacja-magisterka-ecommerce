const request = require("supertest");
const app = require("../server");
const { sequelize, User } = require("../models/user");

describe("User Microservice", () => {
  // beforeAll(async () => {
  //   await sequelize.sync({ force: true });
  //   await User.create({
  //     username: "testuser",
  //     password: "testpassword",
  //     email: "testuser@example.com",
  //   });
  // });

  // afterAll(async () => {
  //   await sequelize.close();
  // });

  // it("should fetch a user by ID", async () => {
  //   const res = await request(app).get("/api/users/1");
  //   expect(res.statusCode).toEqual(200);
  //   expect(res.body).toHaveProperty("username", "testuser");
  // });

  it("should return 404 for non-existent user", async () => {
    const res = await request(app).get("/api/users/999");
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty("error", "User not found");
  });

  it("should return 200 for health check", async () => {
    const res = await request(app).get("/health");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("status", "UP");
  });
});
