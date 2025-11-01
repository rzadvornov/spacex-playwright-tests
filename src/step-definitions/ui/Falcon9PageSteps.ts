import { expect } from "@playwright/test";
import { Given, When, Then, Fixture } from "playwright-bdd/decorators";
import { DataTable } from "playwright-bdd";
import { Falcon9Page } from "../../pages/ui/Falcon9Page";
import { AssertionHelper } from "../../utils/AssertionHelper";
import { SharedPageSteps } from "./SharedPageSteps";
import { MerlinSpecTable } from "../../pages/types/Types";

@Fixture("falcon9PageSteps")
export class Falcon9PageSteps {
  constructor(
    private falcon9Page: Falcon9Page,
    private assertionHelper: AssertionHelper,
    private sharedPageSteps: SharedPageSteps
  ) {}

  @Given("a user navigates to the Falcon 9 vehicle information page")
  async navigateToFalcon9Page() {
    await this.falcon9Page.navigate();
  }

  @When("the Falcon 9 page loads successfully")
  async pageLoadsSuccessfully() {
    await this.falcon9Page.waitForAppContentLoad();
  }

  @Then("the user should see the Falcon 9 page headline {string}")
  async verifyMainHeadline(headline: string) {
    await expect(this.falcon9Page.mainHeadline).toHaveText(headline);
  }

  @Then(
    "a brief description explaining that Falcon 9 is a **fully reusable** two-stage rocket"
  )
  async verifyReusabilityDescription() {
    await expect(this.falcon9Page.reusabilityDescription).toBeVisible();
    await expect(this.falcon9Page.reusabilityDescription).toContainText(
      "fully reusable"
    );
  }

  @Then(
    "the cost and reliability benefits of reusability should be prominently highlighted"
  )
  async verifyCostBenefitHighlight() {
    await expect(this.falcon9Page.costBenefitHighlight).toBeVisible();
  }

  @When("the user scrolls to the specifications section of the Falcon 9 page")
  async scrollToSpecifications() {
    await this.falcon9Page.scrollToSpecificationsSection();
  }

  @Then(
    "the page should display the following key technical specifications in a structured format:"
  )
  async verifyTechnicalSpecs(table: DataTable) {
    const rows = table.hashes();
    for (const row of rows) {
      await expect(this.falcon9Page.specsTable).toContainText(row["Attribute"]);

      const hasMetric = await this.falcon9Page.isSpecValueDisplayed(
        row["Attribute"],
        row["Metric Value"]
      );
      const hasImperial = await this.falcon9Page.isSpecValueDisplayed(
        row["Attribute"],
        row["Imperial Value"]
      );

      this.assertionHelper.validateBooleanCheck(
        async () => hasMetric || row["Metric Value"] === "Must be displayed",
        `Neither metric nor imperial value for '${row["Attribute"]}' is displayed as expected.`
      );
      this.assertionHelper.validateBooleanCheck(
        async () =>
          hasImperial || row["Imperial Value"] === "Must be displayed",
        `Imperial value for ${row["Attribute"]} not found.`
      );
    }
  }

  @Then(
    "the page should display detailed **Merlin Engine** specifications, including:"
  )
  async verifyEngineSpecs(table: DataTable) {
    const rows = table.hashes();
    await expect(this.falcon9Page.enginesSection).toBeVisible();

    for (const row of rows) {
      const isDisplayed = await this.falcon9Page.isEngineSpecDisplayed(
        row["Attribute"],
        row["Detail"]
      );
      this.assertionHelper.validateBooleanCheck(
        async () => isDisplayed,
        `Expected engine specification '${row["Attribute"]}' with detail '${row["Detail"]}' to be displayed.`
      );
    }
  }

  @When("the user clicks on the featured video section of the Falcon 9 page")
  async clickFeaturedVideoSection() {
    await this.falcon9Page.clickFeaturedVideo();
  }

  @Then("an embedded video player should successfully appear")
  async verifyVideoPlayerAppears() {
    const isLoaded = await this.falcon9Page.isVideoPlayerLoaded();
    this.assertionHelper.validateBooleanCheck(
      async () => isLoaded,
      "The embedded video player did not successfully load or become visible."
    );
  }

  @Then("the video player should include accessible sound controls")
  async verifySoundControls() {
    const hasControls = await this.falcon9Page.hasAccessibleSoundControls();
    this.assertionHelper.validateBooleanCheck(
      async () => hasControls,
      "The video player does not have accessible sound controls (e.g., volume/mute)."
    );
  }

  @When("the user reviews the vehicle's market positioning")
  async reviewMarketPositioning() {
    await this.falcon9Page.marketPositioningSection.scrollIntoViewIfNeeded();
  }

  @Then(
    "the page should provide context about Falcon 9's **reusability advantage over expendable rockets**"
  )
  async verifyReusabilityAdvantage() {
    await expect(this.falcon9Page.marketPositioningSection).toBeVisible();
  }

  @Then(
    "the cost-effectiveness of using a reusable vehicle should be clearly mentioned"
  )
  async verifyCostEffectiveness() {
    await expect(this.falcon9Page.marketPositioningSection).toContainText(
      /cost-effectiveness|savings|lower cost/i
    );
  }

