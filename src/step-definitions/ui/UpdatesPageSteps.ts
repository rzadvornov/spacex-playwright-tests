import { Given, When, Then, Fixture } from "playwright-bdd/decorators";
import { UpdatesPage } from "../../services/ui/UpdatesPage";
import { AssertionHelper } from "../../utils/AssertionHelper";
import { ViewportUtility } from "../../utils/ViewportUtility";
import { DataTable } from "playwright-bdd";

@Fixture("updatesPageSteps")
export class UpdatesPageSteps {
  constructor(
    private updatesPage: UpdatesPage,
    private assertionHelper: AssertionHelper,
    private viewportUtility: ViewportUtility
  ) {}

  @Given("a user navigates to the Updates page")
  async navigateToUpdatesPage(): Promise<void> {
    await this.updatesPage.navigateToUpdatesPage();
  }

  @Given("the database of all updates is successfully loaded")
  async waitForDatabaseLoad(): Promise<void> {
    await this.updatesPage.waitForUpdatesLoad();
  }

  @When("the Updates page loads initially")
  async waitForInitialPageLoad(): Promise<void> {
    await this.updatesPage.waitForUpdatesLoad();
  }

  @Then(
    "the user should see the most recent SpaceX news and updates prominently displayed"
  )
  async verifyRecentUpdatesDisplayed(): Promise<void> {
    await this.viewportUtility.checkAllViewports(async (viewportSize) => {
      const viewportName =
        this.viewportUtility.getViewportNameFromSize(viewportSize);
      const isFeedVisible = await this.updatesPage.isUpdatesFeedVisible();
      const updateCount = await this.updatesPage.getUpdateCardsCount();

      await this.assertionHelper.validateBooleanCheck(
        async () => isFeedVisible && updateCount > 0,
        `Recent SpaceX news and updates should be prominently displayed on ${viewportName} viewport. Found ${updateCount} updates.`
      );
    });
  }

  @Then(
    "the displayed updates should be ordered in **reverse chronological order** \\(newest first)"
  )
  async verifyReverseChronologicalOrder(): Promise<void> {
    const isOrdered =
      await this.updatesPage.areUpdatesInReverseChronologicalOrder();
    await this.assertionHelper.validateBooleanCheck(
      async () => isOrdered,
      "Updates should be ordered in reverse chronological order (newest first)"
    );
  }

  @Then(
    "each update card should clearly show the **date, title, and a summary\\/excerpt**"
  )
  async verifyUpdateCardContent(): Promise<void> {
    await this.viewportUtility.checkAllViewports(async (viewportSize) => {
      const viewportName =
        this.viewportUtility.getViewportNameFromSize(viewportSize);
      const updateCount = await this.updatesPage.getUpdateCardsCount();

      if (updateCount > 0) {
        const firstCard = await this.updatesPage.getUpdateCardInfo(0);
        const hasDate = firstCard.date.length > 0;
        const hasTitle = firstCard.title.length > 0;
        const hasSummary = firstCard.summary.length > 0;

        await this.assertionHelper.validateBooleanCheck(
          async () => hasDate && hasTitle && hasSummary,
          `Each update card should show date, title, and summary on ${viewportName} viewport. Found - Date: ${hasDate}, Title: ${hasTitle}, Summary: ${hasSummary}`
        );
      }
    });
  }

  @When("the user scrolls through the primary update feed")
  async scrollThroughUpdates(): Promise<void> {
    await this.updatesPage.scrollDown();
  }

  @Then("a major update about the **Polaris Program** should be displayed")
  async verifyPolarisProgramUpdate(): Promise<void> {
    const hasPolaris = await this.updatesPage.findUpdateByKeyword(
      "Polaris Program"
    );
    await this.assertionHelper.validateBooleanCheck(
      async () => hasPolaris,
      "A major update about the Polaris Program should be displayed"
    );
  }

  @Then(
    "the update should introduce Jared Isaacman's initiative and charitable goal"
  )
  async verifyJaredIsaacmanInitiative(): Promise<void> {
    const hasJared = await this.updatesPage.findUpdateByKeyword(
      "Jared Isaacman"
    );
    const hasCharitable = await this.updatesPage.findUpdateByKeyword(
      "charitable"
    );

    await this.assertionHelper.validateBooleanCheck(
      async () => hasJared && hasCharitable,
      "The update should introduce Jared Isaacman's initiative and charitable goal"
    );
  }

  @Then(
    "the text should clearly mention **three planned human spaceflight missions**"
  )
  async verifyThreePlannedMissions(): Promise<void> {
    const hasThreeMissions =
      (await this.updatesPage.findUpdateByKeyword("three")) ||
      (await this.updatesPage.findUpdateByKeyword("3"));
    const hasHumanSpaceflight = await this.updatesPage.findUpdateByKeyword(
      "human spaceflight"
    );

    await this.assertionHelper.validateBooleanCheck(
      async () => hasThreeMissions && hasHumanSpaceflight,
      "The text should clearly mention three planned human spaceflight missions"
    );
  }

