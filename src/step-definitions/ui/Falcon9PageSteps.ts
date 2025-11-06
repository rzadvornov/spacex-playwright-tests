import { expect } from "@playwright/test";
import { Given, When, Then, Fixture } from "playwright-bdd/decorators";
import { DataTable } from "playwright-bdd";
import { Falcon9Page } from "../../services/ui/Falcon9Page";
import { AssertionHelper } from "../../utils/AssertionHelper";
import { EngineSpecValidator } from "../../utils/strategies/EngineSpecValidator";
import { MerlinMainEngineSpecValidator } from "../../utils/strategies/MerlinMainEngineSpecValidator";
import { MerlinVacuumSpecValidator } from "../../utils/strategies/MerlinVacuumSpecValidator";
import {
  SpecValidationStrategy,
  MerlinSpecTable,
} from "../../utils/types/Types";

@Fixture("falcon9PageSteps")
export class Falcon9PageSteps {
  private merlinMainEngineValidator: SpecValidationStrategy;
  private merlinVacuumValidator: SpecValidationStrategy;
  private engineSpecValidator: SpecValidationStrategy;

  constructor(
    private falcon9Page: Falcon9Page,
    private assertionHelper: AssertionHelper
  ) {
    this.merlinMainEngineValidator = new MerlinMainEngineSpecValidator(
      falcon9Page
    );
    this.merlinVacuumValidator = new MerlinVacuumSpecValidator(falcon9Page);
    this.engineSpecValidator = new EngineSpecValidator(falcon9Page);
  }

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
    await this.verifyDescriptionVisibility();
    await this.verifyDescriptionContent();
  }

  private async verifyDescriptionVisibility() {
    await expect(this.falcon9Page.reusabilityDescription).toBeVisible();
  }

  private async verifyDescriptionContent() {
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
      await this.validateTechnicalSpecRow(row);
    }
  }

  private async validateTechnicalSpecRow(row: any) {
    await expect(this.falcon9Page.specsTable).toContainText(row["Attribute"]);

    const hasMetric = await this.falcon9Page.isSpecValueDisplayed(
      row["Attribute"],
      row["Metric Value"]
    );
    const hasImperial = await this.falcon9Page.isSpecValueDisplayed(
      row["Attribute"],
      row["Imperial Value"]
    );

    await this.validateMetricValue(row, hasMetric);
    await this.validateImperialValue(row, hasImperial);
  }

  private async validateMetricValue(row: any, hasMetric: boolean) {
    this.assertionHelper.validateBooleanCheck(
      async () => hasMetric || row["Metric Value"] === "Must be displayed",
      `Neither metric nor imperial value for '${row["Attribute"]}' is displayed as expected.`
    );
  }

  private async validateImperialValue(row: any, hasImperial: boolean) {
    this.assertionHelper.validateBooleanCheck(
      async () => hasImperial || row["Imperial Value"] === "Must be displayed",
      `Imperial value for ${row["Attribute"]} not found.`
    );
  }

  @Then(
    "the page should display detailed **Merlin Engine** specifications, including:"
  )
  async verifyEngineSpecs(table: DataTable) {
    const rows = table.hashes();
    await this.verifyEnginesSectionVisible();
    await this.validateEngineSpecRows(rows);
  }

  private async verifyEnginesSectionVisible() {
    await expect(this.falcon9Page.enginesSection).toBeVisible();
  }

  private async validateEngineSpecRows(rows: any[]) {
    for (const row of rows) {
      await this.validateEngineSpecRow(row);
    }
  }

  private async validateEngineSpecRow(row: any) {
    const isDisplayed = await this.engineSpecValidator.validate(
      row["Attribute"],
      row["Detail"]
    );
    this.assertionHelper.validateBooleanCheck(
      async () => isDisplayed,
      `Expected engine specification '${row["Attribute"]}' with detail '${row["Detail"]}' to be displayed.`
    );
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
    await this.verifyDocumentationLinkVisible();
    await this.verifyDocumentationLinkIsPdf();
  }

  private async verifyDocumentationLinkVisible() {
    await expect(this.falcon9Page.documentationLink).toBeVisible();
  }

  private async verifyDocumentationLinkIsPdf() {
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
    await this.validateMerlinSpecs(specs, this.merlinMainEngineValidator);
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
    await this.validateMerlinSpecs(specs, this.merlinVacuumValidator);
  }

  private async validateMerlinSpecs(
    specs: MerlinSpecTable,
    validator: SpecValidationStrategy
  ) {
    for (const spec of specs) {
      const field = spec["Specification Field"];
      const detail = spec["Value Detail"];
      await this.assertionHelper.validateBooleanCheck(
        () => validator.validate(field, detail),
        `Merlin engine spec: Field '${field}' does not show value '${detail}'.`
      );
    }
  }

  @Then(
    "the video should visually demonstrate the Falcon {int} launch and successful **first-stage recovery**"
  )
  async theVideoShouldVisuallyDemonstrateTheFalcon9LaunchAndSuccessfulFirstStageRecovery(
    _falconVersion: number
  ) {
    await this.assertionHelper.validateBooleanCheck(
      () => this.falcon9Page.isFirstStageRecoveryVisuallyDemonstrated(),
      "The video does not visually demonstrate the Falcon 9 launch and first-stage recovery."
    );
  }

  @Then(
    "a clearly labeled link to downloadable **technical documentation \\(e.g., PDF)** should be available"
  )
  async aClearlyLabeledLinkToDownloadableTechnicalDocumentationShouldBeAvailable() {
    await this.verifyDocumentationLinkAvailable();
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
    _falconVersion: number
  ) {
    await this.assertionHelper.validateBooleanCheck(
      () => this.falcon9Page.isLaunchHistorySectionDisplayed(),
      "A dedicated launch history section for Falcon 9 is not clearly displayed."
    );
  }
}
