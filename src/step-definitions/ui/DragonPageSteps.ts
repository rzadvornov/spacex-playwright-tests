import { expect } from "@playwright/test";
import { Given, When, Then, Fixture } from "playwright-bdd/decorators";
import { DataTable } from "playwright-bdd";
import { DragonPage } from "../../pages/ui/DragonPage";
import { AssertionHelper } from "../../utils/AssertionHelper";
import { SharedPageSteps } from "./SharedPageSteps";

@Fixture("dragonPageSteps")
export class DragonPageSteps {
  constructor(
    private dragonPage: DragonPage,
    private assertionHelper: AssertionHelper,
    private sharedPageSteps: SharedPageSteps
  ) {}

  @Given("a user navigates to the Dragon page")
  async navigateToDragonPage() {
    await this.dragonPage.open();
  }

  @When("the page successfully loads")
  async pageSuccessfullyLoads() {
    await this.dragonPage.waitForAppContentLoad();
  }

  @Then("the user should see the headline {string}")
  async verifyMainHeadline(headline: string) {
    await expect(this.dragonPage.mainHeadline).toHaveText(headline);
  }

  @Then("the text should confirm Dragon can carry up to {int} passengers")
  async verifyPassengerCapacity(capacity: number) {
    await expect(this.dragonPage.passengerCapacityText).toBeVisible();
    await expect(this.dragonPage.passengerCapacityText).toContainText(
      capacity.toString()
    );
  }

  @Then("Dragon's unique capability for **cargo return** should be highlighted")
  async verifyCargoReturnHighlight() {
    await expect(this.dragonPage.cargoReturnHighlight).toBeVisible();
  }

  @When("the user scrolls to the specifications section")
  async scrollToSpecifications() {
    await this.dragonPage.scrollToSpecificationsSection();
  }

  @Then("the page should display key technical specifications, including:")
  async verifyTechnicalSpecs(table: DataTable) {
    const rows = table.hashes();
    for (const row of rows) {
      await this.assertionHelper.validateBooleanCheck(
        () =>
          this.dragonPage.isSpecDetailDisplayed(
            row["Specification Field"],
            row["Detail"]
          ),
        `Specification '${row["Specification Field"]}' with detail '${row["Detail"]}' is not displayed as expected.`
      );
    }
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

  @When("the user reads about landing systems")
  async readAboutLandingSystems() {
    await this.dragonPage.landingSystemSection.scrollIntoViewIfNeeded();
  }

  @Then("the information should confirm the use of:")
  async verifyParachuteDetails(table: DataTable) {
    const rows = table.hashes();
    for (const row of rows) {
      await this.assertionHelper.validateBooleanCheck(
        () =>
          this.dragonPage.isParachuteDetailListed(
            row["Parachute Type"],
            row["Quantity"]
          ),
        `Parachute type '${row["Parachute Type"]}' with quantity '${row["Quantity"]}' is not listed as expected.`
      );
    }
  }

  @Then(
    "the page should specify the vehicle is designed for **water landing** recovery"
  )
  async verifyWaterLandingDesignation() {
    await expect(this.dragonPage.landingSystemSection).toContainText(
      "water landing"
    );
  }

  @When("the user clicks on the featured video section")
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
    "the page should explain that Dragon is available to serve **commercial astronauts and private customers**"
  )
  async verifyCommercialCustomers() {
    await expect(this.dragonPage.commercialApplicationsSection).toBeVisible();
  }
}
