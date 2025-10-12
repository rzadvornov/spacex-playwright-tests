import { TestType, PlaywrightTestArgs, Page, Locator } from "@playwright/test";
import { test as base } from "playwright-bdd";
import { HomePage } from "../pages/ui/HomePage";
import { HumanSpaceflightPage } from "../pages/ui/HumanSpaceflightPage";
import { DestinationsSteps } from "../step-definitions/ui/DestinationsSteps";
import { FooterSteps } from "../step-definitions/ui/FooterSteps";
import { HomePageSteps } from "../step-definitions/ui/HomePageSteps";
import { HumanSpaceflightSteps } from "../step-definitions/ui/HumanSpaceflightSteps";
import { SharedPageSteps } from "../step-definitions/ui/SharedPageSteps";


export type ConsoleErrorFixture = {
  consoleErrors: string[];
};

export type SharedContext = {
  startTime: number;
  apiData: any;
  performanceMetrics?: any;
  newTabPromise?: Promise<Page>;
  mediaType?: string;
  newPage?: Page;
  currentFocusedElement?: Locator | null; 
  initialViewport?: { width: number; height: number };
};

export type BddFixtures = {
  sharedContext: SharedContext;
  sharedPageSteps: SharedPageSteps;
  homePage: HomePage;
  homePageSteps: HomePageSteps;
  humanSpaceflightPage: HumanSpaceflightPage;
  humanSpaceflightSteps: HumanSpaceflightSteps;
  footerSteps: FooterSteps;
  destinationsSteps: DestinationsSteps;
};

interface CustomTestArgs
  extends PlaywrightTestArgs,
    BddFixtures,
    ConsoleErrorFixture {}

export const test = base.extend<BddFixtures & ConsoleErrorFixture>({
  sharedPageSteps: [
    async ({ page, sharedContext }, use) => {
      // These are placeholders to satisfy the constructor's type requirements
      const headerPOF = {} as any; 
      const heroPOF = {} as any;   
      const footerPOF = {} as any; 
      const currentPage = {} as any; 

      const sharedSteps = new SharedPageSteps(
          page
      );
      await use(sharedSteps);
    },
    { scope: "test" },
  ],
  sharedContext: [
    async ({}, use) => {
      const context: SharedContext = {
        startTime: 0,
        apiData: null,
        performanceMetrics: undefined,
        newTabPromise: undefined,
        newPage: undefined,
        currentFocusedElement: null,
        initialViewport: undefined,
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
      const homeSharedPageSteps = new SharedPageSteps(
        page
      );
      const homePageSteps = new HomePageSteps(
        page,
        homePage,
        sharedContext,
        homeSharedPageSteps
      );
      await use(homePageSteps);
    },
    { scope: "test" },
  ],
  humanSpaceflightPage: async ({ page }, use) => {
    const humanSpaceflightPage = new HumanSpaceflightPage(page);
    await use(humanSpaceflightPage);
  },
  humanSpaceflightSteps: [
    async ({ page, humanSpaceflightPage, sharedContext }, use) => {
      const humanSharedPageSteps = new SharedPageSteps(
        page
      );
      const humanSpaceflightSteps = new HumanSpaceflightSteps(
        page,
        humanSpaceflightPage,
        sharedContext,
        humanSharedPageSteps
      );
      await use(humanSpaceflightSteps);
    },
    { scope: "test" },
  ],
  footerSteps: [
    async ({ page, humanSpaceflightPage, sharedContext }, use) => {
      const footerSteps = new FooterSteps(
        page,
        humanSpaceflightPage,
        sharedContext
      );
      await use(footerSteps);
    },
    { scope: "test" },
  ],
  destinationsSteps: [
    async ({ page, humanSpaceflightPage }, use) => {
      const destinationsSteps = new DestinationsSteps(
        page,
        humanSpaceflightPage
      );
      await use(destinationsSteps);
    },
    { scope: "test" },
  ],
  consoleErrors: [
    async ({ page }, use) => {
      const errors: string[] = [];

      page.on("console", (msg) => {
        if (msg.type() === "error") {
          errors.push(msg.text());
        }
      });

      await use(errors);
    },
    { scope: "test", auto: true },
  ],
}) as TestType<PlaywrightTestArgs & BddFixtures & ConsoleErrorFixture, {}>;

export type { CustomTestArgs };