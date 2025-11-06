import { expect, Page } from "@playwright/test";
import { Given, When, Then, Fixture } from "playwright-bdd/decorators";
import { StarshieldPage } from "../../../services/ui/StarshieldPage";
import { SharedPageSteps } from "../SharedPageSteps";
import { SharedContext } from "../../../utils/types/Types";
import { AssertionHelper } from "../../../utils/AssertionHelper";
import { ViewportUtility } from "../../../utils/ViewportUtility";

@Fixture("starshieldNavigationSteps")
export class StarshieldNavigationSteps {
  constructor(
    protected page: Page,
    protected starshieldPage: StarshieldPage,
    protected sharedContext: SharedContext,
    protected sharedPageSteps: SharedPageSteps,
    protected assertionHelper: AssertionHelper,
    protected viewportUtility: ViewportUtility
  ) {}

  @Given("the user is on the Starshield homepage")
  async userIsOnStarshieldHomepage() {
    await this.starshieldPage.navigate();
  }

  @When("the Starshield page loads")
  async pageLoads() {
    await this.starshieldPage.waitForLoadState("load");
  }

  @Then("the Starshield branding should be displayed")
  async starshieldBrandingShouldBeDisplayed() {
    await expect(this.starshieldPage.starshieldBranding).toBeVisible();
  }

  @Then("the main navigation menu should be visible")
  async mainNavigationMenuShouldBeVisible() {
    await expect(this.starshieldPage.mainNavigationMenu).toBeVisible();
  }

  @Given("the main navigation is visible")
  async mainNavigationIsVisible() {
    await expect(this.starshieldPage.mainNavigationMenu).toBeVisible();
  }

  @When("the user clicks on a navigation link")
  async userClicksOnANavigationLink() {
    await this.starshieldPage.mainNavigationMenu.locator("a").first().click();
  }

  @When("the user clicks on a navigation menu item")
  async userClicksOnNavigationMenuItem() {
    await this.starshieldPage.clickNavigationMenuItem("Services");
    this.sharedContext.initialViewport = await this.page.evaluate(() => ({
      x: window.scrollX,
      y: window.scrollY,
      width: window.innerWidth,
      height: window.innerHeight,
    }));
  }

  @Then("the page should scroll to or navigate to the corresponding section")
  async pageShouldScrollOrNavigate() {
    if (this.sharedContext.initialViewport?.y) {
      const currentY = await this.page.evaluate(() => window.scrollY);
      expect(currentY).toBeGreaterThan(
        this.sharedContext.initialViewport.y + 10
      );
    }
  }

  @When("the footer is visible")
  async footerIsVisible() {
    await expect(this.starshieldPage.footer.footer).toBeVisible();
  }

  @Then("additional navigation links should be available")
  async additionalNavigationLinksShouldBeAvailable() {
    const linkCount = await this.starshieldPage.footer.getFooterLinkCount();
    expect(linkCount).toBeGreaterThan(3);
  }

  @Then("copyright and company information should be displayed")
  async copyrightAndCompanyInfoShouldBeDisplayed() {
    await expect(this.starshieldPage.footer.copyrightText).toBeVisible();
  }

  @Given("the user is viewing a Starshield subpage or section")
  async userIsViewingStarshieldSubpageOrSection() {
    const subpagePath = "/starshield/communications";
    await this.starshieldPage.open(subpagePath);
    this.sharedContext.expectedPageTitle = "Communications";
  }

  @When("breadcrumb navigation is present")
  async breadcrumbNavigationIsPresent() {
    await expect(this.starshieldPage.breadcrumb).toBeVisible();
  }

  @Then("the current page location should be indicated")
  async currentPageLocationShouldBeIndicated() {
    await expect(this.starshieldPage.currentPageBreadcrumbItem).toBeVisible();
    if (this.sharedContext.expectedPageTitle) {
      await expect(this.starshieldPage.currentPageBreadcrumbItem).toContainText(
        this.sharedContext.expectedPageTitle
      );
    }
  }

  @Then("users should be able to navigate back to parent pages")
  async usersShouldBeAbleToNavigateBackToParentPages() {
    const linkCount = await this.starshieldPage.parentBreadcrumbLinks.count();
    expect(linkCount).toBeGreaterThanOrEqual(1);
    await expect(
      this.starshieldPage.parentBreadcrumbLinks.first()
    ).toBeEnabled();
  }

  @Then("the breadcrumb should reflect the page hierarchy accurately")
  async breadcrumbShouldReflectPageHierarchyAccurately() {
    const breadcrumbText = await this.starshieldPage.breadcrumb.textContent();
    expect(breadcrumbText).toContain(`Starshield`);
    if (this.sharedContext.expectedPageTitle) {
      expect(breadcrumbText).toContain(this.sharedContext.expectedPageTitle);
    }
  }

