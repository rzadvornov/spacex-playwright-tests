import { Given, When, Then, Fixture } from "playwright-bdd/decorators";
import { StarshipPage } from "../../../services/ui/StarshipPage";
import { AssertionHelper } from "../../../utils/AssertionHelper";
import { SharedPageSteps } from "../SharedPageSteps";
import { DataTable } from "playwright-bdd";

@Fixture("starshipBasicSteps")
export class StarshipBasicSteps {
  constructor(
    private starshipPage: StarshipPage,
    private sharedPageSteps: SharedPageSteps,
    private assertionHelper: AssertionHelper
  ) {}

  @Given("I am on the Starship vehicle information page")
  async navigateToStarshipPage(): Promise<void> {
    await this.starshipPage.navigate();
    await this.starshipPage.waitForStarshipPageLoad();
    await this.assertionHelper.validateBooleanCheck(
      async () => await this.starshipPage.isStarshipPageLoaded(),
      "Starship page should be loaded"
    );
  }

  @When("I wait for the Starship page to fully load")
  async waitForFullPageLoad(): Promise<void> {
    await this.starshipPage.waitForStarshipPageLoad();
  }

  @When("I click on the {string} section in the navigation")
  async clickNavigationSection(sectionName: string): Promise<void> {
    await this.starshipPage.navigateToSection(sectionName);
  }

  @Then("I should see the {string} section content")
  async verifySectionContent(sectionName: string): Promise<void> {
    let isVisible = false;

    switch (sectionName.toLowerCase()) {
      case "overview":
        isVisible = await this.starshipPage.isOverviewSectionVisible();
        break;
      case "capabilities":
        isVisible = await this.starshipPage.isCapabilitiesSectionVisible();
        break;
      case "specifications":
        isVisible = await this.starshipPage.isSpecificationsSectionVisible();
        break;
      case "propulsion":
        isVisible = await this.starshipPage.isPropulsionSectionVisible();
        break;
      case "missions":
        isVisible = await this.starshipPage.isMissionsSectionVisible();
        break;
      case "payload":
        isVisible = await this.starshipPage.isPayloadSectionVisible();
        break;
      case "development":
        isVisible = await this.starshipPage.isDevelopmentSectionVisible();
        break;
      case "contact":
        isVisible = await this.starshipPage.isContactSectionVisible();
        break;
      default:
        throw new Error(`Unknown section: ${sectionName}`);
    }

    await this.assertionHelper.validateBooleanCheck(
      async () => isVisible,
      `${sectionName} section should be visible`
    );
  }

  @When("I review the system capabilities summary")
  async reviewSystemCapabilities(): Promise<void> {
    await this.starshipPage.navigateToSection("Capabilities");
  }

  @Then("I should see the following key performance details:")
  async verifyKeyPerformanceDetails(dataTable: DataTable): Promise<void> {
    const rows = dataTable.rows();
    for (const row of rows) {
      const capabilityType = row[0];
      const expectedValue = row[1];
      const actualValue = await this.starshipPage.getCapabilityDetail(
        capabilityType
      );

      await this.assertionHelper.validateBooleanCheck(
        async () => actualValue.includes(expectedValue),
        `Capability "${capabilityType}" should contain "${expectedValue}". Actual: "${actualValue}"`
      );
    }
  }

  @When("I look for contact information regarding missions")
  async lookForContactInformation(): Promise<void> {
    await this.starshipPage.navigateToSection("Contact");
  }

  @Then(
    "I should find the email address {string} for inquiries regarding Starship missions and the human spaceflight program."
  )
  async verifySalesEmail(expectedEmail: string): Promise<void> {
    const actualEmail = await this.starshipPage.getSalesEmail();

    await this.assertionHelper.validateBooleanCheck(
      async () => actualEmail.includes(expectedEmail),
      `Sales email should contain "${expectedEmail}". Actual: "${actualEmail}"`
    );
  }

  @When("I view the development and manufacturing information")
  async viewDevelopmentInformation(): Promise<void> {
    await this.starshipPage.navigateToSection("Development");
  }

  @Then(
    "I should see that Starship is being developed and manufactured at {string} in Texas"
  )
  async verifyDevelopmentLocation(expectedLocation: string): Promise<void> {
    const actualLocation = await this.starshipPage.getDevelopmentLocation();

    await this.assertionHelper.validateBooleanCheck(
      async () => actualLocation.includes(expectedLocation),
      `Development location should contain "${expectedLocation}". Actual: "${actualLocation}"`
    );
  }

