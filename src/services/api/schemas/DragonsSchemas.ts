import { z } from 'zod';
import { urlSchema } from './UrlSchemas';

export const ThrustSchema = z.object({
  kN: z.number(),
  lbf: z.number(),
});

export const VolumeSchema = z.object({
  cubic_meters: z.number(),
  cubic_feet: z.number(),
});

export const MassSchema = z.object({
  kg: z.number(),
  lb: z.number(),
});

export const DimensionSchema = z.object({
  meters: z.number().nullable(),
  feet: z.number().nullable(),
});

export const HeatShieldSchema = z.object({
  material: z.string(),
  size_meters: z.number(),
  temp_degrees: z.number(),
  dev_partner: z.string().nullable(),
});

export const ThrusterSchema = z.object({
  type: z.string(),
  amount: z.number(),
  pods: z.number(),
  fuel_1: z.string(),
  fuel_2: z.string(),
  thrust: ThrustSchema,
  isp: z.number().nullable(),
});

export const PressurizedCapsuleSchema = z.object({
  payload_volume: VolumeSchema,
});

export const CargoSchema = z.object({
  solar_array: z.number(),
  unpressurized_cargo: z.boolean(),
});

export const TrunkSchema = z.object({
  trunk_volume: VolumeSchema,
  cargo: CargoSchema.nullable(),
});

export const DragonSchema = z.object({
  heat_shield: HeatShieldSchema,
  launch_payload_mass: MassSchema.nullable(),
  launch_payload_vol: VolumeSchema.nullable(),
  return_payload_mass: MassSchema.nullable(),
  return_payload_vol: VolumeSchema.nullable(),
  pressurized_capsule: PressurizedCapsuleSchema,
  trunk: TrunkSchema,
  height_w_trunk: DimensionSchema,
  diameter: DimensionSchema,
  first_flight: z.string().nullable(),
  flickr_images: z.array(urlSchema),
  name: z.string(),
  type: z.string(),
  active: z.boolean(),
  crew_capacity: z.number(),
  sidewall_angle_deg: z.number().nullable(),
  orbit_duration_yr: z.number().nullable(),
  dry_mass_kg: z.number(),
  dry_mass_lb: z.number(),
  thrusters: z.array(ThrusterSchema),
  wikipedia: urlSchema.nullable(),
  description: z.string(),
  id: z.string(),
});

export const DragonArraySchema = z.array(DragonSchema);

export const DragonPaginatedResponseSchema = z.object({
  docs: z.array(DragonSchema),
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

export type Dragon = z.infer<typeof DragonSchema>;
export type DragonArray = z.infer<typeof DragonArraySchema>;
export type DragonPaginatedResponse = z.infer<typeof DragonPaginatedResponseSchema>;
export type HeatShield = z.infer<typeof HeatShieldSchema>;
export type Thruster = z.infer<typeof ThrusterSchema>;
export type PressurizedCapsule = z.infer<typeof PressurizedCapsuleSchema>;
export type Trunk = z.infer<typeof TrunkSchema>;
export type Cargo = z.infer<typeof CargoSchema>;
export type Thrust = z.infer<typeof ThrustSchema>;
export type Volume = z.infer<typeof VolumeSchema>;
export type Mass = z.infer<typeof MassSchema>;
export type Dimension = z.infer<typeof DimensionSchema>;