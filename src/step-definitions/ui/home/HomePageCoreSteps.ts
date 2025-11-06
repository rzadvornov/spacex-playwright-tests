import { Page, expect } from "@playwright/test";
import { Given, When, Then, Fixture } from "playwright-bdd/decorators";
import { DataTable } from "playwright-bdd";
import { HomePage } from "../../../services/ui/HomePage";
import { CustomTestArgs } from "../../../fixtures/BddFixtures";
import { AssertionHelper } from "../../../utils/AssertionHelper";
import {
  parseCoreRequirements,
  parseCriticalContent,
} from "../../../utils/types/TypeGuards";
import { CoreRequirement, CriticalContent } from "../../../utils/types/Types";
import { CoreRequirementStrategyManager } from "../../../utils/strategies/CoreRequirementStrategyManager";
import { CriticalContentStrategyManager } from "../../../utils/strategies/CriticalContentStrategyManager";

@Fixture("homePageCoreSteps")
export class HomePageCoreSteps {
  private readonly MAX_LOAD_TIME = 5000;
  private readonly SCROLL_DELAY = 300;
  private readonly CTA_CLICK_DELAY = 500;

  private coreRequirementManager: CoreRequirementStrategyManager;
  private criticalContentManager: CriticalContentStrategyManager;

  constructor(
    private page: Page,
    private homePage: HomePage,
    private sharedContext: CustomTestArgs["sharedContext"],
    private assertionHelper: AssertionHelper
  ) {
    this.coreRequirementManager = new CoreRequirementStrategyManager();
    this.criticalContentManager = new CriticalContentStrategyManager();
  }

  @Given("I am on the SpaceX HomePage")
  async openHomePage(): Promise<void> {
    this.sharedContext.startTime = Date.now();
    await this.homePage.navigate();
  }

  @Then("the page should meet core requirements:")
  async checkCoreRequirements(dataTable: DataTable): Promise<void> {
    const requirements = parseCoreRequirements(dataTable.hashes());
    await this.validateCoreRequirements(requirements);
  }

  private async validateCoreRequirements(
    requirements: CoreRequirement[]
  ): Promise<void> {
    for (const requirement of requirements) {
      await this.validateSingleCoreRequirement(requirement);
    }
  }

  private async validateSingleCoreRequirement(
    requirement: CoreRequirement
  ): Promise<void> {
    const strategy = this.coreRequirementManager.getStrategy(
      requirement.Element
    );

    if (strategy) {
      await strategy.validate(requirement, this);
    } else {
      console.warn(`Unknown core requirement element: ${requirement.Element}`);
    }
  }

  async validateLoadTime(requirement: string): Promise<void> {
    const loadTime = Date.now() - this.sharedContext.startTime;
    expect(
      loadTime,
      `Page load time (${loadTime}ms) should be within ${requirement}`
    ).toBeLessThanOrEqual(this.MAX_LOAD_TIME);
  }

  async validatePageTitle(expectedContent: string): Promise<void> {
    await this.assertionHelper.validateBooleanCheck(
      () => this.homePage.verifyPageTitle(expectedContent),
      `Page title should contain "${expectedContent}"`
    );
  }

  async validateHeroSectionVisibility(): Promise<void> {
    const isVisible = await this.homePage.hero.isHeroSectionVisible();
    expect(isVisible, "Hero section should be visible").toBeTruthy();
  }

  async validateHeaderAccessibility(): Promise<void> {
    const isHeaderAccessible = await this.homePage.header.isHeaderVisible();
    expect(isHeaderAccessible, "Header menu should be accessible").toBeTruthy();
  }

  @Then("critical content should be present:")
  async checkCriticalContent(dataTable: DataTable): Promise<void> {
    const content = parseCriticalContent(dataTable.hashes());
    await this.validateCriticalContentItems(content);
  }

  private async validateCriticalContentItems(
    content: CriticalContent[]
  ): Promise<void> {
    for (const item of content) {
      await this.validateSingleCriticalContent(item);
    }
  }

  private async validateSingleCriticalContent(
    item: CriticalContent
  ): Promise<void> {
    const strategy = this.criticalContentManager.getStrategy(
      item["Content Type"]
    );

    if (strategy) {
      await strategy.validate(item, this);
    } else {
      console.warn(`Unknown critical content type: ${item["Content Type"]}`);
    }
  }

  async validateMissionTitle(): Promise<void> {
    const titleText = await this.homePage.hero.getHeroTitleText();
    expect(
      titleText.length,
      "Mission Title should be displayed"
    ).toBeGreaterThan(0);
  }

  async validateMissionStatus(): Promise<void> {
    const isStatusVisible = await this.homePage.hero.isMissionStatusVisible();
    expect(
      isStatusVisible,
      "Mission Status indicator should be visible"
    ).toBeTruthy();
  }

  async validateCallToAction(): Promise<void> {
    const isCTAVisible = await this.homePage.hero.isCTAButtonVisible(
      "VIEW MISSION"
    );
    expect(
      isCTAVisible,
      "Primary action button should be visible"
    ).toBeTruthy();
  }

  async validateScrollIndicator(): Promise<void> {
    const isScrollVisible = await this.homePage.hero.isScrollDownArrowVisible();
    expect(isScrollVisible, "Scroll Indicator should be present").toBeTruthy();
  }

  @When("I click the primary CTA button")
  async clickPrimaryCTAButton(): Promise<void> {
    await this.homePage.hero.clickCTAButton("VIEW MISSION");
    await this.page.waitForTimeout(this.CTA_CLICK_DELAY);
  }

  @Then("the page should scroll to the next content section")
  async checkScrollToNextSection(): Promise<void> {
    const isScrolled = await this.homePage.hero.isPageScrolledPastHero();
    expect(isScrolled, "Page should scroll past the Hero section").toBeTruthy();
  }

  @Then("the URL should remain on the Homepage")
  async checkUrlRemainsHomepage(): Promise<void> {
    const currentUrl = new URL(this.page.url());
    expect(currentUrl.pathname, "URL path should remain '/'").toBe("/");
  }

  @When("I scroll past the hero section")
  async scrollPastHeroSection(): Promise<void> {
    await this.homePage.hero.scrollToNextSection();
    await this.page.waitForTimeout(this.SCROLL_DELAY);
  }
}
