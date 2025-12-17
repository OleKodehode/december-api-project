import { z } from "zod";

const baseSchema = z.object({
  title: z.string().min(1, "Title is required"),
  status: z.enum(["planned", "watching", "completed", "dropped"]),
  rating: z.number().min(1).max(10).nullable().optional().default(null),
  notes: z.string().nullable().optional().default(null),
});

const movieSchema = baseSchema.extend({
  type: z.literal("movie"),
  releaseYear: z.number().int().min(1888).nullable().optional().default(null), // First move made in 1888
  director: z.string().nullable().optional().default(null),
});

const seriesSchema = baseSchema.extend({
  type: z.literal("series"),
  releaseYear: z.number().int().min(1928).nullable().optional().default(null), // First tv show aired
  currentSeason: z.number().int().min(1).nullable().optional().default(null),
  currentEpisode: z.number().int().min(1).nullable().optional().default(null),
});

const gameSchema = baseSchema.extend({
  type: z.literal("game"),
  releaseYear: z.number().int().min(1971), // first commercial game.
  platform: z
    .union([z.string(), z.array(z.string())])
    .nullable()
    .optional()
    .default(null),
  playTime: z.number().min(0).nullable().optional().default(null),
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
