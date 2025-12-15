import app from "../src/server.ts";
import request from "supertest";

describe("GET /v1/health", () => {
  it("Should return 200 with a status of ok along with a timestamp in ISO format", async () => {
    const res = await request(app).get("/v1/health");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      status: "ok",
      timestamp: expect.any(String),
    });

    // Check that the timestamp is valid ISO format
    expect(new Date(res.body.timestamp).toISOString()).toBe(res.body.timestamp);
  });
});