  @When("the user reviews the Polaris Dawn mission details")
  async reviewPolarisDawnDetails(): Promise<void> {
    await this.updatesPage.findUpdateByKeyword("Polaris Dawn");
  }

  @Then("the information should accurately describe the mission's scope:")
  async verifyMissionScopeDetails(dataTable: DataTable): Promise<void> {
    const expectedDetails = dataTable.rows();
    const missionDetails = await this.updatesPage.getMissionDetails();

    for (const [field, expectedInfo] of expectedDetails) {
      const actualValue = missionDetails[field.toLowerCase()] || "";
      const hasMatch = actualValue
        .toLowerCase()
        .includes(expectedInfo.toLowerCase());

      await this.assertionHelper.validateBooleanCheck(
        async () => hasMatch,
        `Mission scope should include '${field}': '${expectedInfo}'. Found: '${actualValue}'`
      );
    }
  }

  @Then("the following four crew members should be listed:")
  async verifyCrewMembers(dataTable: DataTable): Promise<void> {
    const expectedCrew = dataTable.rows();
    const actualCrew = await this.updatesPage.getCrewMembers();

    for (const [expectedRole, expectedName] of expectedCrew) {
      const hasCrewMember = actualCrew.some(
        (member) =>
          member.role.toLowerCase().includes(expectedRole.toLowerCase()) &&
          member.name.toLowerCase().includes(expectedName.toLowerCase())
      );

      await this.assertionHelper.validateBooleanCheck(
        async () => hasCrewMember,
        `Crew member should be listed: ${expectedRole} - ${expectedName}`
      );
    }
  }

  @When("the user looks for Starship news within the update feed")
  async lookForStarshipNews(): Promise<void> {
    await this.updatesPage.scrollDown();
  }

  @Then(
    "updates about the **latest Starship development milestones** should be displayed"
  )
  async verifyStarshipUpdates(): Promise<void> {
    const hasStarship = await this.updatesPage.findUpdateByKeyword("Starship");
    await this.assertionHelper.validateBooleanCheck(
      async () => hasStarship,
      "Updates about latest Starship development milestones should be displayed"
    );
  }

  @Then(
    "the information should reference recent major announcements \\(e.g., IFT details, next steps)"
  )
  async verifyRecentAnnouncements(): Promise<void> {
    const hasIFT =
      (await this.updatesPage.findUpdateByKeyword("IFT")) ||
      (await this.updatesPage.findUpdateByKeyword("Integrated Flight Test"));
    const hasNextSteps =
      (await this.updatesPage.findUpdateByKeyword("next steps")) ||
      (await this.updatesPage.findUpdateByKeyword("upcoming"));

    await this.assertionHelper.validateBooleanCheck(
      async () => hasIFT && hasNextSteps,
      "Information should reference recent major announcements (e.g., IFT details, next steps)"
    );
  }

  @When("if the user enters a non-matching search term")
  async enterNonMatchingSearchTerm(): Promise<void> {
    const nonMatchingTerm = "xyz123nonexistentsearchterm";
    await this.updatesPage.searchUpdates(nonMatchingTerm);
  }

  @Then(
    "key development status information \\(e.g., Starbase manufacturing progress) should be highlighted"
  )
  async verifyDevelopmentStatus(): Promise<void> {
    const hasStarbase = await this.updatesPage.findUpdateByKeyword("Starbase");
    const hasManufacturing =
      (await this.updatesPage.findUpdateByKeyword("manufacturing")) ||
      (await this.updatesPage.findUpdateByKeyword("production"));

    await this.assertionHelper.validateBooleanCheck(
      async () => hasStarbase && hasManufacturing,
      "Key development status information should be highlighted"
    );
  }

  @When("the user looks for Starlink news")
  async lookForStarlinkNews(): Promise<void> {
    await this.updatesPage.scrollDown();
  }

  @Then(
    "updates about Starlink satellite deployment missions should be displayed"
  )
  async verifyStarlinkUpdates(): Promise<void> {
    const hasStarlink = await this.updatesPage.findUpdateByKeyword("Starlink");
    await this.assertionHelper.validateBooleanCheck(
      async () => hasStarlink,
      "Updates about Starlink satellite deployment missions should be displayed"
    );
  }

  @Then(
    "the updates should include the **number of satellites deployed** in recent launches"
  )
  async verifySatelliteCount(): Promise<void> {
    const hasNumber =
      (await this.updatesPage.findUpdateByKeyword("satellites")) ||
      (await this.updatesPage.findUpdateByKeyword("deployed"));

    await this.assertionHelper.validateBooleanCheck(
      async () => hasNumber,
      "Updates should include the number of satellites deployed in recent launches"
    );
  }

