import { expect } from "@playwright/test";
import { Given, When, Then, Fixture } from "playwright-bdd/decorators";
import { DataTable } from "playwright-bdd";
import { RidesharePage } from "../../pages/ui/RidesharePage";
import { AssertionHelper } from "../../utils/AssertionHelper";
import {
  DocumentationTable,
  FalconSpecTable,
  RideshareSpecTable,
} from "../../pages/types/Types";
import { SharedPageSteps } from "./SharedPageSteps";

@Fixture("ridesharePageSteps")
export class RidesharePageSteps {
  constructor(
    private ridesharePage: RidesharePage,
    private sharedPageSteps: SharedPageSteps,
    private assertionHelper: AssertionHelper
  ) {}

  @Given("a user navigates to the Rideshare program page")
  async navigateToRidesharePage() {
    await this.ridesharePage.open();
  }

  @When("the Rideshare page loads initially")
  async pageLoadsInitially() {
    await this.ridesharePage.waitForAppContentLoad();
  }

  @Then(
    "the user should see a headline referencing **dedicated Rideshare Missions**"
  )
  async verifyMainHeadline() {
    await expect(this.ridesharePage.mainHeadline).toBeVisible();
  }

  @Then('the anchor price should be highlighted as "as Low as $325k"')
  async verifyAnchorPrice() {
    await expect(this.ridesharePage.anchorPrice).toBeVisible();
  }

  @Then("a visible call-to-action to {string} should be present")
  async verifySearchFlightsCTA(ctaText: string) {
    await expect(this.ridesharePage.searchFlightsButton).toHaveText(ctaText);
    await expect(this.ridesharePage.searchFlightsButton).toBeVisible();
  }

  @When("the user scrolls to the plate configuration section")
  async scrollToPlateConfigurationSection() {
    await this.ridesharePage.plateConfigurationSection.scrollIntoViewIfNeeded();
  }

  @Then("the page should accurately display all standard plate options:")
  async verifyPlateOptions(dataTable: DataTable) {
    const plates = dataTable.hashes() as RideshareSpecTable;
    for (const plate of plates) {
      await this.assertionHelper.validateBooleanCheck(
        () =>
          this.ridesharePage.isPlateOptionDisplayed(
            plate["Plate Configuration"],
            plate["Bolt Pattern"],
            plate["Included Mass"]
          ),
        `Plate option '${plate["Plate Configuration"]}' with details not displayed as expected.`
      );
    }
  }

  @When("the user looks for essential documentation")
  async lookForEssentialDocumentation() {
    await this.ridesharePage.payloadUserGuideLink.scrollIntoViewIfNeeded();
  }

  @Then(
    "a prominent link for the **Payload User Guide (e.g., PDF)** should be available"
  )
  async verifyPayloadUserGuideLink() {
    await expect(this.ridesharePage.payloadUserGuideLink).toBeVisible();
    const href = await this.ridesharePage.payloadUserGuideLink.getAttribute(
      "href"
    );
    expect(href, "Documentation link does not point to a PDF file.").toMatch(
      /\.pdf$/i
    );
  }

  @Then("the document should describe the standard interface (e.g., ESPA-like)")
  async verifyStandardInterfaceDescription() {
    await expect(this.ridesharePage.payloadUserGuideDescription).toBeVisible();
  }

  @When("the user clicks to select and book a plate configuration")
  async clickToBookPlateConfiguration() {
    await this.ridesharePage.bookPlateButton.click();
  }

  @Then("an online reservation system or form should become accessible")
  async verifyReservationFormAccessible() {
    await expect(this.ridesharePage.reservationForm).toBeVisible();
  }

  @Then(
    "the user should be prompted to specify their **payload mass and mission requirements**"
  )
  async verifyReservationPrompt() {
    await this.assertionHelper.validateBooleanCheck(
      () => this.ridesharePage.isReservationPromptVisible(),
      "The reservation form is missing payload mass or mission requirements fields."
    );
  }

  @When("the user reviews custom configuration options")
  async reviewCustomConfigurationOptions() {
    await this.ridesharePage.customOptionsSection.scrollIntoViewIfNeeded();
  }

  @Then(
    'the availability of **"cake topper" slots** for specific orbital applications should be noted'
  )
  async verifyCakeTopperSlotsNote() {
    await expect(this.ridesharePage.cakeTopperNote).toBeVisible();
  }

  @Then(
    "clear contact information for discussing custom interfaces should be provided"
  )
  async verifyCustomContactInfo() {
    await expect(this.ridesharePage.customContactInfo).toBeVisible();
  }

  @When("the user reviews payload processing information")
  async reviewPayloadProcessingInformation() {
    await this.ridesharePage.logisticsSection.scrollIntoViewIfNeeded();
  }

  @Then(
    "a summary of necessary **payload documentation requirements** should be listed"
  )
  async verifyPayloadDocumentationRequirements() {
    await expect(this.ridesharePage.logisticsSection).toContainText(
      /documentation requirements|required documents/i
    );
  }

  @When("the user reviews the post-reservation steps")
  async reviewPostReservationSteps() {
    await this.ridesharePage.postReservationStepsSection.scrollIntoViewIfNeeded();
  }

