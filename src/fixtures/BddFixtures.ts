import { BaseUrlFixtures } from "./BaseUrlFixtures";
import { test as base } from "playwright-bdd";
import { HomePage } from "../services/ui/HomePage";
import { HumanSpaceflightPage } from "../services/ui/HumanSpaceflightPage";
import { DestinationsSteps } from "../step-definitions/ui/humanspaceflight/DestinationsSteps";
import { SharedPageSteps } from "../step-definitions/ui/SharedPageSteps";
import { MediaCarouselSteps } from "../step-definitions/ui/humanspaceflight/MediaCarouselSteps";
import { OurMissionsSteps } from "../step-definitions/ui/humanspaceflight/ourmissions/OurMissionsSteps";
import { AssertionHelper } from "../utils/AssertionHelper";
import { ViewportUtility } from "../utils/ViewportUtility";
import { AboutPage } from "../services/ui/AboutPage";
import { AboutPageSteps } from "../step-definitions/ui/AboutPageSteps";
import { CareersPage } from "../services/ui/CareersPage";
import { CareersPageSteps } from "../step-definitions/ui/CareersPageSteps";
import { DragonPage } from "../services/ui/DragonPage";
import { DragonPageSteps } from "../step-definitions/ui/DragonPageSteps";
import { Falcon9Page } from "../services/ui/Falcon9Page";
import { Falcon9PageSteps } from "../step-definitions/ui/Falcon9PageSteps";
import { FalconHeavyPage } from "../services/ui/FalconHeavyPage";
import { FalconHeavyPageSteps } from "../step-definitions/ui/FalconHeavyPageSteps";
import { MissionsPage } from "../services/ui/MissionsPage";
import { MissionsSteps } from "../step-definitions/ui/MissionsPageSteps";
import { RidesharePage } from "../services/ui/RidesharePage";
import { RidesharePageSteps } from "../step-definitions/ui/RidesharePageSteps";
import { StarshieldPage } from "../services/ui/StarshieldPage";
import { StarshieldPageSteps } from "../step-definitions/ui/starshield/StarshieldPageSteps";
import { StarshipPage } from "../services/ui/StarshipPage";
import { SuppliersPage } from "../services/ui/SuppliersPage";
import { UpdatesPage } from "../services/ui/UpdatesPage";
import { UpdatesPageSteps } from "../step-definitions/ui/UpdatesPageSteps";
import { FooterSteps } from "../step-definitions/ui/humanspaceflight/FooterSteps";
import {
  BddFixtures,
  ConsoleErrorFixture,
  SharedContext,
  CustomTestArgs,
} from "../utils/types/Types";
import { AccessibilityMobileSteps } from "../step-definitions/ui/humanspaceflight/accessibility/AccessibilityMobileSteps";
import { FormAccessibilitySteps } from "../step-definitions/ui/humanspaceflight/accessibility/FormAccessibilitySteps";
import { KeyboardAccessibilitySteps } from "../step-definitions/ui/humanspaceflight/accessibility/KeyboardAccessibilitySteps";
import { MediaAccessibilitySteps } from "../step-definitions/ui/humanspaceflight/accessibility/MediaAccessibilitySteps";
import { NavigationAccessibilitySteps } from "../step-definitions/ui/humanspaceflight/accessibility/NavigationAccessibilitySteps";
import { ResponsiveAccessibilitySteps } from "../step-definitions/ui/humanspaceflight/accessibility/ResponsiveAccessibilitySteps";
import { ResponsiveCommonSteps } from "../step-definitions/ui/humanspaceflight/accessibility/ResponsiveCommonSteps";
import { ResponsiveComponentSteps } from "../step-definitions/ui/humanspaceflight/accessibility/ResponsiveComponentSteps";
import { ResponsiveImageSteps } from "../step-definitions/ui/humanspaceflight/accessibility/ResponsiveImageSteps";
import { ResponsiveInteractionSteps } from "../step-definitions/ui/humanspaceflight/accessibility/ResponsiveInteractionSteps";
import { ResponsiveLayoutSteps } from "../step-definitions/ui/humanspaceflight/accessibility/ResponsiveLayoutSteps";
import { ResponsiveNavigationSteps } from "../step-definitions/ui/humanspaceflight/accessibility/ResponsiveNavigationSteps";
import { ResponsiveTypographySteps } from "../step-definitions/ui/humanspaceflight/accessibility/ResponsiveTypographySteps";
import { ResponsiveViewportSteps } from "../step-definitions/ui/humanspaceflight/accessibility/ResponsiveViewportSteps";
import { SeoMetaTagsSteps } from "../step-definitions/ui/humanspaceflight/accessibility/SeoMetaTagsSteps";
import { StructuralAccessibilitySteps } from "../step-definitions/ui/humanspaceflight/accessibility/StructuralAccessibilitySteps";
import { VisualElementAccessibilitySteps } from "../step-definitions/ui/humanspaceflight/accessibility/VisualElementAccessibilitySteps";
import { OurMissionsContentSteps } from "../step-definitions/ui/humanspaceflight/ourmissions/OurMissionsContentSteps";
import { OurMissionsPerformanceSteps } from "../step-definitions/ui/humanspaceflight/ourmissions/OurMissionsPerformanceSteps";
import { OurMissionsTabSteps } from "../step-definitions/ui/humanspaceflight/ourmissions/OurMissionsTabSteps";
import { OurMissionsVisualSteps } from "../step-definitions/ui/humanspaceflight/ourmissions/OurMissionsVisualSteps";
import { ContentSeoSteps } from "../step-definitions/ui/humanspaceflight/performance/ContentSeoSteps";
import { ImageOptimizationSteps } from "../step-definitions/ui/humanspaceflight/performance/ImageOptimizationSteps";
import { PerformanceMetricsSteps } from "../step-definitions/ui/humanspaceflight/performance/PerformanceMetricsSteps";
import { ResponsivePerformanceSteps } from "../step-definitions/ui/humanspaceflight/performance/ResponsivePerformanceSteps";
import { TheSuitesCoreSteps } from "../step-definitions/ui/humanspaceflight/suites/TheSuitesCoreSteps";
import { TheSuitesHotspotSteps } from "../step-definitions/ui/humanspaceflight/suites/TheSuitesHotspotSteps";
import { TheSuitesInteractionSteps } from "../step-definitions/ui/humanspaceflight/suites/TheSuitesInteractionSteps";
import { TheSuitesVisualSteps } from "../step-definitions/ui/humanspaceflight/suites/TheSuitesVisualSteps";
import { VehicleAccessibilitySteps } from "../step-definitions/ui/humanspaceflight/vehicle/VehicleAccessibilitySteps";
import { VehicleBaseSteps } from "../step-definitions/ui/humanspaceflight/vehicle/VehicleBaseSteps";
import { VehiclePerformanceSteps } from "../step-definitions/ui/humanspaceflight/vehicle/VehiclePerformanceSteps";
import { HumanSpaceflightCoreSteps } from "../step-definitions/ui/humanspaceflight/HumanSpaceflightCoreSteps";
import { HumanSpaceflightHeaderSteps } from "../step-definitions/ui/humanspaceflight/HumanSpaceflightHeaderSteps";
import { HumanSpaceflightInteractionSteps } from "../step-definitions/ui/humanspaceflight/HumanSpaceflightInteractionSteps";
import { HumanSpaceflightMobileSteps } from "../step-definitions/ui/humanspaceflight/HumanSpaceflightMobileSteps";
import { HumanSpaceflightPerformanceSteps } from "../step-definitions/ui/humanspaceflight/HumanSpaceflightPerformanceSteps";
import { HomePageCoreSteps } from "../step-definitions/ui/home/HomePageCoreSteps";
import { HomePageInteractionSteps } from "../step-definitions/ui/home/HomePageInteractionSteps";
import { HomePageMobileSteps } from "../step-definitions/ui/home/HomePageMobileSteps";
import { HomePageNavigationSteps } from "../step-definitions/ui/home/HomePageNavigationSteps";
import { HomePageTechnicalSteps } from "../step-definitions/ui/home/HomePageTechnicalSteps";
import { StarshieldContentSteps } from "../step-definitions/ui/starshield/StarshieldContentSteps";
import { StarshieldErrorHandlingSteps } from "../step-definitions/ui/starshield/StarshieldErrorHandlingSteps";
import { StarshieldFormSteps } from "../step-definitions/ui/starshield/StarshieldFormSteps";
import { StarshieldNavigationSteps } from "../step-definitions/ui/starshield/StarshieldNavigationSteps";
import { StarshieldPerformanceSteps } from "../step-definitions/ui/starshield/StarshieldPerformanceSteps";
import { StarshieldTechnicalSteps } from "../step-definitions/ui/starshield/StarshieldTechnicalSteps";
import { StarshipBasicSteps } from "../step-definitions/ui/starship/StarshipBasicSteps";
import { StarshipMissionsSteps } from "../step-definitions/ui/starship/StarshipMissionsSteps";
import { StarshipPropulsionSteps } from "../step-definitions/ui/starship/StarshipPropulsionSteps";
import { StarshipResponsiveSteps } from "../step-definitions/ui/starship/StarshipResponsiveSteps";
import { SuppliersPageBasicSteps } from "../step-definitions/ui/suppliers/SuppliersPageBasicSteps";
import { SuppliersPageRegistrationSteps } from "../step-definitions/ui/suppliers/SuppliersPageRegistrationSteps";
import { SuppliersPageResourcesSteps } from "../step-definitions/ui/suppliers/SuppliersPageResourcesSteps";
import { SuppliersPageTechnicalSteps } from "../step-definitions/ui/suppliers/SuppliersPageTechnicalSteps";
import { TimelineContentSteps } from "../step-definitions/ui/timeline/TimelineContentSteps";
import { TimelineCoreSteps } from "../step-definitions/ui/timeline/TimelineCoreSteps";
import { TimelineNavigationSteps } from "../step-definitions/ui/timeline/TimelineNavigationSteps";
import { TimelineResponsiveSteps } from "../step-definitions/ui/timeline/TimelineResponsiveSteps";
import { TimelineVisualSteps } from "../step-definitions/ui/timeline/TimelineVisualSteps";
import { HomePageMetadataSteps } from "../step-definitions/ui/home/HomePageMetadataSteps";
import { StarlinkSteps } from "../step-definitions/api/StarlinkSteps";
import { ShipsSteps } from "../step-definitions/api/ShipsSteps";
import { APISharedSteps } from "../step-definitions/api/APISharedSteps";
import { RocketsSteps } from "../step-definitions/api/RocketsSteps";
import { RoadsterSteps } from "../step-definitions/api/RoadsterSteps";
import { PayloadsSteps } from "../step-definitions/api/PayloadsSteps";
import { LaunchpadsSteps } from "../step-definitions/api/LaunchpadsSteps";
import { LaunchesSteps } from "../step-definitions/api/LaunchesSteps";
import { LandpadsSteps } from "../step-definitions/api/LandpadsSteps";
import { HistorySteps } from "../step-definitions/api/HistorySteps";
import { DragonsSteps } from "../step-definitions/api/DragonsSteps";
import { CrewSteps } from "../step-definitions/api/CrewSteps";
import { CoresSteps } from "../step-definitions/api/CoresSteps";
import { CompanySteps } from "../step-definitions/api/CompanySteps";
import { CapsulesSteps } from "../step-definitions/api/CapsulesSteps";
import { APISecuritySteps } from "../step-definitions/api/APISecuritySteps";
import { APIPerformanceSteps } from "../step-definitions/api/APIPerformanceSteps";
import { APIPaginationSteps } from "../step-definitions/api/APIPaginationSteps";
import { APIIntegrationSteps } from "../step-definitions/api/APIIntegrationSteps";
import { APIFilteringSteps } from "../step-definitions/api/APIFilteringSteps";

