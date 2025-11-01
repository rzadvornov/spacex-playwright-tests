import { Page, Locator } from "@playwright/test";
import { SpaceXPage } from "../base/SpaceXPage";

export class SuppliersPage extends SpaceXPage {
  readonly supplierProgramSection: Locator;
  readonly contactInformation: Locator;
  readonly qualificationCriteria: Locator;
  readonly supplierRegistrationForm: Locator;
  readonly registrationForm: Locator;
  readonly confirmationMessage: Locator;
  readonly applicationReference: Locator;
  readonly reviewTimeline: Locator;
  readonly resourcesSection: Locator;
  readonly faqSection: Locator;
  readonly activeRFQsSection: Locator;
  readonly supplierPortalLogin: Locator;
  readonly loginForm: Locator;
  readonly passwordReset: Locator;

  constructor(page: Page) {
    super(page);

    this.supplierProgramSection = page
      .locator('[data-testid="supplier-program"], .supplier-program, section')
      .first();
    this.contactInformation = page
      .locator(
        '[data-testid="contact-info"], .contact-information, .supplier-contact'
      )
      .first();
    this.qualificationCriteria = page
      .locator(
        '[data-testid="qualification-criteria"], .qualification-criteria, .requirements'
      )
      .first();
    this.supplierRegistrationForm = page
      .locator(
        '[data-testid="supplier-registration"], .supplier-registration, form'
      )
      .first();
    this.registrationForm = this.supplierRegistrationForm;
    this.confirmationMessage = page
      .locator(
        '[data-testid="confirmation-message"], .confirmation-message, .success-message'
      )
      .first();
    this.applicationReference = page
      .locator(
        '[data-testid="application-reference"], .reference-number, .application-id'
      )
      .first();
    this.reviewTimeline = page
      .locator('[data-testid="review-timeline"], .timeline, .review-time')
      .first();
    this.resourcesSection = page
      .locator(
        '[data-testid="supplier-resources"], .supplier-resources, .resources'
      )
      .first();
    this.faqSection = page
      .locator('[data-testid="supplier-faq"], .faq-section, .faq')
      .first();
    this.activeRFQsSection = page
      .locator('[data-testid="active-rfqs"], .rfq-opportunities, .rfq-list')
      .first();
    this.supplierPortalLogin = page
      .locator(
        '[data-testid="supplier-portal"], .supplier-portal, .portal-login'
      )
      .first();
    this.loginForm = page
      .locator('[data-testid="login-form"], .login-form, form')
      .first();
    this.passwordReset = page
      .locator(
        '[data-testid="password-reset"], .password-reset, .forgot-password'
      )
      .first();
  }

  async navigateToSuppliersPage(urlPath: string = "/suppliers"): Promise<void> {
    this.setupErrorListeners();
    await this.open(urlPath);
    await this.waitForAppContentLoad();
  }

  async isSupplierProgramInfoVisible(): Promise<boolean> {
    return await this.supplierProgramSection.isVisible();
  }

  async getProgramBenefitsText(): Promise<string> {
    const benefitsText = await this.supplierProgramSection.textContent();
    return benefitsText?.trim() || "";
  }

  async getContactInformation(): Promise<string> {
    return (await this.contactInformation.textContent()) || "";
  }

  async isContactInfoDisplayed(): Promise<boolean> {
    return await this.contactInformation.isVisible();
  }

  async isQualificationCriteriaVisible(): Promise<boolean> {
    return await this.qualificationCriteria.isVisible();
  }

  async getQualificationCriteriaText(): Promise<string> {
    return (await this.qualificationCriteria.textContent()) || "";
  }

  async isRegistrationFormAccessible(): Promise<boolean> {
    return await this.supplierRegistrationForm.isVisible();
  }

  async getRequiredFormFields(): Promise<string[]> {
    const requiredFields: string[] = [];

    const companyFields = ["company", "legal name", "address"];
    for (const field of companyFields) {
      const fieldLocator = this.registrationForm.locator(
        `[name*="${field}"], [id*="${field}"]`
      );
      if ((await fieldLocator.count()) > 0) {
        requiredFields.push(field);
      }
    }

    const productsField = this.registrationForm.locator(
      '[name*="product"], [name*="service"], [id*="product"], [id*="service"]'
    );
    if ((await productsField.count()) > 0) {
      requiredFields.push("products/services");
    }

    const certsField = this.registrationForm.locator(
      '[name*="certification"], [name*="qualification"], [id*="cert"], [id*="qual"]'
    );
    if ((await certsField.count()) > 0) {
      requiredFields.push("certifications");
    }

    const contactFields = ["email", "phone", "contact"];
    for (const field of contactFields) {
      const fieldLocator = this.registrationForm.locator(
        `[name*="${field}"], [id*="${field}"]`
      );
      if ((await fieldLocator.count()) > 0) {
        requiredFields.push("contact details");
        break;
      }
    }

    const referencesField = this.registrationForm.locator(
      '[name*="reference"], [id*="reference"]'
    );
    if ((await referencesField.count()) > 0) {
      requiredFields.push("references");
    }

    return requiredFields;
  }

