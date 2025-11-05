import { Given, Then, Fixture, When } from "playwright-bdd/decorators";
import { DataTable } from "playwright-bdd";
import { HomePage } from "../../../pages/ui/HomePage";
import { CustomTestArgs } from "../../../fixtures/BddFixtures";
import { AssertionHelper } from "../../../utils/AssertionHelper";
import { Page, expect } from "@playwright/test";
import { MobileMenuTable } from "../../../utils/types/Types";

@Fixture("homePageMobileSteps")
export class HomePageMobileSteps {
  private readonly MOBILE_VIEWPORT = { width: 375, height: 812 };
  private readonly MOBILE_BREAKPOINT = 768;

  constructor(
    private page: Page,
    private homePage: HomePage,
    private sharedContext: CustomTestArgs["sharedContext"],
    private assertionHelper: AssertionHelper
  ) {}

  @Given("I am on the SpaceX HomePage viewed on mobile")
  async openHomePageMobile(): Promise<void> {
    this.sharedContext.startTime = Date.now();
    await this.homePage.openWithMobileViewport(
      this.MOBILE_VIEWPORT.width,
      this.MOBILE_VIEWPORT.height
    );
    await this.page.waitForLoadState("networkidle");
  }

  @Then("the menu should be collapsed on mobile")
  async checkMenuCollapsedOnMobile(): Promise<void> {
    const viewport = this.page.viewportSize();
    if (viewport && viewport.width <= this.MOBILE_BREAKPOINT) {
      const isMenuCollapsed = await this.homePage.header.isMenuCollapsed();
      expect(
        isMenuCollapsed,
        "Menu should be collapsed on mobile"
      ).toBeTruthy();
    }
  }

  @When("viewing on {string} with width {string}")
  async setViewingViewport(
    _deviceType: string,
    widthString: string
  ): Promise<void> {
    const width = parseInt(widthString, 10);
    if (isNaN(width)) {
      throw new Error(`Invalid width value: ${widthString}`);
    }
    await this.homePage.setViewportSize(width);
  }

  @Then("the mobile menu should function appropriately:")
  async checkMobileMenuFunctionality(dataTable: DataTable): Promise<void> {
    const checks = dataTable.hashes() as MobileMenuTable;
    await this.validateMobileMenuBehaviors(checks);
  }

  private async validateMobileMenuBehaviors(
    checks: MobileMenuTable
  ): Promise<void> {
    for (const check of checks) {
      await this.validateSingleMobileMenuBehavior(check);
    }
  }

  private async validateSingleMobileMenuBehavior(
    check: MobileMenuTable[0]
  ): Promise<void> {
    const behavior = check["Behavior Check"].toLowerCase().trim();
    const expected = check["Expected Outcome"].toLowerCase().trim();

    const isSatisfied = await this.homePage.checkMobileMenuBehavior(behavior);

    await this.assertionHelper.validateBooleanCheck(
      async () => isSatisfied,
      `Mobile menu behavior check failed: '${behavior}' was not satisfied. Expected: '${expected}'`
    );
  }
}
