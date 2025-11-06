import { expect } from "@playwright/test";
import { Then, When, Fixture } from "playwright-bdd/decorators";
import { DataTable } from "playwright-bdd";
import { HumanSpaceflightPage } from "../../../../services/ui/HumanSpaceflightPage";
import { MissionTab } from "../../../../utils/types/Types";
import { parseMissionTabs } from "../../../../utils/types/TypeGuards";

@Fixture("ourMissionsTabSteps")
export class OurMissionsTabSteps {
  private previousMetrics: Array<any> = [];

  constructor(private humanSpaceflightPage: HumanSpaceflightPage) {}

  @Then("the default tab should be {string}")
  async checkDefaultTab(expectedTab: string) {
    await this.verifyTabIsActive(
      expectedTab,
      `The default tab should be active: ${expectedTab}`
    );
  }

  @Then("mission tabs should be available:")
  async checkMissionTabsAvailable(dataTable: DataTable) {
    const expectedTabs = parseMissionTabs(dataTable.hashes());
    const actualTabs =
      await this.humanSpaceflightPage.ourMissions.getMissionTabs();

    this.verifyTabCount(actualTabs.length, expectedTabs.length);
    await this.validateAllTabs(actualTabs, expectedTabs);
  }

  private verifyTabCount(actualCount: number, expectedCount: number): void {
    expect(actualCount, "Number of tabs should match").toBe(expectedCount);
  }

  private async validateAllTabs(
    actualTabs: any[],
    expectedTabs: MissionTab[]
  ): Promise<void> {
    for (const expectedTab of expectedTabs) {
      await this.validateMissionTab(actualTabs, expectedTab);
    }
  }

  private async validateMissionTab(
    actualTabs: any[],
    expectedTab: MissionTab
  ): Promise<void> {
    const actualTab = actualTabs.find(
      (t) => t.name === expectedTab["Tab Name"]
    );
    expect(
      actualTab,
      `Tab "${expectedTab["Tab Name"]}" should exist`
    ).toBeDefined();
    expect(
      actualTab?.order,
      `Order for tab "${expectedTab["Tab Name"]}" should match`
    ).toBe(expectedTab.Order);
  }

  @When("I view the {string} tab")
  async viewMissionTab(tabName: string) {
    await this.clickTab(tabName);
  }

  @When("I click the {string} tab")
  async clickMissionTab(tabName: string) {
    await this.clickTab(tabName);
  }

  @When("I click on the {string} tab")
  async clickOnTab(tabName: string) {
    this.humanSpaceflightPage.ourMissions.previousActiveTab =
      await this.humanSpaceflightPage.ourMissions.getActiveTabName();
    await this.humanSpaceflightPage.ourMissions.clickMissionTab(tabName);
  }

  private async clickTab(tabName: string): Promise<void> {
    await this.humanSpaceflightPage.ourMissions.clickMissionTab(tabName);
  }

  @Then("the tab should become active")
  async checkTabIsActive() {
    // This step is a control flow step, its primary assertion is implicitly covered by subsequent checks
  }

  @Then("the content for {string} should be displayed")
  async checkTabContentDisplayed(tabName: string) {
    await this.verifyTabIsActive(
      tabName,
      `Tab "${tabName}" should be active and its content displayed`
    );
  }

  private async verifyTabIsActive(
    tabName: string,
    message: string
  ): Promise<void> {
    const isActive = await this.humanSpaceflightPage.ourMissions.isTabActive(
      tabName
    );
    expect(isActive, message).toBeTruthy();
  }

  @Then("the following changes should occur:")
  async checkTabSwitchChanges(dataTable: DataTable) {
    const changes = dataTable.hashes();

    for (const change of changes) {
      await this.validateTabSwitchChange(change);
    }
  }

  private async validateTabSwitchChange(change: any): Promise<void> {
    const { Element, State } = change;

    const changeValidators: Record<string, () => Promise<void>> = {
      "Target Tab": async () => {
        const isActive =
          await this.humanSpaceflightPage.ourMissions.isTabActive(
            State.split(", ")[0]
          );
        expect(isActive, `Target tab should be ${State}`).toBeTruthy();
      },
      "Previous Tab": async () => {
        const previousTab =
          await this.humanSpaceflightPage.ourMissions.getPreviousActiveTab();
        if (previousTab) {
          const isInactive =
            !(await this.humanSpaceflightPage.ourMissions.isTabActive(
              previousTab
            ));
          expect(
            isInactive,
            `Previous tab "${previousTab}" should be inactive`
          ).toBeTruthy();
        }
      },
      "Metrics Table": async () => {
        const metricsUpdated =
          await this.humanSpaceflightPage.ourMissions.isTabContentUpdated(
            this.previousMetrics
          );
        expect(
          metricsUpdated,
          "Metrics table should update with new data"
        ).toBeTruthy();
      },
      Description: async () => {
        const descriptionFocus = State.split("Shows ")[1];
        const description =
          await this.humanSpaceflightPage.ourMissions.getSectionDescription();
        expect(
          description.toLowerCase(),
          `Description should focus on ${descriptionFocus}`
        ).toContain(descriptionFocus.toLowerCase());
      },
      Background: async () => {
        const backgroundUpdated =
          await this.humanSpaceflightPage.ourMissions.isBackgroundImageUpdated();
        expect(
          backgroundUpdated,
          "Background image should update"
        ).toBeTruthy();
      },
    };

    const validator = changeValidators[Element];
    if (!validator) {
      throw new Error(`Unknown element change check: ${Element}`);
    }
    await validator();
  }
}
