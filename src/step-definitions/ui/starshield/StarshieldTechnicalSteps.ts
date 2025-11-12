import { expect, Page } from "@playwright/test";
import { Given, When, Then, Fixture } from "playwright-bdd/decorators";
import { StarshieldPage } from "../../../services/ui/StarshieldPage";
import { SharedContext } from "../../../utils/types/Types";
import { ViewportUtility } from "../../../utils/ViewportUtility";

@Fixture("starshieldTechnicalSteps")
export class StarshieldTechnicalSteps {
  constructor(
    protected page: Page,
    protected starshieldPage: StarshieldPage,
    protected sharedContext: SharedContext,
    protected viewportUtility: ViewportUtility
  ) {}

  @Given("the user is viewing Earth Observation details")
  async userIsViewingEarthObservationDetails() {
    await this.starshieldPage.earthObservationInfo.scrollIntoViewIfNeeded();
    await expect(this.starshieldPage.earthObservationInfo).toBeVisible();
  }

  @When("technical specifications are displayed")
  async technicalSpecificationsAreDisplayed() {
    await expect(this.starshieldPage.technicalSpecs).toBeVisible();
  }

  @Then("satellite sensor capabilities should be described")
  async satelliteSensorCapabilitiesShouldBeDescribed() {
    const specsText = await this.starshieldPage.technicalSpecs.textContent();
    expect(specsText?.toLowerCase()).toMatch(
      /electro-optical|synthetic aperture radar|infrared sensors/i
    );
  }

  @Then("resolution and coverage information should be provided")
  async resolutionAndCoverageInformationShouldBeProvided() {
    const specsText = await this.starshieldPage.technicalSpecs.textContent();
    expect(specsText?.toLowerCase()).toMatch(
      /high-resolution|sub-meter|global coverage|revisit rate/i
    );
  }

  @Then("data delivery methods should be explained")
  async dataDeliveryMethodsShouldBeExplained() {
    const detailsText =
      await this.starshieldPage.earthObservationInfo.textContent();
    expect(detailsText?.toLowerCase()).toMatch(
      /direct downlink|secure channels|encrypted link|low-latency delivery/i
    );
  }

  @Given("the user is reviewing Communications features")
  async userIsReviewingCommunicationsFeatures() {
    await this.starshieldPage.communicationsInfo.scrollIntoViewIfNeeded();
    await expect(this.starshieldPage.communicationsInfo).toBeVisible();
  }

  @When("network security information is displayed")
  async networkSecurityInformationIsDisplayed() {
    await this.starshieldPage.securitySpecifications.scrollIntoViewIfNeeded();
    await expect(this.starshieldPage.securitySpecifications).toBeVisible();
  }

  @Then("end-to-end encryption features should be explained")
  async endToEndEncryptionFeaturesShouldBeExplained() {
    const securityText =
      await this.starshieldPage.securitySpecifications.textContent();
    expect(securityText?.toLowerCase()).toMatch(
      /end-to-end user data encryption|terminal to satellite|zero-trust architecture/i
    );
  }

  @Then("network resilience capabilities should be described")
  async networkResilienceCapabilitiesShouldBeDescribed() {
    const securityText =
      await this.starshieldPage.securitySpecifications.textContent();
    expect(securityText?.toLowerCase()).toMatch(
      /resilient to attack|anti-jamming|cyberattacks|redundancy|laser links/i
    );
  }

  @Then("low-latency communication benefits should be highlighted")
  async lowLatencyCommunicationBenefitsShouldBeHighlighted() {
    const commsText =
      await this.starshieldPage.communicationsInfo.textContent();
    expect(commsText?.toLowerCase()).toMatch(
      /low-latency|real-time data|speed advantage|mission critical/i
    );
  }

  @Given("the user wants technical infrastructure details")
  async userWantsTechnicalInfrastructureDetails() {
    await this.starshieldPage.communicationsInfo.scrollIntoViewIfNeeded();
  }

  @When("viewing Communications infrastructure information")
  async viewingCommunicationsInfrastructureInformation() {
    await this.starshieldPage.technicalSpecs.scrollIntoViewIfNeeded();
    await expect(this.starshieldPage.technicalSpecs).toBeVisible();
  }

  @Then("satellite constellation details should be provided")
  async satelliteConstellationDetailsShouldBeProvided() {
    const commsText =
      await this.starshieldPage.communicationsInfo.textContent();
    const specsText = await this.starshieldPage.technicalSpecs.textContent();

    const content = (commsText ?? "") + (specsText ?? "");
    expect(content?.toLowerCase()).toMatch(
      /leo constellation|thousands of satellites|network architecture|inter-satellite laser links/i
    );
  }

  @Then("ground station connectivity should be explained")
  async groundStationConnectivityShouldBeExplained() {
    const commsText =
      await this.starshieldPage.communicationsInfo.textContent();

    expect(commsText?.toLowerCase()).toMatch(
      /ground stations|user terminals|downlinks and uplinks|network access points/i
    );
  }

