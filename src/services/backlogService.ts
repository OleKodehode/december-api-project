import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { v4 as uuidv4 } from "uuid";
import type { Entry } from "../types/entry";
import type { CreateEntryInput } from "../schemas/entrySchema";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const BACKLOG_FILE = join(__dirname, "../data/backlog.json");

let entries: Entry[] = [];

try {
  const data = readFileSync(BACKLOG_FILE, "utf8");
  entries = JSON.parse(data);
  // console.log(`Loaded ${entries.length} backlog entries`);
} catch (err) {
  const error = err as NodeJS.ErrnoException; // type assertion - To avoid err: any/unknown
  if (error.code === "ENOENT") {
    // console.log("No backlog file found - Starting with empty array");
  } else {
    console.error("Error loading backlog:", err);
  }

  entries = [];
  writeFileSync(BACKLOG_FILE, JSON.stringify([]));
}

const save = () => {
  // console.log("entries:", entries, "\n", new Date().toISOString());
  try {
    writeFileSync(BACKLOG_FILE, JSON.stringify(entries, null, 2) + "\n"); // new line to match formatting
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
  input: Entry,
  userId: string
): Entry | null => {
  const entry = findEntryById(id, userId);
  if (!entry) return null;

  Object.assign(entry, input);
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
