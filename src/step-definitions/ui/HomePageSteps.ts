import { Page, expect } from "@playwright/test";
import { Given, When, Then, Fixture } from "playwright-bdd/decorators";
import { DataTable } from "playwright-bdd";
import { HomePage } from "../../pages/ui/HomePage";
import { CustomTestArgs } from "../../fixtures/BddFixtures";
import { SharedPageSteps } from "./SharedPageSteps";
import {
  CoreRequirement,
  CriticalContent,
  MetadataItem,
  MetadataTable,
  MobileMenuTable,
  NavigationLink,
  PerformanceTable,
  RedirectionTable,
  SocialMediaTag,
  TechnicalRequirementsTable,
} from "../../pages/types/Types";
import {
  parseCoreRequirements,
  parseCriticalContent,
  parseNavigationLinks,
  parseMetadataItems,
  parseSocialMediaTags,
  parseWcagStandards,
  parseAssistiveTechRequirements,
} from "../../pages/types/TypeGuards";
import { AssertionHelper } from "../../utils/AssertionHelper";

@Fixture("homePageSteps")
export class HomePageSteps {
  private readonly MAX_LOAD_TIME = 5000;
  private readonly SCROLL_DELAY = 300;
  private readonly CTA_CLICK_DELAY = 500;
  private readonly MOBILE_VIEWPORT = { width: 375, height: 812 };
  private readonly MOBILE_BREAKPOINT = 768;

  constructor(
    private page: Page,
    private homePage: HomePage,
    private sharedContext: CustomTestArgs["sharedContext"],
    private sharedPageSteps: SharedPageSteps,
    private assertionHelper: AssertionHelper
  ) {}

  @Given("I am on the SpaceX HomePage")
  async openHomePage() {
    this.sharedContext.startTime = Date.now();
    await this.homePage.open();
    await this.page.waitForLoadState("networkidle");
  }

  @Given("I am on the SpaceX HomePage viewed on mobile")
  async openHomePageMobile() {
    this.sharedContext.startTime = Date.now();
    await this.homePage.openWithMobileViewport(
      this.MOBILE_VIEWPORT.width,
      this.MOBILE_VIEWPORT.height
    );
    await this.page.waitForLoadState("networkidle");
  }

  @Then("the page should meet core requirements:")
  async checkCoreRequirements(dataTable: DataTable) {
    const requirements = parseCoreRequirements(dataTable.hashes());

    for (const req of requirements) {
      await this.validateCoreRequirement(req);
    }
  }

  private async validateCoreRequirement(req: CoreRequirement): Promise<void> {
    switch (req.Element) {
      case "Load Time":
        await this.validateLoadTime(req.Requirement);
        break;
      case "Page Title":
        await this.validatePageTitle(req.Requirement);
        break;
      case "Hero Section":
        await this.validateHeroSectionVisibility();
        break;
      case "Navigation":
        await this.validateHeaderAccessibility();
        break;
      case "Layout":
        break;
      default:
        console.warn(`Unknown core requirement element: ${req.Element}`);
    }
  }

  private async validateLoadTime(requirement: string): Promise<void> {
    const loadTime = Date.now() - this.sharedContext.startTime;
    expect(
      loadTime,
      `Page load time (${loadTime}ms) should be within ${requirement}`
    ).toBeLessThanOrEqual(this.MAX_LOAD_TIME);
  }

  private async validatePageTitle(expectedContent: string): Promise<void> {
    await this.assertionHelper.validateBooleanCheck(
      () => this.homePage.verifyPageTitle(expectedContent),
      `Page title should contain "${expectedContent}"`
    );
  }

  private async validateHeroSectionVisibility(): Promise<void> {
    const isVisible = await this.homePage.hero.isHeroSectionVisible();
    expect(isVisible, "Hero section should be visible").toBe(true);
  }

  private async validateHeaderAccessibility(): Promise<void> {
    const isHeaderAccessible = await this.homePage.header.isHeaderVisible();
    expect(isHeaderAccessible, "Header menu should be accessible").toBe(true);
  }

  @Then("critical content should be present:")
  async checkCriticalContent(dataTable: DataTable) {
    const content = parseCriticalContent(dataTable.hashes());

    for (const item of content) {
      await this.validateCriticalContent(item);
    }
  }

