import { z } from 'zod';
import { urlSchema } from './UrlSchemas';

export const CoreSchema = z.object({
  core: z.string().nullable(),
  flight: z.number().nullable(),
  gridfins: z.boolean().nullable(),
  legs: z.boolean().nullable(),
  reused: z.boolean().nullable(),
  landing_attempt: z.boolean().nullable(),
  landing_success: z.boolean().nullable(),
  landing_type: z.string().nullable(),
  landpad: z.string().nullable(),
});

export const FailureSchema = z.object({
  time: z.number(),
  altitude: z.number().nullable(),
  reason: z.string(),
});

export const FairingsSchema = z.object({
  reused: z.boolean().nullable(),
  recovery_attempt: z.boolean().nullable(),
  recovered: z.boolean().nullable(),
  ships: z.array(z.string()),
});

export const LinksSchema = z.object({
  patch: z.object({
    small: urlSchema.nullable(),
    large: urlSchema.nullable(),
  }).nullable(),
  reddit: z.object({
    campaign: urlSchema.nullable(),
    launch: urlSchema.nullable(),
    media: urlSchema.nullable(),
    recovery: urlSchema.nullable(),
  }).nullable(),
  flickr: z.object({
    small: z.array(urlSchema),
    original: z.array(urlSchema),
  }).nullable(),
  presskit: urlSchema.nullable(),
  webcast: urlSchema.nullable(),
  youtube_id: z.string().nullable(),
  article: urlSchema.nullable(),
  wikipedia: urlSchema.nullable(),
});

export const LaunchSchema = z.object({
  fairings: FairingsSchema.nullable(),
  links: LinksSchema,
  static_fire_date_utc: z.string().nullable(),
  static_fire_date_unix: z.number().nullable(),
  net: z.boolean().nullable(),
  window: z.number().nullable(),
  rocket: z.string(),
  success: z.boolean().nullable(),
  failures: z.array(FailureSchema),
  details: z.string().nullable(),
  crew: z.array(z.string()),
  ships: z.array(z.string()),
  capsules: z.array(z.string()),
  payloads: z.array(z.string()),
  launchpad: z.string(),
  flight_number: z.number(),
  name: z.string(),
  date_utc: z.string(),
  date_unix: z.number(),
  date_local: z.string(),
  date_precision: z.string(),
  upcoming: z.boolean(),
  cores: z.array(CoreSchema),
  auto_update: z.boolean(),
  tbd: z.boolean(),
  launch_library_id: z.string().nullable(),
  id: z.string(),
});

export const LaunchArraySchema = z.array(LaunchSchema);

export const LaunchPaginatedResponseSchema = z.object({
  docs: z.array(LaunchSchema),
  totalDocs: z.number().optional(),
  offset: z.number().optional(),
  limit: z.number().optional(),
  totalPages: z.number().optional(),
  page: z.number().optional(),
  pagingCounter: z.number().optional(),
  hasPrevPage: z.boolean().optional(),
  hasNextPage: z.boolean().optional(),
  prevPage: z.number().nullable().optional(),
  nextPage: z.number().nullable().optional(),
});

export type Launch = z.infer<typeof LaunchSchema>;
export type LaunchArray = z.infer<typeof LaunchArraySchema>;
export type LaunchPaginatedResponse = z.infer<typeof LaunchPaginatedResponseSchema>;
export type Core = z.infer<typeof CoreSchema>;
export type Failure = z.infer<typeof FailureSchema>;
export type Fairings = z.infer<typeof FairingsSchema>;
export type Links = z.infer<typeof LinksSchema>;