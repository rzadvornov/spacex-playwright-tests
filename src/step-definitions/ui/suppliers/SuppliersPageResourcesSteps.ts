import { When, Then, Fixture } from "playwright-bdd/decorators";
import { expect } from "@playwright/test";
import { SuppliersPage } from "../../../pages/ui/SuppliersPage";
import { AssertionHelper } from "../../../utils/AssertionHelper";
import { ViewportUtility } from "../../../utils/ViewportUtility";
import { DataTable } from "playwright-bdd";

@Fixture("suppliersPageResourcesSteps")
export class SuppliersPageResourcesSteps {
  constructor(
    private suppliersPage: SuppliersPage,
    private assertionHelper: AssertionHelper,
    private viewportUtility: ViewportUtility
  ) {}

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

  @Then("the following resources should be available for download:")
  async verifySpecificResources(dataTable: DataTable): Promise<void> {
    const expectedResources = dataTable.rows();
    const availableResources = await this.suppliersPage.getAvailableResources();

    for (const [resourceType, format] of expectedResources) {
      const hasResource = availableResources.some(
        (resource) =>
          resource.toLowerCase().includes(resourceType.toLowerCase()) ||
          resourceType.toLowerCase().includes(resource.toLowerCase())
      );

      await this.assertionHelper.validateBooleanCheck(
        async () => hasResource,
        `Resource '${resourceType}' should be available for download in format ${format}`
      );
    }
  }

  @Then(
    "document **versioning and last updated dates** should be clearly displayed."
  )
  async verifyDocumentVersioning(): Promise<void> {
    await this.viewportUtility.checkAllViewports(async (viewportSize) => {
      const viewportName =
        this.viewportUtility.getViewportNameFromSize(viewportSize);

      const resourcesText = await this.suppliersPage.getResourcesSectionText();
      const hasVersioning = /version|v\d+\.\d+|\d+\.\d+\.\d+/i.test(
        resourcesText
      );
      const hasDates =
        /updated|last modified|\d{1,2}\/\d{1,2}\/\d{4}|\d{4}-\d{2}-\d{2}/i.test(
          resourcesText
        );

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

  @Then("the FAQ should cover essential topics:")
  async verifySpecificFAQTopics(dataTable: DataTable): Promise<void> {
    const expectedTopics = dataTable.rows();
    const faqTopics = await this.suppliersPage.getFAQTopics();

    for (const [topic] of expectedTopics) {
      const hasTopic = faqTopics.some(
        (faqTopic) =>
          faqTopic.toLowerCase().includes(topic.toLowerCase()) ||
          topic.toLowerCase().includes(faqTopic.toLowerCase())
      );

      await this.assertionHelper.validateBooleanCheck(
        async () => hasTopic,
        `FAQ should cover essential topic: '${topic}'`
      );
    }
  }
}
