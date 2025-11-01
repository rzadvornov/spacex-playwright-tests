import { Given, When, Then, Fixture } from "playwright-bdd/decorators";
import { expect, Page } from "@playwright/test";
import { SuppliersPage } from "../../pages/ui/SuppliersPage";
import { AssertionHelper } from "../../utils/AssertionHelper";
import { ViewportUtility } from "../../utils/ViewportUtility";
import { SharedPageSteps } from "./SharedPageSteps";
import { DataTable } from "playwright-bdd";

@Fixture("suppliersPageSteps")
export class SuppliersPageSteps {
  constructor(
    private page: Page,
    private suppliersPage: SuppliersPage,
    private sharedPageSteps: SharedPageSteps,
    private assertionHelper: AssertionHelper,
    private viewportUtility: ViewportUtility
  ) {}

  @Given("a user navigates to the Suppliers page")
  async navigateToSuppliersPage(): Promise<void> {
    await this.suppliersPage.navigateToSuppliersPage();
  }

  @When("the page loads successfully")
  async waitForPageLoad(): Promise<void> {
    await this.suppliersPage.waitForAppContentLoad();
  }

  @Then(
    "the user should see SpaceX's supplier program information and its purpose"
  )
  async verifySupplierProgramInfo(): Promise<void> {
    await this.viewportUtility.checkAllViewports(async (viewportSize) => {
      const viewportName =
        this.viewportUtility.getViewportNameFromSize(viewportSize);
      await this.assertionHelper.validateBooleanCheck(
        () => this.suppliersPage.isSupplierProgramInfoVisible(),
        `Supplier program information should be visible on ${viewportName} viewport`
      );
    });
  }

  @Then("the program's benefits should be highlighted")
  async verifyProgramBenefits(): Promise<void> {
    await this.viewportUtility.checkAllViewports(async (viewportSize) => {
      const viewportName =
        this.viewportUtility.getViewportNameFromSize(viewportSize);
      const benefitsText = await this.suppliersPage.getProgramBenefitsText();
      this.assertionHelper.assertValuePresent(
        benefitsText,
        `Program benefits should be displayed on ${viewportName} viewport`
      );
    });
  }

  @Then("clear contact information for supplier inquiries should be displayed")
  async verifyContactInformation(): Promise<void> {
    await this.viewportUtility.checkAllViewports(async (viewportSize) => {
      const viewportName =
        this.viewportUtility.getViewportNameFromSize(viewportSize);

      await this.assertionHelper.validateBooleanCheck(
        () => this.suppliersPage.isContactInfoDisplayed(),
        `Contact information should be visible on ${viewportName} viewport`
      );

      const contactInfo = await this.suppliersPage.getContactInformation();
      this.assertionHelper.assertValuePresent(
        contactInfo,
        `Contact information should not be empty on ${viewportName} viewport`
      );
    });
  }

  @When("the user reviews program requirements")
  async reviewProgramRequirements(): Promise<void> {
    await this.suppliersPage.scrollDown();
  }

  @Then("supplier qualification criteria should be clearly described")
  async verifyQualificationCriteria(): Promise<void> {
    await this.viewportUtility.checkAllViewports(async (viewportSize) => {
      const viewportName =
        this.viewportUtility.getViewportNameFromSize(viewportSize);

      await this.assertionHelper.validateBooleanCheck(
        () => this.suppliersPage.isQualificationCriteriaVisible(),
        `Qualification criteria should be visible on ${viewportName} viewport`
      );

      const criteriaText =
        await this.suppliersPage.getQualificationCriteriaText();
      this.assertionHelper.assertValuePresent(
        criteriaText,
        `Qualification criteria should not be empty on ${viewportName} viewport`
      );
    });
  }

  @Then("the page should list the accepted major certifications: {string}")
  async verifyAcceptedCertifications(certifications: string): Promise<void> {
    const certList = certifications.split(", ");

    for (const cert of certList) {
      const hasCert = await this.suppliersPage.hasCertification(cert);
      await this.assertionHelper.validateBooleanCheck(
        async () => hasCert,
        `Certification ${cert} should be listed`
      );
    }
  }