  private async validateCriticalContent(item: CriticalContent): Promise<void> {
    switch (item["Content Type"]) {
      case "Mission Title":
        await this.validateMissionTitle();
        break;
      case "Mission Status":
        await this.validateMissionStatus();
        break;
      case "Call-to-Action":
        await this.validateCallToAction();
        break;
      case "Scroll Indicator":
        await this.validateScrollIndicator();
        break;
      default:
        console.warn(`Unknown critical content type: ${item["Content Type"]}`);
    }
  }

  private async validateMissionTitle(): Promise<void> {
    const titleText = await this.homePage.hero.getHeroTitleText();
    expect(
      titleText.length,
      "Mission Title should be displayed"
    ).toBeGreaterThan(0);
  }

  private async validateMissionStatus(): Promise<void> {
    const isStatusVisible = await this.homePage.hero.isMissionStatusVisible();
    expect(isStatusVisible, "Mission Status indicator should be visible").toBe(
      true
    );
  }

  private async validateCallToAction(): Promise<void> {
    const isCTAVisible = await this.homePage.hero.isCTAButtonVisible(
      "VIEW MISSION"
    );
    expect(isCTAVisible, "Primary action button should be visible").toBe(true);
  }

  private async validateScrollIndicator(): Promise<void> {
    const isScrollVisible = await this.homePage.hero.isScrollDownArrowVisible();
    expect(isScrollVisible, "Scroll Indicator should be present").toBe(true);
  }

  @Then("the navigation menu should contain:")
  async checkNavigationMenu(dataTable: DataTable) {
    const links = parseNavigationLinks(dataTable.hashes());

    for (const link of links) {
      await this.validateNavigationLink(link);
    }
  }

  private async validateNavigationLink(link: NavigationLink): Promise<void> {
    const isPrimaryLinkVisible = await this.homePage.header.isNavLinkVisible(
      link["Primary Links"]
    );
    expect(
      isPrimaryLinkVisible,
      `Primary link "${link["Primary Links"]}" should be visible`
    ).toBe(true);

    if (link["Secondary Elements"] === "SpaceX Logo") {
      const isLogoVisible = await this.homePage.header.isLogoVisible();
      expect(isLogoVisible, "SpaceX Logo should be visible").toBe(true);
    }
  }

  @Then("the SpaceX logo should be present and clickable")
  async checkLogoPresentAndClickable() {
    const [isLogoVisible, isLogoClickable] = await Promise.all([
      this.homePage.header.isLogoVisible(),
      this.homePage.header.isLogoClickable(),
    ]);

    expect(isLogoVisible, "SpaceX logo should be present").toBe(true);
    expect(isLogoClickable, "SpaceX logo should be clickable").toBe(true);
  }

  @Then("the menu should be collapsed on mobile")
  async checkMenuCollapsedOnMobile() {
    const viewport = this.page.viewportSize();
    if (viewport && viewport.width <= this.MOBILE_BREAKPOINT) {
      const isMenuCollapsed = await this.homePage.header.isMenuCollapsed();
      expect(isMenuCollapsed, "Menu should be collapsed on mobile").toBe(true);
    }
  }

  @When("I click the primary CTA button")
  async clickPrimaryCTAButton() {
    await this.homePage.hero.clickCTAButton("VIEW MISSION");
    await this.page.waitForTimeout(this.CTA_CLICK_DELAY);
  }

  @Then("the page should scroll to the next content section")
  async checkScrollToNextSection() {
    const isScrolled = await this.homePage.hero.isPageScrolledPastHero();
    expect(isScrolled, "Page should scroll past the Hero section").toBe(true);
  }

  @Then("the URL should remain on the Homepage")
  async checkUrlRemainsHomepage() {
    const currentUrl = new URL(this.page.url());
    expect(currentUrl.pathname, "URL path should remain '/'").toBe("/");
  }

  @When("I scroll past the hero section")
  async scrollPastHeroSection() {
    await this.homePage.hero.scrollToNextSection();
    await this.page.waitForTimeout(this.SCROLL_DELAY);
  }

  @Then("the header should minimize in height")
  async checkHeaderMinimize() {
    const [initialHeight, currentHeight] = await Promise.all([
      this.homePage.header.getInitialHeaderHeight(),
      this.homePage.header.getCurrentHeaderHeight(),
    ]);

    expect(
      currentHeight,
      "Header height should be smaller after scroll"
    ).toBeLessThan(initialHeight);
  }