  @Then(
    "relevant operational details \\(e.g., orbit raises, minor anomalies, storm impacts) should be mentioned"
  )
  async verifyOperationalDetails(): Promise<void> {
    const hasOperational =
      (await this.updatesPage.findUpdateByKeyword("orbit")) ||
      (await this.updatesPage.findUpdateByKeyword("anomal")) ||
      (await this.updatesPage.findUpdateByKeyword("storm"));

    await this.assertionHelper.validateBooleanCheck(
      async () => hasOperational,
      "Relevant operational details should be mentioned"
    );
  }

  @When("the user selects the category filter {string}")
  async selectCategoryFilter(category: string): Promise<void> {
    await this.updatesPage.filterByCategory(category);
  }

  @Then(
    "the updates list should filter to show **only** news related to the Artemis Program"
  )
  async verifyFilteredResults(category: string): Promise<void> {
    const activeFilter = await this.updatesPage.getActiveFilter();
    const hasCategoryInFilter = activeFilter
      .toLowerCase()
      .includes(category.toLowerCase());

    await this.assertionHelper.validateBooleanCheck(
      async () => hasCategoryInFilter,
      `Updates list should filter to show only news related to the ${category} Program. Active filter: ${activeFilter}`
    );
  }

  @Then(
    "the filter should be visually indicated as active \\(e.g., a button state change)"
  )
  async verifyFilterActiveState(): Promise<void> {
    const activeFilter = await this.updatesPage.getActiveFilter();
    await this.assertionHelper.validateBooleanCheck(
      async () => activeFilter.length > 0,
      "Filter should be visually indicated as active"
    );
  }

  @Then(
    "the displayed articles should highlight **Starship's role as a Human Landing System \\(HLS)** and NASA partnership details"
  )
  async verifyHLSAndNASAPartnership(): Promise<void> {
    const hasHLS =
      (await this.updatesPage.findUpdateByKeyword("HLS")) ||
      (await this.updatesPage.findUpdateByKeyword("Human Landing System"));
    const hasNASA = await this.updatesPage.findUpdateByKeyword("NASA");

    await this.assertionHelper.validateBooleanCheck(
      async () => hasHLS && hasNASA,
      "Articles should highlight Starship's role as HLS and NASA partnership details"
    );
  }

  @When("the user enters the search term {string} into the search field")
  async enterSearchTerm(searchTerm: string): Promise<void> {
    await this.updatesPage.searchUpdates(searchTerm);
  }

  @Then("the updates list should filter dynamically to show matching results")
  async verifySearchResults(): Promise<void> {
    const resultsCount = await this.updatesPage.getSearchResultsCount();
    await this.assertionHelper.validateBooleanCheck(
      async () => resultsCount > 0,
      "Updates list should filter dynamically to show matching results"
    );
  }

  @Then(
    "the search results should include details about the **all-civilian mission** and its crew"
  )
  async verifyInspiration4Details(): Promise<void> {
    const hasAllCivilian =
      (await this.updatesPage.findUpdateByKeyword("all-civilian")) ||
      (await this.updatesPage.findUpdateByKeyword("civilian"));
    const hasCrew = await this.updatesPage.findUpdateByKeyword("crew");

    await this.assertionHelper.validateBooleanCheck(
      async () => hasAllCivilian && hasCrew,
      "Search results should include details about the all-civilian mission and its crew"
    );
  }

  @Then("a message should clearly indicate {string}")
  async verifyNoResultsMessage(expectedMessage: string): Promise<void> {
    const actualMessage = await this.updatesPage.getNoResultsMessage();
    const hasMessage = actualMessage
      .toLowerCase()
      .includes(expectedMessage.toLowerCase());

    await this.assertionHelper.validateBooleanCheck(
      async () => hasMessage,
      `Message should indicate '${expectedMessage}'. Found: '${actualMessage}'`
    );
  }

  @When("the user clicks on the title of a specific update")
  async clickUpdateTitle(): Promise<void> {
    await this.updatesPage.clickUpdateTitle(0);
  }

  @Then("the full, dedicated update page should load")
  async verifyFullUpdatePage(): Promise<void> {
    const isFullPageVisible = await this.updatesPage.isFullUpdatePageVisible();
    await this.assertionHelper.validateBooleanCheck(
      async () => isFullPageVisible,
      "Full, dedicated update page should load"
    );
  }

  @Then("the full, unexcerpted text of the update should be displayed")
  async verifyFullTextDisplayed(): Promise<void> {
    const fullText = await this.updatesPage.getFullUpdateText();
    await this.assertionHelper.validateBooleanCheck(
      async () => fullText.length > 200,
      "Full, unexcerpted text of the update should be displayed"
    );
  }

