import { z } from 'zod';

export const urlSchema = z.string().refine((val) => {
  try {
    new URL(val);
    return true;
  } catch {
    return false;
  }
}, {
  message: "Invalid URL format"
});