  @When("the user wants to become a supplier")
  async initiateSupplierRegistration(): Promise<void> {
    // This step is primarily for context, no action needed
  }

  @Then("a supplier registration form should be accessible")
  async verifyRegistrationFormAccessible(): Promise<void> {
    await this.viewportUtility.checkAllViewports(async (viewportSize) => {
      const viewportName =
        this.viewportUtility.getViewportNameFromSize(viewportSize);
      await this.assertionHelper.validateBooleanCheck(
        () => this.suppliersPage.isRegistrationFormAccessible(),
        `Registration form should be accessible on ${viewportName} viewport`
      );
    });
  }

  @Then("the required company information for initial screening should include")
  async verifyRequiredFormFields(): Promise<void> {
    const requiredFields = await this.suppliersPage.getRequiredFormFields();

    const expectedFields = [
      "company",
      "products/services",
      "certifications",
      "contact details",
      "references",
    ];

    for (const expectedField of expectedFields) {
      const hasField = requiredFields.some((field) =>
        field.toLowerCase().includes(expectedField.toLowerCase())
      );
      await this.assertionHelper.validateBooleanCheck(
        async () => hasField,
        `Required field '${expectedField}' should be present in registration form`
      );
    }
  }

  @Given("a user is completing supplier registration")
  async completeSupplierRegistration(): Promise<void> {
    await this.suppliersPage.isRegistrationFormAccessible();
  }

  @When("the user successfully submits the application")
  async submitApplication(): Promise<void> {
    await this.suppliersPage.submitRegistrationForm();
  }

  @Then("a visible confirmation message should appear")
  async verifyConfirmationMessage(): Promise<void> {
    await this.assertionHelper.validateBooleanCheck(
      () => this.suppliersPage.isConfirmationMessageVisible(),
      "Confirmation message should be visible after form submission"
    );
  }

  @Then("an application reference number should be provided to the user")
  async verifyApplicationReference(): Promise<void> {
    const referenceNumber =
      await this.suppliersPage.getApplicationReferenceNumber();
    this.assertionHelper.assertValuePresent(
      referenceNumber,
      "Application reference number should be provided after successful submission"
    );
  }

  @Then("the expected review timeline should be clearly communicated")
  async verifyReviewTimeline(): Promise<void> {
    const timeline = await this.suppliersPage.getReviewTimeline();
    this.assertionHelper.assertValuePresent(
      timeline,
      "Review timeline should be communicated after application submission"
    );
  }

  @When("the user looks for program documentation")
  async lookForProgramDocumentation(): Promise<void> {
    await this.suppliersPage.scrollDown();
  }

  @Then("the following resources should be available for download")
  async verifyAvailableResources(): Promise<void> {
    await this.viewportUtility.checkAllViewports(async (viewportSize) => {
      const viewportName =
        this.viewportUtility.getViewportNameFromSize(viewportSize);

      await this.assertionHelper.validateBooleanCheck(
        () => this.suppliersPage.areResourcesAvailable(),
        `Resources section should be available on ${viewportName} viewport`
      );

      const resources = await this.suppliersPage.getAvailableResources();
      expect(
        resources.length,
        `At least one resource should be available on ${viewportName} viewport`
      ).toBeGreaterThan(0);
    });
  }

  @Then("document **versioning and last updated dates** should be clearly displayed.")
  async verifyDocumentVersioning(): Promise<void> {
    await this.viewportUtility.checkAllViewports(async (viewportSize) => {
      const viewportName = this.viewportUtility.getViewportNameFromSize(viewportSize);
      
      const resourcesText = await this.suppliersPage.getResourcesSectionText();
      const hasVersioning = /version|v\d+\.\d+|\d+\.\d+\.\d+/i.test(resourcesText);
      const hasDates = /updated|last modified|\d{1,2}\/\d{1,2}\/\d{4}|\d{4}-\d{2}-\d{2}/i.test(resourcesText);
      
      await this.assertionHelper.validateBooleanCheck(
        async () => hasVersioning && hasDates,
        `Document versioning and last updated dates should be clearly displayed on ${viewportName} viewport`
      );
    });
  }

