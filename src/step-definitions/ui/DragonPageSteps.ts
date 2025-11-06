import { expect } from "@playwright/test";
import { Given, When, Then, Fixture } from "playwright-bdd/decorators";
import { DataTable } from "playwright-bdd";
import { DragonPage } from "../../services/ui/DragonPage";
import { AssertionHelper } from "../../utils/AssertionHelper";
import { DracoSpecTable } from "../../utils/types/Types";

@Fixture("dragonPageSteps")
export class DragonPageSteps {
  constructor(
    private dragonPage: DragonPage,
    private assertionHelper: AssertionHelper  ) {}

  @Given("a user navigates to the Dragon page")
  async navigateToDragonPage() {
    await this.dragonPage.navigate();
  }

  @When("the Dragon page successfully loads")
  async pageSuccessfullyLoads() {
    await this.dragonPage.waitForAppContentLoad();
  }

  @Then("the user should see the Dragon page headline {string}")
  async verifyMainHeadline(headline: string) {
    await expect(this.dragonPage.mainHeadline).toHaveText(headline);
  }

  @Then("the text should confirm Dragon can carry up to {int} passengers")
  async verifyPassengerCapacity(capacity: number) {
    await this.verifyTextVisibilityAndContent(
      this.dragonPage.passengerCapacityText,
      capacity.toString()
    );
  }

  @Then("Dragon's unique capability for **cargo return** should be highlighted")
  async verifyCargoReturnHighlight() {
    await expect(this.dragonPage.cargoReturnHighlight).toBeVisible();
  }

  @When("the user scrolls to the specifications section of the Dragon page")
  async scrollToSpecifications() {
    await this.dragonPage.scrollToSpecificationsSection();
  }

  @Then("the page should display key technical specifications, including:")
  async verifyTechnicalSpecs(table: DataTable) {
    const rows = table.hashes();
    await this.validateTableData(
      rows,
      (row) =>
        this.dragonPage.isSpecDetailDisplayed(
          row["Specification Field"],
          row["Detail"]
        ),
      "Specification"
    );
  }

  @Then("the page should display clear **metric and imperial** measurements")
  async verifyImperialMetricToggle() {
    await expect(this.dragonPage.imperialMetricToggle).toBeVisible();
  }

  @Then(
    "the user should read that the escape performance is approximately **half a mile in less than 8 seconds**"
  )
  async verifyInFlightAbortDetails() {
    await expect(this.dragonPage.inFlightAbortDetails).toBeVisible();
  }

  @Then(
    "the text should specify the escape performance is approximately **half a mile in less than {int} seconds**"
  )
  async verifyEscapePerformanceWithParameter(seconds: number) {
    await expect(this.dragonPage.superDracoSection).toContainText(
      `half a mile in less than ${seconds} seconds`
    );
  }

  @When("the user reads about landing systems")
  async readAboutLandingSystems() {
    await this.scrollToElement(this.dragonPage.landingSystemSection);
  }

  @Then("the information should confirm the use of:")
  async verifyParachuteDetails(table: DataTable) {
    const rows = table.hashes();
    await this.validateTableData(
      rows,
      (row) =>
        this.dragonPage.isParachuteDetailListed(
          row["Parachute Type"],
          row["Quantity"]
        ),
      "Parachute type"
    );
  }

  @Then(
    "the page should specify the vehicle is designed for **water landing** recovery"
  )
  async verifyWaterLandingDesignation() {
    await expect(this.dragonPage.landingSystemSection).toContainText(
      "water landing"
    );
  }

  @Then(
    "the page should clearly explain Dragon's multi-stage parachute landing mechanism"
  )
  async verifyMultiStageParachuteMechanism() {
    await this.assertionHelper.validateBooleanCheck(
      () => this.dragonPage.isMultiStageLandingMechanismExplained(),
      "The multi-stage parachute landing mechanism explanation is not clear or missing."
    );
  }

  @When("the user clicks on the featured video section of the Dragon page")
  async clickFeaturedVideoSection() {
    await this.dragonPage.clickFeaturedVideo();
  }

  @Then(
    "an embedded video player should successfully load and display the content"
  )
  async verifyVideoPlayerLoads() {
    await this.assertionHelper.validateBooleanCheck(
      () => this.dragonPage.isVideoPlayerLoaded(),
      "The embedded video player did not successfully load or become visible."
    );
  }

  @Then(
    "the video should visually showcase Dragon's **launch, docking, and ocean landing operations**"
  )
  async verifyVideoShowcasesOperations() {
    await this.assertionHelper.validateBooleanCheck(
      () => this.dragonPage.isVideoContentShowcased("launch", "ocean landing"),
      "Video does not visually showcase launch, docking, and ocean landing."
    );
  }

  @Then("the video should highlight **crew operations** inside the capsule")
  async verifyVideoHighlightsCrewOperations() {
    await this.assertionHelper.validateBooleanCheck(
      () => this.dragonPage.isVideoContentHighlightingCrewOps(),
      "Video does not highlight crew operations inside the capsule."
    );
  }

