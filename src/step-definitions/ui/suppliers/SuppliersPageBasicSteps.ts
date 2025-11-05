import { Given, When, Then, Fixture } from "playwright-bdd/decorators";
import { SuppliersPage } from "../../../pages/ui/SuppliersPage";
import { AssertionHelper } from "../../../utils/AssertionHelper";
import { ViewportUtility } from "../../../utils/ViewportUtility";
import { SharedPageSteps } from "../SharedPageSteps";

@Fixture("suppliersPageBasicSteps")
export class SuppliersPageBasicSteps {
  constructor(
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

  @Then(
    "the program's benefits \\(e.g., long-term partnership, impact on space exploration) should be highlighted"
  )
  async verifySpecificProgramBenefits(): Promise<void> {
    await this.viewportUtility.checkAllViewports(async (viewportSize) => {
      const viewportName =
        this.viewportUtility.getViewportNameFromSize(viewportSize);
      const benefitsText = await this.suppliersPage.getProgramBenefitsText();

      const benefitKeywords = [
        "long-term partnership",
        "partnership",
        "space exploration",
        "impact",
        "benefit",
      ];
      const hasBenefits = benefitKeywords.some((keyword) =>
        benefitsText.toLowerCase().includes(keyword.toLowerCase())
      );

      await this.assertionHelper.validateBooleanCheck(
        async () => hasBenefits,
        `Program benefits like long-term partnership and space exploration impact should be highlighted on ${viewportName} viewport`
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

  @Then(
    "clear contact information for supplier inquiries \\(email,phone) should be displayed"
  )
  async verifySpecificContactInformation(): Promise<void> {
    await this.viewportUtility.checkAllViewports(async (viewportSize) => {
      const viewportName =
        this.viewportUtility.getViewportNameFromSize(viewportSize);
      const contactInfo = await this.suppliersPage.getContactInformation();

      const hasEmail =
        /\S+@\S+\.\S+/.test(contactInfo) ||
        contactInfo.toLowerCase().includes("email") ||
        contactInfo.toLowerCase().includes("@");
      const hasPhone =
        /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(
          contactInfo
        ) ||
        contactInfo.toLowerCase().includes("phone") ||
        contactInfo.toLowerCase().includes("tel:");

      await this.assertionHelper.validateBooleanCheck(
        async () => hasEmail && hasPhone,
        `Clear contact information with email and phone should be displayed on ${viewportName} viewport`
      );
    });
  }
}
