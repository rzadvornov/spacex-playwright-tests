import { test as base } from "playwright-bdd";
import { HomePage } from "../pages/ui/HomePage";
import { HumanSpaceflightPage } from "../pages/ui/HumanSpaceflightPage";
import { DestinationsSteps } from "../step-definitions/ui/DestinationsSteps";
import { FooterSteps } from "../step-definitions/ui/FooterSteps";
import { HomePageSteps } from "../step-definitions/ui/HomePageSteps";
import { HumanSpaceflightSteps } from "../step-definitions/ui/HumanSpaceflightSteps";
import { SharedPageSteps } from "../step-definitions/ui/SharedPageSteps";
import {
  BddFixtures,
  ConsoleErrorFixture,
  CustomTestArgs,
  SharedContext,
} from "../pages/types/Types";
import { AccessibilitySteps } from "../step-definitions/ui/AccessibilitySteps";
import { MediaCarouselSteps } from "../step-definitions/ui/MediaCarouselSteps";
import { OurMissionsSteps } from "../step-definitions/ui/OurMissionsSteps";
import { PerformanceSeoSteps } from "../step-definitions/ui/PerformanceSeoSteps";
import { ResponsiveDesignSteps } from "../step-definitions/ui/ResponsiveDesignSteps";
import { TheSuitesSteps } from "../step-definitions/ui/TheSuitesSteps";
import { TimelineSteps } from "../step-definitions/ui/TimelineSteps";
import { VehiclesSteps } from "../step-definitions/ui/VehiclesSteps";
import { AssertionHelper } from "../utils/AssertionHelper";
import { ViewportUtility } from "../utils/ViewportUtility";
import { AboutPage } from "../pages/ui/AboutPage";
import { AboutPageSteps } from "../step-definitions/ui/AboutPageSteps";
import { CareersPage } from "../pages/ui/CareersPage";
import { CareersSteps } from "../step-definitions/ui/CareersSteps";
import { DragonPage } from "../pages/ui/DragonPage";
import { DragonPageSteps } from "../step-definitions/ui/DragonPageSteps";
import { Falcon9Page } from "../pages/ui/Falcon9Page";
import { Falcon9PageSteps } from "../step-definitions/ui/Falcon9PageSteps";
import { FalconHeavyPage } from "../pages/ui/FalconHeavyPage";
import { FalconHeavyPageSteps } from "../step-definitions/ui/FalconHeavyPageSteps";

