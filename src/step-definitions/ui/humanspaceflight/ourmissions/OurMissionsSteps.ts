import { Page, expect } from "@playwright/test";
import { Given, Then, Fixture, When } from "playwright-bdd/decorators";
import { HumanSpaceflightPage } from "../../../../services/ui/HumanSpaceflightPage";
import { ViewportUtility } from "../../../../utils/ViewportUtility";
import { DataTable } from "playwright-bdd";
import { MissionMetric } from "../../../../utils/types/Types";
import { OurMissionsPOF } from "../../../../services/fragments/OurMissionsPOF";
import { parseMissionMetrics, parseNavigationRequirements } from "../../../../utils/types/TypeGuards";

@Fixture("ourMissionsSteps")
export class OurMissionsSteps {
  protected previousMetrics: Array<any> = [];
  protected readonly OPACITY_RANGE = { min: 0.1, max: 1 };

  constructor(
    protected page: Page,
    protected humanSpaceflightPage: HumanSpaceflightPage,
    protected viewportUtility: ViewportUtility
  ) {}

  @Given("I view the Our Missions section")
  async viewOurMissionsSection() {
    await this.humanSpaceflightPage.ourMissions.scrollIntoView();
    await this.verifySectionVisibility();
  }

  @Then("I should see the section title {string}")
  async checkSectionTitle(expectedTitle: string) {
    const title = await this.humanSpaceflightPage.ourMissions.getSectionTitle();
    expect(title, "Section title should match").toBe(expectedTitle);
  }

  @Then(
    "the section description should mention scientific research and global awareness"
  )
  async checkSectionDescription() {
    const description =
      await this.humanSpaceflightPage.ourMissions.getSectionDescription();
    this.verifyDescriptionContent(description);
  }

  protected async verifySectionVisibility(): Promise<void> {
    const isVisible =
      await this.humanSpaceflightPage.ourMissions.ourMissionsSection.isVisible();
    expect(isVisible, "Our Missions section should be visible").toBeTruthy();
  }

  protected verifyDescriptionContent(description: string): void {
    expect(description, "Section description should exist").not.toBe("");
    expect(description.toLowerCase()).toContain("scientific research");
    expect(description.toLowerCase()).toContain("global awareness");
  }

  @When("I click the {string} button")
  async clickJoinMissionButton(buttonText: string) {
    await this.humanSpaceflightPage.ourMissions.clickButton(buttonText);
  }

  @Then("a {string} button should be visible")
  async checkJoinMissionButtonVisible(buttonText: string) {
    const isVisible =
      await this.humanSpaceflightPage.ourMissions.isJoinMissionButtonVisible();
    expect(
      isVisible,
      `The "${buttonText}" button should be visible`
    ).toBeTruthy();
  }

  @Then("the metrics table should show mission-specific information:")
  async checkMetricsTable(dataTable: DataTable) {
    const expectedMetrics = parseMissionMetrics(dataTable.hashes());
    const actualMetrics =
      await this.humanSpaceflightPage.ourMissions.getActiveMissionMetrics();

    await this.validateAllMetrics(actualMetrics, expectedMetrics);
  }

  @Then("the metrics table should update with new information")
  async checkMetricsTableUpdate() {
    const isUpdated =
      await this.humanSpaceflightPage.ourMissions.isTabContentUpdated(
        this.previousMetrics
      );
    expect(isUpdated, "Metrics table content should have updated").toBeTruthy();
  }

  private async validateAllMetrics(
    actualMetrics: MissionMetric[],
    expectedMetrics: MissionMetric[]
  ): Promise<void> {
    for (const expected of expectedMetrics) {
      await this.validateMetric(actualMetrics, expected);
    }
  }

  private async validateMetric(
    actualMetrics: MissionMetric[],
    expected: MissionMetric
  ): Promise<void> {
    const actual = actualMetrics.find(
      (m) => m.Metric.toUpperCase() === expected.Metric.toUpperCase()
    );
    expect(
      actual,
      `Metric "${expected.Metric}" should be displayed`
    ).toBeDefined();

    const placeholderValues = [
      "<Primary Value>",
      "<Passengers>",
      "<Altitude>",
      "<Duration>",
    ];
    if (expected.Value && !placeholderValues.includes(expected.Value)) {
      expect(
        actual?.Value,
        `Value for metric "${expected.Metric}" should match`
      ).toContain(expected.Value);
    }
  }

  @When("I click the {string} link within the tab content")
  async clickMissionLink(linkText: string) {
    await (await this.humanSpaceflightPage.ourMissions.getTabByName(linkText))
      .locator("a")
      .click();
  }

  @Then("I should be navigated to the destination details page for {string}")
  async checkNavigationToDestination(destination: string) {
    const normalizedDestination = destination.toLowerCase().replace(/\s/g, "-");
    await this.page.waitForURL(`**/*${normalizedDestination}`);
    expect(this.page.url().toLowerCase()).toContain(normalizedDestination);
  }

  @Then("the URL should contain the path for {string}")
  async checkURLContainsPath(path: string) {
    expect(this.page.url()).toContain(path);
  }

  @Then("I should be directed to:")
  async checkNavigationToSubmissionDetails(dataTable: DataTable) {
    const requirements = parseNavigationRequirements(dataTable.hashes())[0];
    const ourMissionsPOF = this.humanSpaceflightPage
      .ourMissions as OurMissionsPOF;

    if (requirements.URL) {
      const urlPath = requirements.URL.split("Contains ")[1];
      await this.page.waitForURL(`**/*${urlPath}`);
      expect(this.page.url()).toContain(urlPath);
    }

    if (requirements["Page Title"]) {
      await this.page.waitForLoadState("domcontentloaded");
      const title = await this.page.title();
      expect(title).toContain(requirements["Page Title"]);
    }

    if (requirements.Form) {
      const isFormVisible =
        await ourMissionsPOF.isMissionSubmissionFormVisible();
      expect(
        isFormVisible,
        "The Mission Submission Form should be visible"
      ).toBeTruthy();
    }
  }
}