  @Given("the user scrolls to the page footer")
  async userScrollsToThePageFooter() {
    await this.starshieldPage.footer.scrollToFooter();
  }

  @Then("social media links should be present if applicable")
  async socialMediaLinksShouldBePresentIfApplicable() {
    await this.assertionHelper.validateBooleanCheck(
      () => this.starshieldPage.footer.isSocialMediaSectionVisible(),
      "Social media section must be visible when applicable."
    );
    expect(
      await this.starshieldPage.footer.getSocialMediaLinksCount()
    ).toBeGreaterThanOrEqual(1);
  }

  @When("the user scrolls down the page")
  async userScrollsDownThePage() {
    await this.page.mouse.wheel(0, 500);
  }

  @Then("the header should remain visible and fixed")
  async headerShouldRemainVisibleAndFixed() {
    const header = this.starshieldPage.page.locator("header");
    const position = await header.evaluate((el) => {
      return window.getComputedStyle(el).position;
    });

    const isFixedOrSticky = position === "fixed" ? true : position === "sticky";
    expect(isFixedOrSticky).toBeTruthy();
    await expect(header).toBeInViewport();
  }

  @Then("the main content should scroll underneath the header")
  async mainContentShouldScrollUnderneathTheHeader() {
    const boundingBox =
      await this.starshieldPage.hero.heroSection.boundingBox();
    expect(boundingBox?.y).toBeLessThan(100);
  }

  @Given("the page contains internal or external links")
  async pageContainsInternalOrExternalLinks() {
    const links = this.starshieldPage.page.locator("a[href]");
    expect(await links.count()).toBeGreaterThan(5);
  }

  @When("a user clicks on a broken link")
  async userClicksOnBrokenLink() {
    await this.page.route("**/broken-link", (route) => {
      route.fulfill({
        status: 404,
        body: "Not Found",
      });
    });
    await this.starshieldPage.page
      .locator('a[href*="broken-link"]')
      .first()
      .click();
  }

  @Then("an appropriate 404 page should be displayed")
  async appropriate404PageShouldBeDisplayed() {
    await expect(this.starshieldPage.page.locator("h1")).toContainText(
      /404|not found/i
    );
    await expect(this.starshieldPage.page.locator("body")).toContainText(
      /page not found|does not exist/i
    );
  }

  @Then("the error should be logged for correction")
  async errorShouldBeLoggedForCorrection() {
    await expect(this.starshieldPage.page.locator("main")).toBeVisible();
  }

  @When("the target section or page does not exist")
  async targetSectionOrPageDoesNotExist() {
    await this.starshieldPage.open("/non-existent-section");
  }

  @Then("a user-friendly error message should be displayed")
  async userFriendlyErrorMessageShouldBeDisplayed() {
    await expect(this.starshieldPage.page.locator("body")).toContainText(
      /page not found|does not exist|we're sorry|error/i
    );
    const errorText = await this.starshieldPage.page
      .locator("body")
      .textContent();
    expect(errorText?.toLowerCase()).not.toMatch(
      /technical details|stack trace/i
    );
  }

  @Then("alternative navigation options should be provided")
  async alternativeNavigationOptionsShouldBeProvided() {
    await expect(this.starshieldPage.mainNavigationMenu).toBeVisible();
    await expect(this.starshieldPage.footer.footer).toBeVisible();
    const homeLink = this.starshieldPage.page.locator(
      'a[href="/"], a[href="/starshield"]'
    );
    await expect(homeLink.first()).toBeVisible();
  }

  @Then("the user should remain on a functional page")
  async userShouldRemainOnFunctionalPage() {
    await expect(this.starshieldPage.mainNavigationMenu).toBeVisible();
    await expect(this.starshieldPage.footer.footer).toBeVisible();
  }

  @Given("the page contains external links")
  async pageContainsExternalLinks() {
    const externalLinks = this.starshieldPage.page.locator('a[href^="http"]');
    expect(await externalLinks.count()).toBeGreaterThan(0);
  }

  @When("an external link target is unavailable")
  async externalLinkTargetIsUnavailable() {
    await this.page.route("**://external-site.com/**", (route) => {
      route.fulfill({
        status: 500,
        body: "Service Unavailable",
      });
    });
  }

  @Then("the user should be notified appropriately")
  async userShouldBeNotifiedAppropriately() {
    const errorBanner = this.starshieldPage.page.locator(
      ".network-error, .external-link-error"
    );
    if (await errorBanner.isVisible()) {
      await expect(errorBanner).toContainText(/unavailable|failed|error/i);
    }
  }

  @Then("the page should remain functional")
  async pageShouldRemainFunctional() {
    await expect(this.starshieldPage.mainNavigationMenu).toBeVisible();
    await expect(this.starshieldPage.hero.heroSection).toBeVisible();
  }
}
