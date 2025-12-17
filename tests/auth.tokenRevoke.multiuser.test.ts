import request from "supertest";
import app from "../src/server";
import { validUsers } from "./validUsers";

describe("Test to make sure one user logging out doesn't interfer with other users", () => {
  interface UserTokens {
    accessToken: string;
    refreshToken: string;
  }

  const userTokens = new Map<string, UserTokens>();

  // Login all users before tests.
  beforeAll(async () => {
    for (const user of validUsers) {
      const res = await request(app)
        .post("/v1/auth/login")
        .send({ username: user.username, password: user.password });

      expect(res.status).toBe(200);

      userTokens.set(user.username, {
        accessToken: res.body.accessToken,
        refreshToken: res.body.refreshToken,
      });
    }
  });

  it("all users should be able to acccess protected routes initially", async () => {
    for (const [username] of userTokens) {
      const tokens = userTokens.get(username)!;
      const res = await request(app)
        .get("/v1/protected")
        .set("Authorization", `Bearer ${tokens.accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body.user.userId).toBe(
        validUsers.find((user) => user.username === username)?.expectedUserId
      );
    }
  });

  it("logging out one user revokes only that user's token", async () => {
    const testTokens = userTokens.get("Test");

    if (!testTokens) {
      // This shouldn't trigger.
      throw new Error(
        "Something went wrong with getting the token for the user Test"
      );
    }

    // Test user is logged out
    const logoutRes = await request(app)
      .post("/v1/auth/logout")
      .set("X-RefreshToken", testTokens.refreshToken);

    expect(logoutRes.status).toBe(204);

    // Test user should be revoked.
    const protectedTest = await request(app)
      .get("/v1/protected")
      .set("Authorization", `Bearer ${testTokens?.accessToken}`);
    expect(protectedTest.status).toBe(401);

    // Check if at least 2 of the other users can access protected still.
    for (const username of ["Bob", "Leon"]) {
      const tokens = userTokens.get(username)!;
      const res = await request(app)
        .get("/v1/protected")
        .set("Authorization", `Bearer ${tokens.accessToken}`);
      expect(res.status).toBe(200);
    }
  });
});
