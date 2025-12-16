import type { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../services/jwtService";
import { hasSession } from "../services/sessionServices";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer")) {
    return res
      .status(401)
      .json({ message: "Missing or invalid Authorization header" });
  }

  const token = authHeader.split(" ")[1];
  // Check to make sure token is not undefined.
  if (!token) {
    return res
      .status(401)
      .json({ message: "Invalid Authorization header format" });
  }

  try {
    const payload = verifyAccessToken(token);

    if (!hasSession(payload.sid)) {
      return res
        .status(401)
        .json({ message: "Session invalid or already revoked" });
    }

    req.user = { userId: payload.userId, sid: payload.sid };
    next();
  } catch (err) {
    console.error("Error during token verification:", err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