export const test = base.extend<
  BddFixtures & ConsoleErrorFixture & BaseUrlFixtures
>({
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
    async ({ aboutPage, assertionHelper }, use) => {
      const aboutPageSteps = new AboutPageSteps(aboutPage, assertionHelper);
      await use(aboutPageSteps);
    },
    { scope: "test" },
  ],
  accessibilityMobileSteps: [
    async ({ page, humanSpaceflightPage }, use) => {
      const accessibilityMobileSteps = new AccessibilityMobileSteps(
        page,
        humanSpaceflightPage
      );
      await use(accessibilityMobileSteps);
    },
    { scope: "test" },
  ],
  formAccessibilitySteps: [
    async ({ page, humanSpaceflightPage }, use) => {
      const formAccessibilitySteps = new FormAccessibilitySteps(
        page,
        humanSpaceflightPage
      );
      await use(formAccessibilitySteps);
    },
    { scope: "test" },
  ],
  keyboardAccessibilitySteps: [
    async ({ page, humanSpaceflightPage, assertionHelper }, use) => {
      const keyboardAccessibilitySteps = new KeyboardAccessibilitySteps(
        page,
        humanSpaceflightPage,
        assertionHelper
      );
      await use(keyboardAccessibilitySteps);
    },
    { scope: "test" },
  ],
  mediaAccessibilitySteps: [
    async ({ page, humanSpaceflightPage }, use) => {
      const mediaAccessibilitySteps = new MediaAccessibilitySteps(
        page,
        humanSpaceflightPage
      );
      await use(mediaAccessibilitySteps);
    },
    { scope: "test" },
  ],
  apiSharedSteps: [
    async ({ request }, use) => {
      const apiSharedSteps = new APISharedSteps(request);
      await use(apiSharedSteps);
    },
    { scope: "test" },
  ],
  starlinkSteps: [
    async ({ apiSharedSteps }, use) => {
      const starlinkSteps = new StarlinkSteps(apiSharedSteps);
      await use(starlinkSteps);
    },
    { scope: "test" },
  ],
  shipsSteps: [
    async ({ apiSharedSteps }, use) => {
      const shipsSteps = new ShipsSteps(apiSharedSteps);
      await use(shipsSteps);
    },
    { scope: "test" },
  ],
  rocketsSteps: [
    async ({ apiSharedSteps }, use) => {
      const rocketsSteps = new RocketsSteps(apiSharedSteps);
      await use(rocketsSteps);
    },
    { scope: "test" },
  ],
  launchesSteps: [
    async ({ apiSharedSteps }, use) => {
      const launchesSteps = new LaunchesSteps(apiSharedSteps);
      await use(launchesSteps);
    },
    { scope: "test" },
  ],
  landpadsSteps: [
    async ({ apiSharedSteps }, use) => {
      const landpadsSteps = new LandpadsSteps(apiSharedSteps);
      await use(landpadsSteps);
    },
    { scope: "test" },
  ],
  historySteps: [
    async ({ apiSharedSteps }, use) => {
      const historySteps = new HistorySteps(apiSharedSteps);
      await use(historySteps);
    },
    { scope: "test" },
  ],
  dragonsSteps: [
    async ({ apiSharedSteps }, use) => {
      const dragonsSteps = new DragonsSteps(apiSharedSteps);
      await use(dragonsSteps);
    },
    { scope: "test" },
  ],
  crewSteps: [
    async ({ apiSharedSteps }, use) => {
      const crewSteps = new CrewSteps(apiSharedSteps);
      await use(crewSteps);
    },
    { scope: "test" },
  ],
  coresSteps: [
    async ({ apiSharedSteps }, use) => {
      const coresSteps = new CoresSteps(apiSharedSteps);
      await use(coresSteps);
    },
    { scope: "test" },
  ],
  companySteps: [
    async ({ apiSharedSteps }, use) => {
      const companySteps = new CompanySteps(apiSharedSteps);
      await use(companySteps);
    },
    { scope: "test" },
  ],
  capsulesSteps: [
    async ({ apiSharedSteps }, use) => {
      const capsulesSteps = new CapsulesSteps(apiSharedSteps);
      await use(capsulesSteps);
    },
    { scope: "test" },
  ],
  payloadsSteps: [
    async ({ apiSharedSteps }, use) => {
      const payloadsSteps = new PayloadsSteps(apiSharedSteps);
      await use(payloadsSteps);
    },
    { scope: "test" },
  ],
  launchpadsSteps: [
    async ({ apiSharedSteps }, use) => {
      const launchpadsSteps = new LaunchpadsSteps(apiSharedSteps);
      await use(launchpadsSteps);
    },
    { scope: "test" },
  ],
  roadsterSteps: [
    async ({ apiSharedSteps }, use) => {
      const roadsterSteps = new RoadsterSteps(apiSharedSteps);
      await use(roadsterSteps);
    },
    { scope: "test" },
  ],
  apiSecuritySteps: [
    async ({ apiSharedSteps }, use) => {
      const apiSecuritySteps = new APISecuritySteps(apiSharedSteps);
      await use(apiSecuritySteps);
    },
    { scope: "test" },
  ],
  apiPerformanceSteps: [
    async ({ apiSharedSteps }, use) => {
      const apiPerformanceSteps = new APIPerformanceSteps(apiSharedSteps);
      await use(apiPerformanceSteps);
    },
    { scope: "test" },
  ],
  apiPaginationSteps: [
    async ({ apiSharedSteps }, use) => {
      const apiPaginationSteps = new APIPaginationSteps(apiSharedSteps);
      await use(apiPaginationSteps);
    },
    { scope: "test" },
  ],
  apiIntegrationSteps: [
    async ({ apiSharedSteps }, use) => {
      const apiIntegrationSteps = new APIIntegrationSteps(apiSharedSteps);
      await use(apiIntegrationSteps);
    },
    { scope: "test" },
  ],
  apiFilteringSteps: [
    async ({ apiSharedSteps }, use) => {
      const apiFilteringSteps = new APIFilteringSteps(apiSharedSteps);
      await use(apiFilteringSteps);
    },
    { scope: "test" },
  ],
  navigationAccessibilitySteps: [
    async ({ page }, use) => {
      const navigationAccessibilitySteps = new NavigationAccessibilitySteps(
        page
      );
      await use(navigationAccessibilitySteps);
    },
    { scope: "test" },
  ],
  responsiveAccessibilitySteps: [
    async ({ page }, use) => {
      const responsiveAccessibilitySteps = new ResponsiveAccessibilitySteps(
        page
      );
      await use(responsiveAccessibilitySteps);
    },
    { scope: "test" },
  ],
  responsiveCommonSteps: [
    async ({ page, humanSpaceflightPage }, use) => {
      const responsiveCommonSteps = new ResponsiveCommonSteps(
        page,
        humanSpaceflightPage
      );
      await use(responsiveCommonSteps);
    },
    { scope: "test" },
  ],
  responsiveComponentSteps: [
    async ({ humanSpaceflightPage }, use) => {
      const responsiveComponentSteps = new ResponsiveComponentSteps(
        humanSpaceflightPage
      );
      await use(responsiveComponentSteps);
    },
    { scope: "test" },
  ],
  responsiveImageSteps: [
    async ({ page, humanSpaceflightPage }, use) => {
      const responsiveImageSteps = new ResponsiveImageSteps(
        page,
        humanSpaceflightPage
      );
      await use(responsiveImageSteps);
    },
    { scope: "test" },
  ],
  responsiveInteractionSteps: [
    async ({ page, humanSpaceflightPage }, use) => {
      const responsiveInteractionSteps = new ResponsiveInteractionSteps(
        page,
        humanSpaceflightPage
      );
      await use(responsiveInteractionSteps);
    },
    { scope: "test" },
  ],
  responsiveLayoutSteps: [
    async ({ page, humanSpaceflightPage, assertionHelper }, use) => {
      const responsiveLayoutSteps = new ResponsiveLayoutSteps(
        page,
        humanSpaceflightPage,
        assertionHelper
      );
      await use(responsiveLayoutSteps);
    },
    { scope: "test" },
  ],
  responsiveNavigationSteps: [
    async ({ humanSpaceflightPage }, use) => {
      const responsiveNavigationSteps = new ResponsiveNavigationSteps(
        humanSpaceflightPage
      );
      await use(responsiveNavigationSteps);
    },
    { scope: "test" },
  ],
  responsiveTypographySteps: [
    async ({ page }, use) => {
      const responsiveTypographySteps = new ResponsiveTypographySteps(page);
      await use(responsiveTypographySteps);
    },
    { scope: "test" },
  ],
  responsiveViewportSteps: [
    async ({ page, humanSpaceflightPage }, use) => {
      const responsiveViewportSteps = new ResponsiveViewportSteps(
        page,
        humanSpaceflightPage
      );
      await use(responsiveViewportSteps);
    },
    { scope: "test" },
  ],
  seoMetaTagsSteps: [
    async ({ page, humanSpaceflightPage }, use) => {
      const seoMetaTagsSteps = new SeoMetaTagsSteps(page, humanSpaceflightPage);
      await use(seoMetaTagsSteps);
    },
    { scope: "test" },
  ],
  contentSeoSteps: [
    async ({ page, humanSpaceflightPage }, use) => {
      const contentSeoSteps = new ContentSeoSteps(page, humanSpaceflightPage);
      await use(contentSeoSteps);
    },
    { scope: "test" },
  ],
  imageOptimizationSteps: [
    async ({ humanSpaceflightPage }, use) => {
      const imageOptimizationSteps = new ImageOptimizationSteps(
        humanSpaceflightPage
      );
      await use(imageOptimizationSteps);
    },
    { scope: "test" },
  ],
  performanceMetricsSteps: [
    async (
      { page, humanSpaceflightPage, sharedContext, assertionHelper },
      use
    ) => {
      const performanceMetricsSteps = new PerformanceMetricsSteps(
        page,
        humanSpaceflightPage,
        sharedContext,
        assertionHelper
      );
      await use(performanceMetricsSteps);
    },
    { scope: "test" },
  ],
  responsivePerformanceSteps: [
    async ({ page, humanSpaceflightPage }, use) => {
      const responsivePerformanceSteps = new ResponsivePerformanceSteps(
        page,
        humanSpaceflightPage
      );
      await use(responsivePerformanceSteps);
    },
    { scope: "test" },
  ],
  structuralAccessibilitySteps: [
    async ({ page, humanSpaceflightPage, assertionHelper }, use) => {
      const structuralAccessibilitySteps = new StructuralAccessibilitySteps(
        page,
        humanSpaceflightPage,
        assertionHelper
      );
      await use(structuralAccessibilitySteps);
    },
    { scope: "test" },
  ],
  theSuitesCoreSteps: [
    async ({ page, humanSpaceflightPage }, use) => {
      const theSuitesCoreSteps = new TheSuitesCoreSteps(
        page,
        humanSpaceflightPage
      );
      await use(theSuitesCoreSteps);
    },
    { scope: "test" },
  ],
  theSuitesHotspotSteps: [
    async ({ page, humanSpaceflightPage }, use) => {
      const theSuitesHotspotSteps = new TheSuitesHotspotSteps(
        page,
        humanSpaceflightPage
      );
      await use(theSuitesHotspotSteps);
    },
    { scope: "test" },
  ],
  theSuitesInteractionSteps: [
    async ({ page, humanSpaceflightPage }, use) => {
      const theSuitesInteractionSteps = new TheSuitesInteractionSteps(
        page,
        humanSpaceflightPage
      );
      await use(theSuitesInteractionSteps);
    },
    { scope: "test" },
  ],
  theSuitesVisualSteps: [
    async ({ humanSpaceflightPage }, use) => {
      const theSuitesVisualSteps = new TheSuitesVisualSteps(
        humanSpaceflightPage
      );
      await use(theSuitesVisualSteps);
    },
    { scope: "test" },
  ],
  vehicleAccessibilitySteps: [
    async ({ page, humanSpaceflightPage }, use) => {
      const vehicleAccessibilitySteps = new VehicleAccessibilitySteps(
        page,
        humanSpaceflightPage
      );
      await use(vehicleAccessibilitySteps);
    },
    { scope: "test" },
  ],
  vehicleBaseSteps: [
    async ({ page, humanSpaceflightPage }, use) => {
      const vehicleBaseSteps = new VehicleBaseSteps(page, humanSpaceflightPage);
      await use(vehicleBaseSteps);
    },
    { scope: "test" },
  ],
  vehiclePerformanceSteps: [
    async ({ page, humanSpaceflightPage }, use) => {
      const vehiclePerformanceSteps = new VehiclePerformanceSteps(
        page,
        humanSpaceflightPage
      );
      await use(vehiclePerformanceSteps);
    },
    { scope: "test" },
  ],
  humanSpaceflightCoreSteps: [
    async (
      { page, humanSpaceflightPage, sharedContext, assertionHelper },
      use
    ) => {
      const humanSpaceflightCoreSteps = new HumanSpaceflightCoreSteps(
        page,
        humanSpaceflightPage,
        sharedContext,
        assertionHelper
      );
      await use(humanSpaceflightCoreSteps);
    },
    { scope: "test" },
  ],
  humanSpaceflightHeaderSteps: [
    async ({ humanSpaceflightPage }, use) => {
      const humanSpaceflightHeaderSteps = new HumanSpaceflightHeaderSteps(
        humanSpaceflightPage
      );
      await use(humanSpaceflightHeaderSteps);
    },
    { scope: "test" },
  ],
  humanSpaceflightInteractionSteps: [
    async ({ page, humanSpaceflightPage }, use) => {
      const humanSpaceflightInteractionSteps =
        new HumanSpaceflightInteractionSteps(page, humanSpaceflightPage);
      await use(humanSpaceflightInteractionSteps);
    },
    { scope: "test" },
  ],
  humanSpaceflightMobileSteps: [
    async ({ page, humanSpaceflightPage, sharedContext }, use) => {
      const humanSpaceflightMobileSteps = new HumanSpaceflightMobileSteps(
        page,
        humanSpaceflightPage,
        sharedContext
      );
      await use(humanSpaceflightMobileSteps);
    },
    { scope: "test" },
  ],
  humanSpaceflightPerformanceSteps: [
    async ({ page, humanSpaceflightPage, viewportUtility }, use) => {
      const humanSpaceflightPerformanceSteps =
        new HumanSpaceflightPerformanceSteps(
          page,
          humanSpaceflightPage,
          viewportUtility
        );
      await use(humanSpaceflightPerformanceSteps);
    },
    { scope: "test" },
  ],
  homePageCoreSteps: [
    async ({ page, homePage, sharedContext, assertionHelper }, use) => {
      const homePageCoreSteps = new HomePageCoreSteps(
        page,
        homePage,
        sharedContext,
        assertionHelper
      );
      await use(homePageCoreSteps);
    },
    { scope: "test" },
  ],
  homePageInteractionSteps: [
    async ({ page, homePage, assertionHelper }, use) => {
      const homePageInteractionSteps = new HomePageInteractionSteps(
        page,
        homePage,
        assertionHelper
      );
      await use(homePageInteractionSteps);
    },
    { scope: "test" },
  ],
  homePageMetadataSteps: [
    async ({ page, homePage }, use) => {
      const homePageMetadataSteps = new HomePageMetadataSteps(page, homePage);
      await use(homePageMetadataSteps);
    },
    { scope: "test" },
  ],
  homePageMobileSteps: [
    async ({ page, homePage, sharedContext, assertionHelper }, use) => {
      const homePageMobileSteps = new HomePageMobileSteps(
        page,
        homePage,
        sharedContext,
        assertionHelper
      );
      await use(homePageMobileSteps);
    },
    { scope: "test" },
  ],
  homePageNavigationSteps: [
    async ({ page, homePage }, use) => {
      const homePageNavigationSteps = new HomePageNavigationSteps(
        page,
        homePage
      );
      await use(homePageNavigationSteps);
    },
    { scope: "test" },
  ],
  homePageTechnicalSteps: [
    async ({ page, homePage, sharedContext }, use) => {
      const homePageTechnicalSteps = new HomePageTechnicalSteps(
        page,
        homePage,
        sharedContext
      );
      await use(homePageTechnicalSteps);
    },
    { scope: "test" },
  ],
  visualElementAccessibilitySteps: [
    async ({ page, humanSpaceflightPage, assertionHelper }, use) => {
      const visualElementAccessibilitySteps =
        new VisualElementAccessibilitySteps(
          page,
          humanSpaceflightPage,
          assertionHelper
        );
      await use(visualElementAccessibilitySteps);
    },
    { scope: "test" },
  ],
  careersPage: async ({ page }, use) => {
    const careersPage = new CareersPage(page);
    await use(careersPage);
  },
  careersPageSteps: [
    async ({ careersPage, sharedContext, assertionHelper }, use) => {
      const careersPageSteps = new CareersPageSteps(
        careersPage,
        sharedContext,
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
    async ({ dragonPage, assertionHelper }, use) => {
      const dragonPageSteps = new DragonPageSteps(dragonPage, assertionHelper);
      await use(dragonPageSteps);
    },
    { scope: "test" },
  ],
  falcon9Page: async ({ page }, use) => {
    const falcon9Page = new Falcon9Page(page);
    await use(falcon9Page);
  },
  falcon9PageSteps: [
    async ({ falcon9Page, assertionHelper }, use) => {
      const falcon9PageSteps = new Falcon9PageSteps(
        falcon9Page,
        assertionHelper
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
    async ({ falconHeavyPage, assertionHelper }, use) => {
      const falconHeavyPageSteps = new FalconHeavyPageSteps(
        falconHeavyPage,
        assertionHelper
      );
      await use(falconHeavyPageSteps);
    },
    { scope: "test" },
  ],
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await use(homePage);
  },
  missionsPage: async ({ page }, use) => {
    const missionsPage = new MissionsPage(page);
    await use(missionsPage);
  },
  missionsSteps: [
    async ({ page, missionsPage, assertionHelper, sharedContext }, use) => {
      const missionsSteps = new MissionsSteps(
        page,
        missionsPage,
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
    async ({ ridesharePage, assertionHelper }, use) => {
      const ridesharePageSteps = new RidesharePageSteps(
        ridesharePage,
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
  starshieldPage: async ({ page }, use) => {
    const starshieldPage = new StarshieldPage(page);
    await use(starshieldPage);
  },
  starshieldPageSteps: [
    async ({ starshieldPage, sharedContext, assertionHelper }, use) => {
      const starshieldPageSteps = new StarshieldPageSteps(
        starshieldPage,
        sharedContext,
        assertionHelper
      );
      await use(starshieldPageSteps);
    },
    { scope: "test" },
  ],
  starshipPage: async ({ page }, use) => {
    const starshipPage = new StarshipPage(page);
    await use(starshipPage);
  },
  suppliersPage: async ({ page }, use) => {
    const suppliersPage = new SuppliersPage(page);
    await use(suppliersPage);
  },
  updatesPage: async ({ page }, use) => {
    const updatesPage = new UpdatesPage(page);
    await use(updatesPage);
  },
  updatesPageSteps: [
    async ({ updatesPage, viewportUtility, assertionHelper }, use) => {
      const updatesPageSteps = new UpdatesPageSteps(
        updatesPage,
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
  starshieldContentSteps: [
    async ({ page, starshieldPage, sharedContext, assertionHelper }, use) => {
      const starshieldContentSteps = new StarshieldContentSteps(
        page,
        starshieldPage,
        sharedContext,
        assertionHelper
      );
      await use(starshieldContentSteps);
    },
    { scope: "test" },
  ],
  starshieldErrorHandlingSteps: [
    async ({ page, starshieldPage, sharedContext, assertionHelper }, use) => {
      const starshieldErrorHandlingSteps = new StarshieldErrorHandlingSteps(
        page,
        starshieldPage,
        sharedContext,
        assertionHelper
      );
      await use(starshieldErrorHandlingSteps);
    },
    { scope: "test" },
  ],
  starshieldFormSteps: [
    async ({ page, starshieldPage, sharedContext, assertionHelper }, use) => {
      const starshieldFormSteps = new StarshieldFormSteps(
        page,
        starshieldPage,
        sharedContext,
        assertionHelper
      );
      await use(starshieldFormSteps);
    },
    { scope: "test" },
  ],
  starshieldNavigationSteps: [
    async (
      { page, starshieldPage, sharedContext, assertionHelper, viewportUtility },
      use
    ) => {
      const starshieldNavigationSteps = new StarshieldNavigationSteps(
        page,
        starshieldPage,
        sharedContext,
        assertionHelper,
        viewportUtility
      );
      await use(starshieldNavigationSteps);
    },
    { scope: "test" },
  ],
  starshieldPerformanceSteps: [
    async ({ page, starshieldPage, assertionHelper }, use) => {
      const starshieldPerformanceSteps = new StarshieldPerformanceSteps(
        page,
        starshieldPage,
        assertionHelper
      );
      await use(starshieldPerformanceSteps);
    },
    { scope: "test" },
  ],
  starshieldTechnicalSteps: [
    async ({ page, starshieldPage, sharedContext, viewportUtility }, use) => {
      const starshieldTechnicalSteps = new StarshieldTechnicalSteps(
        page,
        starshieldPage,
        sharedContext,
        viewportUtility
      );
      await use(starshieldTechnicalSteps);
    },
    { scope: "test" },
  ],
  starshipBasicSteps: [
    async ({ starshipPage, assertionHelper }, use) => {
      const starshipBasicSteps = new StarshipBasicSteps(
        starshipPage,
        assertionHelper
      );
      await use(starshipBasicSteps);
    },
    { scope: "test" },
  ],
  starshipMissionsSteps: [
    async ({ starshipPage, assertionHelper }, use) => {
      const starshipMissionsSteps = new StarshipMissionsSteps(
        starshipPage,
        assertionHelper
      );
      await use(starshipMissionsSteps);
    },
    { scope: "test" },
  ],
  starshipPropulsionSteps: [
    async ({ starshipPage, assertionHelper }, use) => {
      const starshipPropulsionSteps = new StarshipPropulsionSteps(
        starshipPage,
        assertionHelper
      );
      await use(starshipPropulsionSteps);
    },
    { scope: "test" },
  ],
  starshipResponsiveSteps: [
    async ({ page, starshipPage, assertionHelper, viewportUtility }, use) => {
      const starshipResponsiveSteps = new StarshipResponsiveSteps(
        page,
        starshipPage,
        assertionHelper,
        viewportUtility
      );
      await use(starshipResponsiveSteps);
    },
    { scope: "test" },
  ],
  suppliersPageBasicSteps: [
    async ({ suppliersPage, assertionHelper, viewportUtility }, use) => {
      const suppliersPageBasicSteps = new SuppliersPageBasicSteps(
        suppliersPage,
        assertionHelper,
        viewportUtility
      );
      await use(suppliersPageBasicSteps);
    },
    { scope: "test" },
  ],
  suppliersPageRegistrationSteps: [
    async ({ suppliersPage, assertionHelper, viewportUtility }, use) => {
      const suppliersPageRegistrationSteps = new SuppliersPageRegistrationSteps(
        suppliersPage,
        assertionHelper,
        viewportUtility
      );
      await use(suppliersPageRegistrationSteps);
    },
    { scope: "test" },
  ],
  suppliersPageResourcesSteps: [
    async ({ suppliersPage, assertionHelper, viewportUtility }, use) => {
      const suppliersPageResourcesSteps = new SuppliersPageResourcesSteps(
        suppliersPage,
        assertionHelper,
        viewportUtility
      );
      await use(suppliersPageResourcesSteps);
    },
    { scope: "test" },
  ],
  suppliersPageTechnicalSteps: [
    async ({ suppliersPage, assertionHelper, viewportUtility }, use) => {
      const suppliersPageTechnicalSteps = new SuppliersPageTechnicalSteps(
        suppliersPage,
        assertionHelper,
        viewportUtility
      );
      await use(suppliersPageTechnicalSteps);
    },
    { scope: "test" },
  ],
  timelineContentSteps: [
    async ({ page, humanSpaceflightPage }, use) => {
      const timelineContentSteps = new TimelineContentSteps(
        page,
        humanSpaceflightPage
      );
      await use(timelineContentSteps);
    },
    { scope: "test" },
  ],
  timelineCoreSteps: [
    async ({ humanSpaceflightPage }, use) => {
      const timelineCoreSteps = new TimelineCoreSteps(humanSpaceflightPage);
      await use(timelineCoreSteps);
    },
    { scope: "test" },
  ],
  timelineNavigationSteps: [
    async ({ page, humanSpaceflightPage }, use) => {
      const timelineNavigationSteps = new TimelineNavigationSteps(
        page,
        humanSpaceflightPage
      );
      await use(timelineNavigationSteps);
    },
    { scope: "test" },
  ],
  timelineResponsiveSteps: [
    async ({ page, humanSpaceflightPage }, use) => {
      const timelineResponsiveSteps = new TimelineResponsiveSteps(
        page,
        humanSpaceflightPage
      );
      await use(timelineResponsiveSteps);
    },
    { scope: "test" },
  ],
  timelineVisualSteps: [
    async ({ humanSpaceflightPage }, use) => {
      const timelineVisualSteps = new TimelineVisualSteps(humanSpaceflightPage);
      await use(timelineVisualSteps);
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
  ourMissionsTabSteps: [
    async ({ humanSpaceflightPage }, use) => {
      const ourMissionsTabSteps = new OurMissionsTabSteps(humanSpaceflightPage);
      await use(ourMissionsTabSteps);
    },
    { scope: "test" },
  ],
  ourMissionsContentSteps: [
    async ({ humanSpaceflightPage }, use) => {
      const ourMissionsContentSteps = new OurMissionsContentSteps(
        humanSpaceflightPage
      );
      await use(ourMissionsContentSteps);
    },
    { scope: "test" },
  ],
  ourMissionsPerformanceSteps: [
    async ({ humanSpaceflightPage, viewportUtility }, use) => {
      const ourMissionsPerformanceSteps = new OurMissionsPerformanceSteps(
        humanSpaceflightPage,
        viewportUtility
      );
      await use(ourMissionsPerformanceSteps);
    },
    { scope: "test" },
  ],
  ourMissionsVisualSteps: [
    async ({ humanSpaceflightPage }, use) => {
      const ourMissionsVisualSteps = new OurMissionsVisualSteps(
        humanSpaceflightPage
      );
      await use(ourMissionsVisualSteps);
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
