import { z } from "zod";

const baseSchema = z.object({
  title: z.string().min(1, "Title is required"),
  status: z.enum(["planned", "watching", "completed", "dropped"]),
  rating: z.number().min(1).max(10).nullable().optional(),
  notes: z.string().optional(),
});

const movieSchema = baseSchema.extend({
  type: z.literal("movie"),
  releaseYear: z.number().int().min(1888).optional(), // First move made in 1888
  director: z.string().optional(),
});

const seriesSchema = baseSchema.extend({
  type: z.literal("series"),
  releaseYear: z.number().int().min(1928).optional(), // First tv show aired
  currentSeason: z.number().int().min(1).optional(),
  currentEpisode: z.number().int().min(1).optional(),
});

const gameSchema = baseSchema.extend({
  type: z.literal("game"),
  releaseYear: z.number().int().min(1971), // first commercial game.
  platform: z.union([z.string(), z.array(z.string())]).optional(),
  playTime: z.number().min(0).optional(),
});

export const CreateEntrySchema = z.discriminatedUnion("type", [
  movieSchema,
  seriesSchema,
  gameSchema,
]);

export type CreateEntryInput = z.infer<typeof CreateEntrySchema>;

export const UpdateEntrySchema = z.discriminatedUnion("type", [
  movieSchema.partial(),
  seriesSchema.partial(),
  gameSchema.partial(),
]);

export type UpdateEntryInput = z.infer<typeof UpdateEntrySchema>;
