// tests/auth.test.js
const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/User");
const { setupTestDB, teardownTestDB, clearTestDB } = require("./setup");

beforeAll(async () => {
  await setupTestDB();
});

afterAll(async () => {
  await teardownTestDB();
});

beforeEach(async () => {
  await clearTestDB();
});

describe("Authentication Tests", () => {
  const validUser = {
    name: "Test User",
    email: "test@example.com",
    password: "Password123",
  };

  describe("POST /api/auth/register", () => {
    test("Should register a new user successfully", async () => {
      const response = await request(app)
        .post("/api/auth/register")
        .send(validUser)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe(validUser.email);
      expect(response.body.data.token).toBeDefined();
    });

    test("Should not register user with invalid email", async () => {
      const invalidUser = { ...validUser, email: "invalid-email" };

      const response = await request(app)
        .post("/api/auth/register")
        .send(invalidUser)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    test("Should not register user with weak password", async () => {
      const weakPasswordUser = { ...validUser, password: "123" };

      const response = await request(app)
        .post("/api/auth/register")
        .send(weakPasswordUser)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe("POST /api/auth/login", () => {
    beforeEach(async () => {
      const user = new User(validUser);
      await user.save();
    });

    test("Should login with valid credentials", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: validUser.email,
          password: validUser.password,
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.token).toBeDefined();
    });

    test("Should not login with invalid credentials", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: validUser.email,
          password: "wrongpassword",
        })
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });
});
