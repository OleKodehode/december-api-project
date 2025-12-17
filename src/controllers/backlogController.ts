import type { Request, Response } from "express";
import { getUserEntries } from "../services/backlogService";

export const listEntries = (req: Request, res: Response) => {
  const userId = req.user?.userId;

  if (!userId)
    return res
      .status(401)
      .json({ message: "User object with userId is required." });

  const userEntries = getUserEntries(userId);

  // Display "playing" instead of "watching" for games
  // Everything is "watching" in the back to keep it consistent
  const displayEntries = userEntries.map((entry) => ({
    ...entry,
    status:
      entry.type === "game" && entry.status == "watching"
        ? "playing"
        : entry.status,
  }));

  res.status(200).json(displayEntries);
};

/*
TODO: Add more functions to handle the other backlog endpoints
*/
