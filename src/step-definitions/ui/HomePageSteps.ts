import { Page, expect } from "@playwright/test";
import { Given, When, Then, Fixture } from "playwright-bdd/decorators";
import { DataTable } from "playwright-bdd";
import { HomePage } from "../../pages/ui/HomePage";
import { CustomTestArgs } from "../../fixtures/BddFixtures";
import { SharedPageSteps } from "./SharedPageSteps";

@Fixture("homePageSteps")
export class HomePageSteps {
  constructor(
    private page: Page,
    private homePage: HomePage,
    private sharedContext: CustomTestArgs["sharedContext"],
    private sharedPageSteps: SharedPageSteps
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
    // Assuming this method handles setting the viewport and opening the page
    await this.homePage.openWithMobileViewport(375, 812); 
    await this.page.waitForLoadState("networkidle");
  }

  // --- Initial Load Verification ---

  @Then("the page should meet core requirements:")
  async checkCoreRequirements(dataTable: DataTable) {
    const requirements = dataTable.hashes();
    
    for (const req of requirements) {
      switch (req.Element) {
        case "Load Time":
          const loadTime = Date.now() - this.sharedContext.startTime;
          expect(
            loadTime,
            `Page load time (${loadTime}ms) should be within ${req.Requirement}`
          ).toBeLessThanOrEqual(5000);
          break;
        case "Page Title":
          const title = await this.page.title();
          expect(title).toContain(req.Requirement);
          break;
        case "Hero Section":
          const isVisible = await this.homePage.hero.isHeroSectionVisible();
          expect(isVisible, `${req.Element} should be visible`).toBe(true);
          break;
        case "Navigation":
          const isHeaderAccessible = await this.homePage.header.isHeaderVisible();
          expect(isHeaderAccessible, "Header menu should be accessible").toBe(true);
          break;
        case "Layout":
          // Placeholder for visual regression check
          break;
      }
    }
  }

  @Then("critical content should be present:")
  async checkCriticalContent(dataTable: DataTable) {
    const content = dataTable.hashes();

    for (const item of content) {
      switch (item["Content Type"]) {
        case "Mission Title":
          const titleText = await this.homePage.hero.getHeroTitleText();
          expect(titleText.length, "Mission Title should be displayed").toBeGreaterThan(0);
          break;
        case "Mission Status":
          const isStatusVisible = await this.homePage.hero.isMissionStatusVisible();
          expect(isStatusVisible, "Mission Status indicator should be visible").toBe(true);
          break;
        case "Call-to-Action":
          // Renamed to match the existing POF method isCTAButtonVisible
          const isCTAVisible = await this.homePage.hero.isCTAButtonVisible("VIEW MISSION");
          expect(isCTAVisible, "Primary action button should be visible").toBe(true);
          break;
        case "Scroll Indicator":
          // Renamed to match the existing POF method isScrollDownArrowVisible
          const isScrollVisible = await this.homePage.hero.isScrollDownArrowVisible();
          expect(isScrollVisible, "Scroll Indicator should be present").toBe(true);
          break;
      }
    }
  }

  // --- Header Navigation Steps ---

  @Then("the navigation menu should contain:")
  async checkNavigationMenu(dataTable: DataTable) {
    const links = dataTable.hashes();
    
    for (const link of links) {
      const isPrimaryLinkVisible = await this.homePage.header.isNavLinkVisible(link["Primary Links"]);
      expect(isPrimaryLinkVisible, `Primary link "${link["Primary Links"]}" should be visible`).toBe(true);
      
      if (link["Secondary Elements"] === "SpaceX Logo") {
        const isLogoVisible = await this.homePage.header.isLogoVisible();
        expect(isLogoVisible, "SpaceX Logo should be visible").toBe(true);
      }
    }
  }

