import { z } from 'zod';
import { urlSchema } from './UrlSchemas';

export const RoadsterSchema = z.object({
  name: z.string(),
  launch_date_utc: z.string(),
  launch_date_unix: z.number(),
  launch_mass_kg: z.number(),
  launch_mass_lbs: z.number(),
  norad_id: z.number(),
  epoch_jd: z.number(),
  orbit_type: z.string(),
  apoapsis_au: z.number(),
  periapsis_au: z.number(),
  semi_major_axis_au: z.number(),
  eccentricity: z.number(),
  inclination: z.number(),
  longitude: z.number(),
  perihelion_arg: z.number(),
  period_days: z.number(),
  speed_kph: z.number(),
  speed_mph: z.number(),
  earth_distance_km: z.number(),
  earth_distance_mi: z.number(),
  mars_distance_km: z.number(),
  mars_distance_mi: z.number(),
  flickr_images: z.array(urlSchema),
  wikipedia: urlSchema,
  video: urlSchema,
  details: z.string(),
  id: z.string(),
});

export type Roadster = z.infer<typeof RoadsterSchema>;