  @Then(
    "the page should explain that Dragon is available to serve **commercial astronauts and private customers**"
  )
  async verifyCommercialCustomers() {
    await expect(this.dragonPage.commercialApplicationsSection).toBeVisible();
  }

  @Then("a description of Dragon's full capabilities should be displayed")
  async verifyFullCapabilitiesDisplayed() {
    await this.assertionHelper.validateBooleanCheck(
      () => this.dragonPage.isFullCapabilitiesDisplayed(),
      "Full capabilities summary (e.g., passenger/cargo) is not fully displayed."
    );
  }

  @When("the user reviews the capabilities section")
  async reviewCapabilitiesSection() {
    await this.scrollToElement(this.dragonPage.capabilitiesSection);
  }

  @Then(
    "the page should explain that Dragon restored the American ability to launch astronauts from US soil"
  )
  async verifyCrewLaunchRestoreText() {
    await expect(this.dragonPage.crewLaunchRestoreText).toBeVisible();
  }

  @Then(
    "it should mention that this capability was absent between {int} and {int}"
  )
  async verifyCapabilityGap(year1: number, year2: number) {
    await this.assertionHelper.validateBooleanCheck(
      () => this.dragonPage.isAmericanLaunchRestoredMentioned(year1, year2),
      `The text does not mention the capability gap between ${year1} and ${year2}.`
    );
  }

  @Then(
    "the page should highlight Dragon's role in the **first private spaceflight** \\(Inspiration4 or equivalent)"
  )
  async verifyInspiration4Highlight() {
    await this.assertionHelper.validateBooleanCheck(
      () => this.dragonPage.isInspiration4Highlighted(),
      "The first private spaceflight (Inspiration4) is not highlighted."
    );
  }

  @When("the user scrolls to the propulsion systems section")
  async scrollToPropulsionSystems() {
    await this.dragonPage.scrollToPropulsionSection();
  }

  @Then("the page should display Draco thruster specifications")
  async verifyDracoSpecsVisible() {
    await expect(this.dragonPage.dracoSpecsSection).toBeVisible();
  }

  @Then("the information should accurately list:")
  async verifyDracoSpecifications(dataTable: DataTable) {
    const specs = dataTable.hashes() as DracoSpecTable;
    await this.validateTableData(
      specs,
      (spec) =>
        this.dragonPage.isDracoSpecDetailDisplayed(
          spec["Specification Field"],
          spec["Value Detail"]
        ),
      "Draco spec detail"
    );
  }

  @When("the user reviews the SuperDraco section")
  async reviewSuperDracoSection() {
    await this.scrollToElement(this.dragonPage.superDracoSection);
  }

  @Then("the page should display details on the launch escape system:")
  async verifySuperDracoLaunchEscapeDetails(dataTable: DataTable) {
    const details = dataTable.hashes();
    await this.validateTableData(
      details,
      (detailRow) =>
        this.dragonPage.isSuperDracoLaunchEscapeDetailDisplayed(
          detailRow["Detail"]
        ),
      "SuperDraco detail"
    );
  }

  @Then(
    "the information should confirm that acceleration experience is approximately **{string} in less than {int} seconds**"
  )
  async verifyAccelerationExperience(distance: string, seconds: number) {
    await expect(this.dragonPage.superDracoSection).toContainText(
      `${distance} in less than ${seconds} seconds`
    );
  }

  @When("the user reviews the full mission description")
  async reviewFullMissionDescription() {
    await this.scrollToElement(this.dragonPage.fullMissionDescription);
  }

  @Then(
    "the capability for Earth orbit missions, including the ISS, should be mentioned"
  )
  async verifyISSCapabilityMentioned() {
    await this.assertionHelper.validateBooleanCheck(
      () => this.dragonPage.isISSCapabilityMentioned(),
      "Earth orbit/ISS mission capability is not mentioned."
    );
  }

  @Then(
    "the option for specialized **missions beyond Low Earth Orbit \\(LEO)** should be described"
  )
  async verifyBeyondLEOMissionDescribed() {
    await this.assertionHelper.validateBooleanCheck(
      () => this.dragonPage.isBeyondLEOMissionDescribed(),
      "Missions beyond Low Earth Orbit (LEO) are not described."
    );
  }

  private async verifyTextVisibilityAndContent(
    element: any,
    expectedText: string
  ) {
    await expect(element).toBeVisible();
    await expect(element).toContainText(expectedText);
  }

  private async scrollToElement(element: any) {
    await element.scrollIntoViewIfNeeded();
  }

  private async validateTableData<T>(
    data: T[],
    validationFn: (item: T) => Promise<boolean>,
    itemType: string
  ) {
    for (const item of data) {
      await this.assertionHelper.validateBooleanCheck(
        () => validationFn(item),
        `${itemType} '${JSON.stringify(item)}' is not displayed as expected.`
      );
    }
  }
}
