import { z } from 'zod';

declare global {
  namespace PlaywrightTest {
    interface Matchers<R, T> {
      toMatchSchema(schema: z.ZodType): Promise<R>;
    }
  }
}

export {};