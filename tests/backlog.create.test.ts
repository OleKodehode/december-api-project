import request from "supertest";
import app from "../src/server";
import { validUsers } from "./validUsers";
import { clearAllEntries } from "../src/services/backlogService";

describe("POST /v1/entries - Create a new entry (protected)", () => {
  let accessToken: string;
  const testUser = validUsers[0];

  beforeEach(async () => {
    clearAllEntries(); // Start clean with no entries in the json

    const loginRes = await request(app)
      .post("/v1/auth/login")
      .send({ username: testUser.username, password: testUser.password });

    accessToken = loginRes.body.accessToken;
  });

  it("should create a entry and returns 201 with the entry (Movie entry in this case)", async () => {
    const movieEntry = {
      type: "movie",
      title: "Pirates of the Caribbean: The Curse of the Black Pearl",
      status: "completed",
      rating: 8,
      releaseYear: 2003,
      director: "Gore Verbinski",
    };

    const res = await request(app)
      .post("/v1/entries")
      .set("Authorization", `Bearer ${accessToken}`)
      .send(movieEntry);

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      ...movieEntry,
      id: expect.any(String),
      userId: testUser.expectedUserId,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });

    const listRes = await request(app)
      .get("/v1/entries")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(listRes.body).toHaveLength(1);
    expect(listRes.body[0].title).toBe(movieEntry.title);
  });

  it("should show games as playing instead of watching", async () => {
    const gameEntry = {
      type: "game",
      title: "Escape from Tarkov",
      status: "watching",
      releaseYear: 2015,
      platform: "PC",
    };

    const res = await request(app)
      .post("/v1/entries")
      .set("Authorization", `Bearer ${accessToken}`)
      .send(gameEntry);

    expect(res.status).toBe(201);
    expect(res.body.status).toBe("playing");

    const listRes = await request(app)
      .get("/v1/entries")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(listRes.body).toHaveLength(2);
    expect(listRes.body[1].title).toBe(gameEntry.title);
  });

  it("should return 401 without authentication", async () => {
    const res = await request(app)
      .post("/v1/entries")
      .send({ type: "movie", title: "test", status: "watching" });

    expect(res.status).toBe(401);
  });
});