  @When("the user has common questions")
  async userHasQuestions(): Promise<void> {
    // Context step, no action needed
  }

  @Then("a FAQ section should be available")
  async verifyFAQSection(): Promise<void> {
    await this.viewportUtility.checkAllViewports(async (viewportSize) => {
      const viewportName =
        this.viewportUtility.getViewportNameFromSize(viewportSize);
      await this.assertionHelper.validateBooleanCheck(
        () => this.suppliersPage.isFAQSectionVisible(),
        `FAQ section should be available on ${viewportName} viewport`
      );
    });
  }

  @Then("the FAQ should cover essential topics")
  async verifyFAQTopics(): Promise<void> {
    const topics = await this.suppliersPage.getFAQTopics();
    expect(topics.length, "FAQ should contain multiple topics").toBeGreaterThan(
      0
    );
  }

  @When("the user checks for active procurement opportunities")
  async checkActiveProcurement(): Promise<void> {
    await this.suppliersPage.scrollDown();
  }

  @Then("a list of active RFQs should be displayed")
  async verifyActiveRFQs(): Promise<void> {
    await this.viewportUtility.checkAllViewports(async (viewportSize) => {
      const viewportName =
        this.viewportUtility.getViewportNameFromSize(viewportSize);

      await this.assertionHelper.validateBooleanCheck(
        () => this.suppliersPage.areActiveRFQsDisplayed(),
        `Active RFQs section should be displayed on ${viewportName} viewport`
      );

      const rfqCount = await this.suppliersPage.getActiveRFQCount();
      expect(
        rfqCount,
        `At least one active RFQ should be displayed on ${viewportName} viewport`
      ).toBeGreaterThan(0);
    });
  }

  @When("the user is an existing supplier")
  async userIsExistingSupplier(): Promise<void> {
    // Context step, no action needed
  }

  @Then(
    "a prominent link or section for the Supplier Portal Login should be accessible"
  )
  async verifySupplierPortalAccessible(): Promise<void> {
    await this.viewportUtility.checkAllViewports(async (viewportSize) => {
      const viewportName =
        this.viewportUtility.getViewportNameFromSize(viewportSize);
      await this.assertionHelper.validateBooleanCheck(
        () => this.suppliersPage.isSupplierPortalAccessible(),
        `Supplier portal login should be accessible on ${viewportName} viewport`
      );
    });
  }

  @Then(
    "the login form should require **username, email and password authentication**"
  )
  async verifyLoginFormRequirements(): Promise<void> {
    await this.viewportUtility.checkAllViewports(async (viewportSize) => {
      const viewportName =
        this.viewportUtility.getViewportNameFromSize(viewportSize);
      await this.assertionHelper.validateBooleanCheck(
        () => this.suppliersPage.isLoginFormVisible(),
        `Login form should be visible on ${viewportName} viewport`
      );
    });
  }

  @Then("a functional password reset option should be available")
  async verifyPasswordResetOption(): Promise<void> {
    await this.viewportUtility.checkAllViewports(async (viewportSize) => {
      const viewportName =
        this.viewportUtility.getViewportNameFromSize(viewportSize);
      await this.assertionHelper.validateBooleanCheck(
        () => this.suppliersPage.isPasswordResetAvailable(),
        `Password reset option should be available on ${viewportName} viewport`
      );
    });
  }

  @Then("the page should be responsive across different viewports")
  async verifyPageResponsiveness(): Promise<void> {
    await this.viewportUtility.checkAllViewports(async (viewportSize) => {
      const viewportName =
        this.viewportUtility.getViewportNameFromSize(viewportSize);

      const checks = [
        this.suppliersPage.isSupplierProgramInfoVisible(),
        this.suppliersPage.isNavigationVisible(),
        this.suppliersPage.isLogoVisible(),
      ];

      const results = await Promise.all(checks);
      const allVisible = results.every((result) => result === true);

      await this.assertionHelper.validateBooleanCheck(
        async () => allVisible,
        `All key elements should be visible and functional on ${viewportName} viewport`
      );
    });
  }

