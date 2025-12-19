import type { Request, Response } from "express";
import {
  getUserEntries,
  createEntry as createEntryService,
  updateEntry as updateEntryService,
  findEntryById,
} from "../services/backlogService";
import { requireUserId } from "../utils/authHelper";
import { updateSchemas } from "../schemas/entrySchema";

export const listEntries = (req: Request, res: Response) => {
  const userId = requireUserId(req, res);
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

export const createEntry = (req: Request, res: Response) => {
  const userId = requireUserId(req, res);
  const input = req.body;
  const entry = createEntryService(input, userId);

  // display games as playing instead of watching
  const displayedEntry = {
    ...entry,
    status:
      entry.type === "game" && entry.status === "watching"
        ? "playing"
        : entry.status,
  };

  res.status(201).json(displayedEntry);
};

export const updateEntry = (req: Request, res: Response) => {
  const userId = requireUserId(req, res);
  const { id } = req.params;

  if (!id) {
    return res.status(401).json({ message: "Entry ID is required" });
  }

  const existingEntry = findEntryById(id, userId);
  if (!existingEntry) {
    return res.status(404).json({ message: "Entry not found" });
  }

  const schema = updateSchemas[existingEntry.type];
  if (!schema) {
    // Ideally shouldn't be called
    return res.status(500).json({ message: "Invalid entry type" });
  }

  const result = schema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: result.error,
    });
  }

  const updated = updateEntryService(id, result.data, userId);

  if (!updated) {
    return res.status(404).json({ message: "Entry not found" }); // Shouldn't happen but you never know
  }

  const displayed = {
    ...updated,
    status:
      updated.type === "game" && updated.status === "watching"
        ? "playing"
        : updated.status,
  };

  res.status(200).json(displayed);
};

/*
TODO: Add more functions to handle the other backlog endpoints
*/
