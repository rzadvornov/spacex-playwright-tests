import { z } from 'zod';
import { urlSchema } from './UrlSchemas';

export const HeightSchema = z.object({
  meters: z.number().nullable(),
  feet: z.number().nullable(),
});

export const DiameterSchema = z.object({
  meters: z.number().nullable(),
  feet: z.number().nullable(),
});

export const MassSchema = z.object({
  kg: z.number(),
  lb: z.number(),
});

export const PayloadWeightSchema = z.object({
  id: z.string(),
  name: z.string(),
  kg: z.number(),
  lb: z.number(),
});

export const ThrustSchema = z.object({
  kN: z.number(),
  lbf: z.number(),
});

export const FirstStageSchema = z.object({
  thrust_sea_level: ThrustSchema.nullable(),
  thrust_vacuum: ThrustSchema.nullable(),
  reusable: z.boolean().nullable(),
  engines: z.number().nullable(),
  fuel_amount_tons: z.number().nullable(),
  burn_time_sec: z.number().nullable(),
});

export const SecondStageSchema = z.object({
  thrust: ThrustSchema.nullable(),
  payloads: z.object({
    composite_fairing: z.object({
      height: HeightSchema.nullable(),
      diameter: DiameterSchema.nullable(),
    }).nullable(),
    option_1: z.string().nullable(),
  }).nullable(),
  reusable: z.boolean().nullable(),
  engines: z.number().nullable(),
  fuel_amount_tons: z.number().nullable(),
  burn_time_sec: z.number().nullable(),
});

export const EnginesSchema = z.object({
  isp: z.object({
    sea_level: z.number().nullable(),
    vacuum: z.number().nullable(),
  }).nullable(),
  thrust_sea_level: ThrustSchema.nullable(),
  thrust_vacuum: ThrustSchema.nullable(),
  number: z.number(),
  type: z.string(),
  version: z.string(),
  layout: z.string().nullable(),
  engine_loss_max: z.number().nullable(),
  propellant_1: z.string(),
  propellant_2: z.string(),
  thrust_to_weight: z.number().nullable(),
});

export const LandingLegsSchema = z.object({
  number: z.number(),
  material: z.string().nullable(),
});

export const RocketSchema = z.object({
  height: HeightSchema.nullable(),
  diameter: DiameterSchema.nullable(),
  mass: MassSchema,
  first_stage: FirstStageSchema.nullable(),
  second_stage: SecondStageSchema.nullable(),
  engines: EnginesSchema,
  landing_legs: LandingLegsSchema.nullable(),
  payload_weights: z.array(PayloadWeightSchema),
  flickr_images: z.array(urlSchema),
  name: z.string(),
  type: z.string(),
  active: z.boolean(),
  stages: z.number().nullable(),
  boosters: z.number().nullable(),
  cost_per_launch: z.number().nullable(),
  success_rate_pct: z.number().nullable(),
  first_flight: z.string().nullable(),
  country: z.string(),
  company: z.string(),
  wikipedia: urlSchema.nullable(),
  description: z.string().nullable(),
  id: z.string(),
});

export const RocketArraySchema = z.array(RocketSchema);

export const RocketPaginatedResponseSchema = z.object({
  docs: z.array(RocketSchema),
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

export type Rocket = z.infer<typeof RocketSchema>;
export type RocketArray = z.infer<typeof RocketArraySchema>;
export type RocketPaginatedResponse = z.infer<typeof RocketPaginatedResponseSchema>;
export type Height = z.infer<typeof HeightSchema>;
export type Diameter = z.infer<typeof DiameterSchema>;
export type Mass = z.infer<typeof MassSchema>;
export type PayloadWeight = z.infer<typeof PayloadWeightSchema>;