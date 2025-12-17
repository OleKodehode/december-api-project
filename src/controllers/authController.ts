import type { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { issueTokens } from "../services/jwtService";
import { addSession } from "../services/sessionServices";
import { findUsersByUsername } from "../services/userService";

export const handleLogin = (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and Password required." });
  }

  const user = findUsersByUsername(username);

  if (!user || user.password !== password) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const sid = uuidv4();

  addSession(sid);

  const tokens = issueTokens({ userId: user.userid, sid });

  res.status(200).json(tokens);
};

// TODO: Add refresh and logout - Testing to see if login still works as expected first.