  @Then("the page should clearly outline the reservation approval process")
  async verifyReservationApprovalProcess() {
    await this.assertionHelper.validateBooleanCheck(
      () => this.ridesharePage.isApprovalProcessDetailed(),
      "The reservation approval process, welcome package, or contact protocols are not detailed."
    );
  }

  @Then("a brief overview of the high-level program value should be displayed")
  async verifyProgramValueOverviewDisplayed() {
    await expect(this.ridesharePage.programValueOverview).toBeVisible();
  }

  @When("the user reviews the program information section")
  async reviewProgramInformationSection() {
    await this.ridesharePage.programInfoSection.scrollIntoViewIfNeeded();
  }

  @Then(
    "the page should provide direct links to essential documentation, including:"
  )
  async verifyEssentialDocumentationLinks(dataTable: DataTable) {
    const documents = dataTable.hashes() as DocumentationTable;
    for (const doc of documents) {
      const docName = doc["Documentation Name"];
      await this.assertionHelper.validateBooleanCheck(
        () => this.ridesharePage.isDocumentationLinked(docName),
        `Essential documentation link for "${docName}" is not visible or lacks an href.`
      );
    }
  }

  @When("the user reviews the launch vehicle section")
  async reviewLaunchVehicleSection() {
    await this.ridesharePage.launchVehicleSection.scrollIntoViewIfNeeded();
  }

  @Then("the page should display the following Falcon {int} specifications:")
  async verifyFalconSpecifications(
    vehicleNumber: number,
    dataTable: DataTable
  ) {
    const specs = dataTable.hashes() as FalconSpecTable;
    for (const spec of specs) {
      const attribute = spec["Attribute"];
      const detail = spec["Detail"];
      await this.assertionHelper.validateBooleanCheck(
        () => this.ridesharePage.isSpecDisplayed(attribute, detail),
        `Falcon ${vehicleNumber} spec '${attribute}: ${detail}' is not displayed.`
      );
    }
  }

  @Then(
    "a brief description of Falcon {int} as a reusable orbital class rocket should be visible"
  )
  async verifyFalconDescriptionVisible(vehicleNumber: number) {
    await expect(
      this.ridesharePage.falconDescription(vehicleNumber)
    ).toBeVisible();
    await expect(
      this.ridesharePage.falconDescription(vehicleNumber)
    ).toContainText(/reusable orbital class rocket/i);
  }

  @When("the user clicks the {string} feature")
  async clickFeature(featureName: string) {
    await this.ridesharePage.clickFeature(featureName);
  }

  @Then(
    "an interactive search interface should display available rideshare missions"
  )
  async verifySearchInterfaceVisible() {
    await expect(this.ridesharePage.searchInterface).toBeVisible();
  }

  @Then("upcoming launch dates should be clearly listed for each mission")
  async verifyUpcomingLaunchDatesListed() {
    await expect(this.ridesharePage.upcomingLaunchDatesList).toBeVisible();
    const flightCount = await this.ridesharePage.availableFlights.count();
    expect(flightCount).toBeGreaterThan(5);
  }

  @Then('the corresponding **pricing and available mass capacity** information should be shown')
  async verifyPricingAndCapacityShown() {
    await expect(this.ridesharePage.pricingCapacitySection).toBeVisible();
  }

  @Given('the user has viewed the available flights')
  async givenUserHasViewedAvailableFlights() {
    await this.ridesharePage.availableFlightsSection.scrollIntoViewIfNeeded();
  }

  @Then('the page should mention that custom interfaces and larger spacecraft options are available upon request')
  async verifyCustomOptionsAvailable() {
    await expect(this.ridesharePage.customOptionsText).toBeVisible();
    await expect(this.ridesharePage.customOptionsText).toContainText(
      /custom interfaces|larger spacecraft|upon request/i
    );
  }

  @Then('the page should clearly explain the payload processing timeline')
  async verifyPayloadProcessingTimeline() {
    await expect(this.ridesharePage.processingTimelineText).toBeVisible();
    await expect(this.ridesharePage.processingTimelineText).toContainText(
      /processing timeline|key dates|milestones/i
    );
  }

  @Then('the typical processing location \\(SpaceX facility) should be specified')
  async verifyProcessingLocationSpecified() {
    await expect(this.ridesharePage.processingLocationText).toBeVisible();
    await expect(this.ridesharePage.processingLocationText).toContainText(
      /SpaceX facility|Cape Canaveral|Vandenberg/i
    );
  }

  @Then('it should explain the issuance of a **welcome package** upon approval')
  async verifyWelcomePackageExplanation() {
    await expect(this.ridesharePage.welcomePackageText).toBeVisible();
    await expect(this.ridesharePage.welcomePackageText).toContainText(
      /welcome package|upon approval|documentation/i
    );
  }

  @Then('the next contact and technical documentation exchange protocols should be detailed')
  async verifyDocumentationExchangeProtocols() {
    await expect(this.ridesharePage.documentationProtocolsText).toBeVisible();
    await expect(this.ridesharePage.documentationProtocolsText).toContainText(
      /contact protocols|documentation exchange|technical review/i
    );
  }
}
