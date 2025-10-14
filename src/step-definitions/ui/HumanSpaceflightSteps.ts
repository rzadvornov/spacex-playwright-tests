import { Page, expect } from "@playwright/test";
import { Given, When, Then, Fixture } from "playwright-bdd/decorators";
import { DataTable } from "playwright-bdd";
import { HumanSpaceflightPage } from "../../pages/ui/HumanSpaceflightPage";
import { CustomTestArgs } from "../../fixtures/BddFixtures";
import { SharedPageSteps } from "./SharedPageSteps";
import {
  BoundingBox,
  CoreValue,
  Element,
  MetadataItem,
  MobileAction,
  RequirementMetric,
} from "../../pages/types/Types";
import {
  parseCoreValues,
  parseHeaderElements,
  parseMobileActions,
  parsePerformanceMetrics,
  parseMetadataItems,
} from "../../pages/types/TypeGuards";
import { ViewportUtility } from "../../utils/ViewportUtility";

@Fixture("humanSpaceflightSteps")
export class HumanSpaceflightSteps {
  private readonly MOBILE_VIEWPORT = { width: 375, height: 812 };
  private readonly SCROLL_DELAY = 500;
  private readonly NAVIGATION_LINKS = [
    "Vehicles",
    "Launches",
    "Human Spaceflight",
    "Rideshare",
    "Starlink",
    "Starshield",
    "Company",
  ];

  constructor(
    private page: Page,
    private humanSpaceflightPage: HumanSpaceflightPage,
    private sharedContext: CustomTestArgs["sharedContext"],
    private sharedPageSteps: SharedPageSteps,
    private viewportUtility: ViewportUtility
  ) {}

  @Given("I am on the SpaceX Human Spaceflight page")
  async openHumanSpaceflightPage() {
    this.sharedContext.startTime = Date.now();
    await this.humanSpaceflightPage.open("/human-spaceflight");
    await this.page.waitForLoadState("networkidle");
  }

  @Given("I am on the SpaceX Human Spaceflight page viewed on mobile")
  async openHumanSpaceflightPageMobile() {
    this.sharedContext.startTime = Date.now();
    await this.humanSpaceflightPage.openWithMobileViewport(
      this.MOBILE_VIEWPORT.width,
      this.MOBILE_VIEWPORT.height
    );
    await this.page.waitForLoadState("networkidle");
  }

  @When("I click on the {string} navigation link")
  async clickNavigationLink(linkText: string) {
    await this.humanSpaceflightPage.header.clickNavigationLink(linkText);
    await this.page.waitForLoadState("domcontentloaded");
  }

  @Then("the page should load with the following requirements:")
  async checkCoreRequirements(dataTable: DataTable) {
    const requirements = parseCoreValues(dataTable.hashes());

    for (const req of requirements) {
      await this.validateCoreRequirement(req);
    }
  }

  private async validateCoreRequirement(req: CoreValue): Promise<void> {
    switch (req.Element) {
      case "Load Time":
        await this.validateLoadTime(req.Value);
        break;
      case "Page Title":
        await this.validatePageTitle(req.Value);
        break;
      case "Hero Title":
        await this.validateHeroTitle(req.Value);
        break;
      case "Subtitle":
        await this.validateHeroSubtitle(req.Value);
        break;
      default:
        console.warn(`Unknown core requirement element: ${req.Element}`);
    }
  }

  private async validateLoadTime(requirement: string): Promise<void> {
    const loadTime = Date.now() - this.sharedContext.startTime;
    const maxTime = parseInt(requirement.split(" ")[0]) * 1000;
    expect(
      loadTime,
      `Page load time (${loadTime}ms) should be under ${maxTime}ms`
    ).toBeLessThanOrEqual(maxTime);
  }

  private async validatePageTitle(expectedContent: string): Promise<void> {
    const title = await this.page.title();
    expect(title).toContain(expectedContent);
  }

  private async validateHeroTitle(expectedValue: string): Promise<void> {
    const heroTitle = await this.humanSpaceflightPage.hero.getHeroTitleText();
    expect(heroTitle.toUpperCase()).toBe(expectedValue.toUpperCase());
  }

  private async validateHeroSubtitle(expectedValue: string): Promise<void> {
    const subtitle = await this.humanSpaceflightPage.hero.getHeroSubtitleText();
    expect(subtitle).toBe(expectedValue);
  }

  @Then("the header navigation should contain:")
  async checkNavigationMenu(dataTable: DataTable) {
    const links = dataTable.hashes();

    for (const link of links) {
      const isVisible = await this.humanSpaceflightPage.header.isNavLinkVisible(
        link["Link Text"]
      );
      expect(
        isVisible,
        `Navigation link "${link["Link Text"]}" should be visible`
      ).toBe(true);
    }
  }

  @Then("I should see the header with the following elements:")
  async checkHeaderElements(dataTable: DataTable) {
    const elements = parseHeaderElements(dataTable.hashes());

    for (const element of elements) {
      await this.validateHeaderElement(element);
    }
  }