  @When("the user looks for detailed technical specifications")
  async lookForDetailedSpecs() {
    // No action needed, just a placeholder for the step
  }

  @Then(
    "a clearly labeled link to downloadable **technical documentation (e.g., PDF)** should be available"
  )
  async verifyDocumentationLinkAvailable() {
    await expect(this.falcon9Page.documentationLink).toBeVisible();
    const href = await this.falcon9Page.documentationLink.getAttribute("href");
    expect(href, "Documentation link does not point to a PDF file.").toMatch(
      /\.pdf$/i
    );
  }

  @When("the user scrolls down the Falcon9 page")
  async scrollDownPage() {
    await this.falcon9Page.page.mouse.wheel(0, 1000);
    await this.falcon9Page.launchHistorySection.scrollIntoViewIfNeeded();
  }

  @Then(
    "key statistics like total successful missions and **booster reuse count** should be highlighted"
  )
  async verifyReuseCountHighlight() {
    await expect(this.falcon9Page.reuseCountHighlight).toBeVisible();
  }

  @When("the user reviews the engines section")
  async theUserReviewsTheEnginesSection() {
    await this.falcon9Page.enginesSection.scrollIntoViewIfNeeded();
  }

  @Then("the page should display information about the Merlin engine family")
  async thePageShouldDisplayInformationAboutTheMerlinEngineFamily() {
    await this.assertionHelper.validateBooleanCheck(
      () => this.falcon9Page.isMerlinEngineFamilyDisplayed(),
      "Information about the Merlin engine family is not displayed."
    );
  }

  @Then("the specifications for the main engines should include:")
  async theSpecificationsForTheMainEnginesShouldInclude(dataTable: DataTable) {
    const specs = dataTable.hashes() as MerlinSpecTable;
    for (const spec of specs) {
      const field = spec["Specification Field"];
      const detail = spec["Value Detail"];
      await this.assertionHelper.validateBooleanCheck(
        () => this.falcon9Page.isMerlinMainEngineSpecDisplayed(field, detail),
        `Merlin main engine spec: Field '${field}' does not show value '${detail}'.`
      );
    }
  }

  @When("the user reviews the Merlin Vacuum section details")
  async theUserReviewsTheMerlinVacuumSectionDetails() {
    await this.falcon9Page.merlinVacuumSpecsSection.scrollIntoViewIfNeeded();
  }

  @Then(
    "the page should accurately display the specialized vacuum engine specifications:"
  )
  async thePageShouldAccuratelyDisplayTheSpecializedVacuumEngineSpecifications(
    dataTable: DataTable
  ) {
    const specs = dataTable.hashes() as MerlinSpecTable;
    for (const spec of specs) {
      const field = spec["Specification Field"];
      const detail = spec["Value Detail"];
      await this.assertionHelper.validateBooleanCheck(
        () => this.falcon9Page.isMerlinVacuumSpecDisplayed(field, detail),
        `Merlin Vacuum engine spec: Field '${field}' does not show value '${detail}'.`
      );
    }
  }

  @Then(
    "the video should visually demonstrate the Falcon {int} launch and successful **first-stage recovery**"
  )
  async theVideoShouldVisuallyDemonstrateTheFalcon9LaunchAndSuccessfulFirstStageRecovery(
    falconVersion: number
  ) {
    await this.assertionHelper.validateBooleanCheck(
      () => this.falcon9Page.isFirstStageRecoveryVisuallyDemonstrated(),
      `The video does not visually demonstrate the Falcon ${falconVersion} launch and first-stage recovery.`
    );
  }

  @Then(
    "a clearly labeled link to downloadable **technical documentation \\(e.g., PDF)** should be available"
  )
  async aClearlyLabeledLinkToDownloadableTechnicalDocumentationShouldBeAvailable() {
    await expect(this.falcon9Page.documentationLink).toBeVisible();
    const href = await this.falcon9Page.documentationLink.getAttribute("href");
    expect(href, "Documentation link does not point to a PDF file.").toMatch(
      /\\.pdf$/i
    );
  }

  @Then(
    "the link should point to a document that includes detailed performance metrics and schematics"
  )
  async theLinkShouldPointToADocumentThatIncludesDetailedPerformanceMetricsAndSchematics() {
    await this.assertionHelper.validateBooleanCheck(
      () => this.falcon9Page.isDocumentationContentAccurate(),
      "Documentation link text/context does not mention detailed performance metrics and schematics."
    );
  }

  @Then(
    "a dedicated section or link summarizing Falcon {int}'s launch history should be displayed"
  )
  async aDedicatedSectionOrLinkSummarizingFalcon9sLaunchHistoryShouldBeDisplayed(
    falconVersion: number
  ) {
    await this.assertionHelper.validateBooleanCheck(
      () => this.falcon9Page.isLaunchHistorySectionDisplayed(),
      `A dedicated launch history section for Falcon ${falconVersion} is not clearly displayed.`
    );
  }
}
