import type { Request, Response } from "express";
import {
  getUserEntries,
  createEntry as createEntryService,
  updateEntry as updateEntryService,
  findEntryById,
  deleteEntry as deleteEntryService,
} from "../services/backlogService";
import { requireUserId } from "../utils/authHelper";
import { updateSchemas } from "../schemas/entrySchema";
import type { Entry, GameEntry, MovieEntry, SeriesEntry } from "../types/entry";

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

export const getById = (req: Request, res: Response) => {
  const userId = requireUserId(req, res);
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Entry Id is required" });
  }

  const entry = findEntryById(id, userId);

  if (!entry) {
    return res.status(404).json({ message: "Entry not found" });
  }

  // Same as in listEntries
  const displayEntry = {
    ...entry,
    status:
      entry.type === "game" && entry.status === "watching"
        ? "playing"
        : entry.status,
  };

  return res.status(200).json(displayEntry);
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

  const result = schema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: result.error,
    });
  }

  const updatedData = mergeEntryUpdate(existingEntry, result.data);

  const updated = updateEntryService(id, updatedData, userId);

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

export const deleteEntry = (req: Request, res: Response) => {
  const userId = requireUserId(req, res);
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Entry ID required" });
  }

  const deletedEntry = deleteEntryService(id, userId);

  if (!deletedEntry) {
    return res.status(404).json({ message: "Entry not found" });
  }

  return res.status(204).send();
};

// type guard
function isDefined<T>(value: T | undefined): value is T {
  return value !== undefined;
}

function mergeEntryUpdate(
  existing: Entry,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  update: any // This will be processed within the function
): Entry {
  const updated: Entry = {
    ...existing,
    updatedAt: new Date().toISOString(),
  };

  if (isDefined(update.title)) updated.title = update.title;
  if (isDefined(update.status)) updated.status = update.status;
  if (isDefined(update.rating)) updated.rating = update.rating;
  if (isDefined(update.notes)) updated.notes = update.notes;

  switch (existing.type) {
    case "movie": {
      const movieUpdate = update as Partial<MovieEntry>;
      const updatedMovie = updated as MovieEntry;

      if (isDefined(movieUpdate.releaseYear)) {
        updatedMovie.releaseYear = movieUpdate.releaseYear;
      }
      if (isDefined(movieUpdate.director)) {
        updatedMovie.director = movieUpdate.director;
      }
      break;
    }

    case "series": {
      const seriesUpdate = update as Partial<SeriesEntry>;
      const updatedSeries = updated as SeriesEntry;

      if (isDefined(seriesUpdate.releaseYear)) {
        updatedSeries.releaseYear = seriesUpdate.releaseYear;
      }
      if (isDefined(seriesUpdate.currentEpisode)) {
        updatedSeries.currentEpisode = seriesUpdate.currentEpisode;
      }
      if (isDefined(seriesUpdate.currentSeason)) {
        updatedSeries.currentSeason = seriesUpdate.currentSeason;
      }
      break;
    }

    case "game": {
      const gameUpdate = update as Partial<GameEntry>;
      const updatedGame = updated as GameEntry;

      if (isDefined(gameUpdate.releaseYear)) {
        updatedGame.releaseYear = gameUpdate.releaseYear;
      }
      if (isDefined(gameUpdate.platform)) {
        updatedGame.platform = gameUpdate.platform;
      }
      if (isDefined(gameUpdate.playTime)) {
        updatedGame.playTime = gameUpdate.playTime;
      }
      break;
    }
    // Something wrong must have happened to end up here.
    default:
      throw new Error("Type not found within mergeEntryUpdate!");
  }

  return updated;
}
