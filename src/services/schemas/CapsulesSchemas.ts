import { z } from "zod";

export const CapsuleSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ID format"),
  serial: z.string().min(1),
  status: z.enum([
    "unknown",
    "active", 
    "retired", 
    "destroyed"
  ]),
  type: z.enum([
    "Dragon 1.0",
    "Dragon 1.1",
    "Dragon 2.0"
  ]),
  dragon: z.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
  reuse_count: z.number().int().nonnegative(),
  water_landings: z.number().int().nonnegative(),
  land_landings: z.number().int().nonnegative(),
  last_update: z.string().nullable().optional(),
  launches: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/)),
});

export const CapsuleQueryResponseSchema = z.object({
  docs: z.array(CapsuleSchema),
  totalDocs: z.number(),
  offset: z.number(),
  limit: z.number(),
  totalPages: z.number(),
  page: z.number(),
  pagingCounter: z.number(),
  hasPrevPage: z.boolean(),
  hasNextPage: z.boolean(),
  prevPage: z.number().nullable(),
  nextPage: z.number().nullable(),
});

export const SingleCapsuleResponseSchema = CapsuleSchema;

export type Capsule = z.infer<typeof CapsuleSchema>;
export type CapsuleQueryResponse = z.infer<typeof CapsuleQueryResponseSchema>;