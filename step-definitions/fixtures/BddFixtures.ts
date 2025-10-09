import { TestType, PlaywrightTestArgs } from "@playwright/test";
import { test as base } from "playwright-bdd";
import { HomePage } from "../../ui/pages/HomePage";
import { HomePageSteps } from "../ui/HomePageSteps";

export type ConsoleErrorFixture = {
  consoleErrors: string[];
};

export type BddFixtures = {
  sharedContext: { startTime: number; apiData: any; performanceMetrics?: any };
  homePage: HomePage;
  homePageSteps: HomePageSteps;
};

interface CustomTestArgs
  extends PlaywrightTestArgs,
    BddFixtures,
    ConsoleErrorFixture {}

export const test = base.extend<BddFixtures & ConsoleErrorFixture>({
  sharedContext: [
    async ({}, use) => {
      const context = {
        startTime: 0,
        apiData: null,
        performanceMetrics: undefined,
      };
      await use(context);
    },
    { scope: "test" },
  ],
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await use(homePage);
  },
  homePageSteps: [
    async ({ page, homePage, sharedContext }, use) => {
      const homePageSteps = new HomePageSteps(page, homePage, sharedContext);
      await use(homePageSteps);
    },
    { scope: "test" },
  ],
  consoleErrors: [
    async ({ page }, use) => {
      const errors: string[] = [];

      // Listener to capture console errors during the test run
      page.on("console", (msg) => {
        if (msg.type() === "error") {
          errors.push(msg.text());
        }
      });

      await use(errors);
    },
    { scope: "test", auto: true }, // 'auto: true' ensures this runs for every test/scenario
  ],
}) as TestType<PlaywrightTestArgs & BddFixtures & ConsoleErrorFixture, {}>;

export type { CustomTestArgs }; 
