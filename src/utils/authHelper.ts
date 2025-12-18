import type { Request, Response } from "express";

export const requireUserId = (req: Request, res: Response): string => {
  const userId = req.user?.userId;

  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    throw new Error();
  }

  return userId;
};
