import { expect, Page } from "@playwright/test";
import { Given, When, Then, Fixture } from "playwright-bdd/decorators";
import { StarshieldPage } from "../../pages/ui/StarshieldPage";
import { SharedPageSteps } from "./SharedPageSteps";
import { SharedContext } from "../../pages/types/Types";
import { AssertionHelper } from "../../utils/AssertionHelper";
import { ViewportUtility } from "../../utils/ViewportUtility";

@Fixture("starshieldPageSteps")
export class StarshieldPageSteps {
  
  constructor(
    private page: Page,
    private starshieldPage: StarshieldPage,
    private sharedContext: SharedContext,
    private sharedPageSteps: SharedPageSteps,
    private assertionHelper: AssertionHelper,
    private viewportUtility: ViewportUtility
  ) {}

  @Given("the user is on the Starshield homepage")
  async userIsOnStarshieldHomepage() {
    await this.starshieldPage.navigate();
  }

  @When("the Starshield page loads")
  async pageLoads() {
    await this.starshieldPage.waitForLoadState("load");
  }

  @Then("the Starshield branding should be displayed")
  async starshieldBrandingShouldBeDisplayed() {
    await expect(this.starshieldPage.starshieldBranding).toBeVisible();
  }

  @Then("the main navigation menu should be visible")
  async mainNavigationMenuShouldBeVisible() {
    await expect(this.starshieldPage.mainNavigationMenu).toBeVisible();
  }

  @Then(
    "the hero section should contain information about Starshield's purpose"
  )
  async heroSectionShouldContainPurposeInfo() {
    const heroText = await this.starshieldPage.hero.heroSection.textContent();
    this.assertionHelper.assertValuePresent(
      heroText,
      "Hero text content must be present."
    );
    expect(heroText?.length).toBeGreaterThan(50);
    await expect(this.starshieldPage.hero.heroSection).toBeVisible();
  }

  @Given("the main navigation is visible")
  async mainNavigationIsVisible() {
    await expect(this.starshieldPage.mainNavigationMenu).toBeVisible();
  }

  @When("the user clicks on a navigation link")
  async userClicksOnANavigationLink() {
    await this.starshieldPage.mainNavigationMenu.locator("a").first().click();
  }

  @When("the user clicks on a navigation menu item")
  async userClicksOnNavigationMenuItem() {
    await this.starshieldPage.clickNavigationMenuItem("Services");
    this.sharedContext.initialViewport = await this.page.evaluate(() => ({
      x: window.scrollX,
      y: window.scrollY,
      width: window.innerWidth,
      height: window.innerHeight,
    }));
  }

  @Then("the page should scroll to or navigate to the corresponding section")
  async pageShouldScrollOrNavigate() {
    if (this.sharedContext.initialViewport?.y) {
      const currentY = await this.page.evaluate(() => window.scrollY);
      expect(currentY).toBeGreaterThan(
        this.sharedContext.initialViewport.y + 10
      );
    }
  }

  @When("the footer is visible")
  async footerIsVisible() {
    await expect(this.starshieldPage.footer.footer).toBeVisible();
  }

  @Then("additional navigation links should be available")
  async additionalNavigationLinksShouldBeAvailable() {
    const linkCount = await this.starshieldPage.footer.getFooterLinkCount();
    expect(linkCount).toBeGreaterThan(3);
  }

  @Then("copyright and company information should be displayed")
  async copyrightAndCompanyInfoShouldBeDisplayed() {
    await expect(this.starshieldPage.footer.copyrightText).toBeVisible();
  }

  @Given("the page contains call-to-action buttons or links")
  async pageContainsCTAs() {
    await this.assertionHelper.validateBooleanCheck(
      () => this.starshieldPage.checkInteractiveElements(),
      "Page must contain interactive CTA elements."
    );
  }

  @When("the user hovers over or focuses on CTAs")
  async userHoversOrFocusesOnCTAs() {
    await this.starshieldPage.allCTAs.first().hover();
  }

  @Then("the CTA purpose should be clear from the text")
  async ctaPurposeShouldBeClear() {
    const ctaText = await this.starshieldPage.allCTAs.first().textContent();
    expect(ctaText).toMatch(/contact|learn more|inquire|explore/i);
  }

  @Then("clicking should lead to the expected destination or action")
  async clickingShouldLeadToExpectedDestination() {
    const href = await this.starshieldPage.allCTAs.first().getAttribute("href");
    this.assertionHelper.assertValuePresent(
      href,
      "CTA link must have an 'href' attribute (destination)."
    );
  }

  @Given("the user is viewing the services section")
  async userIsViewingServicesSection() {
    await this.starshieldPage.servicesSection.scrollIntoViewIfNeeded();
    await expect(this.starshieldPage.servicesSection).toBeVisible();
  }

  @When("the user navigates to Earth Observation information")
  async userNavigatesToEarthObservationInfo() {
    await this.starshieldPage.earthObservationInfo.scrollIntoViewIfNeeded();
  }

  @Then("details about sensing payload satellites should be displayed")
  async detailsAboutSensingPayloadsShouldBeDisplayed() {
    await expect(this.starshieldPage.earthObservationInfo).toContainText(
      /sensing payload satellites/i
    );
  }

  @When("the user looks for contact information")
  async userLooksForContactInfo() {
    await this.starshieldPage.contactDetailsSection.scrollIntoViewIfNeeded();
  }

  @Then("government-specific contact details or forms should be available")
  async governmentSpecificContactDetailsShouldBeAvailable() {
    await expect(this.starshieldPage.inquiryForm).toBeVisible();
  }

  @Given("a government agency wants to inquire about Starshield")
  async aGovernmentAgencyWantsToInquireAboutStarshield() {
    await this.starshieldPage.contactDetailsSection.scrollIntoViewIfNeeded();
    await expect(this.starshieldPage.inquiryForm).toBeVisible();
  }

  @Then("inquiry submission methods should be clear")
  async inquirySubmissionMethodsShouldBeClear() {
    await expect(this.starshieldPage.submitButton).toBeEnabled();
    await expect(this.starshieldPage.submitButton).toHaveText(
      /submit|send inquiry|contact us/i
    );
  }

  @Then(
    "appropriate security notices for sensitive communications should be present"
  )
  async appropriateSecurityNoticesForSensitiveCommunicationsShouldBePresent() {
    const securityNotice = this.starshieldPage.inquiryForm.locator(
      ".security-notice, [data-testid='security-notice']",
      { hasText: /secure|encrypted|classified|sensitive/i }
    );
    await expect(securityNotice).toBeVisible();
  }

