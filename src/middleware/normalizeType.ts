import type { NextFunction, Request, Response } from "express";

export const normalizeType = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let entryType = req.body.type;
  if (entryType && typeof entryType === "string") {
    entryType = entryType.toLowerCase().trim();
    req.body.type = entryType;
  }
  next();
};