  @Then("and the logo size should adjust")
  async checkLogoSizeAdjust() {
    const [initialSize, currentSize] = await Promise.all([
      this.homePage.header.getInitialLogoSize(),
      this.homePage.header.getCurrentLogoSize(),
    ]);

    expect(
      currentSize,
      "Logo size should be smaller after scroll"
    ).toBeLessThan(initialSize);
  }

  @Then("the page should contain correct metadata:")
  async checkMetadata(dataTable: DataTable) {
    const metadata = parseMetadataItems(dataTable.hashes());

    for (const item of metadata) {
      await this.validateMetadataItem(item);
    }
  }

  private async validateMetadataItem(item: MetadataItem): Promise<void> {
    switch (item.Element) {
      case "Title Tag":
        const title = await this.page.title();
        expect(title).toContain(item.Content);
        break;
      case "Description Meta":
        const metaDescription = await this.page.getAttribute(
          'meta[name="description"]',
          "content"
        );
        expect(metaDescription).toContain(item.Content);
        break;
      case "Viewport":
        const viewportMeta = await this.page.getAttribute(
          'meta[name="viewport"]',
          "content"
        );
        expect(viewportMeta).toContain(item.Content);
        break;
      case "Canonical URL":
        const canonicalLink = await this.page.getAttribute(
          'link[rel="canonical"]',
          "href"
        );
        expect(canonicalLink).toBe(item.Content);
        break;
      default:
        console.warn(`Unknown metadata element: ${item.Element}`);
    }
  }

  @Then("social media tags should be present:")
  async checkSocialMediaTags(dataTable: DataTable) {
    const tags = parseSocialMediaTags(dataTable.hashes());

    for (const tag of tags) {
      await this.validateSocialMediaTag(tag);
    }
  }

  private async validateSocialMediaTag(tag: SocialMediaTag): Promise<void> {
    if (tag.Platform === "Open Graph") {
      const ogTitle = await this.page.getAttribute(
        'meta[property="og:title"]',
        "content"
      );
      expect(ogTitle, "Open Graph og:title should be present").not.toBeNull();
    } else if (tag.Platform === "Twitter Card") {
      const twitterCard = await this.page.getAttribute(
        'meta[name="twitter:card"]',
        "content"
      );
      expect(twitterCard, "Twitter Card tag should be present").not.toBeNull();
    } else {
      console.warn(`Unknown social media platform: ${tag.Platform}`);
    }
  }

  @Then("the page should meet WCAG 2.1 AA standards:")
  async checkWcagStandards(dataTable: DataTable) {
    const requirements = parseWcagStandards(dataTable.hashes());

    for (const req of requirements) {
      if (req.Requirement.includes("H1 tag")) {
        const h1Count = await this.page.locator("h1").count();
        expect(h1Count, "Page must have exactly one H1 tag (WCAG)").toBe(1);
      }
    }
  }

  @Then("assistive technology support should be verified:")
  async checkAssistiveTechSupport(dataTable: DataTable) {
    const requirements = parseAssistiveTechRequirements(dataTable.hashes());

    for (const req of requirements) {
      if (req["Support Type"].includes("language")) {
        const lang = await this.page.getAttribute("html", "lang");
        expect(
          lang,
          "HTML element must have a 'lang' attribute"
        ).not.toBeNull();
      }
    }
  }

  @Then("the homepage should load within performance benchmarks")
  async checkPerformanceBenchmarks() {
    const loadTime = Date.now() - this.sharedContext.startTime;
    expect(
      loadTime,
      `Homepage should load within ${this.MAX_LOAD_TIME}ms`
    ).toBeLessThanOrEqual(this.MAX_LOAD_TIME);

    const timeToInteractive = await this.page.evaluate(() => {
      const navigationEntry = performance.getEntriesByType(
        "navigation"
      )[0] as PerformanceNavigationTiming;
      if (navigationEntry) {
        return (
          navigationEntry.domContentLoadedEventEnd - navigationEntry.fetchStart
        );
      }
      return performance.now();
    });

    expect(
      timeToInteractive,
      "Time to interactive should be reasonable"
    ).toBeLessThan(3000);
  }

  @When("I click on the {string} navigation item")
  async clickNavigationItem(itemName: string) {
    await this.homePage.clickNavigationItem(itemName);
  }

  @Then("I should be redirected to the corresponding page:")
  async checkRedirectionToCorrespondingPage(dataTable: DataTable) {
    const links = dataTable.hashes() as RedirectionTable;
    const expectedPath = links[0]["Expected Path"];

    await expect(this.page).toHaveURL(new RegExp(expectedPath));
  }

