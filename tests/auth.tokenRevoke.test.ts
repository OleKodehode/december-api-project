import request from "supertest";
import app from "../src/server";

describe("Token should be rejected after logout", () => {
  let accessToken: string;
  let refreshToken: string;

  beforeEach(async () => {
    // Fresh login for each test.
    const loginRes = await request(app)
      .post("/v1/auth/login")
      .send({ username: "Test", password: "TestPassword123" });

    expect(loginRes.status).toBe(200);
    accessToken = loginRes.body.accessToken;
    refreshToken = loginRes.body.refreshToken;
  });

  it("allows access to protected route before logout", async () => {
    const res = await request(app)
      .get("/v1/protected")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("You are authenticated");
  });

  it("rejects access to protected route after logout", async () => {
    // Initiate logout first.
    const logoutRes = await request(app)
      .post("/v1/auth/logout")
      .set("X-RefreshToken", refreshToken);

    expect(logoutRes.status).toBe(204);

    // Try to use old access token after logging out
    const protectedRes = await request(app)
      .get("/v1/protected")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(protectedRes.status).toBe(401);
    expect(protectedRes.body.message).toContain(
      "Session invalid or already revoked"
    );
  });

  it("rejects refresh tokens after logout", async () => {
    await request(app)
      .post("/v1/auth/logout")
      .set("X-RefreshToken", refreshToken);

    const refreshRes = await request(app)
      .get("/v1/auth/refresh")
      .set("X-RefreshToken", refreshToken);

    expect(refreshRes.status).toBe(401);
  });
});
