import { Page, expect } from "@playwright/test";
import { Given, When, Then, Fixture } from "playwright-bdd/decorators";
import { DataTable } from "playwright-bdd";
import { HumanSpaceflightPage } from "../../pages/ui/HumanSpaceflightPage";
import { CustomTestArgs } from "../../fixtures/BddFixtures";
import { SharedPageSteps } from "./SharedPageSteps";

@Fixture("humanSpaceflightSteps")
export class HumanSpaceflightSteps {
  constructor(
    private page: Page,
    private humanSpaceflightPage: HumanSpaceflightPage,
    private sharedContext: CustomTestArgs["sharedContext"],
    private sharedPageSteps: SharedPageSteps
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
    await this.humanSpaceflightPage.openWithMobileViewport(375, 812); 
    await this.page.waitForLoadState("networkidle");
  }

  @When("I click on the {string} navigation link")
  async clickNavigationLink(linkText: string) {
    await this.humanSpaceflightPage.header.clickNavigationLink(linkText);
    await this.page.waitForLoadState("domcontentloaded");
  }
  
  // --- Core Content and Load Steps ---

  @Then("the page should load with the following requirements:")
  async checkCoreRequirements(dataTable: DataTable) {
    const requirements = dataTable.hashes();
    
    for (const req of requirements) {
      switch (req.Element) {
        case "Load Time":
          const loadTime = Date.now() - this.sharedContext.startTime;
          // Note: The feature file says "5 seconds" (5000ms)
          const maxTime = parseInt(req.Value.split(" ")[0]) * 1000;
          expect(
            loadTime,
            `Page load time (${loadTime}ms) should be under ${maxTime}ms`
          ).toBeLessThanOrEqual(maxTime);
          break;
        case "Page Title":
          const title = await this.page.title();
          expect(title).toContain(req.Value);
          break;
        case "Hero Title":
          const heroTitle = await this.humanSpaceflightPage.hero.getHeroTitleText();
          expect(heroTitle.toUpperCase()).toBe(req.Value.toUpperCase());
          break;
        case "Subtitle":
          const subtitle = await this.humanSpaceflightPage.hero.getHeroSubtitleText();
          expect(subtitle).toBe(req.Value);
          break;
      }
    }
  }

  @Then('the page should match the snapshot "spaceflight_initial_load"')
  async checkInitialSnapshot() {
    await expect(this.page).toHaveScreenshot("spaceflight_initial_load.png", {
        fullPage: true,
        maxDiffPixelRatio: 0.01 
    });
  }

  // --- Desktop Navigation Steps ---

  @Then("the header navigation should contain:")
  async checkNavigationMenu(dataTable: DataTable) {
    const links = dataTable.hashes();
    
    for (const link of links) {
      const isVisible = await this.humanSpaceflightPage.header.isNavLinkVisible(link["Link Text"]);
      expect(isVisible, `Navigation link "${link["Link Text"]}" should be visible`).toBe(true);
    }
  }
  
  // --- Mobile Navigation Steps (Refactored to match Gherkin) ---

  // IMPLEMENTED: Matches "Then I should see the header with the following elements:"
  @Then("I should see the header with the following elements:")
  async checkHeaderElements(dataTable: DataTable) {
    const elements = dataTable.hashes();
    for (const element of elements) {
        switch (element.Element) {
            case "Logo":
                const isLogoVisible = await this.humanSpaceflightPage.header.isLogoVisible();
                expect(isLogoVisible, "Logo should be visible").toBe(true);
                break;
            case "Hamburger":
                const isHamburgerVisible = await this.humanSpaceflightPage.header.isMobileMenuButtonVisible();
                expect(isHamburgerVisible, "Hamburger button should be visible").toBe(true);
                break;
        }
    }
  }

  // IMPLEMENTED: Matches "When I click hamburger"
  @When("I click hamburger")
  async clickHamburgerMenu() {
    await this.humanSpaceflightPage.header.clickMobileMenuButton();
  }

  // IMPLEMENTED: Matches "Then Menu expands"
  @Then("Menu expands")
  async checkMenuExpands() {
    const isExpanded = await this.humanSpaceflightPage.header.isMobileMenuExpanded();
    expect(isExpanded, "Mobile menu should be expanded/visible").toBe(true);
  }

  // IMPLEMENTED: Matches "When I click close"
  @When("I click close")
  async clickCloseButtonOnMobileMenu() {
    await this.humanSpaceflightPage.header.clickMobileMenuCloseButton();
  }
  
  // IMPLEMENTED: Matches "Then Menu collapses"
  @Then("Menu collapses")
  async checkMenuCollapses() {
    // Checking that the menu is not expanded/visible
    const isExpanded = await this.humanSpaceflightPage.header.isMobileMenuExpanded();
    expect(isExpanded, "Mobile menu should be collapsed/hidden").toBe(false);
  }

  @Then("after the actions are performed:")
  async checkMobileActionVerification(dataTable: DataTable) {
      const actions = dataTable.hashes();
      
      for (const action of actions) {
          switch (action.Action) {
              case "Click hamburger":
                  await this.humanSpaceflightPage.header.clickMobileMenuButton();
                  const isExpanded = await this.humanSpaceflightPage.header.isMobileMenuExpanded();
                  expect(isExpanded, `Action: ${action.Verification}`).toBe(true);
                  break;
              case "View menu items":
                  // Use the links defined in the desktop navigation scenario in the feature file
                  const expectedLinks = [
                    "Vehicles", "Launches", "Human Spaceflight", "Rideshare", "Starlink", "Starshield", "Company"
                  ];
                  const allLinksExist = await this.humanSpaceflightPage.header.checkNavigationLinksExist(expectedLinks);
                  expect(allLinksExist, `Verification: ${action.Verification}`).toBe(true);
                  break;
              case "Click close":
                  await this.humanSpaceflightPage.header.clickMobileMenuCloseButton();
                  const isCollapsed = await this.humanSpaceflightPage.header.isMobileMenuExpanded();
                  expect(isCollapsed, `Action: ${action.Verification}`).toBe(false);
                  break;
              default:
                  throw new Error(`Unknown action type: ${action.Action}`);
          }
      }
  }


