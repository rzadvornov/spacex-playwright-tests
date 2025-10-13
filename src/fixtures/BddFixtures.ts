import { TestType, PlaywrightTestArgs } from "@playwright/test";
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
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await use(homePage);
  },
  homePageSteps: [
    async ({ page, homePage, sharedContext }, use) => {
      const homeSharedPageSteps = new SharedPageSteps(page);
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
      const humanSharedPageSteps = new SharedPageSteps(page);
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
  accessubilitySteps: [
    async ({ page, humanSpaceflightPage }, use) => {
      const accessibilitySteps = new AccessibilitySteps(
        page,
        humanSpaceflightPage
      );
      await use(accessibilitySteps);
    },
    { scope: "test" },
  ],
  mediaCarouselSteps: [
    async ({ page, humanSpaceflightPage }, use) => {
      const mediaCarouselSteps = new MediaCarouselSteps(
        page,
        humanSpaceflightPage
      );
      await use(mediaCarouselSteps);
    },
    { scope: "test" },
  ],
  ourMissionSteps: [
    async ({ page, humanSpaceflightPage }, use) => {
      const ourMissionSteps = new OurMissionsSteps(page, humanSpaceflightPage);
      await use(ourMissionSteps);
    },
    { scope: "test" },
  ],
  performanceSeoSteps: [
    async ({ page, humanSpaceflightPage, sharedContext }, use) => {
      const performanceSeoSteps = new PerformanceSeoSteps(
        page,
        humanSpaceflightPage,
        sharedContext
      );
      await use(performanceSeoSteps);
    },
    { scope: "test" },
  ],
  responsiveDesignSteps: [
    async ({ page, humanSpaceflightPage }, use) => {
      const responsiveDesignSteps = new ResponsiveDesignSteps(
        page,
        humanSpaceflightPage
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
}) as TestType<PlaywrightTestArgs & BddFixtures & ConsoleErrorFixture, {}>;

export type { CustomTestArgs };
