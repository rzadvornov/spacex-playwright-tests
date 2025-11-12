import { z } from 'zod';

export const DragonSchema = z.object({
  capsule: z.string().nullable(),
  mass_returned_kg: z.number().nullable(),
  mass_returned_lbs: z.number().nullable(),
  flight_time_sec: z.number().nullable(),
  manifest: z.string().nullable(),
  water_landing: z.boolean().nullable(),
  land_landing: z.boolean().nullable(),
});

export const PayloadSchema = z.object({
  name: z.string(),
  type: z.string(),
  reused: z.boolean().nullable(),
  launch: z.string(),
  customers: z.array(z.string()),
  norad_ids: z.array(z.number()),
  nationalities: z.array(z.string()),
  manufacturers: z.array(z.string()),
  mass_kg: z.number().nullable(),
  mass_lbs: z.number().nullable(),
  orbit: z.string().nullable(),
  reference_system: z.string().nullable(),
  regime: z.string().nullable(),
  longitude: z.number().nullable(),
  semi_major_axis_km: z.number().nullable(),
  eccentricity: z.number().nullable(),
  periapsis_km: z.number().nullable(),
  apoapsis_km: z.number().nullable(),
  inclination_deg: z.number().nullable(),
  period_min: z.number().nullable(),
  lifespan_years: z.number().nullable(),
  epoch: z.string().nullable(),
  mean_motion: z.number().nullable(),
  raan: z.number().nullable(),
  arg_of_pericenter: z.number().nullable(),
  mean_anomaly: z.number().nullable(),
  dragon: DragonSchema.nullable(),
  id: z.string(),
});

export const PayloadArraySchema = z.array(PayloadSchema);

export const PayloadPaginatedResponseSchema = z.object({
  docs: z.array(PayloadSchema),
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

export type Payload = z.infer<typeof PayloadSchema>;
export type PayloadArray = z.infer<typeof PayloadArraySchema>;
export type PayloadPaginatedResponse = z.infer<typeof PayloadPaginatedResponseSchema>;
export type Dragon = z.infer<typeof DragonSchema>;