  private async validateHeaderElement(element: Element): Promise<void> {
    switch (element.Element) {
      case "Logo":
        const isLogoVisible =
          await this.humanSpaceflightPage.header.isLogoVisible();
        expect(isLogoVisible, "Logo should be visible").toBe(true);
        break;
      case "Hamburger":
        const isHamburgerVisible =
          await this.humanSpaceflightPage.header.isMobileMenuButtonVisible();
        expect(isHamburgerVisible, "Hamburger button should be visible").toBe(
          true
        );
        break;
      default:
        console.warn(`Unknown header element: ${element.Element}`);
    }
  }

  @When("I click hamburger")
  async clickHamburgerMenu() {
    await this.humanSpaceflightPage.header.clickMobileMenuButton();
  }

  @Then("Menu expands")
  async checkMenuExpands() {
    const isExpanded =
      await this.humanSpaceflightPage.header.isMobileMenuExpanded();
    expect(isExpanded, "Mobile menu should be expanded/visible").toBe(true);
  }

  @When("I click close")
  async clickCloseButtonOnMobileMenu() {
    await this.humanSpaceflightPage.header.clickMobileMenuCloseButton();
  }

  @Then("Menu collapses")
  async checkMenuCollapses() {
    const isExpanded =
      await this.humanSpaceflightPage.header.isMobileMenuExpanded();
    expect(isExpanded, "Mobile menu should be collapsed/hidden").toBe(false);
  }

  @Then("after the actions are performed:")
  async checkMobileActionVerification(dataTable: DataTable) {
    const actions = parseMobileActions(dataTable.hashes());

    for (const action of actions) {
      await this.executeMobileAction(action);
    }
  }

  private async executeMobileAction(action: MobileAction): Promise<void> {
    switch (action.Action) {
      case "Click hamburger":
        await this.humanSpaceflightPage.header.clickMobileMenuButton();
        const isExpanded =
          await this.humanSpaceflightPage.header.isMobileMenuExpanded();
        expect(isExpanded, `Action: ${action.Verification}`).toBe(true);
        break;
      case "View menu items":
        const allLinksExist =
          await this.humanSpaceflightPage.header.checkNavigationLinksExist(
            this.NAVIGATION_LINKS
          );
        expect(allLinksExist, `Verification: ${action.Verification}`).toBe(
          true
        );
        break;
      case "Click close":
        await this.humanSpaceflightPage.header.clickMobileMenuCloseButton();
        const isCollapsed =
          await this.humanSpaceflightPage.header.isMobileMenuExpanded();
        expect(isCollapsed, `Action: ${action.Verification}`).toBe(false);
        break;
      default:
        throw new Error(`Unknown action type: ${action.Action}`);
    }
  }

  @Then("the mobile navigation should be fully functional")
  async checkMobileNavigationFunctionality() {
    await this.testMobileMenuOpenClose();
    await this.testMobileMenuNavigation();
    await this.testMobileMenuFinalState();
  }

  private async testMobileMenuOpenClose(): Promise<void> {
    await this.humanSpaceflightPage.header.clickMobileMenuButton();
    const isExpanded =
      await this.humanSpaceflightPage.header.isMobileMenuExpanded();
    expect(isExpanded, "Mobile menu should open").toBe(true);
  }

  private async testMobileMenuNavigation(): Promise<void> {
    const linkText = "Starlink";
    await this.humanSpaceflightPage.header.clickNavigationLink(linkText);
    expect(this.page.url()).toContain("/starlink");

    await this.humanSpaceflightPage.open("/human-spaceflight");
    await this.page.waitForLoadState("networkidle");
  }

  private async testMobileMenuFinalState(): Promise<void> {
    await this.humanSpaceflightPage.header.clickMobileMenuButton();
    await this.humanSpaceflightPage.header.clickMobileMenuCloseButton();
    const isCollapsed =
      await this.humanSpaceflightPage.header.isMobileMenuExpanded();
    expect(isCollapsed, "Mobile menu should close after use").toBe(false);
  }

  @When("I see the scroll-down arrow animation")
  async checkScrollDownArrowVisible() {
    const isVisible =
      await this.humanSpaceflightPage.hero.isScrollDownArrowVisible();
    expect(isVisible, "Scroll-down arrow should be visible").toBe(true);
  }

  @When("I click on the arrow")
  async clickScrollDownArrow() {
    await this.humanSpaceflightPage.hero.clickScrollDownArrow();
    await this.page.waitForTimeout(this.SCROLL_DELAY);
  }

  @Then("the page should smoothly scroll to the Media Carousel section")
  async checkPageScrollsToMediaCarousel() {
    const isVisible =
      await this.humanSpaceflightPage.mediaCarousel.isSectionInViewport();
    expect(
      isVisible,
      "Media Carousel section should be in the viewport after scroll"
    ).toBe(true);
  }