  @Then("global coverage capabilities should be illustrated")
  async globalCoverageCapabilitiesShouldBeIllustrated() {
    const commsText =
      await this.starshieldPage.communicationsInfo.textContent();

    expect(commsText?.toLowerCase()).toMatch(
      /global coverage|worldwide availability|pole-to-pole coverage/i
    );
  }

  @Given("the user wants to understand payload hosting")
  async userWantsToUnderstandPayloadHosting() {
    await this.starshieldPage.hostedPayloadsInfo.scrollIntoViewIfNeeded();
    await expect(this.starshieldPage.hostedPayloadsInfo).toBeVisible();
  }

  @When("integration process information is displayed")
  async integrationProcessInformationIsDisplayed() {
    const payloadsText =
      await this.starshieldPage.hostedPayloadsInfo.textContent();

    expect(payloadsText?.toLowerCase()).toMatch(
      /integration process|onboarding timeline|testing phase|delivery schedule/i
    );
  }

  @Then("payload specifications and requirements should be listed")
  async payloadSpecificationsAndRequirementsShouldBeListed() {
    const payloadsText =
      await this.starshieldPage.hostedPayloadsInfo.textContent();
    expect(payloadsText?.toLowerCase()).toMatch(
      /payload mass|power limits|volume constraints|interface requirements/i
    );
  }

  @Then("integration timeline information should be provided")
  async integrationTimelineInformationShouldBeProvided() {
    const payloadsText =
      await this.starshieldPage.hostedPayloadsInfo.textContent();
    expect(payloadsText?.toLowerCase()).toMatch(
      /timeline|development schedule|launch readiness|delivery window/i
    );
  }

  @Then("technical support capabilities should be described")
  async technicalSupportCapabilitiesShouldBeDescribed() {
    const payloadsText =
      await this.starshieldPage.hostedPayloadsInfo.textContent();
    expect(payloadsText?.toLowerCase()).toMatch(
      /dedicated support team|technical assistance|mission operations|on-orbit monitoring/i
    );
  }

  @Given("a government agency has unique mission requirements")
  async governmentAgencyHasUniqueMissionRequirements() {
    await this.starshieldPage.hostedPayloadsInfo.scrollIntoViewIfNeeded();
    await expect(this.starshieldPage.hostedPayloadsInfo).toBeVisible();
  }

  @When("viewing custom mission information")
  async viewingCustomMissionInformation() {
    await expect(
      this.starshieldPage.hostedPayloadsInfo.locator("h2,h3", {
        hasText: /custom mission|unique requirements/i,
      })
    ).toBeVisible();
  }

  @Then("mission flexibility options should be explained")
  async missionFlexibilityOptionsShouldBeExplained() {
    const payloadsText =
      await this.starshieldPage.hostedPayloadsInfo.textContent();
    expect(payloadsText?.toLowerCase()).toMatch(
      /flexibility|tailored solutions|mission duration|orbital customization/i
    );
  }

  @Then("dedicated satellite capabilities should be described")
  async dedicatedSatelliteCapabilitiesShouldBeDescribed() {
    const payloadsText =
      await this.starshieldPage.hostedPayloadsInfo.textContent();
    expect(payloadsText?.toLowerCase()).toMatch(
      /dedicated satellite|single-customer use|controlled access|sovereign operation/i
    );
  }

  @Then("mission lifecycle support should be detailed")
  async missionLifecycleSupportShouldBeDetailed() {
    const payloadsText =
      await this.starshieldPage.hostedPayloadsInfo.textContent();
    expect(payloadsText?.toLowerCase()).toMatch(
      /lifecycle support|concept to decommissioning|launch, operations, and sustainment/i
    );
  }

  @Given("the user is reading about Starshield's security")
  async userIsReadingAboutStarshieldSecurity() {
    await this.starshieldPage.securitySpecifications.scrollIntoViewIfNeeded();
    await expect(this.starshieldPage.securitySpecifications).toBeVisible();
  }

  @When("security specifications are displayed")
  async securitySpecificationsAreDisplayed() {
    const securityText =
      await this.starshieldPage.securitySpecifications.textContent();
    expect(securityText?.length).toBeGreaterThan(50);
  }

  @Then("cryptographic capability information should be present")
  async cryptographicCapabilityInformationShouldBePresent() {
    const securityText =
      await this.starshieldPage.securitySpecifications.textContent();
    expect(securityText?.toLowerCase()).toMatch(
      /cryptographic capability|encryption protocols|high-assurance/i
    );
  }

  @Then("classified payload hosting features should be described")
  async classifiedPayloadHostingFeaturesShouldBeDescribed() {
    const securityText =
      await this.starshieldPage.securitySpecifications.textContent();
    expect(securityText?.toLowerCase()).toMatch(
      /classified payloads|secure processing|multi-level security|data compartmentalization/i
    );
  }

  @Then("government security requirement compliance should be stated")
  async governmentSecurityRequirementComplianceShouldBeStated() {
    const securityText =
      await this.starshieldPage.securitySpecifications.textContent();
    expect(securityText?.toLowerCase()).toMatch(
      /dod compliant|nist standards|security clearance|government mandates/i
    );
  }