export const test = base.extend<BddFixtures & ConsoleErrorFixture>({
  sharedPageSteps: [
    async ({ page }, use) => {
      const sharedSteps = new SharedPageSteps(page);
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
  assertionHelper: [
    async ({ page }, use) => {
      const helper = new AssertionHelper(page);
      await use(helper);
    },
    { scope: "test" },
  ],
  viewportUtility: [
    async ({ page }, use) => {
      const utility = new ViewportUtility(page);
      await use(utility);
    },
    { scope: "test" },
  ],
  aboutPage: async ({ page }, use) => {
    const aboutPage = new AboutPage(page);
    await use(aboutPage);
  },
  aboutPageSteps: [
    async ({ page, aboutPage, assertionHelper }, use) => {
      const aboutSharedPageSteps = new SharedPageSteps(page);
      const aboutPageSteps = new AboutPageSteps(
        page,
        aboutPage,
        aboutSharedPageSteps,
        assertionHelper
      );
      await use(aboutPageSteps);
    },
    { scope: "test" },
  ],
  careersPage: async ({ page }, use) => {
    const careersPage = new CareersPage(page);
    await use(careersPage);
  },
  careersSteps: [
    async ({ page, careersPage, sharedContext, assertionHelper }, use) => {
      const careersSharedPageSteps = new SharedPageSteps(page);
      const careersSteps = new CareersSteps(
        careersPage,
        sharedContext,
        careersSharedPageSteps,
        assertionHelper
      );
      await use(careersSteps);
    },
    { scope: "test" },
  ],
  dragonPage: async ({ page }, use) => {
    const dragonPage = new DragonPage(page);
    await use(dragonPage);
  },
  dragonPageSteps: [
    async ({ page, dragonPage, assertionHelper }, use) => {
      const dragonSharedPageSteps = new SharedPageSteps(page);
      const dragonPageSteps = new DragonPageSteps(
        dragonPage,
        assertionHelper,
        dragonSharedPageSteps
      );
      await use(dragonPageSteps);
    },
    { scope: "test" },
  ],
  falcon9Page: async ({ page }, use) => {
    const falcon9Page = new Falcon9Page(page);
    await use(falcon9Page);
  },
  falcon9PageSteps: [
    async ({ page, falcon9Page, assertionHelper }, use) => {
      const falcon9SharedPageSteps = new SharedPageSteps(page);
      const falcon9PageSteps = new Falcon9PageSteps(
        falcon9Page,
        assertionHelper,
        falcon9SharedPageSteps
      );
      await use(falcon9PageSteps);
    },
    { scope: "test" },
  ],
  falconHeavyPage: async ({ page }, use) => {
    const falconHeavyPage = new FalconHeavyPage(page);
    await use(falconHeavyPage);
  },
  falconHeavyPageSteps: [
    async ({ page, falconHeavyPage, assertionHelper }, use) => {
      const falconHeavySharedPageSteps = new SharedPageSteps(page);
      const falconHeavyPageSteps = new FalconHeavyPageSteps(
        falconHeavyPage,
        assertionHelper,
        falconHeavySharedPageSteps
      );
      await use(falconHeavyPageSteps);
    },
    { scope: "test" },
  ],
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await use(homePage);
  },
  homePageSteps: [
    async ({ page, homePage, sharedContext, assertionHelper }, use) => {
      const homeSharedPageSteps = new SharedPageSteps(page);
      const homePageSteps = new HomePageSteps(
        page,
        homePage,
        sharedContext,
        homeSharedPageSteps,
        assertionHelper
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
    async (
      {
        page,
        humanSpaceflightPage,
        sharedContext,
        viewportUtility,
        assertionHelper,
      },
      use
    ) => {
      const humanSpaceflightSharedPageSteps = new SharedPageSteps(page);
      const humanSpaceflightSteps = new HumanSpaceflightSteps(
        page,
        humanSpaceflightPage,
        sharedContext,
        humanSpaceflightSharedPageSteps,
        viewportUtility,
        assertionHelper
      );
      await use(humanSpaceflightSteps);
    },
    { scope: "test" },
  ],
  footerSteps: [
    async (
      { page, humanSpaceflightPage, sharedContext, viewportUtility },
      use
    ) => {
      const footerSteps = new FooterSteps(
        page,
        humanSpaceflightPage,
        sharedContext,
        viewportUtility
      );
      await use(footerSteps);
    },
    { scope: "test" },
  ],
  destinationsSteps: [
    async (
      { page, humanSpaceflightPage, viewportUtility, assertionHelper },
      use
    ) => {
      const destinationsSteps = new DestinationsSteps(
        page,
        humanSpaceflightPage,
        viewportUtility,
        assertionHelper
      );
      await use(destinationsSteps);
    },
    { scope: "test" },
  ],
  accessibilitySteps: [
    async ({ page, humanSpaceflightPage, assertionHelper }, use) => {
      const accessibilitySteps = new AccessibilitySteps(
        page,
        humanSpaceflightPage,
        assertionHelper
      );
      await use(accessibilitySteps);
    },
    { scope: "test" },
  ],
  mediaCarouselSteps: [
    async ({ page, humanSpaceflightPage, viewportUtility }, use) => {
      const mediaCarouselSteps = new MediaCarouselSteps(
        page,
        humanSpaceflightPage,
        viewportUtility
      );
      await use(mediaCarouselSteps);
    },
    { scope: "test" },
  ],
  ourMissionsSteps: [
    async ({ page, humanSpaceflightPage, viewportUtility }, use) => {
      const ourMissionsSteps = new OurMissionsSteps(
        page,
        humanSpaceflightPage,
        viewportUtility
      );
      await use(ourMissionsSteps);
    },
    { scope: "test" },
  ],
  performanceSeoSteps: [
    async (
      { page, humanSpaceflightPage, sharedContext, assertionHelper },
      use
    ) => {
      const performanceSeoSteps = new PerformanceSeoSteps(
        page,
        humanSpaceflightPage,
        sharedContext,
        assertionHelper
      );
      await use(performanceSeoSteps);
    },
    { scope: "test" },
  ],
  responsiveDesignSteps: [
    async ({ page, humanSpaceflightPage, assertionHelper }, use) => {
      const responsiveDesignSteps = new ResponsiveDesignSteps(
        page,
        humanSpaceflightPage,
        assertionHelper
      );
      await use(responsiveDesignSteps);
    },
    { scope: "test" },
  ],
  theSuitesSteps: [
    async ({ page, humanSpaceflightPage }, use) => {
      const theSuitesSteps = new TheSuitesSteps(page, humanSpaceflightPage);
      await use(theSuitesSteps);
    },
    { scope: "test" },
  ],
  timelineSteps: [
    async ({ page, humanSpaceflightPage }, use) => {
      const timelineSteps = new TimelineSteps(page, humanSpaceflightPage);
      await use(timelineSteps);
    },
    { scope: "test" },
  ],
  vehiclesSteps: [
    async ({ page, humanSpaceflightPage }, use) => {
      const vehiclesSteps = new VehiclesSteps(page, humanSpaceflightPage);
      await use(vehiclesSteps);
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
});

export type { CustomTestArgs };
