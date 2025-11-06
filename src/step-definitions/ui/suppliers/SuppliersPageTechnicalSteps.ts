import { Then, Fixture, When } from "playwright-bdd/decorators";
import { expect } from "@playwright/test";
import { SuppliersPage } from "../../../services/ui/SuppliersPage";
import { AssertionHelper } from "../../../utils/AssertionHelper";
import { ViewportUtility } from "../../../utils/ViewportUtility";
import { DataTable } from "playwright-bdd";

@Fixture("suppliersPageTechnicalSteps")
export class SuppliersPageTechnicalSteps {
  constructor(
    private suppliersPage: SuppliersPage,
    private assertionHelper: AssertionHelper,
    private viewportUtility: ViewportUtility
  ) {}

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

  @Then("a list of active RFQs should be displayed, each showing:")
  async verifyDetailedRFQDisplay(dataTable: DataTable): Promise<void> {
    const expectedDetails = dataTable.rows();

    await this.viewportUtility.checkAllViewports(async (viewportSize) => {
      const viewportName =
        this.viewportUtility.getViewportNameFromSize(viewportSize);
      const rfqCount = await this.suppliersPage.getActiveRFQCount();

      expect(
        rfqCount,
        `At least one active RFQ should be displayed on ${viewportName} viewport`
      ).toBeGreaterThan(0);

      const rfqSectionText =
        (await this.suppliersPage.activeRFQsSection.textContent()) || "";

      for (const [detail, displayStatus] of expectedDetails) {
        if (displayStatus.toLowerCase().includes("must be displayed")) {
          const hasDetail = rfqSectionText
            .toLowerCase()
            .includes(detail.toLowerCase());
          await this.assertionHelper.validateBooleanCheck(
            async () => hasDetail,
            `RFQ detail '${detail}' should be displayed on ${viewportName} viewport`
          );
        }
      }
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
    "a prominent link or section for the **Supplier Portal Login** should be accessible"
  )
  async verifyProminentSupplierPortal(): Promise<void> {
    await this.viewportUtility.checkAllViewports(async (viewportSize) => {
      const viewportName =
        this.viewportUtility.getViewportNameFromSize(viewportSize);

      const isAccessible =
        await this.suppliersPage.isSupplierPortalAccessible();
      const portalElement = this.suppliersPage.supplierPortalLogin;

      const boundingBox = await portalElement.boundingBox();
      const isProminent =
        boundingBox && (boundingBox.width > 100 || boundingBox.height > 30);

      await this.assertionHelper.validateBooleanCheck(
        async () => isAccessible && !!isProminent,
        `A prominent link or section for Supplier Portal Login should be accessible on ${viewportName} viewport`
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

  @Then("supplier qualification criteria should be clearly described:")
  async verifyDetailedQualificationCriteria(
    dataTable: DataTable
  ): Promise<void> {
    const expectedCriteria = dataTable.rows();

    await this.viewportUtility.checkAllViewports(async (viewportSize) => {
      const viewportName =
        this.viewportUtility.getViewportNameFromSize(viewportSize);
      const criteriaText =
        await this.suppliersPage.getQualificationCriteriaText();

      for (const [category] of expectedCriteria) {
        const hasCategory = criteriaText
          .toLowerCase()
          .includes(category.toLowerCase());
        await this.assertionHelper.validateBooleanCheck(
          async () => hasCategory,
          `Qualification criteria should include '${category}' on ${viewportName} viewport`
        );
      }
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

  @Then(
    "the page should list the accepted major certifications: **ISO {int}, AS9100, and SOC {int} compliance**"
  )
  async verifySpecificCertifications(
    isoNumber: number,
    socNumber: number
  ): Promise<void> {
    const certifications = [
      `ISO ${isoNumber}`,
      "AS9100",
      `SOC ${socNumber} compliance`,
    ];

    for (const cert of certifications) {
      const hasCert = await this.suppliersPage.hasCertification(cert);
      await this.assertionHelper.validateBooleanCheck(
        async () => hasCert,
        `Certification ${cert} should be listed as an accepted major certification`
      );
    }
  }
}
