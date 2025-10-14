import { defineConfig, devices } from "@playwright/test";
import { cucumberReporter, defineBddConfig } from "playwright-bdd";

defineBddConfig({
  // Specify the paths to your Gherkin Feature files (.feature)
  paths: ["src/features/**/*.feature", "src/features/**/**/*.feature"],

  // Specify the paths to your Step Definition files (.ts)
  require: ["step-definitions/**/*.ts"],

  // The directory where Playwright-BDD will generate the runnable .spec.ts files.
  // This MUST match the 'testDir' in your Playwright configuration.
  outputDir: "/tests",
});

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./tests",
  testMatch: /.*\.spec\.ts$/,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ["list"],
    cucumberReporter("html", {
      outputFile: "cucumber-report/playwright-report.html",
    }),
  ],
  use: {
    baseURL: process.env.UI_BASE_URL || "https://www.spacex.com",

    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },

    {
      name: "Mobile Chrome",
      use: { ...devices["Pixel 5"] },
    },
    {
      name: "Mobile Chrome",
      use: { ...devices["iPad"] },
    },
  ],
});
