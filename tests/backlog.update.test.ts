import request from "supertest";
import app from "../src/server";
import { validUsers } from "./validUsers";
import { clearAllEntries } from "../src/services/backlogService";

describe("PATCH /v1/entries/:id - Partial update (protected)", () => {
  let accessToken: string;
  let entryId: string;
  const testUser = validUsers[0];

  beforeEach(async () => {
    clearAllEntries(); // start with a clean slate

    const loginRes = await request(app)
      .post("/v1/auth/login")
      .send({ username: testUser.username, password: testUser.password });
    accessToken = loginRes.body.accessToken;

    // Send a post request to create a test entry to update
    const postRes = await request(app)
      .post("/v1/entries")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        type: "movie",
        title: "Original Title",
        status: "planned",
        rating: null,
      });

    entryId = postRes.body.id;
  });

  it("should return 401 without authentication", async () => {
    const res = await request(app)
      .patch(`/v1/entries/${entryId}`)
      .send({ status: "completed" });

    expect(res.status).toBe(401);
  });

  it("should return 404 if entry was not found or belongs to another user", async () => {
    const res = await request(app)
      .patch(`/v1/entries/does-not-exist`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ status: "completed" });

    expect(res.status).toBe(404);
  });

  it("should update the allowed fields and return 200 with updated entry", async () => {
    const updateData = {
      title: "Updated Title",
      status: "completed",
      rating: 8,
      notes: "Pretty good!",
    };

    const res = await request(app)
      .patch(`/v1/entries/${entryId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send(updateData);

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      id: entryId,
      userId: testUser.expectedUserId,
      ...updateData,
      type: "movie",
    });
    expect(Date.parse(res.body.updatedAt)).toBeGreaterThan(
      Date.parse(res.body.createdAt)
    );
  });

  it("should allow changing status to be in-progress", async () => {
    const gameRes = await request(app)
      .post("/v1/entries")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        type: "game",
        title: "Test Game",
        status: "planned",
      });

    const gameId = gameRes.body.id;

    const patchRes = await request(app)
      .patch(`/v1/entries/${gameId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ status: "in-progress" });

    expect(patchRes.status).toBe(200);
    expect(patchRes.body.status).toBe("in-progress");
  });
});
