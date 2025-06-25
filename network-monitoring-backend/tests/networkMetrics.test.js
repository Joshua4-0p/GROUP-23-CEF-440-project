// tests/networkMetrics.test.js
const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/User");
const NetworkMetrics = require("../src/models/NetworkMetrics");
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

describe("Network Metrics Tests", () => {
  let authToken;
  let userId;

  beforeEach(async () => {
    // Create and authenticate user
    const user = new User({
      name: "Test User",
      email: "test@example.com",
      password: "Password123",
    });
    await user.save();
    userId = user._id;

    const loginResponse = await request(app).post("/api/auth/login").send({
      email: "test@example.com",
      password: "Password123",
    });

    authToken = loginResponse.body.data.token;
  });

  const validMetrics = {
    deviceId: "test-device-123",
    connectionType: "cellular",
    isConnected: true,
    downloadSpeed: 25.5,
    uploadSpeed: 10.2,
    latency: 45,
    location: {
      latitude: 4.0511,
      longitude: 9.7679,
    },
  };

  describe("POST /api/network-metrics", () => {
    test("Should create network metrics successfully", async () => {
      const response = await request(app)
        .post("/api/network-metrics")
        .set("Authorization", `Bearer ${authToken}`)
        .send(validMetrics)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.downloadSpeed).toBe(validMetrics.downloadSpeed);
    });

    test("Should not create metrics without authentication", async () => {
      const response = await request(app)
        .post("/api/network-metrics")
        .send(validMetrics)
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe("GET /api/network-metrics", () => {
    beforeEach(async () => {
      // Create test metrics
      const metrics = new NetworkMetrics({
        ...validMetrics,
        userId,
        downloadStatus: "excellent",
        uploadStatus: "good",
        latencyStatus: "good",
      });
      await metrics.save();
    });

    test("Should get user metrics successfully", async () => {
      const response = await request(app)
        .get("/api/network-metrics")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.metrics).toHaveLength(1);
    });
  });
});
