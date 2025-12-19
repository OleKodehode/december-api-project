import request from "supertest";
import app from "../src/server";
import { validUsers } from "./validUsers";
import { clearAllEntries } from "../src/services/backlogService";

describe("DELETE /v1/entries/:id - Should delete a specified entry (protected)", () => {
  let accessToken: string;
  let testEntryId: string;
  const testUser = validUsers[0];

  beforeEach(async () => {
    clearAllEntries(); // Start clean with no entries in the json

    const loginRes = await request(app)
      .post("/v1/auth/login")
      .send({ username: testUser.username, password: testUser.password });

    accessToken = loginRes.body.accessToken;

    const testEntry = {
      type: "movie",
      title: "Pirates of the Caribbean: The Curse of the Black Pearl",
      status: "completed",
      rating: 8,
      releaseYear: 2003,
      director: "Gore Verbinski",
    };

    const createRes = await request(app)
      .post("/v1/entries/")
      .set("Authorization", `Bearer ${accessToken}`)
      .send(testEntry);

    expect(createRes).toBe(201);
    testEntryId = createRes.body.id;
  });

  it("should delete the entry when a user is authenticated and entry exists", async () => {
    const deleteRes = await request(app)
      .delete(`/v1/entries/${testEntryId}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(deleteRes.status).toBe(204);
    expect(deleteRes.body.message).toContain("Entry successfully deleted");

    // Need to verify that it's actually deleted
    const listRes = await request(app)
      .get("/v1/entries")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(listRes.body).toHaveLength(0);
  });

  it("should return 404 when entry does not exist", async () => {
    const deleteRes = await request(app)
      .delete("/v1/entries/fake-id")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(deleteRes.status).toBe(404);
    expect(deleteRes.body.message).toContain("Entry not found");
  });

  it("should return 401 when not authenticated", async () => {
    const deleteRes = await request(app).delete(`/v1/entries/${testEntryId}`);

    expect(deleteRes.status).toBe(401);
  });

  it("Should return 404 when trying to delete another user's entry", async () => {
    const otherUser = validUsers[1];
    const otherLogin = await request(app)
      .post("/v1/auth/login")
      .send({ username: otherUser.username, password: otherUser.password });

    const otherToken = otherLogin.body.accessToken;

    const otherEntryRes = await request(app)
      .post("/v1/entries")
      .set("Authorization", `Bearer ${otherToken}`)
      .send({
        type: "game",
        title: "Other User's Game",
        status: "watching",
      });

    const otherEntryId = otherEntryRes.body.id;

    // First user tries to delete the other user's entry
    const deleteRes = await request(app)
      .delete(`/v1/entries/${otherEntryId}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(deleteRes.status).toBe(404); // It should not be found - Filered by UserId
  });
});