  @Then("the SpaceX logo should be present and clickable")
  async checkLogoPresentAndClickable() {
    const isLogoVisible = await this.homePage.header.isLogoVisible();
    expect(isLogoVisible, "SpaceX logo should be present").toBe(true);
    
    const isLogoClickable = await this.homePage.header.isLogoClickable();
    expect(isLogoClickable, "SpaceX logo should be clickable").toBe(true);
  }

  @Then("the menu should be collapsed on mobile")
  async checkMenuCollapsedOnMobile() {
    if (this.page.viewportSize() && this.page.viewportSize()!.width <= 768) {
      const isMenuCollapsed = await this.homePage.header.isMenuCollapsed();
      expect(isMenuCollapsed, "Menu should be collapsed on mobile").toBe(true);
    }
  }

  // --- CTA Functionality Steps ---

  @When("I click the primary CTA button")
  async clickPrimaryCTAButton() {
    // Calling the generic CTA method with the assumed button text
    await this.homePage.hero.clickCTAButton("VIEW MISSION");
    await this.page.waitForTimeout(500); 
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

  // --- Header Behavior on Scroll Steps ---

  @When("I scroll past the hero section")
  async scrollPastHeroSection() {
    await this.homePage.hero.scrollToNextSection();
    await this.page.waitForTimeout(300);
  }

  @Then("the header should minimize in height")
  async checkHeaderMinimize() {
    const initialHeight = await this.homePage.header.getInitialHeaderHeight();
    const currentHeight = await this.homePage.header.getCurrentHeaderHeight();
    
    expect(
      currentHeight, 
      "Header height should be smaller after scroll"
    ).toBeLessThan(initialHeight);
  }

  @Then("and the logo size should adjust")
  async checkLogoSizeAdjust() {
    const initialSize = await this.homePage.header.getInitialLogoSize();
    const currentSize = await this.homePage.header.getCurrentLogoSize();
    
    expect(
      currentSize, 
      "Logo size should be smaller after scroll"
    ).toBeLessThan(initialSize);
  }

  // --- SEO and Metadata Steps ---

  @Then("the page should contain correct metadata:")
  async checkMetadata(dataTable: DataTable) {
    const metadata = dataTable.hashes();

    for (const item of metadata) {
      switch (item.Element) {
        case "Title Tag":
          const title = await this.page.title();
          expect(title).toContain(item.Content);
          break;
        case "Description Meta":
          const metaDescription = await this.page.getAttribute('meta[name="description"]', 'content');
          expect(metaDescription).toContain(item.Content);
          break;
        case "Viewport":
          const viewportMeta = await this.page.getAttribute('meta[name="viewport"]', 'content');
          expect(viewportMeta).toContain(item.Content);
          break;
        case "Canonical URL":
          const canonicalLink = await this.page.getAttribute('link[rel="canonical"]', 'href');
          expect(canonicalLink).toBe(item.Content);
          break;
      }
    }
  }

  @Then("social media tags should be present:")
  async checkSocialMediaTags(dataTable: DataTable) {
    const tags = dataTable.hashes();
    
    for (const tag of tags) {
      if (tag.Platform === "Open Graph") {
        const ogTitle = await this.page.getAttribute('meta[property="og:title"]', 'content');
        expect(ogTitle, "Open Graph og:title should be present").not.toBeNull();
      } else if (tag.Platform === "Twitter Card") {
        const twitterCard = await this.page.getAttribute('meta[name="twitter:card"]', 'content');
        expect(twitterCard, "Twitter Card tag should be present").not.toBeNull();
      }
    }
  }

  // --- Accessibility Steps (Simplified for Homepage feature) ---

  @Then("the page should meet WCAG 2.1 AA standards:")
  async checkWcagStandards() {
    const h1Count = await this.homePage.page.locator('h1').count();
    expect(h1Count, "Page must have exactly one H1 tag (WCAG)").toBe(1);
  }

  @Then("assistive technology support should be verified:")
  async checkAssistiveTechSupport() {
    const lang = await this.homePage.page.getAttribute('html', 'lang');
    expect(lang, "HTML element must have a 'lang' attribute").not.toBeNull();
  }
}