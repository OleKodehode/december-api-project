import "dotenv/config";
import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { issueTokens, verifyRefreshToken } from "../services/jwtService";
import {
  addSession,
  hasSession,
  removeSession,
} from "../services/sessionServices";
import { findUserByUsername } from "../services/userService";

export const handleLogin = (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and Password required." });
  }

  const user = findUserByUsername(username);

  if (!user || user.password !== password) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const sid = uuidv4();

  addSession(sid);

  const tokens = issueTokens({ userId: user.userId, sid });

  res.status(200).json(tokens);
};

export const handleRefresh = (req: Request, res: Response) => {
  const refreshToken = req.headers["x-refreshtoken"];

  if (typeof refreshToken !== "string") {
    return res.status(401).json({ message: "Refresh token must be a string" });
  }

  try {
    const payload = verifyRefreshToken(refreshToken);

    if (!hasSession(payload.sid)) {
      return res.status(401).json({ message: "Session revoked" });
    }

    const newAccessToken = jwt.sign(
      { userId: payload.userId, sid: payload.sid },
      process.env.ACCESS_SECRET!, // This should have been checked by now to exist
      { expiresIn: "15m" }
    );

    res.status(200).json({ accessToken: newAccessToken });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    res.status(401).json({ message: "Invalid refresh token" });
  }
};

export const handleLogout = (req: Request, res: Response) => {
  const refreshToken = req.headers["x-refreshtoken"];

  if (typeof refreshToken !== "string") {
    return res.status(401).json({ message: "Refresh token required" });
  }

  try {
    const payload = verifyRefreshToken(refreshToken);
    removeSession(payload.sid);
    res.status(204).send();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};
