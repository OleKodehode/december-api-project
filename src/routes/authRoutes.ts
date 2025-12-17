import "dotenv/config";
import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import { issueTokens, verifyRefreshToken } from "../services/jwtService";
import {
  addSession,
  hasSession,
  removeSession,
} from "../services/sessionServices";
import { handleLogin } from "../controllers/authController";

const router = Router();

router.post("/login", handleLogin);

router.get("/refresh", (req, res) => {
  const refreshToken = req.headers["x-refreshtoken"];

  if (!refreshToken || typeof refreshToken !== "string") {
    return res.status(401).json({ message: "Refresh token required" });
  }

  try {
    const payload = verifyRefreshToken(refreshToken);

    if (!hasSession(payload.sid)) {
      return res.status(401).json({ message: "Session revoked" });
    }

    const newAccessToken = jwt.sign(
      { userId: payload.userId, sid: payload.sid },
      process.env.ACCESS_SECRET!,
      { expiresIn: "15m" }
    );

    res.status(200).json({ accessToken: newAccessToken });
  } catch (err) {
    res.status(401).json({ message: "Invalid refresh token" });
  }
});

router.post("/logout", (req, res) => {
  const refreshToken = req.headers["x-refreshtoken"];

  if (!refreshToken || typeof refreshToken !== "string") {
    return res.status(401).json({
      message: "Refresh token required",
    });
  }

  try {
    const payload = verifyRefreshToken(refreshToken);
    removeSession(payload.sid);
    res.status(204).send();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
});

export default router;
