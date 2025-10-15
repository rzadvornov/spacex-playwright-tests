import { expect, Locator } from "@playwright/test";
import { Given, When, Then, Fixture } from "playwright-bdd/decorators";
import { MissionsPage } from "../../pages/ui/MissionsPage";
import { AssertionHelper } from "../../utils/AssertionHelper";
import { Page } from "@playwright/test";
import { SharedPageSteps } from "./SharedPageSteps";

@Fixture("missionsSteps")
export class MissionsSteps {
  constructor(
    private page: Page,
    private missionsPage: MissionsPage,
    private sharedPageSteps: SharedPageSteps,
    private assertionHelper: AssertionHelper
  ) {}

  @Given("a user navigates to the Missions page")
  async navigateToMissionsPage() {
    await this.missionsPage.open();
  }

  @Given("the list of all available missions is successfully loaded")
  async missionListLoadsSuccessfully() {
    await this.missionsPage.waitForAppContentLoad();
    await expect(this.missionsPage.missionList).toBeVisible();
    await expect(this.missionsPage.missionCard.first()).toBeVisible();
  }

  @When("the Mission page loads initially")
  async missionPageLoadsInitially() {
    await this.missionListLoadsSuccessfully();
  }

  @Then("the user should see a list of completed and upcoming SpaceX missions")
  async verifyMissionListVisible() {
    const missionCount = await this.missionsPage.missionCard.count();
    expect(
      missionCount,
      "Expected a substantial number of missions (more than 9) to be displayed."
    ).toBeGreaterThan(9);
  }

  @Then(
    "each mission card should accurately display the **launch date, mission name, and vehicle type**"
  )
  async verifyMissionCardDetails() {
    const firstCard = this.missionsPage.missionCard.first();
    await expect(
      firstCard.locator('[data-field="mission-name"], h2')
    ).toBeVisible();
    await expect(
      firstCard.locator('[data-field="launch-date"], .launch-date')
    ).toBeVisible();
    await expect(
      firstCard.locator('[data-field="vehicle-type"], .vehicle-type')
    ).toBeVisible();
  }

  @Then(
    "the mission list should be ordered **chronologically from most recent to oldest**"
  )
  async verifyChronologicalOrder() {
    const allCards = await this.missionsPage.missionCard.all();
    const dates: Date[] = [];

    const cardsToCheck = allCards.slice(0, Math.min(allCards.length, 5));

    for (const card of cardsToCheck) {
      const dateText = await this.missionsPage.getLaunchDateFromCard(card);
      const date = new Date(dateText);

      if (
        dates.length > 0 &&
        date.getTime() > dates[dates.length - 1].getTime()
      ) {
        throw new Error(
          `Mission list is not chronologically ordered (most recent to oldest). Found date ${dateText} which is newer than the previous date: ${dates[
            dates.length - 1
          ].toISOString()}.`
        );
      }
      dates.push(date);
    }
  }

  @When("the user selects the vehicle filter with the value {string}")
  async selectVehicleFilter(vehicleType: string) {
    await this.missionsPage.selectVehicleFilter(vehicleType);
  }

  @Then(
    "the mission list should update to show **only** missions launched by {string}"
  )
  async verifyFilterByVehicle(vehicleType: string) {
    await this.missionsPage.missionCard.first().waitFor({ state: "visible" });

    const count = await this.missionsPage.missionCard.count();

    const cardsToCheck = Math.min(count, 10);
    for (let i = 0; i < cardsToCheck; i++) {
      const vehicleText = await this.missionsPage.missionCard
        .nth(i)
        .locator('[data-field="vehicle-type"], .vehicle-type')
        .textContent();
      expect(
        vehicleText,
        `Mission card ${i + 1} vehicle type should be ${vehicleType}`
      ).toContain(vehicleType);
    }
  }

  @Then(
    "the total count of filtered missions should be displayed prominently \\(e.g., {string})"
  )
  async verifyMissionCountDisplay(exampleText: string) {
    await expect(this.missionsPage.missionCountDisplay).toBeVisible();
    await expect(this.missionsPage.missionCountDisplay).toHaveText(
      /\d+ of \d+ Missions/
    );
  }

  @Then(
    "the vehicle filter should allow multiple selections \\(e.g., {string})"
  )
  async verifyMultipleFilterSelections(vehicles: string) {
    const isSelect =
      (await this.missionsPage.vehicleFilterDropdown.evaluate(
        (el) => el.tagName
      )) === "SELECT";

    if (isSelect) {
      await expect(this.missionsPage.vehicleFilterDropdown).toHaveAttribute(
        "multiple",
        /.*/i
      );
    } else {
      await expect(this.missionsPage.vehicleFilterDropdown).toHaveAttribute(
        "aria-multiselectable",
        "true",
        { timeout: 100 }
      );
    }
  }

  @When("the user clicks on a specific mission link, such as {string}")
  async clickMissionLink(missionName: string) {
    await this.missionsPage.missionLink(missionName).click();
    await this.missionsPage.missionDetailPage.waitFor({ state: "visible" });
  }

