import request from "supertest";
import app from "../src/server";
import { validUsers } from "./validUsers";

describe("POST /v1/auth/login", () => {
  it.each(validUsers)(
    "should return 200 and tokens when provided with valid credentials for usert $username",
    async ({ username, password, expectedUserId }) => {
      const res = await request(app)
        .post("/v1/auth/login")
        .send({ username, password });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("accessToken");
      expect(res.body).toHaveProperty("refreshToken");
      expect(typeof res.body.accessToken).toBe("string");
      expect(typeof res.body.refreshToken).toBe("string");

      // Decode token to check if userid matches the expected userid
      // if I'm not mistaken, JWTs are encoded by default with base64Url
      const payload = JSON.parse(
        Buffer.from(res.body.accessToken.split(".")[1], "base64").toString()
      );
      expect(payload.userId).toBe(expectedUserId);
    }
  );

  it("should return 401 when provided with invalid credentials", async () => {
    const res = await request(app)
      .post("/v1/auth/login")
      .send({ username: "wrong", password: "wrong" });

    expect(res.status).toBe(401);
  });

  it("should return 400 if username or password is missing", async () => {
    const res = await request(app)
      .post("/v1/auth/login")
      .send({ username: "test" });

    expect(res.status).toBe(400);
  });
});
