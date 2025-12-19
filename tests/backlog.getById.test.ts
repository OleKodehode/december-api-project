import request from "supertest";
import app from "../src/server";
import { validUsers } from "./validUsers";
import { clearAllEntries } from "../src/services/backlogService";

describe("GET /v1/entries/:id - Retrieve a single entry (protected)", () => {
  let accessToken: string;
  let testEntryId: string;
  const testUser = validUsers[0];
  const testEntry = {
    type: "movie",
    title: "Inception",
    status: "planned",
    releaseYear: 2010,
    director: "Christopher Nolan",
  };

  beforeEach(async () => {
    clearAllEntries();

    const loginRes = await request(app)
      .post("/v1/auth/login")
      .send({ username: testUser.username, password: testUser.password });

    accessToken = loginRes.body.accessToken;

    const createRes = await request(app)
      .post("/v1/entries")
      .set("Authorization", `Bearer ${accessToken}`)
      .send(testEntry);

    expect(createRes.status).toBe(201);
    testEntryId = createRes.body.id;
  });

  it("should return the entry when authenticated and ID exists", async () => {
    const res = await request(app)
      .get(`/v1/entries/${testEntryId}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject(testEntry);
  });

  it("should return 404 when entry does not exist", async () => {
    const res = await request(app)
      .get("/v1/entries/00000000-0000-0000-0000-000000000000")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.status).toBe(404);
    expect(res.body.message).toContain("Entry not found");
  });

  it("should return 401 when not authenticated", async () => {
    const res = await request(app).get(`/v1/entries/${testEntryId}`);

    expect(res.status).toBe(401);
  });

  it("should return 404 when trying to access another user's entry", async () => {
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

    const res = await request(app)
      .get(`/v1/entries/${otherEntryId}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Entry not found");
  });

  // Redudancy test - Already tested in create but just in case.
  it("should display game status as 'playing' instead of 'watching'", async () => {
    const gameRes = await request(app)
      .post("/v1/entries")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        type: "game",
        title: "Megabonk",
        status: "watching",
        playTime: 35,
      });

    const gameId = gameRes.body.id;

    const res = await request(app)
      .get(`/v1/entries/${gameId}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("playing"); // games should be displayed as playing instead of watching
  });
});
