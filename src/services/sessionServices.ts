import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SESSIONS_FILE = path.join(__dirname, "../data/activeSessions.json");

// In-memory caching for speed
let activeSessions: Set<string> = new Set();

try {
  const data = readFileSync(SESSIONS_FILE, "utf8");
  const loaded = JSON.parse(data);
  activeSessions = new Set(loaded);
  // console.log(`Loaded ${loaded.length} active sessions from file`);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
} catch (err) {
  // console.log("Couldn't find any existing session files - Starting fresh");
  activeSessions = new Set();
}

const saveSessions = () => {
  try {
    writeFileSync(SESSIONS_FILE, JSON.stringify([...activeSessions]) + "\n"); // new line to match formatting
  } catch (err) {
    console.error("Failed to save sessions:", err);
  }
};

export const addSession = (sid: string): void => {
  activeSessions.add(sid);
  saveSessions();
};

export const hasSession = (sid: string): boolean => {
  return activeSessions.has(sid);
};

export const removeSession = (sid: string): void => {
  activeSessions.delete(sid);
  saveSessions();
};

// Mostly for testing
export const clearAllSessions = (): void => {
  activeSessions.clear();
  saveSessions();
};