  @Then(
    "I should see updates on its testing progress and commercial spaceport status"
  )
  async verifyDevelopmentUpdates(): Promise<void> {
    const updates = await this.starshipPage.getDevelopmentUpdates();

    this.assertionHelper.assertValuePresent(
      updates,
      "Development updates should be present"
    );

    this.assertionHelper.assertMetric(
      updates?.length,
      0,
      "Development updates should not be empty"
    );
  }

  @When("I view the primary overview section")
  async viewPrimaryOverviewSection(): Promise<void> {
    await this.starshipPage.navigateToSection("Overview");
  }

  @Then("the displayed headline should be {string}")
  async verifyHeadlineText(expectedHeadline: string): Promise<void> {
    const actualHeadline = await this.starshipPage.getOverviewHeadline();
    await this.assertionHelper.validateBooleanCheck(
      async () => actualHeadline.includes(expectedHeadline),
      `Headline should contain "${expectedHeadline}". Actual: "${actualHeadline}"`
    );
  }

  @Then(
    "the description should position Starship and Super Heavy as the world's most powerful, fully reusable transportation system"
  )
  async verifyValuePropositionDescription(): Promise<void> {
    const description = await this.starshipPage.getOverviewDescription();

    await this.assertionHelper.validateBooleanCheck(
      async () => description.includes("most powerful"),
      "Description should mention 'most powerful'"
    );

    await this.assertionHelper.validateBooleanCheck(
      async () => description.includes("fully reusable"),
      "Description should mention 'fully reusable'"
    );

    await this.assertionHelper.validateBooleanCheck(
      async () => description.includes("Starship"),
      "Description should mention 'Starship'"
    );

    await this.assertionHelper.validateBooleanCheck(
      async () => description.includes("Super Heavy"),
      "Description should mention 'Super Heavy'"
    );
  }

  @When("I review the payload section")
  async reviewPayloadSection(): Promise<void> {
    await this.starshipPage.navigateToSection("Payload");
  }

  @Then("I should see the following advantages highlighted:")
  async verifyPayloadAdvantages(dataTable: DataTable): Promise<void> {
    const rows = dataTable.rows();
    const expectedAdvantages = rows.map((row: string[]) => row[0]);
    const actualAdvantages = await this.starshipPage.getPayloadAdvantages();

    for (const expectedAdvantage of expectedAdvantages) {
      await this.assertionHelper.validateBooleanCheck(
        async () =>
          actualAdvantages.some((advantage) =>
            advantage.includes(expectedAdvantage)
          ),
        `Should have payload advantage: "${expectedAdvantage}"`
      );
    }
  }

  @When("I view the Starship vehicle specifications")
  async viewStarshipSpecifications(): Promise<void> {
    await this.starshipPage.navigateToSection("Specifications");
  }

  @Then(
    "I should see the following technical details are accurately displayed:"
  )
  async verifyStarshipTechnicalDetails(dataTable: DataTable): Promise<void> {
    const rows = dataTable.rows();
    for (const row of rows) {
      const attribute = row[0];
      const expectedMetric = row[1];
      const expectedImperial = row[2];

      const actualSpec = await this.starshipPage.getStarshipSpecification(
        attribute
      );

      await this.assertionHelper.validateBooleanCheck(
        async () => actualSpec.metric.includes(expectedMetric),
        `Starship ${attribute} metric should contain "${expectedMetric}". Actual: "${actualSpec.metric}"`
      );

      if (expectedImperial) {
        await this.assertionHelper.validateBooleanCheck(
          async () => actualSpec.imperial.includes(expectedImperial),
          `Starship ${attribute} imperial should contain "${expectedImperial}". Actual: "${actualSpec.imperial}"`
        );
      }
    }
  }

  @When("I view the Super Heavy Booster specifications")
  async viewSuperHeavySpecifications(): Promise<void> {
    await this.starshipPage.navigateToSection("Super Heavy");
  }

  @Then(
    "I should see the following Super Heavy Booster technical details are accurately displayed:"
  )
  async verifySuperHeavyTechnicalDetails(dataTable: DataTable): Promise<void> {
    const rows = dataTable.rows();
    for (const row of rows) {
      const attribute = row[0];
      const expectedMetric = row[1];
      const expectedImperial = row[2];

      const actualSpec = await this.starshipPage.getSuperHeavySpecification(
        attribute
      );

      await this.assertionHelper.validateBooleanCheck(
        async () => actualSpec.metric.includes(expectedMetric),
        `Super Heavy ${attribute} metric should contain "${expectedMetric}". Actual: "${actualSpec.metric}"`
      );

      if (expectedImperial) {
        await this.assertionHelper.validateBooleanCheck(
          async () => actualSpec.imperial.includes(expectedImperial),
          `Super Heavy ${attribute} imperial should contain "${expectedImperial}". Actual: "${actualSpec.imperial}"`
        );
      }
    }
  }
}