  @When("I interact with the {string} button")
  async interactWithCtaButton(buttonText: string) {
    await this.homePage.interactWithButton(buttonText);
  }

  @Then("the result should match {string}")
  async checkCtaInteractionResult(expectedOutcome: string) {
    if (expectedOutcome.startsWith("URL contains")) {
      const expectedPath = expectedOutcome.split("URL contains ")[1].trim();
      await expect(this.page).toHaveURL(new RegExp(expectedPath));
    } else if (expectedOutcome.startsWith("Modal is visible")) {
      const modalLocator = this.page
        .locator('[role="dialog"], .modal-overlay')
        .first();
      await expect(modalLocator).toBeVisible();
    } else {
      await this.assertionHelper.validateBooleanCheck(
        () => this.page.locator(`text=/${expectedOutcome}/i`).isVisible(),
        `Expected result '${expectedOutcome}' is not visible on the page.`
      );
    }
  }

  @When("viewing on {string} with width {string}")
  async setViewingViewport(deviceType: string, widthString: string) {
    const width = parseInt(widthString, 10);
    if (isNaN(width)) {
      throw new Error(`Invalid width value: ${widthString}`);
    }
    await this.homePage.setViewportSize(width);
  }

  @Then("the mobile menu should function appropriately:")
  async checkMobileMenuFunctionality(dataTable: DataTable) {
    const checks = dataTable.hashes() as MobileMenuTable;
    for (const check of checks) {
      const behavior = check["Behavior Check"].toLowerCase().trim();
      const expected = check["Expected Outcome"].toLowerCase().trim();

      const isSatisfied = await this.homePage.checkMobileMenuBehavior(behavior);

      await this.assertionHelper.validateBooleanCheck(
        async () => isSatisfied,
        `Mobile menu behavior check failed: '${behavior}' was not satisfied. Expected: '${expected}'`
      );
    }
  }

  @Then("the page should meet performance standards:")
  async checkPerformanceStandards(dataTable: DataTable) {
    const metrics = dataTable.hashes() as PerformanceTable;
    for (const metric of metrics) {
      const name = metric.Metric;
      const maxValue = parseInt(metric["Max Value (ms)"], 10);
      const actualValue = await this.homePage.getPerformanceMetric(name);

      expect(
        actualValue,
        `${name} should be less than or equal to ${maxValue}ms`
      ).toBeLessThanOrEqual(maxValue);
    }
  }

  @Then("technical requirements should be met:")
  async checkTechnicalRequirements(dataTable: DataTable) {
    const requirements = dataTable.hashes() as TechnicalRequirementsTable;
    for (const req of requirements) {
      if (req["Requirement Name"].toLowerCase().includes("single h1")) {
        const h1Count = await this.page.locator("h1").count();
        expect(
          h1Count,
          "Technical Requirement Failed: Page must have exactly one H1 tag"
        ).toBe(1);
      } else if (
        req["Requirement Name"].toLowerCase().includes("lang attribute")
      ) {
        const lang = await this.page.getAttribute("html", "lang");
        expect(
          lang,
          "Technical Requirement Failed: HTML element must have a 'lang' attribute"
        ).not.toBeNull();
        expect(
          lang?.toLowerCase(),
          "Technical Requirement Failed: 'lang' attribute should be 'en'"
        ).toBe("en");
      }
    }
  }

  @Then("the page metadata should be properly configured:")
  async checkPageMetadata(dataTable: DataTable) {
    const metas = dataTable.hashes() as MetadataTable;
    for (const meta of metas) {
      const metaNameOrProp = meta["Meta Name/Property"];
      const expectedContent = meta["Value Contains"];

      let actualContent: string | null = null;

      if (metaNameOrProp.includes(":")) {
        actualContent = await this.homePage.getPageProperty(metaNameOrProp);
      } else {
        actualContent = await this.homePage.getMetaTagContent(metaNameOrProp);
      }

      expect(
        actualContent,
        `Metadata tag '${metaNameOrProp}' not found or is empty.`
      ).not.toBeNull();

      expect(
        actualContent?.toLowerCase(),
        `Metadata tag '${metaNameOrProp}' content '${actualContent}' does not contain expected value: '${expectedContent}'`
      ).toContain(expectedContent.toLowerCase());
    }
  }
}