  @Given("the user needs to verify regulatory compliance")
  async userNeedsToVerifyRegulatoryCompliance() {
    await this.starshieldPage.complianceInfo.scrollIntoViewIfNeeded();
    await expect(this.starshieldPage.complianceInfo).toBeVisible();
  }

  @When("compliance information is displayed")
  async complianceInformationIsDisplayed() {
    const complianceText =
      await this.starshieldPage.complianceInfo.textContent();
    expect(complianceText?.length).toBeGreaterThan(50);
  }

  @Then("relevant government certifications should be listed")
  async relevantGovernmentCertificationsShouldBeListed() {
    const complianceText =
      await this.starshieldPage.complianceInfo.textContent();
    expect(complianceText?.toLowerCase()).toMatch(
      /certifications|fedramp|iso 27001|authority to operate/i
    );
  }

  @Then("security clearance requirements should be specified")
  async securityClearanceRequirementsShouldBeSpecified() {
    const complianceText =
      await this.starshieldPage.complianceInfo.textContent();
    expect(complianceText?.toLowerCase()).toMatch(
      /security clearance|authorized personnel|background checks/i
    );
  }

  @Then("regulatory framework adherence should be documented")
  async regulatoryFrameworkAdherenceShouldBeDocumented() {
    const complianceText =
      await this.starshieldPage.complianceInfo.textContent();
    expect(complianceText?.toLowerCase()).toMatch(
      /regulatory framework|fcc|itu|international agreements/i
    );
  }

  @Given("the page displays technical information")
  async thePageDisplaysTechnicalInformation() {
    await this.starshieldPage.technicalSpecs.scrollIntoViewIfNeeded();
    await expect(this.starshieldPage.technicalSpecs).toBeVisible();
  }

  @When("infographics or diagrams are present")
  async infographicsOrDiagramsArePresent() {
    await this.starshieldPage.infographics.first().scrollIntoViewIfNeeded();
    await expect(this.starshieldPage.infographics.first()).toBeVisible();
  }

  @Then("they should be clear and legible")
  async theyShouldBeClearAndLegible() {
    const infographic = this.starshieldPage.infographics.first();
    const dimensions = await infographic.boundingBox();
    expect(dimensions?.width).toBeGreaterThan(200);
  }

  @Then("they should convey technical specifications accurately")
  async theyShouldConveyTechnicalSpecificationsAccurately() {
    const altText = await this.starshieldPage.infographics
      .first()
      .getAttribute("alt");
    const surroundingText =
      await this.starshieldPage.technicalSpecs.textContent();

    const textToMatch = `${altText} ${surroundingText}`;

    expect(textToMatch.toLowerCase()).toMatch(
      /laser link|mesh network|leo constellation|payload integration/i
    );
  }

  @Then("they should scale appropriately for different devices")
  async theyShouldScaleAppropriatelyForDifferentDevices() {
    const infographic = this.starshieldPage.infographics.first();
    await this.viewportUtility.checkAllViewports(async (size) => {
      const isResponsive = await infographic.evaluate((el) => {
        const computedWidth = el.getBoundingClientRect().width;
        const parentWidth = el.parentElement!.getBoundingClientRect().width;
        return computedWidth <= parentWidth + 1;
      });
      expect(
        isResponsive,
        `Infographic failed responsiveness check at ${size.width}x${size.height}`
      ).toBeTruthy();
    });
  }

  @Given("technical specifications are shown on the page")
  async technicalSpecificationsAreShownOnThePage() {
    await this.starshieldPage.technicalSpecs.scrollIntoViewIfNeeded();
    await expect(this.starshieldPage.technicalSpecs).toBeVisible();
  }

  @When("the user reviews the specifications")
  async theUserReviewsTheSpecifications() {
    await this.starshieldPage.page.waitForLoadState("domcontentloaded");
  }

  @Then("information should be current and accurate")
  async informationShouldBeCurrentAndAccurate() {
    const specsText = await this.starshieldPage.technicalSpecs.textContent();
    expect(specsText?.toLowerCase()).toMatch(
      /100\+ tbps|high-bandwidth|secure link|latest generation/i
    );

    const lastUpdated = this.starshieldPage.page.locator(
      ".last-updated, .revision-date"
    );
    if (await lastUpdated.isVisible()) {
      const dateText = await lastUpdated.textContent();
      expect(dateText).toMatch(/\d{4}-\d{2}-\d{2}|\d{1,2}\/\d{1,2}\/\d{4}/);
    }
  }

  @Then("units of measurement should be clearly indicated")
  async unitsOfMeasurementShouldBeClearlyIndicated() {
    const specsText = await this.starshieldPage.technicalSpecs.textContent();
    expect(specsText).toMatch(
      /\d+\s*(gbps|tbps|kg|m|km|metric tonnes|gbit\/s)/i
    );
  }

  @Then("capabilities should align with official government contracts")
  async capabilitiesShouldAlignWithOfficialGovernmentContracts() {
    const complianceText =
      await this.starshieldPage.complianceInfo.textContent();
    expect(complianceText?.toLowerCase()).toMatch(
      /dod|nist|security clearance|jdam|govsatcom/i
    );
    await expect(this.starshieldPage.complianceInfo).toBeVisible();
  }
}