  async submitRegistrationForm(): Promise<void> {
    const submitButton = this.registrationForm.locator(
      'button[type="submit"], input[type="submit"]'
    );
    await submitButton.click();
  }

  async isConfirmationMessageVisible(): Promise<boolean> {
    return await this.confirmationMessage.isVisible();
  }

  async getApplicationReferenceNumber(): Promise<string> {
    return (await this.applicationReference.textContent()) || "";
  }

  async getReviewTimeline(): Promise<string> {
    return (await this.reviewTimeline.textContent()) || "";
  }

  async areResourcesAvailable(): Promise<boolean> {
    return await this.resourcesSection.isVisible();
  }

  async getAvailableResources(): Promise<string[]> {
    const resources: string[] = [];
    const resourceLinks = this.resourcesSection.locator(
      'a[href*=".pdf"], a[href*="download"]'
    );

    const count = await resourceLinks.count();
    for (let i = 0; i < count; i++) {
      const text = await resourceLinks.nth(i).textContent();
      if (text) {
        resources.push(text.trim());
      }
    }

    return resources;
  }

  async isFAQSectionVisible(): Promise<boolean> {
    return await this.faqSection.isVisible();
  }

  async getFAQTopics(): Promise<string[]> {
    const topics: string[] = [];
    const faqItems = this.faqSection.locator("details, .faq-item, [data-faq]");

    const count = await faqItems.count();
    for (let i = 0; i < count; i++) {
      const question = await faqItems
        .nth(i)
        .locator("summary, .question, h3")
        .textContent();
      if (question) {
        topics.push(question.trim());
      }
    }

    return topics;
  }

  async areActiveRFQsDisplayed(): Promise<boolean> {
    return await this.activeRFQsSection.isVisible();
  }

  async getActiveRFQCount(): Promise<number> {
    const rfqItems = this.activeRFQsSection.locator(
      ".rfq-item, [data-rfq], li"
    );
    return await rfqItems.count();
  }

  async isSupplierPortalAccessible(): Promise<boolean> {
    return await this.supplierPortalLogin.isVisible();
  }

  async isLoginFormVisible(): Promise<boolean> {
    return await this.loginForm.isVisible();
  }

  async isPasswordResetAvailable(): Promise<boolean> {
    return await this.passwordReset.isVisible();
  }

  async getCertificationText(): Promise<string> {
    const certText = await this.qualificationCriteria.textContent();
    return certText?.trim() || "";
  }

  async hasCertification(certName: string): Promise<boolean> {
    const text = await this.getCertificationText();
    return text.toLowerCase().includes(certName.toLowerCase());
  }

  async isNavigationVisible(): Promise<boolean> {
    return await this.header.isNavigationVisible();
  }

  async isLogoVisible(): Promise<boolean> {
    return await this.header.isLogoVisible();
  }

  async getResourcesSectionText(): Promise<string> {
    return (await this.resourcesSection.textContent()) || "";
  }

  async getActiveRFQsSectionText(): Promise<string> {
    return (await this.activeRFQsSection.textContent()) || "";
  }

  async isSupplierPortalProminent(): Promise<boolean> {
    const boundingBox = await this.supplierPortalLogin.boundingBox();
    return !!(
      boundingBox &&
      (boundingBox.width > 100 || boundingBox.height > 30)
    );
  }

  async getFAQSectionText(): Promise<string> {
    return (await this.faqSection.textContent()) || "";
  }

  async getLoginFormFields(): Promise<{
    hasUsername: boolean;
    hasPassword: boolean;
  }> {
    const usernameField = this.loginForm.locator(
      'input[type="text"], input[type="email"], input[name*="user"], input[name*="email"], input[placeholder*="user"], input[placeholder*="email"]'
    );
    const passwordField = this.loginForm.locator(
      'input[type="password"], input[name*="password"], input[placeholder*="password"]'
    );

    const [hasUsername, hasPassword] = await Promise.all([
      usernameField.count().then((count) => count > 0),
      passwordField.count().then((count) => count > 0),
    ]);

    return { hasUsername, hasPassword };
  }

  async getSpecificContactInfo(): Promise<{ email: string; phone: string }> {
    const contactText = await this.getContactInformation();

    const emailMatch = contactText.match(/\S+@\S+\.\S+/);
    const email = emailMatch ? emailMatch[0] : "";

    const phoneMatch = contactText.match(
      /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/
    );
    const phone = phoneMatch ? phoneMatch[0] : "";

    return { email, phone };
  }
}
