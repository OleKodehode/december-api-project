import "dotenv/config";
import jwt from "jsonwebtoken";

const ACCESS_SECRET = process.env.ACCESS_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;

// A check is ran on server start to check for this, but to make typescript happy, check it here too
if (!ACCESS_SECRET || !REFRESH_SECRET) {
  throw new Error("Couldn't find secrets in the dotenv file.");
}

export interface TokenPayLoad {
  userId: string;
  sid: string;
}

export const issueTokens = (payload: TokenPayLoad) => {
  const accessToken = jwt.sign(payload, ACCESS_SECRET, { expiresIn: "15m" });
  const refreshToken = jwt.sign(payload, REFRESH_SECRET, { expiresIn: "7d" });

  return { accessToken, refreshToken };
};

export const verifyAccessToken = (token: string): TokenPayLoad => {
  return jwt.verify(token, ACCESS_SECRET) as TokenPayLoad;
};

export const verifyRefreshToken = (token: string): TokenPayLoad => {
  return jwt.verify(token, REFRESH_SECRET) as TokenPayLoad;
};
