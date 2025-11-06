import { Page, expect } from "@playwright/test";
import { Given, When, Then, Fixture } from "playwright-bdd/decorators";
import { DataTable } from "playwright-bdd";
import { HumanSpaceflightPage } from "../../../services/ui/HumanSpaceflightPage";
import { CustomTestArgs } from "../../../fixtures/BddFixtures";
import { MobileAction, MobileActionStrategy } from "../../../utils/types/Types";
import { parseMobileActions } from "../../../utils/types/TypeGuards";

@Fixture("humanSpaceflightMobileSteps")
export class HumanSpaceflightMobileSteps {
  private readonly MOBILE_VIEWPORT = { width: 375, height: 812 };
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
    private sharedContext: CustomTestArgs["sharedContext"]
  ) {}

  @Given("I am on the SpaceX Human Spaceflight page viewed on mobile")
  async openHumanSpaceflightPageMobile() {
    this.sharedContext.startTime = Date.now();
    await this.humanSpaceflightPage.openWithMobileViewport(
      this.MOBILE_VIEWPORT.width,
      this.MOBILE_VIEWPORT.height
    );
    await this.page.waitForLoadState("networkidle");
  }

  @When("I click hamburger")
  async clickHamburgerMenu() {
    await this.humanSpaceflightPage.header.clickMobileMenuButton();
  }

  @Then("Menu expands")
  async checkMenuExpands() {
    const isExpanded =
      await this.humanSpaceflightPage.header.isMobileMenuExpanded();
    expect(isExpanded, "Mobile menu should be expanded/visible").toBeTruthy();
  }

  @When("I click close")
  async clickCloseButtonOnMobileMenu() {
    await this.humanSpaceflightPage.header.clickMobileMenuCloseButton();
  }

  @Then("Menu collapses")
  async checkMenuCollapses() {
    const isExpanded =
      await this.humanSpaceflightPage.header.isMobileMenuExpanded();
    expect(isExpanded, "Mobile menu should be collapsed/hidden").toBeFalsy();
  }

  @Then("after the actions are performed:")
  async checkMobileActionVerification(dataTable: DataTable) {
    const actions = parseMobileActions(dataTable.hashes());
    await this.executeMobileActions(actions);
  }

  private async executeMobileActions(actions: MobileAction[]): Promise<void> {
    for (const action of actions) {
      await this.executeMobileAction(action);
    }
  }

  private async executeMobileAction(action: MobileAction): Promise<void> {
    const strategy = this.getMobileActionStrategy(action.Action);
    if (strategy) {
      await strategy.execute(action);
    } else {
      throw new Error(`Unknown action type: ${action.Action}`);
    }
  }

  private getMobileActionStrategy(
    action: string
  ): MobileActionStrategy | undefined {
    const strategies = new Map([
      ["Click hamburger", this.createHamburgerStrategy()],
      ["View menu items", this.createViewMenuItemsStrategy()],
      ["Click close", this.createClickCloseStrategy()],
    ]);
    return strategies.get(action);
  }

  private createHamburgerStrategy() {
    return {
      execute: async (action: MobileAction) => {
        await this.humanSpaceflightPage.header.clickMobileMenuButton();
        await this.verifyMenuExpanded(action);
      },
    };
  }

  private createViewMenuItemsStrategy() {
    return {
      execute: async (action: MobileAction) => {
        const allLinksExist =
          await this.humanSpaceflightPage.header.checkNavigationLinksExist(
            this.NAVIGATION_LINKS
          );
        this.verifyNavigationLinks(action, allLinksExist);
      },
    };
  }

  private createClickCloseStrategy() {
    return {
      execute: async (action: MobileAction) => {
        await this.humanSpaceflightPage.header.clickMobileMenuCloseButton();
        await this.verifyMenuCollapsed(action);
      },
    };
  }

  private async verifyMenuExpanded(action: MobileAction): Promise<void> {
    const isExpanded =
      await this.humanSpaceflightPage.header.isMobileMenuExpanded();
    expect(isExpanded, `Action: ${action.Verification}`).toBeTruthy();
  }

  private async verifyMenuCollapsed(action: MobileAction): Promise<void> {
    const isCollapsed =
      await this.humanSpaceflightPage.header.isMobileMenuExpanded();
    expect(isCollapsed, `Action: ${action.Verification}`).toBeFalsy();
  }

  private verifyNavigationLinks(
    action: MobileAction,
    allLinksExist: boolean
  ): void {
    expect(allLinksExist, `Verification: ${action.Verification}`).toBeTruthy();
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
    expect(isExpanded, "Mobile menu should open").toBeTruthy();
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
    expect(isCollapsed, "Mobile menu should close after use").toBeFalsy();
  }
}
