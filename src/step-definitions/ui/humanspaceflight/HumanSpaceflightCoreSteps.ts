import { Page, expect } from "@playwright/test";
import { Given, When, Then, Fixture } from "playwright-bdd/decorators";
import { DataTable } from "playwright-bdd";
import { HumanSpaceflightPage } from "../../../services/ui/HumanSpaceflightPage";
import { CustomTestArgs } from "../../../fixtures/BddFixtures";
import { AssertionHelper } from "../../../utils/AssertionHelper";
import { parseCoreValues } from "../../../utils/types/TypeGuards";
import { CoreValue, CoreRequirementStrategy } from "../../../utils/types/Types";

@Fixture("humanSpaceflightCoreSteps")
export class HumanSpaceflightCoreSteps {
  constructor(
    private page: Page,
    private humanSpaceflightPage: HumanSpaceflightPage,
    private sharedContext: CustomTestArgs["sharedContext"],
    private assertionHelper: AssertionHelper
  ) {}

  @Given("I am on the SpaceX Human Spaceflight page")
  async openHumanSpaceflightPage() {
    this.sharedContext.startTime = Date.now();
    await this.humanSpaceflightPage.navigate();
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
    await this.validateCoreRequirements(requirements);
  }

  private async validateCoreRequirements(
    requirements: CoreValue[]
  ): Promise<void> {
    for (const requirement of requirements) {
      await this.validateCoreRequirement(requirement);
    }
  }

  private async validateCoreRequirement(requirement: CoreValue): Promise<void> {
    const strategy = this.getCoreRequirementStrategy(requirement.Element);
    if (strategy) {
      await strategy.validate(requirement);
    } else {
      console.warn(`Unknown core requirement element: ${requirement.Element}`);
    }
  }

  private getCoreRequirementStrategy(
    element: string
  ): CoreRequirementStrategy | undefined {
    const strategies = new Map([
      [
        "Load Time",
        { validate: (req: CoreValue) => this.validateLoadTime(req.Value) },
      ],
      [
        "Page Title",
        { validate: (req: CoreValue) => this.validatePageTitle(req.Value) },
      ],
      [
        "Hero Title",
        { validate: (req: CoreValue) => this.validateHeroTitle(req.Value) },
      ],
      [
        "Subtitle",
        { validate: (req: CoreValue) => this.validateHeroSubtitle(req.Value) },
      ],
    ]);
    return strategies.get(element);
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
    await this.assertionHelper.validateBooleanCheck(
      () => this.humanSpaceflightPage.verifyPageTitle(expectedContent),
      `Page title should contain "${expectedContent}"`
    );
  }

  private async validateHeroTitle(expectedValue: string): Promise<void> {
    const heroTitle = await this.humanSpaceflightPage.hero.getHeroTitleText();
    expect(heroTitle.toUpperCase()).toBe(expectedValue.toUpperCase());
  }

  private async validateHeroSubtitle(expectedValue: string): Promise<void> {
    const subtitle = await this.humanSpaceflightPage.hero.getHeroSubtitleText();
    expect(subtitle).toBe(expectedValue);
  }

  @Then("I should be navigated to the correct page")
  async checkNavigationToCorrectPage() {
    await this.page.waitForLoadState("domcontentloaded");

    const isErrorPage = await this.page.evaluate(() => {
      return (
        document.title.toLowerCase().includes("error") ||
        document.title.toLowerCase().includes("404") ||
        document.body.textContent?.toLowerCase().includes("page not found")
      );
    });

    expect(isErrorPage, "Should not be on an error page").toBeFalsy();

    const pageTitle = await this.page.title();
    expect(pageTitle, "Page should have a title").toBeTruthy();
    expect(
      pageTitle.toLowerCase(),
      "Page title should not contain 'error'"
    ).not.toContain("error");
  }
}
