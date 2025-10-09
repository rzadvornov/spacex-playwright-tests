import { Page, expect } from "@playwright/test";
import { Given, When, Then, Fixture } from "playwright-bdd/decorators";
import { DataTable } from "playwright-bdd";
import { CustomTestArgs } from "../fixtures/BddFixtures";

@Fixture("homePageSteps")
export class HomePageSteps {
  constructor(
    private page: Page,
    private homePage: CustomTestArgs["homePage"],
    private sharedContext: CustomTestArgs["sharedContext"]
  ) {}

  @Given("I am on the SpaceX homepage")
  async openHomePage() {
    this.sharedContext.startTime = Date.now();
    await this.homePage.open();
    await this.page.waitForLoadState("networkidle");
  }

  @When("I click on the navigation menu")
  async clickNavigationMenu() {
    await this.homePage.openNavigationMenu();
  }

  @Then("I should see the main navigation links:")
  async checkNavigationLinksVisibility(dataTable: DataTable) {
    const expectedMenuItems = dataTable.raw().slice(1).flat();
    const allItemsExist = await this.homePage.checkMenuItemsExist(
      expectedMenuItems
    );
    expect(allItemsExist, "Main navigation links should be present").toBe(true);
  }

  @Then("the page should match the snapshot {string}")
  async checkPageSnapshot(snapshotName: string) {
    await expect(
      this.page,
      `Screenshots should match for the snapshot ${snapshotName}`
    ).toHaveScreenshot(snapshotName, {
      maxDiffPixelRatio: 0.01,
    });
  }

  @Then("the page should load within {int} seconds")
  async checkPageLoadTime(maxSeconds: number) {
    const loadTime = Date.now() - this.sharedContext.startTime;
    expect(
      loadTime,
      `Page load time should not exceed ${maxSeconds} seconds`
    ).toBeLessThan(maxSeconds * 1000);
  }

  @Then("the page title should be {string}")
  async checkPageTitle(title: string) {
    await expect(this.page, `Page title should be ${title}`).toHaveTitle(
      new RegExp(title, "i")
    );
  }

  @Then("the main header navigation menu \\(desktop view) should be visible")
  async checkNavigationMenu() {
    const isVisible = await this.homePage.isNavigationVisible();
    expect(isVisible, "Main header navigation menu should be visible").toBe(
      true
    );
  }

  @Then("clicking a main navigation link should navigate to the correct URL")
  async checkNavigationLinks() {
    const navigationWorks = await this.homePage.testNavigationLinks();
    expect(navigationWorks, "Navigation links should be working").toBe(true);
  }

  @Then("the Largest Contentful Paint should be less than {int} ms")
  async checkLCP(maxLCP: number) {
    const performanceMetrics = await this.homePage.getPerformanceMetrics();
    if (performanceMetrics.lcp) {
      expect(
        performanceMetrics.lcp,
        `Largest Contentful Paint should be less than ${maxLCP} ms`
      ).toBeLessThan(maxLCP);
    }
  }

  @Then("the First Input Delay should be less than {int} ms")
  async checkFID(maxFID: number) {
    const performanceMetrics = await this.homePage.getPerformanceMetrics();
    // FID might not be captured if no user interaction occurred
    if (performanceMetrics.fid !== undefined) {
      expect(
        performanceMetrics.fid,
        `First Input Delay should be less than ${maxFID} ms`
      ).toBeLessThan(maxFID);
    }
  }

  @Then("the viewport meta tag should be configured for responsiveness")
  async checkViewPortMetaTag() {
    const isConfigured = await this.homePage.isViewportMetaConfigured();
    expect(
      isConfigured,
      "Viewport meta tag should be configured for responsiveness"
    ).toBe(true);
  }

  @Then("the page description meta tag should contain the text {string}")
  async checkMetaTagDescription(description: string) {
    const metaDescription = await this.homePage.getMetaDescription();
    expect(
      metaDescription,
      `page description meta tag should contain the text ${description}`
    ).toContain(description);
  }

  @Then("the Open Graph title should be {string}")
  async checkOpenGraphTitle(title: string) {
    const ogTitle = await this.homePage.getOGTitle();
    expect(ogTitle, `Open Graph title should be ${title}`).toBe(title);
  }

  @Then("the following footer links should be visible:")
  async checkFooterVisibility(dataTable: DataTable) {
    const expectedLinks = dataTable.raw().slice(1).flat();
    let allLinksVisible = true;

    for (const linkText of expectedLinks) {
      const isVisible = await this.homePage.isFooterTextVisible(linkText);
      if (!isVisible) {
        console.error(`Footer link "${linkText}" is not visible.`);
        allLinksVisible = false;
      }
    }
    expect(allLinksVisible, "Footer links should be visible").toBe(true);
  }

  @Then(
    "the social media links \\(e.g., Twitter\\/X) should be present and functional"
  )
  async checkSocialMediaLinks() {
    const areFunctional = await this.homePage.areSocialLinksPresent();
    expect(
      areFunctional,
      "The social media button links should be working"
    ).toBe(true);
  }

  @Then(
    "the {string} section in the footer should be visible at the bottom of the page"
  )
  async checkPageFooterSections(sectionName: string) {
    const isVisible = await this.homePage.isFooterSectionVisible(sectionName);
    expect(
      isVisible,
      `the ${sectionName} section in the footer should be visible`
    ).toBe(true);
  }
}
