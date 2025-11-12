import { z } from "zod";

export const CoreSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ID format"),
  serial: z.string().min(1),
  block: z.number().nullable().optional(),
  status: z.enum([
    "active", 
    "inactive", 
    "unknown", 
    "expended", 
    "lost", 
    "retired"
  ]),
  reuse_count: z.number().int().nonnegative(),
  rtls_attempts: z.number().int().nonnegative(),
  rtls_landings: z.number().int().nonnegative(),
  asds_attempts: z.number().int().nonnegative(),
  asds_landings: z.number().int().nonnegative(),
  last_update: z.string().nullable().optional(),
  launches: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/)),
});

export const CoreQueryResponseSchema = z.object({
  docs: z.array(CoreSchema),
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

export const SingleCoreResponseSchema = CoreSchema;

export type Core = z.infer<typeof CoreSchema>;
export type CoreQueryResponse = z.infer<typeof CoreQueryResponseSchema>;