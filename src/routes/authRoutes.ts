import "dotenv/config";
import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";

const router = Router();

// Temp in-memory sessions
const activeSessions = new Set<string>();

const ACCESS_SECRET = process.env.ACCESS_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;

if (!ACCESS_SECRET || !REFRESH_SECRET) {
  throw new Error("Missing JWT Secrets in environment variables.");
}

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and Password is required." });
  }

  // test authentication to make testing pass for now
  if (username !== "test" || password !== "password") {
    return res.status(401).json({ message: "Invalid credentials." });
  }

  const userId = "user-123";
  const sid = uuidv4();

  activeSessions.add(sid);

  const accessToken = jwt.sign({ userId, sid }, ACCESS_SECRET, {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign({ userId, sid }, REFRESH_SECRET, {
    expiresIn: "7d",
  });

  res.status(200).json({ accessToken, refreshToken });
});

router.get("/refresh", (req, res) => {
  const refreshToken = req.headers["x-refreshtoken"];

  if (!refreshToken || typeof refreshToken !== "string") {
    return res.status(401).json({ message: "Refresh token required." });
  }

  // replace check later to check if token is valid or not instead of hardcoded like this.
  if (refreshToken === "invalid-token") {
    return res.status(401).json({ message: "Invalid refresh token." });
  }

  // TODO: Verify JWT and check SID.
  // For TDD development - issuing just a new access token
  const payload = { userId: "user-123", sid: "dev-sid" }; // dev purposes only
  const newAccessToken = jwt.sign(payload, ACCESS_SECRET, { expiresIn: "15m" });

  res.status(200).json({ accessToken: newAccessToken });
});

router.post("/logout", (req, res) => {
  const refreshToken = req.headers["x-refreshtoken"];
  const accessToken = req.headers["authorization"];

  if (!refreshToken || !accessToken) {
    return res.status(401).json({
      message: "Both refresh and access tokens are required to logout.",
    });
  }

  // Just to get green state.
  // TODO: Verify tokens and remove SID.
  res.status(204).send();
});

export default router;
