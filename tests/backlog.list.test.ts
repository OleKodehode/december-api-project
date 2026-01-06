import request from "supertest";
import app from "../src/server";
import { validUsers } from "./validUsers";
import type { Entry } from "../src/types/entry";

describe("GET /v1/entries - List a user's entries (Protected)", () => {
  let accessToken: string;
  const testUser = validUsers[2];

  beforeEach(async () => {
    const loginRes = await request(app)
      .post("/v1/auth/login")
      .send({ username: testUser.username, password: testUser.password });

    accessToken = loginRes.body.accessToken;
  });

  it("should return 401 without authentication", async () => {
    const res = await request(app).get("/v1/entries");
    expect(res.status).toBe(401);
  });

  it("should return 200 and an empty array for users with no entries", async () => {
    const res = await request(app)
      .get("/v1/entries")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toHaveLength(0);
  });

  it("should only return the authenticated user's entries", async () => {
    const res = await request(app)
      .get("/v1/entries")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    // ALl entries, if there are any, should have matching userIds
    res.body.forEach((entry: Entry) => {
      expect(entry.userId).toBe(testUser.expectedUserId);
      expect(entry.title).toBeDefined();
      expect(["movie", "series", "game"]).toContain(entry.type);
      expect(["planned", "in-progress", "completed", "dropped"]).toContain(
        entry.status
      );
    });
  });
});
