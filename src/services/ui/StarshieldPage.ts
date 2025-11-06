import { Page, Locator } from "@playwright/test";
import { SpaceXPage } from "../base/SpaceXPage";
import { HeroPOF } from "../fragments/HeroPOF";

export class StarshieldPage extends SpaceXPage {
  readonly hero: HeroPOF;
  readonly starshieldBranding: Locator;
  readonly mainNavigationMenu: Locator;
  readonly servicesSection: Locator;
  readonly earthObservationInfo: Locator;
  readonly communicationsInfo: Locator;
  readonly hostedPayloadsInfo: Locator;
  readonly securitySpecifications: Locator;
  readonly comparisonInfo: Locator;
  readonly complianceInfo: Locator;
  readonly contactDetailsSection: Locator;
  readonly inquiryForm: Locator;
  readonly submitButton: Locator;
  readonly emailField: Locator;
  readonly secureChannelsInfo: Locator;
  readonly videoPlayer: Locator;
  readonly infographics: Locator;
  readonly technicalSpecs: Locator;
  readonly testimonialsSection: Locator;
  readonly allCTAs: Locator;
  readonly errorBanner: Locator;
  readonly breadcrumb: Locator;
  readonly currentPageBreadcrumbItem: Locator;
  readonly parentBreadcrumbLinks: Locator;
  readonly useCasesSection: Locator;

  constructor(page: Page) {
    super(page);
    this.hero = new HeroPOF(page);
    this.errorBanner = this.page.locator(".global-error-message, .error-toast");
    this.breadcrumb = this.page.locator(".breadcrumb-nav");
    this.currentPageBreadcrumbItem = this.breadcrumb.locator(
      "li.current-page, span.current-page"
    );
    this.parentBreadcrumbLinks = this.breadcrumb.locator(".breadcrumb-nav a");
    this.useCasesSection = this.page.locator(
      "#government-use-cases, #reconnaissance-info"
    );

    this.starshieldBranding = this.page.locator(".starshield-logo");
    this.mainNavigationMenu = this.page.locator("nav.main-nav");
    this.servicesSection = this.page.locator("#services-section");
    this.allCTAs = this.page.locator("a.cta-button, button.cta-button");
    this.inquiryForm = this.page.locator("form#contact-inquiry-form");
    this.submitButton = this.inquiryForm.locator('button[type="submit"]');
    this.emailField = this.inquiryForm.locator('input[type="email"]');
    this.contactDetailsSection = this.page.locator("#contact-section");
    this.secureChannelsInfo = this.contactDetailsSection.locator(
      ".secure-contact-info"
    );

    this.earthObservationInfo = this.page.locator("#earth-observation-details");
    this.communicationsInfo = this.page.locator("#communications-details");
    this.hostedPayloadsInfo = this.page.locator("#hosted-payloads-details");

    this.securitySpecifications = this.page.locator("#security-specs");
    this.comparisonInfo = this.page.locator("#starshield-starlink-comparison");
    this.complianceInfo = this.page.locator("#compliance-certifications");

    this.videoPlayer = this.page.locator("video-player");
    this.infographics = this.page.locator(".technical-diagrams img");
    this.technicalSpecs = this.page.locator("#technical-specifications-table");
    this.testimonialsSection = this.page.locator("#customer-testimonials");
  }

  async navigate(urlPath: string = "/starshield"): Promise<void> {
    this.setupErrorListeners();
    await this.open(urlPath);
    await this.waitForAppContentLoad();
  }

  async clickNavigationMenuItem(itemName: string): Promise<void> {
    await this.mainNavigationMenu.locator("a", { hasText: itemName }).click();
  }

  async hoverOverCTA(ctaText: string): Promise<void> {
    await this.allCTAs.filter({ hasText: ctaText }).first().hover();
  }

  async clickCTA(ctaText: string): Promise<void> {
    await this.allCTAs.filter({ hasText: ctaText }).first().click();
  }

  async fillInquiryForm(
    email: string,
    requiredField: string,
    longText: string = ""
  ): Promise<void> {
    await this.inquiryForm
      .locator('input[type="text"]')
      .first()
      .fill(requiredField);
    await this.emailField.fill(email);
    if (longText) {
      await this.inquiryForm.locator("textarea").first().fill(longText);
    }
  }

  async submitInquiryForm(): Promise<void> {
    await this.submitButton.click();
  }
}