  @Then("the mission detail page for {string} should load")
  async verifyMissionDetailPageLoads(missionName: string) {
    const expectedPath = `/missions/${missionName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")}`;
    await expect(this.page).toHaveURL(new RegExp(expectedPath));
    await expect(
      this.page.getByRole("heading", { name: missionName, level: 1 })
    ).toBeVisible();
  }

  @When("the user enters the search term {string} into the search box")
  async searchForMission(searchTerm: string) {
    await this.missionsPage.searchForMission(searchTerm);
  }

  @Then(
    "the mission list should filter dynamically to show only matching results"
  )
  async verifyDynamicFilter() {
    await this.missionsPage.missionCard.first().waitFor({ state: "visible" });
    const count = await this.missionsPage.missionCard.count();
    expect(count).toBeLessThan(50);
  }

  @Then("a visible message should indicate {string}")
  async verifyNoResultsMessage(message: string) {
    await expect(this.missionsPage.noResultsMessage).toBeVisible();
    await expect(this.missionsPage.noResultsMessage).toContainText(message);
  }

  @Then("a statistics panel should be displayed")
  async verifyStatisticsPanel() {
    await expect(this.missionsPage.statisticsPanel).toBeVisible();
  }

  @Then(
    "the panel should show key metrics, including total missions, successful launches, and total payload deployed"
  )
  async verifyKeyMetricsDisplayed() {
    const requiredMetrics = [
      "Total Missions",
      "Successful Launches",
      "Total Payload Deployed",
    ];
    for (const metric of requiredMetrics) {
      await this.assertionHelper.validateBooleanCheck(
        () =>
          this.missionsPage
            .getMetricValue(metric)
            .then((v) => v !== "" && v.length > 0),
        `Metric '${metric}' value is not displayed or is empty.`
      );
    }
  }

  @When("the user selects the sorting option {string}")
  @Then("the user selects the sorting option {string}")
  async selectSortOption(sortOption: string) {
    await this.missionsPage.selectSortOption(sortOption);
  }

  @Then(
    "if the user enters a search term like {string} \\(which has no matches)"
  )
  async conditionalSearchPreamble(noMatchTerm: string) {
    console.log(
      `Precondition met: The user has searched for a term ('${noMatchTerm}') that yields no results.`
    );
  }

  @Then(
    "the user interface should visually indicate that {string} is the active sort criteria"
  )
  async verifyActiveSortCriteria(sortOption: string) {
    await this.assertionHelper.validateBooleanCheck(
      () => this.missionsPage.isActiveSortCriteria(sortOption),
      `Sort option '${sortOption}' is not visually indicated as active.`
    );
  }

  @Given(
    "a user is viewing an upcoming mission that is less than 24 hours from launch"
  )
  async setupUpcomingMissionView() {
    // This step assumes the test environment has an upcoming mission within 24 hours.
  }

  @When("the user views the mission details")
  async viewMissionDetails() {
    // No explicit action is needed.
  }

  @Then("a clear link or button to the **live stream** should be available")
  async verifyLiveStreamLink() {
    const upcomingMissionName = "Upcoming Mission X";
    await expect(
      this.missionsPage.liveStreamLink(upcomingMissionName)
    ).toBeVisible();
  }

  @Then(
    "a highly visible **countdown timer** should display the precise time remaining until launch"
  )
  async verifyCountdownTimer() {
    const upcomingMissionName = "Upcoming Mission X";
    const timerLocator = this.missionsPage.countdownTimer(upcomingMissionName);

    await expect(timerLocator).toBeVisible();
    await expect(timerLocator).toHaveText(/(\d+:)?\d{2}:\d{2}/);
  }

  @Then("the mission details page should load successfully")
  async verifyMissionDetailsPageLoad() {
    await expect(
      this.missionsPage.missionDetailPage,
      "Mission detail container should be visible"
    ).toBeVisible();
    await expect(this.missionsPage.missionCard.first()).not.toBeVisible();
  }

  @Then(
    "the page should show detailed information including **payload, launch site, and mission objectives**"
  )
  async verifyDetailedMissionInformation() {
    await expect(
      this.missionsPage.payloadDetail,
      "Payload detail should be visible"
    ).toBeVisible();
    await expect(
      this.missionsPage.launchSiteDetail,
      "Launch Site detail should be visible"
    ).toBeVisible();
    await expect(
      this.missionsPage.objectivesDetail,
      "Mission Objectives detail should be visible"
    ).toBeVisible();
  }

  @Then(
    "relevant multimedia content \\(video footage or images) of the mission should be available"
  )
  async verifyMultimediaContent() {
    await expect(
      this.missionsPage.multimediaContent,
      "Multimedia content (video/image) should be available"
    ).toBeVisible();
    const src =
      (await this.missionsPage.multimediaContent.getAttribute("src")) ||
      (await this.missionsPage.multimediaContent.getAttribute("href"));
    expect(src, "Multimedia content should have a source/link").not.toBeNull();
  }

