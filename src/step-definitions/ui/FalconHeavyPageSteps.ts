import { expect } from "@playwright/test";
import { Given, When, Then, Fixture } from "playwright-bdd/decorators";
import { DataTable } from "playwright-bdd";
import { FalconHeavyPage } from "../../pages/ui/FalconHeavyPage";
import { AssertionHelper } from "../../utils/AssertionHelper";
import {
  AttributeDetailTable,
  TechnicalSpecTable,
} from "../../pages/types/Types";
import { SharedPageSteps } from "./SharedPageSteps";

@Fixture("falconHeavyPageSteps")
export class FalconHeavyPageSteps {
  constructor(
    private falconHeavyPage: FalconHeavyPage,
    private assertionHelper: AssertionHelper,
    private sharedPageSteps: SharedPageSteps
  ) {}

  @Given("a user navigates to the Falcon Heavy page")
  async navigateToFalconHeavyPage() {
    await this.falconHeavyPage.navigate();
  }

  @When("the Falcon Heavy page successfully loads")
  async pageSuccessfullyLoads() {
    await this.falconHeavyPage.waitForAppContentLoad();
  }

  @Then("the user should see the headline {string}")
  async verifyMainHeadline(headline: string) {
    await expect(this.falconHeavyPage.mainHeadline).toHaveText(headline);
  }

  @Then(
    "a description explaining that Falcon Heavy is composed of three Falcon {int} cores"
  )
  async verifyThreeCoresDescription(falconVersion: number) {
    await expect(this.falconHeavyPage.threeCoresDescription).toContainText(
      `three Falcon ${falconVersion} cores`
    );
  }

  @Then(
    "the total thrust at liftoff should be highlighted as **{int} million pounds** \\(or its metric equivalent)"
  )
  async verifyTotalThrustHighlight(thrustMillions: number) {
    await expect(this.falconHeavyPage.totalThrustHighlight).toBeVisible();
    await expect(this.falconHeavyPage.totalThrustHighlight).toContainText(
      thrustMillions.toString()
    );
  }

  @When("the user reviews the overview section")
  async reviewOverviewSection() {
    await this.falconHeavyPage.scrollToElement(
      this.falconHeavyPage.overviewSection
    );
  }

  @Then("the page should compare Falcon Heavy thrust to familiar references")
  async compareThrustToFamiliarReferences() {
    await expect(this.falconHeavyPage.comparisonSection).toBeVisible();
  }

  @Then(
    "a comparison stating its thrust equals approximately **eighteen {int} aircraft** at full power should be displayed"
  )
  async verifyPlaneComparison(aircraftType: number) {
    await expect(this.falconHeavyPage.planeComparisonText).toContainText(
      `eighteen ${aircraftType} aircraft`
    );
  }

  @Then(
    "the maximum payload capacity should be mentioned as **{int} metric tons \\/ {int},{int} lbs** to orbit"
  )
  async verifyMaxPayloadCapacity(metricTons: number, imperialLbs: number) {
    await expect(this.falconHeavyPage.payloadCapacityText).toContainText(
      `${metricTons} metric tons`
    );
    await expect(this.falconHeavyPage.payloadCapacityText).toContainText(
      `${imperialLbs} lbs`
    );
  }

  @When("the user scrolls to the specifications section")
  async scrollToSpecificationsSection() {
    await this.falconHeavyPage.scrollToElement(
      this.falconHeavyPage.specificationsSection
    );
  }

  @Then("the page should display the following key technical details:")
  async verifyKeyTechnicalSpecifications(dataTable: DataTable) {
    const specs = dataTable.hashes() as TechnicalSpecTable;
    for (const spec of specs) {
      await this.assertionHelper.validateBooleanCheck(
        () =>
          this.falconHeavyPage.isTechnicalSpecValueDisplayed(
            spec.Attribute,
            spec["Metric Value"],
            spec["Imperial Value"]
          ),
        `Technical spec: Attribute '${spec.Attribute}' with Metric '${spec["Metric Value"]}' and Imperial '${spec["Imperial Value"]}' is not displayed as expected.`
      );
    }
  }

  @When("the user reviews the Merlin {int}D engine section")
  async reviewMerlin1DEngineSection() {
    await this.falconHeavyPage.scrollToElement(
      this.falconHeavyPage.merlin1DSection
    );
  }

  @Then("the page should display details on the engine's core features:")
  async verifyMerlin1DEngineDetails(dataTable: DataTable) {
    const specs = dataTable.hashes() as AttributeDetailTable;
    for (const spec of specs) {
      await this.assertionHelper.validateBooleanCheck(
        () =>
          this.falconHeavyPage.isMerlin1DEngineSpecDisplayed(
            spec.Attribute,
            spec.Detail
          ),
        `Merlin 1D spec: Attribute '${spec.Attribute}' with Detail '${spec.Detail}' is not displayed.`
      );
    }
  }

  @When("the user reads the Merlin Vacuum section")
  async readMerlinVacuumSection() {
    await this.falconHeavyPage.scrollToElement(
      this.falconHeavyPage.merlinVacuumSection
    );
  }

