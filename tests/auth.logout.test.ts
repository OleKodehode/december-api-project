import request from "supertest";
import app from "../src/server";

describe("POST /v1/auth/logout", () => {
  let refreshToken: string = "";
  let accessToken: string = "";

  // Clean slate before each test
  beforeAll(async () => {
    const loginRes = await request(app)
      .post("/v1/auth/login")
      .send({ username: "test", password: "password" });

    refreshToken = loginRes.body.refreshToken;
    accessToken = loginRes.body.accessToken;
  });

  it("should return 204 on valid logout", async () => {
    const res = await request(app)
      .post("/v1/auth/logout")
      .set("Authorization", `Bearer ${accessToken}`)
      .set("X-RefreshToken", refreshToken);

    expect(res.status).toBe(204);
    expect(res.body).toEqual({}); // No content within body.
  });

  it("should return 401 if tokens weren't supplied.", async () => {
    const res = await request(app).post("/v1/auth/logout");

    expect(res.status).toBe(401);
  });
});
