import { z } from 'zod';
import { urlSchema } from './UrlSchemas';

export const ShipSchema = z.object({
  last_ais_update: z.string().nullable(),
  legacy_id: z.string().nullable(),
  model: z.string().nullable(),
  type: z.string(),
  roles: z.array(z.string()),
  imo: z.number().nullable(),
  mmsi: z.number().nullable(),
  abs: z.number().nullable(),
  class: z.number().nullable(),
  mass_kg: z.number().nullable(),
  mass_lbs: z.number().nullable(),
  year_built: z.number().nullable(),
  home_port: z.string(),
  status: z.string(),
  speed_kn: z.number().nullable(),
  course_deg: z.number().nullable(),
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
  link: urlSchema.nullable(),
  image: urlSchema.nullable(),
  name: z.string(),
  active: z.boolean(),
  launches: z.array(z.string()),
  id: z.string(),
});

export const ShipArraySchema = z.array(ShipSchema);

export const ShipPaginatedResponseSchema = z.object({
  docs: z.array(ShipSchema),
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

export type Ship = z.infer<typeof ShipSchema>;
export type ShipArray = z.infer<typeof ShipArraySchema>;
export type ShipPaginatedResponse = z.infer<typeof ShipPaginatedResponseSchema>;