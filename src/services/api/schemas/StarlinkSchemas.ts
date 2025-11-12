import { z } from 'zod';

export const SpaceTrackSchema = z.object({
  CCSDS_OMM_VERS: z.string().optional(),
  COMMENT: z.string().optional(),
  CREATION_DATE: z.string().optional(),
  ORIGINATOR: z.string().optional(),
  OBJECT_NAME: z.string(),
  OBJECT_ID: z.string(),
  CENTER_NAME: z.string().optional(),
  REF_FRAME: z.string().optional(),
  TIME_SYSTEM: z.string().optional(),
  MEAN_ELEMENT_THEORY: z.string().optional(),
  EPOCH: z.string().optional(),
  MEAN_MOTION: z.number().optional(),
  ECCENTRICITY: z.number().optional(),
  INCLINATION: z.number().optional(),
  RA_OF_ASC_NODE: z.number().optional(),
  ARG_OF_PERICENTER: z.number().optional(),
  MEAN_ANOMALY: z.number().optional(),
  EPHEMERIS_TYPE: z.number().optional(),
  CLASSIFICATION_TYPE: z.string().optional(),
  NORAD_CAT_ID: z.number(),
  ELEMENT_SET_NO: z.number().optional(),
  REV_AT_EPOCH: z.number().optional(),
  BSTAR: z.number().optional(),
  MEAN_MOTION_DOT: z.number().optional(),
  MEAN_MOTION_DDOT: z.number().optional(),
  SEMIMAJOR_AXIS: z.number().optional(),
  PERIOD: z.number().optional(),
  APOAPSIS: z.number().optional(),
  PERIAPSIS: z.number().optional(),
  OBJECT_TYPE: z.string().optional(),
  RCS_SIZE: z.string().optional(),
  COUNTRY_CODE: z.string().optional(),
  LAUNCH_DATE: z.string().optional(),
  SITE: z.string().optional(),
  DECAY_DATE: z.string().optional().nullable(),
  DECAYED: z.number(),
  FILE: z.number().optional(),
  GP_ID: z.number().optional(),
  TLE_LINE0: z.string().optional(),
  TLE_LINE1: z.string().optional(),
  TLE_LINE2: z.string().optional(),
});

export const StarlinkSatelliteSchema = z.object({
  spaceTrack: SpaceTrackSchema,
  launch: z.string(),
  version: z.string(),
  height_km: z.number().nullable(),
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
  velocity_kms: z.number().nullable(),
  id: z.string(),
});

export const StarlinkArraySchema = z.array(StarlinkSatelliteSchema);

export const StarlinkPaginatedResponseSchema = z.object({
  docs: z.array(StarlinkSatelliteSchema),
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

export type StarlinkSatellite = z.infer<typeof StarlinkSatelliteSchema>;
export type StarlinkArray = z.infer<typeof StarlinkArraySchema>;
export type StarlinkPaginatedResponse = z.infer<typeof StarlinkPaginatedResponseSchema>;