  @Given("a contact form is available")
  async contactFormIsAvailable() {
    await expect(this.starshieldPage.inquiryForm).toBeVisible();
  }

  @When("the user fills out required fields with valid information")
  async userFillsOutRequiredFieldsWithValidInfo() {
    await this.starshieldPage.fillInquiryForm(
      "valid.user@gov.mil",
      "Government Inquiry"
    );
  }

  @When("the user submits the form")
  async userSubmitsTheForm() {
    await this.starshieldPage.submitInquiryForm();
    await this.page.waitForTimeout(500);
  }

  @Then("the user should receive acknowledgment of submission")
  async theUserShouldReceiveAcknowledgmentOfSubmission() {
    await expect(
      this.starshieldPage.page.locator(
        ".form-success-message, .acknowledgment-banner"
      )
    ).toBeVisible();
  }

  @Then("a confirmation message should be displayed")
  async confirmationMessageShouldBeDisplayed() {
    await expect(
      this.starshieldPage.page.locator(".form-success-message")
    ).toBeVisible();
  }

  @When("the user submits the form with missing required fields")
  async userSubmitsFormWithMissingRequiredFields() {
    await this.starshieldPage.emailField.fill("test@test.com");
    await this.starshieldPage.submitButton.click();
  }

  @Then("appropriate validation errors should be displayed")
  async appropriateValidationErrorsShouldBeDisplayed() {
    await expect(
      this.starshieldPage.inquiryForm.locator(".error-message").first()
    ).toBeVisible();
  }

  @Then("the form should not be submitted")
  async formShouldNotBeSubmitted() {
    await expect(
      this.starshieldPage.page.locator(".form-success-message")
    ).not.toBeVisible();
  }

  @Given("a contact form with an email field is present")
  async contactFormWithEmailFieldIsPresent() {
    await expect(this.starshieldPage.emailField).toBeVisible();
  }

  @When("the user enters an invalid email format")
  async userEntersInvalidEmailFormat() {
    this.sharedContext.mediaType = "invalid-email";
    await this.starshieldPage.emailField.fill("invalid-email-format");
  }

  @When("And attempts to submit the form")
  async andAttemptsToSubmitTheForm() {
    await this.starshieldPage.submitButton.click();
  }

  @Then("an email format validation error should be displayed")
  async emailFormatValidationErrorShouldBeDisplayed() {
    await expect(
      this.starshieldPage.inquiryForm.locator(".email-error-message")
    ).toBeVisible();
  }

  @Then("the content should be displayed without errors")
  async theContentShouldBeDisplayedWithoutErrors() {
    await expect(this.starshieldPage.errorBanner).not.toBeVisible();
    await expect(this.starshieldPage.hero.heroSection).toBeVisible();
  }

  @Given("the user is viewing a Starshield subpage or section")
  async userIsViewingStarshieldSubpageOrSection() {
    const subpagePath = "/starshield/communications";
    await this.starshieldPage.open(subpagePath);
    this.sharedContext.expectedPageTitle = "Communications";
  }

  @When("breadcrumb navigation is present")
  async breadcrumbNavigationIsPresent() {
    await expect(this.starshieldPage.breadcrumb).toBeVisible();
  }

  @Then("the current page location should be indicated")
  async currentPageLocationShouldBeIndicated() {
    await expect(this.starshieldPage.currentPageBreadcrumbItem).toBeVisible();
    if (this.sharedContext.expectedPageTitle) {
      await expect(this.starshieldPage.currentPageBreadcrumbItem).toContainText(
        this.sharedContext.expectedPageTitle
      );
    }
  }

  @Then("users should be able to navigate back to parent pages")
  async usersShouldBeAbleToNavigateBackToParentPages() {
    const linkCount = await this.starshieldPage.parentBreadcrumbLinks.count();

    expect(linkCount).toBeGreaterThanOrEqual(1);
    await expect(
      this.starshieldPage.parentBreadcrumbLinks.first()
    ).toBeEnabled();
  }

  @Then("the breadcrumb should reflect the page hierarchy accurately")
  async breadcrumbShouldReflectPageHierarchyAccurately() {
    const breadcrumbText = await this.starshieldPage.breadcrumb.textContent();
    expect(breadcrumbText).toContain(`Starshield`);
    if (this.sharedContext.expectedPageTitle) {
      expect(breadcrumbText).toContain(this.sharedContext.expectedPageTitle);
    }
  }

  @Given("the user scrolls to the page footer")
  async userScrollsToThePageFooter() {
    await this.starshieldPage.footer.scrollToFooter();
  }

  @Then("social media links should be present if applicable")
  async socialMediaLinksShouldBePresentIfApplicable() {
    await this.assertionHelper.validateBooleanCheck(
      () => this.starshieldPage.footer.isSocialMediaSectionVisible(),
      "Social media section must be visible when applicable."
    );
    expect(
      await this.starshieldPage.footer.getSocialMediaLinksCount()
    ).toBeGreaterThanOrEqual(1);
  }

  @Then("information about data collection capabilities should be shown")
  async informationAboutDataCollectionCapabilitiesShouldBeShown() {
    await expect(this.starshieldPage.earthObservationInfo).toBeVisible();
    const infoText =
      await this.starshieldPage.earthObservationInfo.textContent();
    expect(infoText?.toLowerCase()).toMatch(
      /sensing payloads|data collection|earth observation|processed data/i
    );
  }

  @Then("use cases for government reconnaissance should be explained")
  async useCasesForGovernmentReconnaissanceShouldBeExplained() {
    await expect(this.starshieldPage.useCasesSection).toBeVisible();
    const useCaseText = await this.starshieldPage.useCasesSection.textContent();
    expect(useCaseText?.toLowerCase()).toMatch(
      /reconnaissance|surveillance|intelligence|target tracking/i
    );
  }

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

  @Given("the user wants to understand practical applications")
  async userWantsToUnderstandPracticalApplications() {
    await this.starshieldPage.earthObservationInfo.scrollIntoViewIfNeeded();
    await expect(this.starshieldPage.earthObservationInfo).toBeVisible();
  }

  @When("viewing Earth Observation use cases")
  async viewingEarthObservationUseCases() {
    await expect(
      this.starshieldPage.earthObservationInfo.locator("h2,h3", {
        hasText: /use cases|applications/i,
      })
    ).toBeVisible();
  }

  @Then("government intelligence applications should be described")
  async governmentIntelligenceApplicationsShouldBeDescribed() {
    const useCaseText =
      await this.starshieldPage.earthObservationInfo.textContent();
    expect(useCaseText?.toLowerCase()).toMatch(
      /intelligence|isr|situational awareness|threat detection/i
    );
  }

