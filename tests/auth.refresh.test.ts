import request from "supertest";
import app from "../src/server";

let refreshToken: string = "";

// Login to get a valid refresh token
beforeAll(async () => {
  const loginRes = await request(app)
    .post("/v1/auth/login")
    .send({ username: "test", password: "password" });

  refreshToken = loginRes.body.refreshToken;
});

describe("GET /v1/auth/refresh", () => {
  it("should return 200 and a new accessToken with a valid refresh token", async () => {
    const res = await request(app)
      .get("/v1/auth/refresh")
      .set("X-RefreshToken", refreshToken);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("accessToken");
    expect(typeof res.body.accessToken).toBe("string");
  });

  it("should return 401 when given an invalid refresh token", async () => {
    const res = await request(app)
      .get("/v1/auth/refresh")
      .set("X-RefreshToken", "invalid-token");

    expect(res.status).toBe(401);
  });

  it("should return 401 when there are no X-RefreshToken header", async () => {
    const res = await request(app).get("/v1/auth/refresh");

    expect(res.status).toBe(401);
  });
});
