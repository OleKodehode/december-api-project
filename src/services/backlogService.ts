import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { v4 as uuidv4 } from "uuid";
import { type Entry } from "../types/entry";
import type {
  UpdateEntryInput,
  CreateEntryInput,
} from "../schemas/entrySchema";

const BACKLOG_FILE = path.resolve(process.cwd(), "data/backlog.json");

let entries: Entry[] = [];

try {
  const data = readFileSync(BACKLOG_FILE, "utf8");
  entries = JSON.parse(data);
  console.log(`Loaded ${entries.length} backlog entries`);
} catch (err) {
  const error = err as NodeJS.ErrnoException; // type assertion - To avoid err: any/unknown
  if (error.code === "ENOENT") {
    console.log("No backlog file found - Starting with empty array");
  } else {
    console.error("Error loading backlog:", err);
  }

  entries = [];
  writeFileSync(BACKLOG_FILE, JSON.stringify([]));
}

const save = () => {
  try {
    writeFileSync(BACKLOG_FILE, JSON.stringify(entries, null, 2));
  } catch (err) {
    console.error("Failed to save backlog:", err);
  }
};

export const getUserEntries = (userId: string): Entry[] => {
  return entries.filter((entry) => entry.userId === userId);
};

export const createEntry = (input: CreateEntryInput, userId: string): Entry => {
  const now = new Date().toISOString();

  const newEntry: Entry = {
    ...input,
    id: uuidv4(),
    userId,
    createdAt: now,
    updatedAt: now,
    rating: input.rating ?? null,
  };

  entries.push(newEntry);
  save();

  return newEntry;
};

export const findEntryById = (
  id: string,
  userId: string
): Entry | undefined => {
  return entries.find((entry) => entry.id === id && entry.userId === userId);
};

export const updateEntry = (
  id: string,
  input: UpdateEntryInput,
  userId: string
): Entry | null => {
  const entry = findEntryById(id, userId);
  if (!entry) return null;

  Object.assign(entry, {
    ...input,
    updatedAt: new Date().toISOString(),
  });

  save();
  return entry;
};

export const deleteEntry = (id: string, userId: string): boolean => {
  const index = entries.findIndex(
    (entry) => entry.id === id && entry.userId === userId
  );
  if (index === -1) return false;

  entries.splice(index, 1);
  save();
  return true;
};

// For testing
export const clearAllEntries = () => {
  entries = [];
  save();
};
