import request from "supertest";
import app from "../src/server";

describe("POST /v1/auth/login", () => {
  it("should return 200 and tokens when provided with valid credentials", async () => {
    const res = await request(app)
      .post("/v1/auth/login")
      .send({ username: "Test", password: "TestPassword123" });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("accessToken");
    expect(res.body).toHaveProperty("refreshToken");
    expect(typeof res.body.accessToken).toBe("string");
    expect(typeof res.body.refreshToken).toBe("string");
  });

  it("should return 401 when provided with invalid credentials", async () => {
    const res = await request(app)
      .post("/v1/auth/login")
      .send({ username: "wrong", password: "wrong" });

    expect(res.status).toBe(401);
  });

  it("should return 400 if username or password is missing", async () => {
    const res = await request(app)
      .post("/v1/auth/login")
      .send({ username: "test" });

    expect(res.status).toBe(400);
  });
});
