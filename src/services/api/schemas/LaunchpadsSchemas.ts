import { z } from 'zod';
import { urlSchema } from './UrlSchemas';

export const LocationSchema = z.object({
  name: z.string(),
  full_name: z.string(),
  locality: z.string(),
  region: z.string(),
  timezone: z.string(),
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
});

export const StatusSchema = z.object({
  status: z.string(),
  details: z.string().nullable(),
  launch_attempts: z.number(),
  launch_successes: z.number(),
});

export const ImagesSchema = z.object({
  large: z.array(urlSchema).nullable(),
});

export const LaunchpadSchema = z.object({
  name: z.string(),
  full_name: z.string(),
  status: z.string(),
  locality: z.string(),
  region: z.string(),
  timezone: z.string(),
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
  launch_attempts: z.number(),
  launch_successes: z.number(),
  rockets: z.array(z.string()),
  launches: z.array(z.string()),
  details: z.string().nullable(),
  id: z.string(),
  images: ImagesSchema.nullable(),
});

export const LaunchpadArraySchema = z.array(LaunchpadSchema);

export const LaunchpadPaginatedResponseSchema = z.object({
  docs: z.array(LaunchpadSchema),
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

export type Launchpad = z.infer<typeof LaunchpadSchema>;
export type LaunchpadArray = z.infer<typeof LaunchpadArraySchema>;
export type LaunchpadPaginatedResponse = z.infer<typeof LaunchpadPaginatedResponseSchema>;
export type Location = z.infer<typeof LocationSchema>;