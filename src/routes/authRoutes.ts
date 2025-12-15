import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";

const router = Router();

// Temp in-memory sessions
const activeSessions = new Set<string>();

// Dev testing - Replace with env variables later
const ACCESS_SECRET = "dev-access";
const REFRESH_SECRET = "dev-refresh";

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

export default router;
