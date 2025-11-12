import { z } from 'zod';
import { urlSchema } from './UrlSchemas';

export const LinksSchema = z.object({
  article: urlSchema.nullable(),
  reddit: urlSchema.nullable(),
  wikipedia: urlSchema.nullable(),
});

export const HistoryEventSchema = z.object({
  title: z.string(),
  event_date_utc: z.string(),
  event_date_unix: z.number(),
  details: z.string(),
  links: LinksSchema.nullable(),
  flight_number: z.number().nullable(),
  launch: z.string().nullable(),
  id: z.string(),
});

export const HistoryArraySchema = z.array(HistoryEventSchema);

export const HistoryPaginatedResponseSchema = z.object({
  docs: z.array(HistoryEventSchema),
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

export type HistoryEvent = z.infer<typeof HistoryEventSchema>;
export type HistoryArray = z.infer<typeof HistoryArraySchema>;
export type HistoryPaginatedResponse = z.infer<typeof HistoryPaginatedResponseSchema>;
export type Links = z.infer<typeof LinksSchema>;