  // IMPLEMENTED: Matches "Then the mobile navigation should be fully functional"
  @Then("the mobile navigation should be fully functional")
  async checkMobileNavigationFunctionality() {
    // 1. Click and open
    await this.humanSpaceflightPage.header.clickMobileMenuButton(); 
    expect(await this.humanSpaceflightPage.header.isMobileMenuExpanded(), "Mobile menu should open").toBe(true);
    
    // 2. Check a critical link is clickable and navigates
    const linkText = "Starlink"; 
    await this.humanSpaceflightPage.header.clickNavigationLink(linkText);
    expect(this.page.url()).toContain("/starlink");
    
    // 3. Return to Human Spaceflight page to complete the test cleanly
    await this.humanSpaceflightPage.open("/human-spaceflight");
    await this.page.waitForLoadState("networkidle");
    
    // 4. Check closing (final state check)
    await this.humanSpaceflightPage.header.clickMobileMenuButton(); // Open again
    await this.humanSpaceflightPage.header.clickMobileMenuCloseButton();
    const isCollapsed = await this.humanSpaceflightPage.header.isMobileMenuExpanded();
    expect(isCollapsed, "Mobile menu should close after use").toBe(false);
  }
  
  // --- Hero Section Interaction Steps ---

  @When("I see the scroll-down arrow animation")
  async checkScrollDownArrowVisible() {
    const isVisible = await this.humanSpaceflightPage.hero.isScrollDownArrowVisible();
    expect(isVisible, "Scroll-down arrow should be visible").toBe(true);
  }

  @When("I click on the arrow")
  async clickScrollDownArrow() {
    await this.humanSpaceflightPage.hero.clickScrollDownArrow();
    await this.page.waitForTimeout(500); 
  }

  @Then("the page should smoothly scroll to the Media Carousel section")
  async checkPageScrollsToMediaCarousel() {
    const isVisible = await this.humanSpaceflightPage.mediaCarousel.isSectionInViewport(); 
    expect(isVisible, "Media Carousel section should be in the viewport after scroll").toBe(true);
  }
  
  @Then("the page should meet the following metrics:")
  async checkPerformanceMetrics(dataTable: DataTable) {
    const metrics = dataTable.hashes();

    for (const metric of metrics) {
      switch (metric.Metric) {
        case "Largest Contentful Paint":
          const lcp = await this.humanSpaceflightPage.performanceSEO.getLargestContentfulPaint();
          const maxLCP = parseInt(metric.Requirement.split(" ")[0]);
          expect(lcp, `LCP (${lcp}ms) should be under ${maxLCP}ms`).toBeLessThan(maxLCP);
          break;

        case "First Input Delay":
          const fid = await this.humanSpaceflightPage.performanceSEO.getFirstInputDelay();
          const maxFID = parseInt(metric.Requirement.split(" ")[0]);
          expect(fid, `FID (${fid}ms) should be under ${maxFID}ms`).toBeLessThan(maxFID);
          break;

        case "Console Errors":
          const errors = await this.humanSpaceflightPage.performanceSEO.getConsoleErrors();
          expect(errors, "Console should have no errors").toEqual([]);
          break;
          
        case "Image Loading":
          const has404s = await this.humanSpaceflightPage.performanceSEO.checkImageLoading404s();
          expect(has404s, "No image 404 errors should be present").toBe(false);
          break;
      }
    }
  }

  @Then("the page should have the following metadata:")
  async checkMetadata(dataTable: DataTable) {
    const metadata = dataTable.hashes();

    for (const item of metadata) {
      switch (item.Element) {
        case "Viewport":
          const viewportContent = await this.humanSpaceflightPage.getMetaTagContent('name="viewport"');
          expect(viewportContent).toContain("width=device-width");
          expect(viewportContent).toContain("initial-scale=1");
          break;
          
        case "Description":
          const descContent = await this.humanSpaceflightPage.getMetaTagContent('name="description"');
          expect(descContent).toContain(item.Content);
          break;
          
        case "Keywords":
          const keywordContent = await this.humanSpaceflightPage.getMetaTagContent('name="keywords"');
          const expectedKeywords = item.Content.split(",").map(k => k.trim().toLowerCase());
          const hasKeyword = expectedKeywords.some(k => keywordContent?.toLowerCase().includes(k));
          expect(hasKeyword, `Keywords meta tag should contain one of: ${item.Content}`).toBe(true);
          break;

        case "Open Graph":
          const ogTitle = await this.humanSpaceflightPage.getMetaTagContent('property="og:title"');
          // Expecting the content to contain the value after "Title:"
          expect(ogTitle).toContain(item.Content.split(":")[1].trim());
          break;
      }
    }
  }

  @Then("all metadata should be properly formatted for search engines")
  async checkMetadataFormatting() {
    const canonical = await this.page.getAttribute('link[rel="canonical"]', 'href');
    expect(canonical, "Canonical URL should be present").not.toBeNull();
    
    const htmlLang = await this.page.getAttribute('html', 'lang');
    expect(htmlLang, "HTML language attribute should be set").not.toBeNull();
  }
}