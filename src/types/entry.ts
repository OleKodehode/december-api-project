export type EntryType = "movie" | "series" | "game";

export type Status = "planned" | "watching" | "completed" | "dropped";

// optional fields will be filled with null by zod.
export interface BaseEntry {
  id: string;
  title: string;
  type: EntryType;
  status: Status;
  rating?: number | null; // 1-10 or null if not rated (yet)
  notes?: string | null; // if the user wants to add notes to an entry - Optional
  userId: string;
  createdAt: string; // ISO string
  updatedAt: string; // ^
}

export interface MovieEntry extends BaseEntry {
  type: "movie";
  releaseYear?: number | null;
  director?: string | null;
}

export interface SeriesEntry extends BaseEntry {
  type: "series";
  releaseYear?: number | null;
  currentSeason?: number | null;
  currentEpisode?: number | null;
}

export interface GameEntry extends BaseEntry {
  type: "game";
  releaseYear?: number | null;
  platform?: string | string[] | null;
  playTime?: number | null; // Playtime in hours
}

export type Entry = MovieEntry | SeriesEntry | GameEntry;