  @Then("the page should display the following details:")
  async verifyMerlinVacuumEngineDetails(dataTable: DataTable) {
    const specs = dataTable.hashes() as AttributeDetailTable;
    for (const spec of specs) {
      await this.assertionHelper.validateBooleanCheck(
        () =>
          this.falconHeavyPage.isMerlinVacuumSpecDisplayed(
            spec.Attribute,
            spec.Detail
          ),
        `Merlin Vacuum spec: Attribute '${spec.Attribute}' with Detail '${spec.Detail}' is not displayed.`
      );
    }
  }

  @When("the user clicks on the video section")
  async clickOnVideoSection() {
    await this.falconHeavyPage.videoSection.click();
  }

  @Then("an embedded video player should successfully load and display")
  async verifyVideoPlayerLoads() {
    await this.assertionHelper.validateBooleanCheck(
      () => this.falconHeavyPage.isVideoPlayerLoaded(),
      "The embedded video player did not successfully load or become visible."
    );
  }

  @Then("the video should showcase the **Falcon Heavy launch sequence**")
  async verifyLaunchSequenceShowcased() {
    await this.assertionHelper.validateBooleanCheck(
      () => this.falconHeavyPage.isLaunchSequenceShowcased(),
      "The video does not showcase the Falcon Heavy launch sequence."
    );
  }

  @Then(
    "the video should clearly demonstrate the **simultaneous booster landing sequences**"
  )
  async verifySimultaneousBoosterLandingSequences() {
    await this.assertionHelper.validateBooleanCheck(
      () => this.falconHeavyPage.isSimultaneousLandingDemonstrated(),
      "The video does not clearly demonstrate simultaneous booster landing sequences."
    );
  }

  @When("the user seeks comparative information")
  async seekComparativeInformation() {
    await this.falconHeavyPage.scrollToElement(
      this.falconHeavyPage.marketPositioningSection
    );
  }

  @Then(
    "the page should describe Falcon Heavy as **one of the world's most capable operational rockets**"
  )
  async verifyMostCapableRocketDescription() {
    await this.assertionHelper.validateBooleanCheck(
      () => this.falconHeavyPage.isMostCapableRocketDescribed(),
      "Falcon Heavy is not described as one of the world's most capable operational rockets."
    );
  }

  @Then(
    "it should be positioned as the ideal choice for **heavy payloads** to various orbits"
  )
  async verifyIdealChoiceForHeavyPayloads() {
    await this.assertionHelper.validateBooleanCheck(
      () => this.falconHeavyPage.isHeavyPayloadsChoiceHighlighted(),
      "Falcon Heavy is not positioned as the ideal choice for heavy payloads."
    );
  }

  @Then(
    "the text should highlight its suitability for launching large satellites or deep space missions"
  )
  async verifyDeepSpaceMissionSuitability() {
    await this.assertionHelper.validateBooleanCheck(
      () => this.falconHeavyPage.isDeepSpaceMissionSuitabilityHighlighted(),
      "Suitability for large satellites or deep space missions is not highlighted."
    );
  }

  @When("the user reviews the vehicle description")
  async reviewVehicleDescription() {
    await this.falconHeavyPage.scrollToElement(
      this.falconHeavyPage.vehicleDescription
    );
  }

  @Then(
    "the explanation should clarify that Falcon Heavy uses **three Falcon {int} first-stage cores**"
  )
  async clarifyThreeFalconCores(falconVersion: number) {
    await this.assertionHelper.validateBooleanCheck(
      () => this.falconHeavyPage.isThreeFalconCoresClarified(falconVersion),
      `The vehicle description does not clearly state the use of three Falcon ${falconVersion} first-stage cores.`
    );
  }

  @Then(
    "the purpose of having **{int} Merlin engines** \\({int} per core) should be explained"
  )
  async explainMerlinEngineCount(totalEngines: number, perCore: number) {
    await this.assertionHelper.validateBooleanCheck(
      () =>
        this.falconHeavyPage.isEngineCountAndPerCoreExplained(
          totalEngines,
          perCore
        ),
      `The explanation of ${totalEngines} Merlin engines (${perCore} per core) is missing.`
    );
  }

  @Then(
    "the page should highlight the **reusability benefits** for the three boosters"
  )
  async highlightBoosterReusabilityBenefits() {
    await this.assertionHelper.validateBooleanCheck(
      () => this.falconHeavyPage.isBoosterReusabilityHighlighted(),
      "The reusability benefits for the three boosters are not highlighted in the description."
    );
  }

  @When("the user scrolls to the engines section")
  async scrollToEnginesSection() {
    await this.falconHeavyPage.scrollToElement(
      this.falconHeavyPage.enginesSection
    );
  }

  @Then("the page should display Merlin engine specifications:")
  async displayMerlinEngineSpecifications(dataTable: DataTable) {
    await this.assertionHelper.validateBooleanCheck(
      () => this.falconHeavyPage.isMerlinEngineSpecsDisplayed(),
      "The Merlin engine specifications section is not visible."
    );

    const specs = dataTable.hashes() as { Attribute: string; Detail: string }[];

    for (const spec of specs) {
      await this.assertionHelper.validateBooleanCheck(
        () =>
          this.falconHeavyPage.isMerlin1DEngineSpecDisplayed(
            spec.Attribute,
            spec.Detail
          ),
        `Merlin engine spec: Attribute '${spec.Attribute}' with Detail '${spec.Detail}' is not displayed in the Merlin 1D section.`
      );
    }
  }
}
