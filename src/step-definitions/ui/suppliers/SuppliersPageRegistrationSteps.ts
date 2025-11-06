import { Given, When, Then, Fixture } from "playwright-bdd/decorators";
import { SuppliersPage } from "../../../services/ui/SuppliersPage";
import { AssertionHelper } from "../../../utils/AssertionHelper";
import { ViewportUtility } from "../../../utils/ViewportUtility";
import { DataTable } from "playwright-bdd";

@Fixture("suppliersPageRegistrationSteps")
export class SuppliersPageRegistrationSteps {
  constructor(
    private suppliersPage: SuppliersPage,
    private assertionHelper: AssertionHelper,
    private viewportUtility: ViewportUtility
  ) {}

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

  @Then(
    "the required company information for initial screening should include:"
  )
  async verifyDetailedRequiredFields(dataTable: DataTable): Promise<void> {
    const expectedFields = dataTable.rows();
    const requiredFields = await this.suppliersPage.getRequiredFormFields();

    for (const [fieldType] of expectedFields) {
      const hasField = requiredFields.some(
        (field) =>
          field.toLowerCase().includes(fieldType.toLowerCase()) ||
          fieldType.toLowerCase().includes(field.toLowerCase())
      );

      await this.assertionHelper.validateBooleanCheck(
        async () => hasField,
        `Required company information should include '${fieldType}' for initial screening`
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
}
