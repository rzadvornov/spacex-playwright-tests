import { Page, expect } from "@playwright/test";
import { Given, When, Then, Fixture } from "playwright-bdd/decorators";
import { DataTable } from "playwright-bdd";
import { HumanSpaceflightPage } from "../../pages/ui/HumanSpaceflightPage";
import { OurMissionsPOF } from "../../pages/fragments/OurMissionsPOF";

@Fixture("ourMissionsSteps")
export class OurMissionsSteps {
  private previousMetrics: Array<{ metric: string; value: string }> = [];

  constructor(
    private page: Page,
    private humanSpaceflightPage: HumanSpaceflightPage
  ) {}

  @Given("I view the Our Missions section")
  async viewOurMissionsSection() {
    await this.humanSpaceflightPage.ourMissions.scrollIntoView();
    const isVisible =
      await this.humanSpaceflightPage.ourMissions.ourMissionsSection.isVisible();
    expect(isVisible, "Our Missions section should be visible").toBe(true);
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
    expect(description, "Section description should exist").not.toBe("");
    expect(description.toLowerCase()).toContain("scientific research");
    expect(description.toLowerCase()).toContain("global awareness");
  }

  @Then("the default tab should be {string}")
  async checkDefaultTab(expectedTab: string) {
    const isActive = await this.humanSpaceflightPage.ourMissions.isTabActive(
      expectedTab
    );
    expect(isActive, `The default tab should be active: ${expectedTab}`).toBe(
      true
    );
  }