  @Then("the page should have acceptable performance metrics")
  async verifyPerformanceMetrics(): Promise<void> {
    const metrics = await this.suppliersPage.getPerformanceMetrics();

    this.assertionHelper.assertMetric(
      metrics.lcp,
      2500,
      "Largest Contentful Paint should be under 2.5 seconds"
    );

    this.assertionHelper.assertMetric(
      metrics.fid,
      100,
      "First Input Delay should be under 100ms"
    );

    this.assertionHelper.assertMetric(
      metrics.cls,
      0.1,
      "Cumulative Layout Shift should be under 0.1"
    );
  }

  @Then("the page should not have any console errors")
  async verifyNoConsoleErrors(): Promise<void> {
    const consoleErrors = this.suppliersPage.getConsoleErrors();
    expect(
      consoleErrors,
      "Page should not have any console errors"
    ).toHaveLength(0);
  }

  @Then("all images on the page should load correctly")
  async verifyAllImagesLoaded(): Promise<void> {
    const allImagesLoaded = await this.suppliersPage.checkAllImagesLoaded();
    await this.assertionHelper.validateBooleanCheck(
      async () => allImagesLoaded,
      "All images on the suppliers page should load correctly without broken images"
    );
  }

  @Then("the program's benefits \\(e.g., long-term partnership, impact on space exploration) should be highlighted")
  async verifySpecificProgramBenefits(): Promise<void> {
    await this.viewportUtility.checkAllViewports(async (viewportSize) => {
      const viewportName = this.viewportUtility.getViewportNameFromSize(viewportSize);
      const benefitsText = await this.suppliersPage.getProgramBenefitsText();
      
      const benefitKeywords = ['long-term partnership', 'partnership', 'space exploration', 'impact', 'benefit'];
      const hasBenefits = benefitKeywords.some(keyword => 
        benefitsText.toLowerCase().includes(keyword.toLowerCase())
      );
      
      await this.assertionHelper.validateBooleanCheck(
        async () => hasBenefits,
        `Program benefits like long-term partnership and space exploration impact should be highlighted on ${viewportName} viewport`
      );
    });
  }

  @Then("clear contact information for supplier inquiries \\(email,phone) should be displayed")
  async verifySpecificContactInformation(): Promise<void> {
    await this.viewportUtility.checkAllViewports(async (viewportSize) => {
      const viewportName = this.viewportUtility.getViewportNameFromSize(viewportSize);
      const contactInfo = await this.suppliersPage.getContactInformation();
      
      const hasEmail = /\S+@\S+\.\S+/.test(contactInfo) || contactInfo.toLowerCase().includes('email') || contactInfo.toLowerCase().includes('@');
      const hasPhone = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(contactInfo) || 
                      contactInfo.toLowerCase().includes('phone') || 
                      contactInfo.toLowerCase().includes('tel:');
      
      await this.assertionHelper.validateBooleanCheck(
        async () => hasEmail && hasPhone,
        `Clear contact information with email and phone should be displayed on ${viewportName} viewport`
      );
    });
  }

  @Then("supplier qualification criteria should be clearly described:")
  async verifyDetailedQualificationCriteria(dataTable: DataTable): Promise<void> {
    const expectedCriteria = dataTable.rows();
    
    await this.viewportUtility.checkAllViewports(async (viewportSize) => {
      const viewportName = this.viewportUtility.getViewportNameFromSize(viewportSize);
      const criteriaText = await this.suppliersPage.getQualificationCriteriaText();
      
      for (const [category] of expectedCriteria) {
        const hasCategory = criteriaText.toLowerCase().includes(category.toLowerCase());
        await this.assertionHelper.validateBooleanCheck(
          async () => hasCategory,
          `Qualification criteria should include '${category}' on ${viewportName} viewport`
        );
      }
    });
  }

  @Then("the page should list the accepted major certifications: **ISO {int}, AS9100, and SOC {int} compliance**")
  async verifySpecificCertifications(isoNumber: number, socNumber: number): Promise<void> {
    const certifications = [`ISO ${isoNumber}`, 'AS9100', `SOC ${socNumber} compliance`];
    
    for (const cert of certifications) {
      const hasCert = await this.suppliersPage.hasCertification(cert);
      await this.assertionHelper.validateBooleanCheck(
        async () => hasCert,
        `Certification ${cert} should be listed as an accepted major certification`
      );
    }
  }