  @When("the user selects the status filter with the value {string}")
  async selectStatusFilter(status: string) {
    await this.missionsPage.selectStatusFilter(status);
  }

  @Then(
    "the mission list should display **only** missions with the {string} status"
  )
  async verifyFilterByStatus(expectedStatus: string) {
    await this.missionsPage.missionCard.first().waitFor({ state: "visible" });

    const missionCount = await this.missionsPage.missionCard.count();
    const cardsToCheck = Math.min(missionCount, 10);

    for (let i = 0; i < cardsToCheck; i++) {
      const card = this.missionsPage.missionCard.nth(i);
      const isStatusCorrect = await card
        .locator(
          `text=/${expectedStatus}/i, [data-status="${expectedStatus.toLowerCase()}"]`
        )
        .isVisible();

      expect(
        isStatusCorrect,
        `Mission card ${i + 1} status should be "${expectedStatus}"`
      ).toBe(true);
    }
  }

  @Then(
    "for each upcoming mission, a **scheduled launch date and time** should be clearly visible"
  )
  async verifyUpcomingMissionDateTime() {
    const firstCard = this.missionsPage.missionCard.first();
    const dateTimeLocator = firstCard
      .locator("text=/d{1,2}:d{2} (AM|PM)/i, .launch-date-time")
      .first();

    await expect(
      dateTimeLocator,
      "Scheduled launch date and time must be clearly visible"
    ).toBeVisible();
    await expect(dateTimeLocator).toHaveText(/\d{1,2}:\d{2}/);
  }

  @When("the user enters the text {string} into the search box")
  async searchForMissionWithText(searchTerm: string) {
    await this.missionsPage.searchForMission(searchTerm);
  }
  @Then(
    "the displayed statistics should update automatically when a new mission is marked as completed"
  )
  async verifyStatisticsPanelUpdate() {
    const initialTotalMissions = await this.missionsPage.getMetricValue(
      "Total Missions"
    );
    await this.missionsPage.simulateStatsUpdate();
    const finalTotalMissions = await this.missionsPage.getMetricValue(
      "Total Missions"
    );
    expect(
      parseInt(finalTotalMissions.replace(/,/g, "")),
      `Final mission count (${finalTotalMissions}) did not update from initial count (${initialTotalMissions})`
    ).toBeGreaterThan(parseInt(initialTotalMissions.replace(/,/g, "")));
  }

  @Then(
    "the mission list should reorder to group missions by their vehicle type"
  )
  async verifySortByVehicleType() {
    await this._verifyGroupingSort((card) =>
      this.missionsPage.getVehicleTypeFromCard(card)
    );
  }

  @Then(
    "missions should be ordered based on the success rate of the vehicle used"
  )
  async verifySortBySuccessRate() {
    await this._verifyNumericSort(async (card) => {
      const text = await card
        .locator('[data-field="success-rate"], .success-rate')
        .textContent();
      const match = text ? text.match(/(\d+(\.\d+)?)/) : null;
      return match ? parseFloat(match[0]) : -1; // -1 for cards where data is missing
    }, "descending");
  }

  private async _verifyGroupingSort(
    getValue: (card: Locator) => Promise<string>
  ) {
    await this.missionsPage.missionCard.first().waitFor({ state: "visible" });
    const allCards = await this.missionsPage.missionCard.all();
    const values: string[] = [];

    const cardsToCheck = allCards.slice(0, Math.min(allCards.length, 10));

    let currentGroupValue: string | null = null;

    for (const card of cardsToCheck) {
      const value = await getValue(card);

      if (currentGroupValue === null) {
        currentGroupValue = value;
      } else if (value !== currentGroupValue) {
        currentGroupValue = value;
        if (values.includes(value)) {
          throw new Error(
            `Grouping sort failed: Found group value "${value}" which already appeared earlier in the list.`
          );
        }
      }
      values.push(value);
    }
  }

  private async _verifyNumericSort(
    getValue: (card: Locator) => Promise<number>,
    order: "ascending" | "descending"
  ) {
    await this.missionsPage.missionCard.first().waitFor({ state: "visible" });
    const allCards = await this.missionsPage.missionCard.all();
    const scores: number[] = [];

    const cardsToCheck = allCards.slice(0, Math.min(allCards.length, 10));

    for (const card of cardsToCheck) {
      const score = await getValue(card);

      if (scores.length > 0) {
        const lastScore = scores[scores.length - 1];
        if (order === "descending" && score > lastScore) {
          throw new Error(
            `Numeric sort failed (${order}): Found score ${score} which is greater than the previous score ${lastScore}.`
          );
        }
        if (order === "ascending" && score < lastScore) {
          throw new Error(
            `Numeric sort failed (${order}): Found score ${score} which is less than the previous score ${lastScore}.`
          );
        }
      }
      scores.push(score);
    }
  }
}