  @Then("the page should meet the following metrics:")
  async checkPerformanceMetrics(dataTable: DataTable) {
    const metrics = parsePerformanceMetrics(dataTable.hashes());

    for (const metric of metrics) {
      await this.validatePerformanceMetric(metric);
    }
  }

  private async validatePerformanceMetric(
    metric: RequirementMetric
  ): Promise<void> {
    switch (metric.Metric) {
      case "Largest Contentful Paint":
        await this.validateLCP(metric.Requirement);
        break;
      case "First Input Delay":
        await this.validateFID(metric.Requirement);
        break;
      case "Console Errors":
        await this.validateConsoleErrors();
        break;
      case "Image Loading":
        await this.validateImageLoading();
        break;
      default:
        console.warn(`Unknown performance metric: ${metric.Metric}`);
    }
  }

  private async validateLCP(requirement: string): Promise<void> {
    const lcp =
      await this.humanSpaceflightPage.performanceSEO.getLargestContentfulPaint();
    const maxLCP = parseInt(requirement.split(" ")[0]);
    expect(lcp, `LCP (${lcp}ms) should be under ${maxLCP}ms`).toBeLessThan(
      maxLCP
    );
  }

  private async validateFID(requirement: string): Promise<void> {
    const fid =
      await this.humanSpaceflightPage.performanceSEO.getFirstInputDelay();
    const maxFID = parseInt(requirement.split(" ")[0]);
    expect(fid, `FID (${fid}ms) should be under ${maxFID}ms`).toBeLessThan(
      maxFID
    );
  }

  private async validateConsoleErrors(): Promise<void> {
    const errors = await this.humanSpaceflightPage.getConsoleErrors();
    expect(errors, "Console should have no errors").toEqual([]);
  }

  private async validateImageLoading(): Promise<void> {
    const has404s =
      await this.humanSpaceflightPage.performanceSEO.checkImageLoading404s();
    expect(has404s, "No image 404 errors should be present").toBe(false);
  }

  @Then("the page should have the following metadata:")
  async checkMetadata(dataTable: DataTable) {
    const metadata = parseMetadataItems(dataTable.hashes());

    for (const item of metadata) {
      await this.validateMetadataItem(item);
    }
  }

  private async validateMetadataItem(item: MetadataItem): Promise<void> {
    switch (item.Element) {
      case "Viewport":
        await this.validateViewportMeta();
        break;
      case "Description":
        await this.validateDescriptionMeta(item.Content);
        break;
      case "Keywords":
        await this.validateKeywordsMeta(item.Content);
        break;
      case "Open Graph":
        await this.validateOpenGraphMeta(item.Content);
        break;
      default:
        console.warn(`Unknown metadata element: ${item.Element}`);
    }
  }

  private async validateViewportMeta(): Promise<void> {
    const viewportContent = await this.humanSpaceflightPage.getMetaTagContent(
      'name="viewport"'
    );
    expect(viewportContent).toContain("width=device-width");
    expect(viewportContent).toContain("initial-scale=1");
  }

  private async validateDescriptionMeta(
    expectedContent: string
  ): Promise<void> {
    const descContent = await this.humanSpaceflightPage.getMetaTagContent(
      'name="description"'
    );
    expect(descContent).toContain(expectedContent);
  }

  private async validateKeywordsMeta(expectedKeywords: string): Promise<void> {
    const keywordContent = await this.humanSpaceflightPage.getMetaTagContent(
      'name="keywords"'
    );
    const expectedKeywordsList = expectedKeywords
      .split(",")
      .map((k) => k.trim().toLowerCase());
    const hasKeyword = expectedKeywordsList.some((k) =>
      keywordContent?.toLowerCase().includes(k)
    );
    expect(
      hasKeyword,
      `Keywords meta tag should contain one of: ${expectedKeywords}`
    ).toBe(true);
  }

  private async validateOpenGraphMeta(expectedContent: string): Promise<void> {
    const ogTitle = await this.humanSpaceflightPage.getMetaTagContent(
      'property="og:title"'
    );
    expect(ogTitle).toContain(expectedContent.split(":")[1].trim());
  }

  @Then("all metadata should be properly formatted for search engines")
  async checkMetadataFormatting() {
    const [canonical, htmlLang] = await Promise.all([
      this.page.getAttribute('link[rel="canonical"]', "href"),
      this.page.getAttribute("html", "lang"),
    ]);

    expect(canonical, "Canonical URL should be present").not.toBeNull();
    expect(htmlLang, "HTML language attribute should be set").not.toBeNull();
  }

  @Then("the page should be responsive across different screen sizes")
  async checkPageResponsiveness() {
    await this.viewportUtility.checkAllViewports(async (size: BoundingBox) => {
      const [heroVisible, headerVisible] = await Promise.all([
        this.humanSpaceflightPage.hero.isHeroSectionVisible(),
        this.humanSpaceflightPage.header.isHeaderVisible(),
      ]);

      expect(
        heroVisible && headerVisible,
        `Page should be responsive at ${size.width}x${size.height}`
      ).toBe(true);
    });
  }
}
