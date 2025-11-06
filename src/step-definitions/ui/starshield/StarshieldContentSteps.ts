import { expect, Page } from "@playwright/test";
import { Given, When, Then, Fixture } from "playwright-bdd/decorators";
import { StarshieldPage } from "../../../services/ui/StarshieldPage";
import { SharedContext } from "../../../utils/types/Types";
import { AssertionHelper } from "../../../utils/AssertionHelper";

@Fixture("starshieldContentSteps")
export class StarshieldContentSteps {
  constructor(
    private page: Page,
    private starshieldPage: StarshieldPage,
    private sharedContext: SharedContext,
    private assertionHelper: AssertionHelper
  ) {}

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
}