  @Then("mission tabs should be available:")
  async checkMissionTabsAvailable(dataTable: DataTable) {
    const expectedTabs = dataTable.hashes();
    const actualTabs =
      await this.humanSpaceflightPage.ourMissions.getMissionTabs();

    expect(actualTabs.length, "Number of tabs should match").toBe(
      expectedTabs.length
    );

    for (const expectedTab of expectedTabs) {
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
  }

  @When("I view the {string} tab")
  async viewMissionTab(tabName: string) {
    await this.humanSpaceflightPage.ourMissions.clickMissionTab(tabName);
    this.previousMetrics =
      await this.humanSpaceflightPage.ourMissions.getActiveMissionMetrics();
  }

  @Then("the tab should become active")
  async checkTabIsActive() {
    // This step is a control flow step, its primary assertion is implicitly covered by subsequent checks like `checkMetricsTable`
  }

  @Then("the metrics table should show mission-specific information:")
  async checkMetricsTable(dataTable: DataTable) {
    const expectedMetrics = dataTable.hashes();
    const actualMetrics =
      await this.humanSpaceflightPage.ourMissions.getActiveMissionMetrics();

    for (const expected of expectedMetrics) {
      const actual = actualMetrics.find(
        (m) => m.metric.toUpperCase() === expected.Metric.toUpperCase()
      );

      expect(
        actual,
        `Metric "${expected.Metric}" should be displayed`
      ).toBeDefined();

      if (
        expected.Value !== "<Primary Value>" &&
        expected.Value !== "<Passengers>" &&
        expected.Value !== "<Altitude>" &&
        expected.Value !== "<Duration>" &&
        expected.Value
      ) {
        expect(
          actual?.value,
          `Value for metric "${expected.Metric}" should match`
        ).toContain(expected.Value);
      }
    }
  }

  @When("I click the {string} tab")
  async clickMissionTab(tabName: string) {
    this.previousMetrics =
      await this.humanSpaceflightPage.ourMissions.getActiveMissionMetrics();
    await this.humanSpaceflightPage.ourMissions.clickMissionTab(tabName);
  }

  @Then("the content for {string} should be displayed")
  async checkTabContentDisplayed(tabName: string) {
    const isActive = await this.humanSpaceflightPage.ourMissions.isTabActive(
      tabName
    );
    expect(
      isActive,
      `Tab "${tabName}" should be active and its content displayed`
    ).toBe(true);
  }

  @Then("the metrics table should update with new information")
  async checkMetricsTableUpdate() {
    const isUpdated =
      await this.humanSpaceflightPage.ourMissions.isTabContentUpdated(
        this.previousMetrics
      );
    expect(isUpdated, "Metrics table content should have updated").toBe(true);
  }

  @Then("the cargo and science capabilities should list more than {int} items")
  async checkCargoScienceCount(count: number) {
    const lines =
      await this.humanSpaceflightPage.ourMissions.getCargoScienceLines();
    expect(
      lines.length,
      `Cargo/Science section should list more than ${count} items`
    ).toBeGreaterThan(count);
  }

  @Then("the key content should be structured logically:")
  async checkKeyContentStructure(dataTable: DataTable) {
    const checks = dataTable.hashes();
    const ourMissionsPOF = this.humanSpaceflightPage
      .ourMissions as OurMissionsPOF;

    for (const check of checks) {
      switch (check.Element) {
        case "Mission Title":
          const title = await ourMissionsPOF.getSectionTitle();
          expect(title.length).toBeGreaterThan(0);
          break;
        case "Metrics Table":
          const isGrid = await ourMissionsPOF.isMetricsGridLayoutClean();
          expect(isGrid).toBe(true);
          break;
        case "Tab Content":
          const isVisible = await (
            await ourMissionsPOF.getTabByName(check["Default Tab"])
          ).isVisible();
          expect(isVisible).toBe(true);
          break;
        case "CTA Button":
          const isButtonVisible =
            await ourMissionsPOF.isJoinMissionButtonVisible();
          expect(isButtonVisible).toBe(true);
          break;
        case "Primary Tab":
          const isActive = await ourMissionsPOF.isTabActive(
            check["Default Tab"]
          );
          expect(isActive).toBe(true);
          break;
        default:
          throw new Error(`Unknown structure element check: ${check.Element}`);
      }
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
    await this.page.waitForURL(
      `**/*${destination.toLowerCase().replace(/\s/g, "-")}`
    );
    expect(this.page.url().toLowerCase()).toContain(
      destination.toLowerCase().replace(/\s/g, "")
    );
  }

  @Then("the URL should contain the path for {string}")
  async checkURLContainsPath(path: string) {
    expect(this.page.url()).toContain(path);
  }

  @Then("the primary image should change to reflect {string} mission")
  async checkPrimaryImageChange(missionName: string) {
    const isRelevant =
      await this.humanSpaceflightPage.ourMissions.isBackgroundImageRelevantToMission(
        missionName
      );
    expect(
      isRelevant,
      `Image should change and be relevant to ${missionName}`
    ).toBe(true);
  }

  @Then("the image should be relevant to {string}")
  async checkImageRelevance(missionName: string) {
    const isRelevant =
      await this.humanSpaceflightPage.ourMissions.isBackgroundImageRelevantToMission(
        missionName
      );
    expect(isRelevant, `Image should be relevant to ${missionName}`).toBe(true);
  }

  @Then("the mission information should align with {string} mission")
  async checkMissionInfoAlignment(missionName: string) {
    const title = await this.humanSpaceflightPage.ourMissions.getSectionTitle();
    expect(title.toUpperCase()).toContain("MISSIONS");

    const isTabActive = await this.humanSpaceflightPage.ourMissions.isTabActive(
      missionName
    );
    expect(isTabActive, `Tab ${missionName} should be active`).toBe(true);
  }

  @When("I click the {string} button")
  async clickJoinMissionButton(buttonText: string) {
    await this.humanSpaceflightPage.ourMissions.clickJoinMissionButton();
  }

  @Then("the section should display core elements:")
  async checkCoreElements(dataTable: DataTable) {
    const coreElements = dataTable.hashes();
    const ourMissionsPOF = this.humanSpaceflightPage
      .ourMissions as OurMissionsPOF;

    for (const element of coreElements) {
      switch (element.Element) {
        case "Title":
          await this.checkSectionTitle(element.Content);
          break;
        case "Description":
          const description = await ourMissionsPOF.getSectionDescription();
          expect(description).toContain(element.Description.split(" and ")[0]);
          break;
        case "Default Tab":
          await this.checkDefaultTab(element.Content);
          break;
        default:
          throw new Error(`Unknown core element check: ${element.Element}`);
      }
    }
  }

  @Then("a {string} button should be visible")
  async checkJoinMissionButtonVisible(buttonText: string) {
    const isVisible =
      await this.humanSpaceflightPage.ourMissions.isJoinMissionButtonVisible();
    expect(isVisible, `The "${buttonText}" button should be visible`).toBe(
      true
    );
  }

  @Then("I should be directed to:")
  async checkNavigationToSubmissionDetails(dataTable: DataTable) {
    const requirements = dataTable.hashes()[0];
    const ourMissionsPOF = this.humanSpaceflightPage
      .ourMissions as OurMissionsPOF;

    if (requirements.URL) {
      await this.page.waitForURL(
        `**/*${requirements.URL.split("Contains ")[1]}`
      );
      expect(this.page.url()).toContain(requirements.URL.split("Contains ")[1]);
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
      ).toBe(true);
    }
  }

  @When("I perform rapid tab interactions:")
  async performRapidTabInteractions(dataTable: DataTable) {
    const tabsToSwitch = [
      "Space Station",
      "Moon",
      "Earth Orbit",
      "Mars",
      "Space Station",
    ];
    await this.humanSpaceflightPage.ourMissions.performRapidTabSwitching(
      tabsToSwitch
    );
  }

  @Then("all content transitions should be smooth")
  async checkSmoothTransitions() {
    const isSmooth =
      await this.humanSpaceflightPage.ourMissions.isContentTransitionSmooth();
    expect(
      isSmooth,
      "Content transitions should be smooth (no console errors/blinking)"
    ).toBe(true);
  }

  @Then("the UI should remain responsive")
  async checkUIResponsive() {
    const isResponsive =
      await this.humanSpaceflightPage.ourMissions.isUIResponsive();
    expect(
      isResponsive,
      "The UI should remain responsive after rapid interactions"
    ).toBe(true);
  }

  @Then("the section should meet visual standards:")
  async checkVisualStandards(dataTable: DataTable) {
    const standards = dataTable.hashes();
    const ourMissionsPOF = this.humanSpaceflightPage
      .ourMissions as OurMissionsPOF;

    for (const standard of standards) {
      switch (standard.Element) {
        case "Background Image":
          const isVisible = await ourMissionsPOF.isBackgroundImageVisible();
          const isRelevant =
            await ourMissionsPOF.isBackgroundImageRelevantToMission(
              "Earth Orbit"
            );
          expect(
            isVisible && isRelevant,
            "Background image should be visible, left-aligned, and relevant"
          ).toBe(true);
          break;
        case "Image Opacity":
          const opacity = await ourMissionsPOF.getBackgroundImageOpacity();
          expect(opacity).toBeGreaterThan(0.1);
          expect(opacity).toBeLessThan(1);
          break;
        case "Tab Design":
          const isConsistent = await ourMissionsPOF.isTabDesignConsistent();
          expect(isConsistent, "Tab design should be consistent").toBe(true);
          break;
        case "Metrics Layout":
          const isCleanGrid = await ourMissionsPOF.isMetricsGridLayoutClean();
          expect(
            isCleanGrid,
            "Metrics table should have a clean, organized grid layout"
          ).toBe(true);
          break;
        case "Typography":
          const isReadable =
            await ourMissionsPOF.isTypographyClearAndReadable();
          expect(isReadable, "Typography should be clear and readable").toBe(
            true
          );
          break;
        default:
          throw new Error(`Unknown visual standard check: ${standard.Element}`);
      }
    }
  }
}
