import { z } from "zod";
import { urlSchema } from "./UrlSchemas";

export const HeadquartersSchema = z.object({
  address: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
});

export const LinksSchema = z.object({
  website: urlSchema,
  flickr: urlSchema,
  twitter: urlSchema,
  elon_twitter: urlSchema,
});

export const CompanyInfoSchema = z.object({
  headquarters: HeadquartersSchema,
  links: LinksSchema,
  name: z.string().min(1),
  founder: z.string().min(1),
  founded: z.number().int().positive(),
  employees: z.number().int().positive(),
  vehicles: z.number().int().nonnegative(),
  launch_sites: z.number().int().nonnegative(),
  test_sites: z.number().int().nonnegative(),
  ceo: z.string().min(1),
  cto: z.string().min(1),
  coo: z.string().min(1),
  cto_propulsion: z.string().min(1),
  valuation: z.number().positive(),
  summary: z.string().min(1),
  id: z.string().optional(),
});

export type CompanyInfo = z.infer<typeof CompanyInfoSchema>;
export type Headquarters = z.infer<typeof HeadquartersSchema>;
export type Links = z.infer<typeof LinksSchema>;