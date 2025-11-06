import { defineParameterType } from "playwright-bdd";

/**
 * Defines a custom 'boolean' parameter type.
 * It matches the literal strings 'true' or 'false' (case-insensitive)
 * and automatically converts them to a JavaScript boolean type.
 */
defineParameterType({
  name: "boolean",
  regexp: /true|false/,
  transformer: (s: string): boolean => s.toLowerCase() === "true",
});
