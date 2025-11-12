import { z } from 'zod';
import { urlSchema } from './UrlSchemas';

export const LocationSchema = z.object({
  name: z.string(),
  full_name: z.string(),
  locality: z.string(),
  region: z.string(),
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
});

export const StatusSchema = z.object({
  status: z.string(),
  type: z.string(),
  details: z.string().nullable(),
  landing_attempts: z.number(),
  successful_landings: z.number(),
});

export const LandpadSchema = z.object({
  name: z.string(),
  full_name: z.string(),
  status: z.string(),
  type: z.string(),
  locality: z.string(),
  region: z.string(),
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
  landing_attempts: z.number(),
  successful_landings: z.number(),
  wikipedia: urlSchema.nullable(),
  details: z.string().nullable(),
  launches: z.array(z.string()),
  id: z.string(),
});

export const LandpadArraySchema = z.array(LandpadSchema);

export const LandpadPaginatedResponseSchema = z.object({
  docs: z.array(LandpadSchema),
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

export type Landpad = z.infer<typeof LandpadSchema>;
export type LandpadArray = z.infer<typeof LandpadArraySchema>;
export type LandpadPaginatedResponse = z.infer<typeof LandpadPaginatedResponseSchema>;
export type Location = z.infer<typeof LocationSchema>;
export type Status = z.infer<typeof StatusSchema>;