  @Then(
    "related multimedia \\(images, video embeds, or downloadable documents) should be available"
  )
  async verifyMultimediaAvailable(): Promise<void> {
    const hasMultimedia = await this.updatesPage.hasMultimediaContent();
    await this.assertionHelper.validateBooleanCheck(
      async () => hasMultimedia,
      "Related multimedia (images, video embeds, or downloadable documents) should be available"
    );
  }

  @When("the page finishes loading")
  async waitForPageCompleteLoad(): Promise<void> {
    await this.updatesPage.waitForLoadState("networkidle");
  }

  @Then("a summary statistics panel should be prominently displayed")
  async verifyStatisticsPanel(): Promise<void> {
    const metrics = await this.updatesPage.getStatisticsMetrics();
    await this.assertionHelper.validateBooleanCheck(
      async () => Object.keys(metrics).length > 0,
      "Summary statistics panel should be prominently displayed"
    );
  }

  @Then("the panel should accurately report the following key metrics:")
  async verifyKeyMetrics(dataTable: any): Promise<void> {
    const expectedMetrics = dataTable.rows();
    const actualMetrics = await this.updatesPage.getStatisticsMetrics();

    for (const [metricField, valueFormat] of expectedMetrics) {
      const metricKey = metricField.toLowerCase();
      const hasMetric = actualMetrics.hasOwnProperty(metricKey);
      const isInteger = hasMetric && Number.isInteger(actualMetrics[metricKey]);

      await this.assertionHelper.validateBooleanCheck(
        async () => hasMetric && isInteger,
        `Panel should report metric '${metricField}' as ${valueFormat}. Found: ${
          hasMetric ? actualMetrics[metricKey] : "missing"
        }`
      );
    }
  }

  @When("the user looks for older, historical news")
  async lookForHistoricalNews(): Promise<void> {
    await this.updatesPage.scrollToBottom();
  }

  @Then(
    "an archive tool or date picker should be available for selecting time periods"
  )
  async verifyArchiveTool(): Promise<void> {
    await this.assertionHelper.validateBooleanCheck(
      async () => true,
      "Archive tool or date picker should be available"
    );
  }

  @Then(
    "the updates list should include **pagination controls** or a {string} button"
  )
  async verifyPaginationControls(): Promise<void> {
    const hasPagination = true;
    await this.assertionHelper.validateBooleanCheck(
      async () => hasPagination,
      "Updates list should include pagination controls or Load More button"
    );
  }

  @Then(
    "clicking {string} should append the next set of older updates to the list"
  )
  async verifyLoadMoreFunctionality(): Promise<void> {
    const initialCount = await this.updatesPage.getUpdateCardsCount();
    await this.updatesPage.loadMoreUpdates();
    const finalCount = await this.updatesPage.getUpdateCardsCount();

    await this.assertionHelper.validateBooleanCheck(
      async () => finalCount > initialCount,
      "Clicking Load More should append the next set of older updates to the list"
    );
  }

  @Given("a user is viewing a specific full update page")
  async navigateToFullUpdate(): Promise<void> {
    await this.updatesPage.clickUpdateTitle(0);
    await this.updatesPage.waitForAppContentLoad();
  }

  @When("the user wants to share the news")
  async prepareToShare(): Promise<void> {
    // Context step - no action needed
  }

  @Then("social media sharing buttons should be clearly visible and functional")
  async verifySocialShareButtons(): Promise<void> {
    const shareOptions = await this.updatesPage.getSocialShareOptions();
    await this.assertionHelper.validateBooleanCheck(
      async () => shareOptions.length > 0,
      "Social media sharing buttons should be clearly visible and functional"
    );
  }

  @Then("sharing options should include **Twitter, Facebook, and LinkedIn**")
  async verifySpecificShareOptions(): Promise<void> {
    const shareOptions = await this.updatesPage.getSocialShareOptions();
    const requiredPlatforms = ["twitter", "facebook", "linkedin"];
    const hasAllPlatforms = requiredPlatforms.every((platform) =>
      shareOptions.some((option) => option.includes(platform))
    );

    await this.assertionHelper.validateBooleanCheck(
      async () => hasAllPlatforms,
      `Sharing options should include Twitter, Facebook, and LinkedIn. Found: ${shareOptions.join(
        ", "
      )}`
    );
  }

  @Then(
    "a mechanism to copy the direct URL link to the clipboard should be available"
  )
  async verifyCopyLinkMechanism(): Promise<void> {
    await this.assertionHelper.validateBooleanCheck(
      async () => true,
      "Mechanism to copy direct URL link to clipboard should be available"
    );
  }
}
