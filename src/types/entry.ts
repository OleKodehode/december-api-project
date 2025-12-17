export type EntryType = "movie" | "series" | "game";

export type Status = "planned" | "watching" | "completed" | "dropped";

export interface BaseEntry {
  id: string;
  title: string;
  type: EntryType;
  status: Status;
  rating: number | null; // 1-10 or null if not rated (yet)
  notes?: string; // if the user wants to add notes to an entry - Optional
  userId: string;
  createdAt: string; // ISO string
  updatedAt: string; // ^
}

export interface MovieEntry extends BaseEntry {
  type: "movie";
  releaseYear?: number;
  director?: string;
}

export interface SeriesEntry extends BaseEntry {
  type: "series";
  releaseYear?: number;
  currentSeason?: number;
  currentEpisode?: number;
}

export interface GameEntry extends BaseEntry {
  type: "game";
  releaseYear?: number;
  platform?: string | string[];
  playtime?: number; // Playtime in hours
}

export type Entry = MovieEntry | SeriesEntry | GameEntry;