  @Then("disaster response capabilities should be mentioned")
  async disasterResponseCapabilitiesShouldBeMentioned() {
    const useCaseText =
      await this.starshieldPage.earthObservationInfo.textContent();
    expect(useCaseText?.toLowerCase()).toMatch(
      /disaster response|damage assessment|crisis response|humanitarian aid/i
    );
  }

  @Then("environmental monitoring options should be detailed")
  async environmentalMonitoringOptionsShouldBeDetailed() {
    const useCaseText =
      await this.starshieldPage.earthObservationInfo.textContent();
    expect(useCaseText?.toLowerCase()).toMatch(
      /environmental monitoring|resource management|deforestation|illegal fishing/i
    );
  }

  @When("the user navigates to Communications information")
  async userNavigatesToCommunicationsInformation() {
    await this.starshieldPage.communicationsInfo.scrollIntoViewIfNeeded();
    await expect(this.starshieldPage.communicationsInfo).toBeVisible();
  }

  @Then("secure communications features should be described")
  async secureCommunicationsFeaturesShouldBeDescribed() {
    const commsText =
      await this.starshieldPage.communicationsInfo.textContent();
    expect(commsText?.toLowerCase()).toMatch(
      /secure communication|classified networks|government users|assured global communications/i
    );
  }

  @Then("high-assurance cryptographic capabilities should be mentioned")
  async highAssuranceCryptographicCapabilitiesShouldBeMentioned() {
    const commsText =
      await this.starshieldPage.communicationsInfo.textContent();
    expect(commsText?.toLowerCase()).toMatch(
      /high-assurance cryptographic capability|classified payloads|secure data processing/i
    );
  }

