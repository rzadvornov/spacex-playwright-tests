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
import { CareersPageSteps } from "../step-definitions/ui/CareersPageSteps";
import { DragonPage } from "../pages/ui/DragonPage";
import { DragonPageSteps } from "../step-definitions/ui/DragonPageSteps";
import { Falcon9Page } from "../pages/ui/Falcon9Page";
import { Falcon9PageSteps } from "../step-definitions/ui/Falcon9PageSteps";
import { FalconHeavyPage } from "../pages/ui/FalconHeavyPage";
import { FalconHeavyPageSteps } from "../step-definitions/ui/FalconHeavyPageSteps";
import { MissionsPage } from "../pages/ui/MissionsPage";
import { MissionsSteps } from "../step-definitions/ui/MissionsPageSteps";
import { RidesharePage } from "../pages/ui/RidesharePage";
import { RidesharePageSteps } from "../step-definitions/ui/RidesharePageSteps";
import { StarshieldPage } from "../pages/ui/StarshieldPage";
import { StarshieldPageSteps } from "../step-definitions/ui/StarshieldPageSteps";
import { StarshipPage } from "../pages/ui/StarshipPage";
import { StarshipPageSteps } from "../step-definitions/ui/StarshipPageSteps";
import { SuppliersPage } from "../pages/ui/SuppliersPage";
import { SuppliersPageSteps } from "../step-definitions/ui/SuppliersPageSteps";
import { UpdatesPage } from "../pages/ui/UpdatesPage";
import { UpdatesPageSteps } from "../step-definitions/ui/UpdatesPageSteps";

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
  careersPageSteps: [
    async ({ page, careersPage, sharedContext, assertionHelper }, use) => {
      const careersSharedPageSteps = new SharedPageSteps(page);
      const careersPageSteps = new CareersPageSteps(
        careersPage,
        sharedContext,
        careersSharedPageSteps,
        assertionHelper
      );
      await use(careersPageSteps);
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
  missionsPage: async ({ page }, use) => {
    const missionsPage = new MissionsPage(page);
    await use(missionsPage);
  },
  missionsSteps: [
    async ({ page, missionsPage, assertionHelper, sharedContext }, use) => {
      const missionsSharedPageSteps = new SharedPageSteps(page);
      const missionsSteps = new MissionsSteps(
        page,
        missionsPage,
        missionsSharedPageSteps,
        assertionHelper,
        sharedContext
      );
      await use(missionsSteps);
    },
    { scope: "test" },
  ],
  ridesharePage: async ({ page }, use) => {
    const ridesharePage = new RidesharePage(page);
    await use(ridesharePage);
  },
  ridesharePageSteps: [
    async ({ page, ridesharePage, assertionHelper }, use) => {
      const ridesSharedPageSteps = new SharedPageSteps(page);
      const ridesharePageSteps = new RidesharePageSteps(
        ridesharePage,
        ridesSharedPageSteps,
        assertionHelper
      );
      await use(ridesharePageSteps);
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
  starshieldPage: async ({ page }, use) => {
    const starshieldPage = new StarshieldPage(page);
    await use(starshieldPage);
  },
  starshieldPageSteps: [
    async (
      { page, starshieldPage, sharedContext, viewportUtility, assertionHelper },
      use
    ) => {
      const starshieldSharedPageSteps = new SharedPageSteps(page);
      const starshieldPageSteps = new StarshieldPageSteps(
        page,
        starshieldPage,
        sharedContext,
        starshieldSharedPageSteps,
        assertionHelper,
        viewportUtility
      );
      await use(starshieldPageSteps);
    },
    { scope: "test" },
  ],
  starshipPage: async ({ page }, use) => {
    const starshipPage = new StarshipPage(page);
    await use(starshipPage);
  },
  starshipPageSteps: [
    async ({ page, starshipPage, viewportUtility, assertionHelper }, use) => {
      const starshipSharedPageSteps = new SharedPageSteps(page);
      const starshipPageSteps = new StarshipPageSteps(
        page,
        starshipPage,
        starshipSharedPageSteps,
        assertionHelper,
        viewportUtility
      );
      await use(starshipPageSteps);
    },
    { scope: "test" },
  ],
  suppliersPage: async ({ page }, use) => {
    const suppliersPage = new SuppliersPage(page);
    await use(suppliersPage);
  },
  suppliersPageSteps: [
    async ({ page, suppliersPage, viewportUtility, assertionHelper }, use) => {
      const supplierSharedPageSteps = new SharedPageSteps(page);
      const suppliersPageSteps = new SuppliersPageSteps(
        page,
        suppliersPage,
        supplierSharedPageSteps,
        assertionHelper,
        viewportUtility
      );
      await use(suppliersPageSteps);
    },
    { scope: "test" },
  ],
  updatesPage: async ({ page }, use) => {
    const updatesPage = new UpdatesPage(page);
    await use(updatesPage);
  },
  updatesPageSteps: [
    async ({ page, updatesPage, viewportUtility, assertionHelper }, use) => {
      const updatesSharedPageSteps = new SharedPageSteps(page);
      const updatesPageSteps = new UpdatesPageSteps(
        page,
        updatesPage,
        updatesSharedPageSteps,
        assertionHelper,
        viewportUtility
      );
      await use(updatesPageSteps);
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
