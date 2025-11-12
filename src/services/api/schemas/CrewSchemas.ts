import { z, ZodError } from "zod";
import { urlSchema } from "./UrlSchemas";

export const CrewMemberSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ID format"),
  name: z.string().min(1),
  agency: z.string().min(1),
  image: urlSchema.optional(),
  wikipedia: urlSchema.optional(),
  launches: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/)).optional(),
  status: z.enum(["active", "inactive", "retired", "unknown"]).optional(),
});

export const CrewQueryResponseSchema = z.object({
  docs: z.array(CrewMemberSchema),
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

export const SingleCrewResponseSchema = CrewMemberSchema;

export type CrewMember = z.infer<typeof CrewMemberSchema>;
export type CrewQueryResponse = z.infer<typeof CrewQueryResponseSchema>;