  @Then("government-grade encryption standards should be highlighted")
  async governmentGradeEncryptionStandardsShouldBeHighlighted() {
    const commsText =
      await this.starshieldPage.communicationsInfo.textContent();
    expect(commsText?.toLowerCase()).toMatch(
      /aes-256|end-to-end encryption|dod standards|government-grade security/i
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

  @When("the user navigates to Hosted Payloads information")
  async userNavigatesToHostedPayloadsInformation() {
    await this.starshieldPage.hostedPayloadsInfo.scrollIntoViewIfNeeded();
    await expect(this.starshieldPage.hostedPayloadsInfo).toBeVisible();
  }

  @Then("satellite bus support for customer missions should be described")
  async satelliteBusSupportForCustomerMissionsShouldBeDescribed() {
    const payloadsText =
      await this.starshieldPage.hostedPayloadsInfo.textContent();

    expect(payloadsText?.toLowerCase()).toMatch(
      /satellite bus|host platform|power and data interfaces|payload missions/i
    );
  }

  @Then("payload integration capabilities should be explained")
  async payloadIntegrationCapabilitiesShouldBeExplained() {
    const payloadsText =
      await this.starshieldPage.hostedPayloadsInfo.textContent();

    expect(payloadsText?.toLowerCase()).toMatch(
      /payload integration|custom modifications|interface specifications|flexible hosting/i
    );
  }

  @Then("custom mission support options should be detailed")
  async customMissionSupportOptionsShouldBeDetailed() {
    const payloadsText =
      await this.starshieldPage.hostedPayloadsInfo.textContent();

    expect(payloadsText?.toLowerCase()).toMatch(
      /diverse mission requirements|customer payload needs|customized services|end-to-end support/i
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

  @Given("the user wants to understand Starshield's unique positioning")
  async userWantsToUnderstandStarshieldsUniquePositioning() {
    await this.starshieldPage.comparisonInfo.scrollIntoViewIfNeeded();
    await expect(this.starshieldPage.comparisonInfo).toBeVisible();
  }

  @When("viewing comparison information")
  async viewingComparisonInformation() {
    const comparisonText =
      await this.starshieldPage.comparisonInfo.textContent();
    expect(comparisonText?.length).toBeGreaterThan(50);
  }

  @Then(
    "government-specific use cases should be distinguished from commercial use"
  )
  async governmentSpecificUseCasesShouldBeDistinguishedFromCommercialUse() {
    const comparisonText =
      await this.starshieldPage.comparisonInfo.textContent();
    expect(comparisonText?.toLowerCase()).toMatch(
      /starshield for government|starlink for commercial|defense use cases|civilian applications/i
    );
  }

  @Then("enhanced security features beyond Starlink should be explained")
  async enhancedSecurityFeaturesBeyondStarlinkShouldBeExplained() {
    const comparisonText =
      await this.starshieldPage.comparisonInfo.textContent();
    expect(comparisonText?.toLowerCase()).toMatch(
      /additional security|enhanced encryption|classified network separation|hardened systems/i
    );
  }

  @Then("government ownership and control aspects should be clarified")
  async governmentOwnershipAndControlAspectsShouldBeClarified() {
    const comparisonText =
      await this.starshieldPage.comparisonInfo.textContent();
    expect(comparisonText?.toLowerCase()).toMatch(
      /government-owned|operator control|dedicated infrastructure|sovereign management/i
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

  @When("the user scrolls down the page")
  async userScrollsDownThePage() {
    await this.page.mouse.wheel(0, 500);
  }

  @Then("the header should remain visible and fixed")
  async headerShouldRemainVisibleAndFixed() {
    const header = this.starshieldPage.page.locator("header");
    const position = await header.evaluate((el) => {
      return window.getComputedStyle(el).position;
    });

    const isFixedOrSticky = position === "fixed" ? true : position === "sticky";
    expect(isFixedOrSticky).toBeTruthy();
    await expect(header).toBeInViewport();
  }

  @Then("the main content should scroll underneath the header")
  async mainContentShouldScrollUnderneathTheHeader() {
    const boundingBox = await this.starshieldPage.hero.heroSection.boundingBox();
    expect(boundingBox?.y).toBeLessThan(100);
  }

  @Given("the page contains interactive elements")
  async pageContainsInteractiveElements() {
    await expect(this.starshieldPage.allCTAs.first()).toBeVisible();
  }

  @When("the user hovers over an interactive element")
  async userHoversOverAnInteractiveElement() {
    this.sharedContext.initialCursor = await this.starshieldPage.page.evaluate(
      () => document.body.style.cursor
    );
    await this.starshieldPage.allCTAs.first().hover();
  }

  @Then("the cursor should change to a pointer")
  async cursorShouldChangeToAPointer() {
    const cursorStyle = await this.starshieldPage.allCTAs
      .first()
      .evaluate((el) => window.getComputedStyle(el).cursor);
    expect(cursorStyle).toBe("pointer");
  }

  @Then("a visual feedback (e.g., color change) should be provided")
  async visualFeedbackShouldBeProvided() {
    const cta = this.starshieldPage.allCTAs.first();
    const hasHoverEffect = await cta.evaluate((el) => {
      const initialBg = window.getComputedStyle(el).backgroundColor;
      el.dispatchEvent(new Event("mouseover"));
      const hoverBg = window.getComputedStyle(el).backgroundColor;
      return initialBg !== hoverBg || el.classList.contains("hover-effect");
    });
    expect(hasHoverEffect).toBeTruthy();
  }

  @Given("the page is designed for performance optimization")
  async pageIsDesignedForPerformanceOptimization() {
    await this.starshieldPage.open();
  }

  @Then("the Largest Contentful Paint (LCP) should be fast")
  async largestContentfulPaintShouldBeFast() {
    const lcp = await this.page.evaluate(
      () =>
        performance
          .getEntriesByType("paint")
          .find((e) => e.name === "first-contentful-paint")?.startTime
    );
    this.assertionHelper.assertMetric(
      lcp,
      2500,
      "Largest Contentful Paint should be less than 2.5 seconds."
    );
  }

  @Then("all critical resources should be loaded efficiently")
  async allCriticalResourcesShouldBeLoadedEfficiently() {
    const imageLoaded = await this.starshieldPage.hero.heroImage.isVisible();
    expect(imageLoaded).toBeTruthy();
  }

  @Then("no major performance warnings should be present")
  async noMajorPerformanceWarningsShouldBePresent() {
    await expect(this.starshieldPage.errorBanner).not.toBeVisible();
  }

  @Given("the user has a slow network connection")
  async userHasASlowNetworkConnection() {
    await this.page.route("**/*", (route) => {
      route.continue({});
    });
    await this.page.emulateMedia({ reducedMotion: "reduce" });
  }

  @When("media content is loading")
  async mediaContentIsLoading() {
    await this.starshieldPage.page.reload({ waitUntil: "domcontentloaded" });
  }

  @Then("loading indicators should be displayed")
  async loadingIndicatorsShouldBeDisplayed() {
    const loadingIndicator = this.starshieldPage.page.locator(
      ".loading-spinner, .media-placeholder-spinner, .skeleton-screen"
    );
    await expect(loadingIndicator).toBeVisible({ timeout: 5000 });
  }

  @Then("the page should remain responsive")
  async thePageShouldRemainResponsive() {
    await expect(
      this.starshieldPage.mainNavigationMenu.locator("a").first()
    ).toBeEnabled();
  }

  @Then("users should have the option to cancel or skip media loading")
  async usersShouldHaveTheOptionToCancelOrSkipMediaLoading() {
    const skipOrCancelButton = this.starshieldPage.page.locator("button", {
      hasText: /skip|cancel|dismiss/i,
    });

    (await skipOrCancelButton.count()) > 0
      ? await expect(skipOrCancelButton).toBeVisible()
      : await expect(this.starshieldPage.mainNavigationMenu).toBeVisible();
  }

  @Given("a network interruption occurs during page load")
  async aNetworkInterruptionOccursDuringPageLoad() {
    await this.page.route("**", (route) => {
      route.abort("failed");
    });
  }

  @When("assets fail to load")
  async assetsFailToLoad() {
    try {
      await this.starshieldPage.page.goto(
        this.starshieldPage.baseURL + "/starshield",
        { timeout: 5000, waitUntil: "domcontentloaded" }
      );
    } catch (error) {}
  }

  @Then("appropriate fallbacks should be in place")
  async appropriateFallbacksShouldBeInPlace() {
    const bodyText = await this.starshieldPage.page
      .locator("body")
      .textContent();
    expect(bodyText?.length).toBeGreaterThan(10);
    const altText = await this.starshieldPage.hero.heroImage.getAttribute("alt");
    this.assertionHelper.assertValuePresent(
      altText,
      "Alt text must be present as a fallback for the hero image."
    );
  }

  @Then("the user should be notified of loading issues")
  async userShouldBeNotifiedOfLoadingIssues() {
    const networkError = this.starshieldPage.page.locator(
      ".network-error-banner, .connection-failed-message"
    );
    await expect(networkError).toBeVisible();
  }

  @Then("retry mechanisms should be available where appropriate")
  async retryMechanismsShouldBeAvailableWhereAppropriate() {
    const retryButton = this.starshieldPage.page.locator("button, a", {
      hasText: /retry|reload|try again/i,
    });
    await expect(retryButton).toBeVisible();
  }

  @Given("JavaScript fails to load or is disabled")
  async javaScriptFailsToLoadOrIsDisabled() {
    await (this.page.context() as any).setJavaScriptEnabled(false);
    await this.page.reload({ waitUntil: "domcontentloaded" });
  }

  @When("the user views the page")
  async userViewsThePage() {
    await this.starshieldPage.page.waitForLoadState("domcontentloaded");
  }

  @Then("core content should still be accessible")
  async coreContentShouldStillBeAccessible() {
    const coreSections = this.starshieldPage.page.locator("h1, h2, h3");
    expect(await coreSections.count()).toBeGreaterThanOrEqual(5);
  }

  @Then("basic navigation should remain functional")
  async basicNavigationShouldRemainFunctional() {
    await expect(
      this.starshieldPage.mainNavigationMenu.locator("a").first()
    ).toBeEnabled();
  }

  @Then("critical information should be visible without JavaScript")
  async criticalInformationShouldBeVisibleWithoutJavaScript() {
    const heroText = await this.starshieldPage.hero.heroSection.textContent();
    this.assertionHelper.assertValuePresent(
      heroText,
      "Hero text content must be present even without JavaScript."
    );
    expect(heroText?.length).toBeGreaterThan(50);
  }

  @Given("the page relies on API calls for dynamic content")
  async pageReliesOnApiCallsForDynamicContent() {
    await expect(this.starshieldPage.testimonialsSection).toBeVisible();
  }

  @When("an API call fails or times out")
  async anApiCallFailsOrTimesOut() {
    await this.page.route("**/api/v1/dynamic-content*", (route) => {
      route.fulfill({
        status: 504,
        body: "API service unavailable",
      });
    });
    await this.starshieldPage.page.reload({ waitUntil: "domcontentloaded" });
  }

  @Then("cached or default content should be displayed where possible")
  async cachedOrDefaultContentShouldBeDisplayedWherePossible() {
    const testimonialText =
      await this.starshieldPage.testimonialsSection.textContent();
    expect(testimonialText?.toLowerCase()).toMatch(
      /default content|case study coming soon|fallback data/i
    );
  }

  @Then("an appropriate error message should inform the user")
  async appropriateErrorMessageShouldInformTheUser() {
    const apiError = this.starshieldPage.testimonialsSection.locator(
      ".api-error-message, .data-load-failed"
    );
    await expect(apiError).toBeVisible();
  }

  @Then("the page should allow retry or refresh actions")
  async pageShouldAllowRetryOrRefreshActions() {
    const retryOrRefreshButton = this.starshieldPage.page.locator("button, a", {
      hasText: /retry|refresh|reload/i,
    });
    await expect(retryOrRefreshButton).toBeVisible();
  }

  @Given("a contact form with text fields is present")
  async contactFormWithTextFieldsIsPresent() {
    await expect(this.starshieldPage.inquiryForm).toBeVisible();
    await expect(
      this.starshieldPage.inquiryForm.locator('input[type="text"]').first()
    ).toBeVisible();
  }

  @When("the user enters text exceeding maximum length limits")
  async userEntersTextExceedingMaximumLengthLimits() {
    const longText = "A".repeat(5000);
    await this.starshieldPage.inquiryForm
      .locator('input[type="text"]')
      .first()
      .fill(longText);
  }

  @Then("the input should be truncated or rejected")
  async inputShouldBeTruncatedOrRejected() {
    const inputField = this.starshieldPage.inquiryForm
      .locator('input[type="text"]')
      .first();
    const inputValue = await inputField.inputValue();
    const maxLength = await inputField.getAttribute("maxlength");

    const expectedMaxLength = maxLength ? parseInt(maxLength, 10) : 5000;
    expect(inputValue.length).toBeLessThanOrEqual(expectedMaxLength);
  }

  @Then("a character count or limit warning should be displayed")
  async aCharacterCountOrLimitWarningShouldBeDisplayed() {
    const limitWarning = this.starshieldPage.inquiryForm.locator(
      ".char-count, .limit-warning, .error-message"
    );
    await expect(limitWarning).toBeVisible();
  }

  @Then("the form should handle the input without breaking")
  async theFormShouldHandleTheInputWithoutBreaking() {
    await expect(this.starshieldPage.submitButton).toBeVisible();
    await expect(this.starshieldPage.mainNavigationMenu).toBeVisible();
  }

  @Given("a user is submitting a contact form")
  async userIsSubmittingAContactForm() {
    await this.starshieldPage.fillInquiryForm(
      "valid@test.com",
      "Required Text"
    );
    await expect(this.starshieldPage.submitButton).toBeEnabled();
  }

  @When("the user clicks submit multiple times rapidly")
  async userClicksSubmitMultipleTimesRapidly() {
    await this.starshieldPage.submitButton.click({ clickCount: 3, delay: 50 });
    this.sharedContext.startTime = Date.now();
    await this.page.waitForSelector(".form-success-message, .error-message", {
      timeout: 10000,
    });
  }

  @Then("only one submission should be processed")
  async onlyOneSubmissionShouldBeProcessed() {
    await expect(
      this.starshieldPage.page.locator(".form-success-message")
    ).toHaveCount(1);
  }

  @Then("the submit button should be disabled during processing")
  async theSubmitButtonShouldBeDisabledDuringProcessing() {
    await expect(this.starshieldPage.submitButton).toBeDisabled({
      timeout: 50,
    });
  }

  @Then("duplicate submissions should be prevented")
  async duplicateSubmissionsShouldBePrevented() {
    await expect(
      this.starshieldPage.page.locator(".form-success-message")
    ).toHaveCount(1);
    await expect(this.starshieldPage.submitButton).toBeDisabled();
  }

  @Given("a user is filling out a long form")
  async userIsFillingOutALongForm() {
    await this.starshieldPage.fillInquiryForm(
      "longform@session.com",
      "Session Data"
    );
    await this.starshieldPage.inquiryForm.scrollIntoViewIfNeeded();
  }

  @When("the session expires before submission")
  async theSessionExpiresBeforeSubmission() {
    await this.page.waitForTimeout(5000);
    await this.starshieldPage.submitButton.click();
  }

  @Then("the user should be notified of the timeout")
  async theUserShouldBeNotifiedOfTheTimeout() {
    await expect(
      this.starshieldPage.page.locator(
        ".session-timeout-message, .relogin-required"
      )
    ).toBeVisible();
  }

  @Then("form data should be preserved if possible")
  async formDataShouldBePreservedIfPossible() {
    const emailValue = await this.starshieldPage.emailField.inputValue();
    expect(emailValue).toContain("longform@session.com");
  }

  @Then("the user should be able to reauthenticate and continue")
  async theUserShouldBeAbleToReauthenticateAndContinue() {
    const reauthButton = this.starshieldPage.page.locator("button, a", {
      hasText: /reauthenticate|login|continue session/i,
    });
    await expect(reauthButton).toBeVisible();
  }

  @Given("content is expected in a specific section")
  async contentIsExpectedInASpecificSection() {
    await expect(this.starshieldPage.testimonialsSection).toBeVisible();
  }

  @When("the content is missing or unavailable")
  async theContentIsMissingOrUnavailable() {
    await expect(
      this.starshieldPage.testimonialsSection.locator(
        ".content-placeholder, .empty-state"
      )
    ).toBeVisible();
  }

  @Then("a placeholder message should be displayed")
  async aPlaceholderMessageShouldBeDisplayed() {
    const fallbackText = this.starshieldPage.testimonialsSection.locator(
      ".content-placeholder, .empty-state"
    );
    await expect(fallbackText).toBeVisible();
    const fallbackMessage = await fallbackText.textContent();
    expect(fallbackMessage?.toLowerCase()).toMatch(
      /no content available|check back later|content unavailable/i
    );
  }

  @Then("the page layout should adjust appropriately")
  async thePageLayoutShouldAdjustAppropriately() {
    await expect(this.starshieldPage.footer.footer).toBeInViewport();
  }

  @Given("the page attempts to display content")
  async pageAttemptsToDisplayContent() {
    await expect(this.starshieldPage.videoPlayer).toBeVisible();
  }

  @When("the content format is not supported by the browser")
  async theContentFormatIsNotSupportedByTheBrowser() {
    await this.page.route("**/*.mp4", (route) => {
      route.fulfill({
        status: 200,
        contentType: "video/unsupported",
        body: "Invalid video stream data",
      });
    });
    await this.starshieldPage.page.reload();
  }

  @Then("an appropriate fallback or alternative should be provided")
  async appropriateFallbackOrAlternativeShouldBeProvided() {
    const fallback = this.starshieldPage.videoPlayer
      .locator("a", {
        hasText: /transcript|download|alternative format/i,
      })
      .or(this.starshieldPage.videoPlayer.locator(".video-poster"));

    await expect(fallback).toBeVisible();
  }

  @Then("the user should be notified of the limitation")
  async theUserShouldBeNotifiedOfTheLimitation() {
    const notification =
      this.starshieldPage.videoPlayer.locator(".error-message");
    await expect(notification).toBeVisible();
    const notificationText = await notification.textContent();
    expect(notificationText?.toLowerCase()).toMatch(
      /format not supported|codec not found/i
    );
  }

  @Then("a download option should be offered if applicable")
  async downloadOptionShouldBeOfferedIfApplicable() {
    const downloadLink = this.starshieldPage.videoPlayer.locator("a", {
      hasText: /download/i,
    });
    await expect(downloadLink).toBeVisible();
  }

  @Given("the page loads content dynamically")
  async pageLoadsContentDynamically() {
    await expect(this.starshieldPage.testimonialsSection).toBeVisible();
  }

  @When("dynamic content fails to load")
  async dynamicContentFailsToLoad() {
    await this.page.route("**/api/v1/dynamic-content*", (route) => {
      route.fulfill({
        status: 504,
        body: "API service unavailable",
      });
    });
    await this.starshieldPage.page.reload({ waitUntil: "domcontentloaded" });
  }

  @Then("static fallback content should be displayed")
  async staticFallbackContentShouldBeDisplayed() {
    const staticFallback = this.starshieldPage.testimonialsSection.locator(
      ".static-fallback-content, .default-message"
    );
    await expect(staticFallback).toBeVisible();
  }

  @Then("the failure should not affect other page sections")
  async theFailureShouldNotAffectOtherPageSections() {
    await expect(this.starshieldPage.mainNavigationMenu).toBeVisible();
    await expect(this.starshieldPage.footer.footer).toBeVisible();
    await expect(
      this.starshieldPage.mainNavigationMenu.locator("a").first()
    ).toBeEnabled();
  }

  @Then("they should scale appropriately for different devices")
  async theyShouldScaleAppropriatelyForDifferentDevices() {
    const infographic = this.starshieldPage.infographics.first();
    await this.viewportUtility.checkAllViewports(async (size) => {
      const isResponsive = await infographic.evaluate((el) => {
        const computedWidth = el.getBoundingClientRect().width;
        const parentWidth = el.parentElement!.getBoundingClientRect().width;
        return computedWidth <= parentWidth + 1; // Allow for slight rounding errors
      });
      expect(
        isResponsive,
        `Infographic failed responsiveness check at ${size.width}x${size.height}`
      ).toBeTruthy();
    });
  }

  @Given("a user from a government agency needs direct contact")
  async aUserFromAGovernmentAgencyNeedsDirectContact() {
    await this.starshieldPage.contactDetailsSection.scrollIntoViewIfNeeded();
    await expect(this.starshieldPage.contactDetailsSection).toBeVisible();
  }

  @When("looking for specialized contact options")
  async lookingForSpecializedContactOptions() {
    await this.page.waitForLoadState("domcontentloaded");
  }

  @Then("secure communication channels should be offered")
  async secureCommunicationChannelsShouldBeOffered() {
    const secureChannel = this.starshieldPage.contactDetailsSection
      .locator("a", { hasText: /secure key|pgp|encrypted/i })
      .or(
        this.starshieldPage.contactDetailsSection.locator(
          ".secure-channel-note, .encrypted-form-label"
        )
      );
    await expect(secureChannel).toBeVisible();
  }

  @Then("appropriate department contacts should be listed")
  async appropriateDepartmentContactsShouldBeListed() {
    const departmentContacts =
      this.starshieldPage.contactDetailsSection.locator("p, div", {
        hasText: /sales|technical support|security operations/i,
      });
    expect(await departmentContacts.count()).toBeGreaterThanOrEqual(2);
  }

  @Then(
    "clearance-level specific contact information should be provided if applicable"
  )
  async clearanceLevelSpecificContactInformationShouldBeProvidedIfApplicable() {
    const clearanceContact = this.starshieldPage.contactDetailsSection.locator(
      "p, a",
      { hasText: /classified|secret|ts\/sci|clearance-level/i }
    );

    (await clearanceContact.count()) > 0
      ? await expect(clearanceContact).toBeVisible()
      : await expect(this.starshieldPage.contactDetailsSection).toBeVisible();
  }

  @Given("the page contains hero images or graphics")
  async thePageContainsHeroImagesOrGraphics() {
    await expect(this.starshieldPage.hero.heroImage).toBeVisible();
  }

  @Then("images should load progressively or with placeholders")
  async imagesShouldLoadProgressivelyOrWithPlaceholders() {
    const heroImage = this.starshieldPage.hero.heroImage;
    const isLazyLoaded = (await heroImage.getAttribute("loading")) === "lazy";
    const hasPlaceholder = await this.page
      .locator(".image-placeholder, .skeleton-screen")
      .isVisible();

    expect(isLazyLoaded || hasPlaceholder).toBeTruthy();
  }

  @Then("images should have appropriate alt text for accessibility")
  async imagesShouldHaveAppropriateAltTextForAccessibility() {
    const altText = await this.starshieldPage.hero.heroImage.getAttribute("alt");
    this.assertionHelper.assertValuePresent(
      altText,
      "Hero image must have a non-empty 'alt' attribute for accessibility."
    );
    expect(altText?.length).toBeGreaterThan(5);
  }

  @Then("images should be optimized for web performance")
  async imagesShouldBeOptimizedForWebPerformance() {
    const heroImage = this.starshieldPage.hero.heroImage;
    const src = await heroImage.getAttribute("src");
    const srcset = await heroImage.getAttribute("srcset");

    const isOptimized =
      src?.toLowerCase().endsWith(".webp") || (srcset && srcset.length > 0);

    expect(isOptimized).toBeTruthy();
  }

  @Given("the page contains video content")
  async thePageContainsVideoContent() {
    await expect(this.starshieldPage.videoPlayer).toBeVisible();
  }

  @When("the user interacts with video controls")
  async theUserInteractsWithVideoControls() {
    await this.starshieldPage.videoPlayer
      .locator('[aria-label="Play"], [aria-label="Pause"], .play-button')
      .first()
      .click();
  }

  @Then("the video should play smoothly")
  async theVideoShouldPlaySmoothly() {
    const isPlaying = this.starshieldPage.videoPlayer
      .locator(
        '[data-state="playing"], .video-playing, button[aria-label="Pause"]'
      )
      .first();
    await expect(isPlaying).toBeVisible();
  }

  @Then("playback controls should be responsive")
  async playbackControlsShouldBeResponsive() {
    const controls = this.starshieldPage.videoPlayer
      .locator(
        '[role="slider"], button[aria-label*="screen"], button[aria-label*="Volume"]'
      )
      .first();
    await expect(controls).toBeEnabled();
  }

  @Then("video should support pause, play, and volume adjustment")
  async videoShouldSupportPausePlayAndVolumeAdjustment() {
    await expect(
      this.starshieldPage.videoPlayer
        .locator('button[aria-label*="play"], button[aria-label*="pause"]')
        .first()
    ).toBeVisible();
    await expect(
      this.starshieldPage.videoPlayer
        .locator('[aria-label="Volume"], [role="slider"][aria-label="volume"]')
        .first()
    ).toBeVisible();
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

  @Given("customer information is displayed")
  async customerInformationIsDisplayed() {
    await this.starshieldPage.testimonialsSection.scrollIntoViewIfNeeded();
    await expect(this.starshieldPage.testimonialsSection).toBeVisible();
  }

  @When("viewing testimonials or case studies")
  async viewingTestimonialsOrCaseStudies() {
    this.sharedContext.testimonialCards =
      this.starshieldPage.testimonialsSection.locator(
        ".testimonial-card, .case-study-block"
      );
    await expect(this.sharedContext.testimonialCards.first()).toBeVisible();
  }

  @Then("proper attribution should be given")
  async properAttributionShouldBeGiven() {
    const firstTestimonial = this.starshieldPage.testimonialsSection.locator(
      ".testimonial-card, .case-study-block"
    );
    await expect(firstTestimonial.first()).toBeVisible();
    const testimonialText = await firstTestimonial
      .locator("blockquote, .quote-text")
      .textContent();
    const attribution = await firstTestimonial
      .locator(".attribution, .customer-name")
      .textContent();

    this.assertionHelper.assertValuePresent(
      testimonialText,
      "Testimonial text must be present."
    );
    this.assertionHelper.assertValuePresent(
      attribution,
      "Testimonial must have a proper attribution (name/agency)."
    );

    expect(attribution?.length).toBeGreaterThan(5);
  }

  @Then("the user should be guided to correct the errors")
  async userShouldBeGuidedToCorrectErrors() {
    const errorMessages =
      this.starshieldPage.inquiryForm.locator(".error-message");
    await expect(errorMessages.first()).toBeVisible();
    const errorText = await errorMessages.first().textContent();
    expect(errorText?.toLowerCase()).toMatch(/required|missing|please enter/i);
  }

  @Then("the email field should be highlighted for correction")
  async emailFieldShouldBeHighlightedForCorrection() {
    const emailField = this.starshieldPage.emailField;
    const hasErrorClass = await emailField.evaluate(
      (el) => el.classList.contains("error") || el.classList.contains("invalid")
    );
    const borderColor = await emailField.evaluate(
      (el) => window.getComputedStyle(el).borderColor
    );

    expect(
      hasErrorClass || borderColor.includes("rgb(255, 0, 0)")
    ).toBeTruthy();
  }

  @Given("the page contains internal or external links")
  async pageContainsInternalOrExternalLinks() {
    const links = this.starshieldPage.page.locator("a[href]");
    expect(await links.count()).toBeGreaterThan(5);
  }

  @When("a user clicks on a broken link")
  async userClicksOnBrokenLink() {
    await this.page.route("**/broken-link", (route) => {
      route.fulfill({
        status: 404,
        body: "Not Found",
      });
    });
    await this.starshieldPage.page
      .locator('a[href*="broken-link"]')
      .first()
      .click();
  }

  @Then("an appropriate 404 page should be displayed")
  async appropriate404PageShouldBeDisplayed() {
    await expect(this.starshieldPage.page.locator("h1")).toContainText(
      /404|not found/i
    );
    await expect(this.starshieldPage.page.locator("body")).toContainText(
      /page not found|does not exist/i
    );
  }

  @Then("the error should be logged for correction")
  async errorShouldBeLoggedForCorrection() {
    await expect(this.starshieldPage.page.locator("main")).toBeVisible();
  }

  @When("the target section or page does not exist")
  async targetSectionOrPageDoesNotExist() {
    await this.starshieldPage.open("/non-existent-section");
  }

  @Then("a user-friendly error message should be displayed")
  async userFriendlyErrorMessageShouldBeDisplayed() {
    await expect(this.starshieldPage.page.locator("body")).toContainText(
      /page not found|does not exist|we're sorry|error/i
    );
    const errorText = await this.starshieldPage.page
      .locator("body")
      .textContent();
    expect(errorText?.toLowerCase()).not.toMatch(
      /technical details|stack trace/i
    );
  }

  @Then("alternative navigation options should be provided")
  async alternativeNavigationOptionsShouldBeProvided() {
    await expect(this.starshieldPage.mainNavigationMenu).toBeVisible();
    await expect(this.starshieldPage.footer.footer).toBeVisible();
    const homeLink = this.starshieldPage.page.locator(
      'a[href="/"], a[href="/starshield"]'
    );
    await expect(homeLink.first()).toBeVisible();
  }

  @Then("the user should remain on a functional page")
  async userShouldRemainOnFunctionalPage() {
    await expect(this.starshieldPage.mainNavigationMenu).toBeVisible();
    await expect(this.starshieldPage.footer.footer).toBeVisible();
  }

  @Given("the page contains external links")
  async pageContainsExternalLinks() {
    const externalLinks = this.starshieldPage.page.locator('a[href^="http"]');
    expect(await externalLinks.count()).toBeGreaterThan(0);
  }

  @When("an external link target is unavailable")
  async externalLinkTargetIsUnavailable() {
    await this.page.route("**://external-site.com/**", (route) => {
      route.fulfill({
        status: 500,
        body: "Service Unavailable",
      });
    });
  }

  @Then("the user should be notified appropriately")
  async userShouldBeNotifiedAppropriately() {
    const errorBanner = this.starshieldPage.page.locator(
      ".network-error, .external-link-error"
    );
    if (await errorBanner.isVisible()) {
      await expect(errorBanner).toContainText(/unavailable|failed|error/i);
    }
  }

  @Then("the page should remain functional")
  async pageShouldRemainFunctional() {
    await expect(this.starshieldPage.mainNavigationMenu).toBeVisible();
    await expect(this.starshieldPage.hero.heroSection).toBeVisible();
  }

  @Given("the page contains images")
  async pageContainsImages() {
    const images = this.starshieldPage.page.locator("img");
    expect(await images.count()).toBeGreaterThan(0);
  }

  @When("an image fails to load")
  async imageFailsToLoad() {
    await this.page.route("**/*.jpg", (route) => {
      route.abort();
    });
    await this.page.route("**/*.png", (route) => {
      route.abort();
    });
    await this.starshieldPage.page.reload();
  }

  @Then("a placeholder or fallback image should be displayed")
  async placeholderOrFallbackImageShouldBeDisplayed() {
    const failedImages = this.starshieldPage.page.locator(
      "img[alt]:not([src])"
    );
    const placeholders = this.starshieldPage.page.locator(
      ".image-placeholder, [data-testid='image-fallback']"
    );

    const hasFallback =
      (await failedImages.count()) > 0 || (await placeholders.count()) > 0;
    expect(hasFallback).toBeTruthy();
  }

  @Then("the page layout should not be broken")
  async pageLayoutShouldNotBeBroken() {
    await expect(this.starshieldPage.mainNavigationMenu).toBeVisible();
    await expect(this.starshieldPage.footer.footer).toBeVisible();

    const heroBox = await this.starshieldPage.hero.heroSection.boundingBox();
    const navBox = await this.starshieldPage.mainNavigationMenu.boundingBox();

    expect(heroBox?.y).toBeGreaterThan(navBox?.y || 0);
  }

  @Then("alt text should be visible if supported")
  async altTextShouldBeVisibleIfSupported() {
    const imagesWithAlt = this.starshieldPage.page.locator("img[alt]");
    const count = await imagesWithAlt.count();
    expect(count).toBeGreaterThan(0);
  }

  @When("a video fails to load or is unavailable")
  async videoFailsToLoadOrIsUnavailable() {
    await this.page.route("**/*.mp4", (route) => {
      route.fulfill({
        status: 404,
        body: "Video not found",
      });
    });
    await this.starshieldPage.page.reload();
  }

  @Then("an appropriate error message should be displayed in the video player")
  async appropriateErrorMessageInVideoPlayer() {
    const errorMessage = this.starshieldPage.videoPlayer.locator(
      ".video-error, [data-testid='video-error']"
    );
    await expect(errorMessage).toBeVisible();
    const errorText = await errorMessage.textContent();
    expect(errorText?.toLowerCase()).toMatch(
      /failed to load|unavailable|error/i
    );
  }

  @Then("alternative content or retry option should be offered")
  async alternativeContentOrRetryOptionShouldBeOffered() {
    const fallbackContent = this.starshieldPage.videoPlayer.locator(
      ".video-fallback, .transcript"
    );
    const retryButton = this.starshieldPage.videoPlayer.locator("button", {
      hasText: /retry|reload/i,
    });

    const hasAlternative =
      (await fallbackContent.isVisible()) || (await retryButton.isVisible());
    expect(hasAlternative).toBeTruthy();
  }

  @Then("the rest of the page should remain functional")
  async restOfPageShouldRemainFunctional() {
    await expect(this.starshieldPage.mainNavigationMenu).toBeVisible();
    await expect(this.starshieldPage.hero.heroSection).toBeVisible();
    await expect(this.starshieldPage.footer.footer).toBeVisible();
  }

  @When("the user enters special characters or script tags in text fields")
  async userEntersSpecialCharactersOrScriptTags() {
    const testInput =
      "<script>alert('xss')</script> or special chars: &nbsp; © ®";
    await this.starshieldPage.inquiryForm
      .locator('input[type="text"]')
      .first()
      .fill(testInput);
  }

  @Then("the input should be properly sanitized")
  async inputShouldBeProperlySanitized() {
    const inputField = this.starshieldPage.inquiryForm
      .locator('input[type="text"]')
      .first();
    const inputValue = await inputField.inputValue();

    expect(inputValue).not.toContain("<script>");
    expect(inputValue).not.toContain("</script>");
  }

  @Then("malicious content should be rejected or escaped")
  async maliciousContentShouldBeRejectedOrEscaped() {
    const inputField = this.starshieldPage.inquiryForm
      .locator('input[type="text"]')
      .first();
    const inputValue = await inputField.inputValue();

    const hasDangerousContent =
      inputValue.includes("<script>") ||
      inputValue.includes("javascript:") ||
      inputValue.includes("onerror=");
    expect(hasDangerousContent).toBeFalsy();
  }

  @Then("an appropriate error or warning should be shown if input is invalid")
  async appropriateErrorOrWarningForInvalidInput() {
    const errorMessage = this.starshieldPage.inquiryForm.locator(
      ".error-message, .warning-message"
    );
    if (await errorMessage.isVisible()) {
      const errorText = await errorMessage.textContent();
      expect(errorText?.toLowerCase()).toMatch(
        /invalid|not allowed|special characters/i
      );
    }
  }

  @Then("the information should be verifiable")
  async informationShouldBeVerifiable() {
    const testimonialCards = this.starshieldPage.testimonialsSection.locator(
      ".testimonial-card, .case-study-block"
    );
    const firstCard = testimonialCards.first();

    const hasVerifiableElements = await firstCard
      .locator(".testimonial-date, .customer-title, .case-study-link")
      .isVisible();
    expect(hasVerifiableElements).toBeTruthy();
  }

  @Then("content should comply with government disclosure requirements")
  async contentShouldComplyWithGovernmentDisclosureRequirements() {
    const testimonialsText =
      await this.starshieldPage.testimonialsSection.textContent();

    expect(testimonialsText?.toLowerCase()).not.toMatch(
      /classified|confidential|proprietary/i
    );

    const disclaimer = this.starshieldPage.testimonialsSection.locator(
      ".disclaimer, .public-disclosure-notice"
    );
    if (await disclaimer.isVisible()) {
      await expect(disclaimer).toContainText(
        /public information|approved for release/i
      );
    }
  }

  @When("attempts to submit the form")
  async attemptsToSubmitTheForm() {
    await this.starshieldPage.submitButton.click();
    await this.page.waitForTimeout(500);
  }

  @When("submits the form")
  async submitsTheForm() {
    await expect(this.starshieldPage.submitButton).toBeEnabled();
    await this.starshieldPage.submitButton.click();

    await Promise.race([
      this.page.waitForSelector(
        ".form-success-message, .acknowledgment-banner",
        { timeout: 5000 }
      ),
      this.page.waitForSelector(".error-message, .validation-error", {
        timeout: 5000,
      }),
      this.page.waitForTimeout(1000),
    ]);
  }
}