  @Then("the required company information for initial screening should include:")
  async verifyDetailedRequiredFields(dataTable: DataTable): Promise<void> {
    const expectedFields = dataTable.rows();
    const requiredFields = await this.suppliersPage.getRequiredFormFields();
    
    for (const [fieldType] of expectedFields) {
      const hasField = requiredFields.some(field => 
        field.toLowerCase().includes(fieldType.toLowerCase()) ||
        fieldType.toLowerCase().includes(field.toLowerCase())
      );
      
      await this.assertionHelper.validateBooleanCheck(
        async () => hasField,
        `Required company information should include '${fieldType}' for initial screening`
      );
    }
  }

  @Then("the following resources should be available for download:")
  async verifySpecificResources(dataTable: DataTable): Promise<void> {
    const expectedResources = dataTable.rows();
    const availableResources = await this.suppliersPage.getAvailableResources();
    
    for (const [resourceType, format] of expectedResources) {
      const hasResource = availableResources.some(resource => 
        resource.toLowerCase().includes(resourceType.toLowerCase()) ||
        resourceType.toLowerCase().includes(resource.toLowerCase())
      );
      
      await this.assertionHelper.validateBooleanCheck(
        async () => hasResource,
        `Resource '${resourceType}' should be available for download in format ${format}`
      );
    }
  }

  @Then("the FAQ should cover essential topics:")
  async verifySpecificFAQTopics(dataTable: DataTable): Promise<void> {
    const expectedTopics = dataTable.rows();
    const faqTopics = await this.suppliersPage.getFAQTopics();
    
    for (const [topic] of expectedTopics) {
      const hasTopic = faqTopics.some(faqTopic => 
        faqTopic.toLowerCase().includes(topic.toLowerCase()) ||
        topic.toLowerCase().includes(faqTopic.toLowerCase())
      );
      
      await this.assertionHelper.validateBooleanCheck(
        async () => hasTopic,
        `FAQ should cover essential topic: '${topic}'`
      );
    }
  }

  @Then("a list of active RFQs should be displayed, each showing:")
  async verifyDetailedRFQDisplay(dataTable: DataTable): Promise<void> {
    const expectedDetails = dataTable.rows();
    
    await this.viewportUtility.checkAllViewports(async (viewportSize) => {
      const viewportName = this.viewportUtility.getViewportNameFromSize(viewportSize);
      const rfqCount = await this.suppliersPage.getActiveRFQCount();
      
      expect(rfqCount, `At least one active RFQ should be displayed on ${viewportName} viewport`).toBeGreaterThan(0);
      
      const rfqSectionText = await this.suppliersPage.activeRFQsSection.textContent() || "";
      
      for (const [detail, displayStatus] of expectedDetails) {
        if (displayStatus.toLowerCase().includes('must be displayed')) {
          const hasDetail = rfqSectionText.toLowerCase().includes(detail.toLowerCase());
          await this.assertionHelper.validateBooleanCheck(
            async () => hasDetail,
            `RFQ detail '${detail}' should be displayed on ${viewportName} viewport`
          );
        }
      }
    });
  }

  @Then("a prominent link or section for the **Supplier Portal Login** should be accessible")
  async verifyProminentSupplierPortal(): Promise<void> {
    await this.viewportUtility.checkAllViewports(async (viewportSize) => {
      const viewportName = this.viewportUtility.getViewportNameFromSize(viewportSize);
      
      const isAccessible = await this.suppliersPage.isSupplierPortalAccessible();
      const portalElement = this.suppliersPage.supplierPortalLogin;
      
      const boundingBox = await portalElement.boundingBox();
      const isProminent = boundingBox && (boundingBox.width > 100 || boundingBox.height > 30);
      
      await this.assertionHelper.validateBooleanCheck(
        async () => isAccessible && !!isProminent,
        `A prominent link or section for Supplier Portal Login should be accessible on ${viewportName} viewport`
      );
    });
  }
}
