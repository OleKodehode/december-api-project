import { z } from "zod";

const baseSchema = z.object({
  title: z.string().min(1, "Title is required"),
  status: z.enum(["planned", "watching", "completed", "dropped"]),
  rating: z.number().min(1).max(10).nullable().optional().default(null),
  notes: z.string().nullable().optional().default(null),
});

export const movieSchema = baseSchema.extend({
  type: z.literal("movie"),
  releaseYear: z.number().int().min(1888).nullable().optional().default(null), // First move made in 1888
  director: z.string().nullable().optional().default(null),
});

export const seriesSchema = baseSchema.extend({
  type: z.literal("series"),
  releaseYear: z.number().int().min(1928).nullable().optional().default(null), // First tv show aired
  currentSeason: z.number().int().min(1).nullable().optional().default(null),
  currentEpisode: z.number().int().min(1).nullable().optional().default(null),
});

export const gameSchema = baseSchema.extend({
  type: z.literal("game"),
  releaseYear: z.number().int().min(1971).nullable().optional(), // first commercial game.
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

const baseUpdateSchema = z
  .object({
    title: z.string().min(1).optional(),
    status: z.enum(["planned", "watching", "completed", "dropped"]).optional(),
    rating: z.number().min(1).max(10).nullable().optional(),
    notes: z.string().nullable().optional(),
  })
  .strict();

export const movieUpdateSchema = baseUpdateSchema.extend({
  releaseYear: z.number().int().min(1888).nullable().optional(),
  director: z.string().nullable().optional(),
});

export const seriesUpdateSchema = baseUpdateSchema.extend({
  releaseYear: z.number().int().min(1928).nullable().optional(),
  currentSeason: z.number().int().min(1).nullable().optional(),
  currentEpisode: z.number().int().min(1).nullable().optional(),
});

export const gameUpdateSchema = baseUpdateSchema.extend({
  releaseYear: z.number().int().min(1971).nullable().optional(),
  platform: z
    .union([z.string(), z.array(z.string())])
    .nullable()
    .optional(),
  playTime: z.number().min(0).nullable().optional(),
});

export const updateSchemas = {
  movie: movieUpdateSchema,
  series: seriesUpdateSchema,
  game: gameUpdateSchema,
};
