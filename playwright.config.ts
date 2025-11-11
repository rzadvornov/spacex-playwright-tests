import { defineConfig, devices } from "@playwright/test";
import { cucumberReporter, defineBddConfig } from "playwright-bdd";

defineBddConfig({
  // Specify the paths to your Gherkin Feature files (.feature)
  paths: ["src/features/**/*.feature", "src/features/**/**/*.feature"],

  // Specify the paths to your Step Definition files (.ts)
  require: [
    "src/utils/types/ParameterTypes.ts",
    "src/fixtures/BddFixtures.ts",
    "src/step-definitions/**/*.ts",
    "src/step-definitions/**/**/*.ts",
    "src/step-definitions/**/**/**/*.ts",
  ],

  // The directory where Playwright-BDD will generate the runnable .spec.ts files.
  // This MUST match the 'testDir' in your Playwright configuration.
  outputDir: "./tests",
});

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  
  reporter: [
    ["list"],
    ["html", { open: 'never' }],
    cucumberReporter("html", {
      outputFile: "cucumber-report/playwright-report.html",
    }),
    ["allure-playwright", {
      outputFolder: "allure-results",
      detail: true,
      suiteTitle: false
    }],
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
      testMatch: "src/features/ui/**/*.spec.ts",
    },
    {
      name: "Mobile Phone",
      use: { ...devices["Pixel 5"] },
      testMatch: "src/features/ui/**/*.spec.ts",
    },
    {
      name: "Mobile Tablet",
      use: { ...devices["iPad"] },
      testMatch: "src/features/ui/**/*.spec.ts",
    },
    {
      name: "API",
      use: {
        baseURL: process.env.API_BASE_URL || "https://api.spacexdata.com/v4",
        extraHTTPHeaders: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
      },
      testMatch: "src/features/api/**/*.spec.ts",
    },
  ],
});