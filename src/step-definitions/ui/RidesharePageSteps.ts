import { expect } from "@playwright/test";
import { Given, When, Then, Fixture } from "playwright-bdd/decorators";
import { DataTable } from "playwright-bdd";
import { RidesharePage } from "../../services/ui/RidesharePage";
import { AssertionHelper } from "../../utils/AssertionHelper";
import {
  DocumentationTable,
  FalconSpecTable,
  RideshareSpecTable,
} from "../../utils/types/Types";
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
    await this.ridesharePage.navigate();
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
    await this.verifyButtonVisibility(
      this.ridesharePage.searchFlightsButton,
      ctaText
    );
  }

  @When("the user scrolls to the plate configuration section")
  async scrollToPlateConfigurationSection() {
    await this.scrollToSection(this.ridesharePage.plateConfigurationSection);
  }

  @Then("the page should accurately display all standard plate options:")
  async verifyPlateOptions(dataTable: DataTable) {
    const plates = dataTable.hashes() as RideshareSpecTable;
    await this.validatePlateOptions(plates);
  }

  @When("the user looks for essential documentation")
  async lookForEssentialDocumentation() {
    await this.scrollToSection(this.ridesharePage.payloadUserGuideLink);
  }

  @Then(
    "a prominent link for the **Payload User Guide (e.g., PDF)** should be available"
  )
  async verifyPayloadUserGuideLink() {
    await this.verifyDocumentationLink();
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
    await this.validateReservationPrompt();
  }

  @When("the user reviews custom configuration options")
  async reviewCustomConfigurationOptions() {
    await this.scrollToSection(this.ridesharePage.customOptionsSection);
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
    await this.scrollToSection(this.ridesharePage.logisticsSection);
  }

  @Then(
    "a summary of necessary **payload documentation requirements** should be listed"
  )
  async verifyPayloadDocumentationRequirements() {
    await this.verifySectionContainsText(
      this.ridesharePage.logisticsSection,
      /documentation requirements|required documents/i
    );
  }

  @When("the user reviews the post-reservation steps")
  async reviewPostReservationSteps() {
    await this.scrollToSection(this.ridesharePage.postReservationStepsSection);
  }

  @Then("the page should clearly outline the reservation approval process")
  async verifyReservationApprovalProcess() {
    await this.validateApprovalProcess();
  }

  @Then("a brief overview of the high-level program value should be displayed")
  async verifyProgramValueOverviewDisplayed() {
    await expect(this.ridesharePage.programValueOverview).toBeVisible();
  }

  @When("the user reviews the program information section")
  async reviewProgramInformationSection() {
    await this.scrollToSection(this.ridesharePage.programInfoSection);
  }

  @Then(
    "the page should provide direct links to essential documentation, including:"
  )
  async verifyEssentialDocumentationLinks(dataTable: DataTable) {
    const documents = dataTable.hashes() as DocumentationTable;
    await this.validateDocumentationLinks(documents);
  }

  @When("the user reviews the launch vehicle section")
  async reviewLaunchVehicleSection() {
    await this.scrollToSection(this.ridesharePage.launchVehicleSection);
  }

  @Then("the page should display the following Falcon {int} specifications:")
  async verifyFalconSpecifications(
    vehicleNumber: number,
    dataTable: DataTable
  ) {
    const specs = dataTable.hashes() as FalconSpecTable;
    await this.validateFalconSpecs(vehicleNumber, specs);
  }

  @Then(
    "a brief description of Falcon {int} as a reusable orbital class rocket should be visible"
  )
  async verifyFalconDescriptionVisible(vehicleNumber: number) {
    await this.verifyFalconDescription(vehicleNumber);
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
    await this.validateUpcomingLaunchDates();
  }

  @Then(
    "the corresponding **pricing and available mass capacity** information should be shown"
  )
  async verifyPricingAndCapacityShown() {
    await expect(this.ridesharePage.pricingCapacitySection).toBeVisible();
  }

  @Given("the user has viewed the available flights")
  async givenUserHasViewedAvailableFlights() {
    await this.scrollToSection(this.ridesharePage.availableFlightsSection);
  }

  @Then(
    "the page should mention that custom interfaces and larger spacecraft options are available upon request"
  )
  async verifyCustomOptionsAvailable() {
    await this.verifyTextContainsPattern(
      this.ridesharePage.customOptionsText,
      /custom interfaces|larger spacecraft|upon request/i
    );
  }

  @Then("the page should clearly explain the payload processing timeline")
  async verifyPayloadProcessingTimeline() {
    await this.verifyTextContainsPattern(
      this.ridesharePage.processingTimelineText,
      /processing timeline|key dates|milestones/i
    );
  }

  @Then(
    "the typical processing location \\(SpaceX facility) should be specified"
  )
  async verifyProcessingLocationSpecified() {
    await this.verifyTextContainsPattern(
      this.ridesharePage.processingLocationText,
      /SpaceX facility|Cape Canaveral|Vandenberg/i
    );
  }

  @Then("it should explain the issuance of a **welcome package** upon approval")
  async verifyWelcomePackageExplanation() {
    await this.verifyTextContainsPattern(
      this.ridesharePage.welcomePackageText,
      /welcome package|upon approval|documentation/i
    );
  }

  @Then(
    "the next contact and technical documentation exchange protocols should be detailed"
  )
  async verifyDocumentationExchangeProtocols() {
    await this.verifyTextContainsPattern(
      this.ridesharePage.documentationProtocolsText,
      /contact protocols|documentation exchange|technical review/i
    );
  }

  private async scrollToSection(section: any) {
    await section.scrollIntoViewIfNeeded();
  }

  private async verifyButtonVisibility(button: any, expectedText: string) {
    await expect(button).toHaveText(expectedText);
    await expect(button).toBeVisible();
  }

  private async validatePlateOptions(plates: RideshareSpecTable) {
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

  private async verifyDocumentationLink() {
    await expect(this.ridesharePage.payloadUserGuideLink).toBeVisible();
    const href = await this.ridesharePage.payloadUserGuideLink.getAttribute(
      "href"
    );
    expect(href, "Documentation link does not point to a PDF file.").toMatch(
      /\.pdf$/i
    );
  }

  private async validateReservationPrompt() {
    await this.assertionHelper.validateBooleanCheck(
      () => this.ridesharePage.isReservationPromptVisible(),
      "The reservation form is missing payload mass or mission requirements fields."
    );
  }

  private async verifySectionContainsText(section: any, pattern: RegExp) {
    await expect(section).toContainText(pattern);
  }

  private async validateApprovalProcess() {
    await this.assertionHelper.validateBooleanCheck(
      () => this.ridesharePage.isApprovalProcessDetailed(),
      "The reservation approval process, welcome package, or contact protocols are not detailed."
    );
  }

  private async validateDocumentationLinks(documents: DocumentationTable) {
    for (const doc of documents) {
      const docName = doc["Documentation Name"];
      await this.assertionHelper.validateBooleanCheck(
        () => this.ridesharePage.isDocumentationLinked(docName),
        `Essential documentation link for "${docName}" is not visible or lacks an href.`
      );
    }
  }

  private async validateFalconSpecs(
    vehicleNumber: number,
    specs: FalconSpecTable
  ) {
    for (const spec of specs) {
      const attribute = spec["Attribute"];
      const detail = spec["Detail"];
      await this.assertionHelper.validateBooleanCheck(
        () => this.ridesharePage.isSpecDisplayed(attribute, detail),
        `Falcon ${vehicleNumber} spec '${attribute}: ${detail}' is not displayed.`
      );
    }
  }

  private async verifyFalconDescription(vehicleNumber: number) {
    await expect(
      this.ridesharePage.falconDescription(vehicleNumber)
    ).toBeVisible();
    await expect(
      this.ridesharePage.falconDescription(vehicleNumber)
    ).toContainText(/reusable orbital class rocket/i);
  }

  private async validateUpcomingLaunchDates() {
    await expect(this.ridesharePage.upcomingLaunchDatesList).toBeVisible();
    const flightCount = await this.ridesharePage.availableFlights.count();
    expect(flightCount).toBeGreaterThan(5);
  }

  private async verifyTextContainsPattern(element: any, pattern: RegExp) {
    await expect(element).toBeVisible();
    await expect(element).toContainText(pattern);
  }
}
