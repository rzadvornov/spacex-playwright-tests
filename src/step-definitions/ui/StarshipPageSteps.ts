import { Given, When, Then, Fixture } from "playwright-bdd/decorators";
import { StarshipPage } from "../../pages/ui/StarshipPage";
import { AssertionHelper } from "../../utils/AssertionHelper";
import { ViewportUtility } from "../../utils/ViewportUtility";
import { SharedPageSteps } from "./SharedPageSteps";
import { Page } from "@playwright/test";
import { DataTable } from "playwright-bdd";

@Fixture("starshipPageSteps")
export class StarshipPageSteps {
  constructor(
    private page: Page,
    private starshipPage: StarshipPage,
    private sharedPageSteps: SharedPageSteps,
    private assertionHelper: AssertionHelper,
    private viewportUtility: ViewportUtility
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

  @When("I view the propulsion system details")
  async viewPropulsionSystemDetails(): Promise<void> {
    await this.starshipPage.navigateToSection("Propulsion");
  }

  @Then(
    "I should see the complete specifications for the Raptor sea-level engine:"
  )
  async verifyRaptorSeaLevelSpecs(dataTable: DataTable): Promise<void> {
    const seaLevelSpecs = await this.starshipPage.getRaptorEngineSpecs(
      "sea-level"
    );
    const rows = dataTable.rows();

    for (const row of rows) {
      const attribute = row[0];
      const expectedMetric = row[1];
      const actualValue = seaLevelSpecs.get(attribute) || "";

      await this.assertionHelper.validateBooleanCheck(
        async () => actualValue.includes(expectedMetric),
        `Raptor sea-level ${attribute} should contain "${expectedMetric}". Actual: "${actualValue}"`
      );
    }
  }

  @Then(
    "I should see the complete specifications for the Raptor Vacuum \\(RVac) engine:"
  )
  async verifyRaptorVacuumSpecs(dataTable: DataTable): Promise<void> {
    const vacuumSpecs = await this.starshipPage.getRaptorEngineSpecs("vacuum");
    const rows = dataTable.rows();

    for (const row of rows) {
      const attribute = row[0];
      const expectedMetric = row[1];
      const actualValue = vacuumSpecs.get(attribute) || "";

      await this.assertionHelper.validateBooleanCheck(
        async () => actualValue.includes(expectedMetric),
        `Raptor Vacuum ${attribute} should contain "${expectedMetric}". Actual: "${actualValue}"`
      );
    }
  }

  @Then("the page should clearly note that Starship uses {string}")
  async verifyEngineConfiguration(expectedConfig: string): Promise<void> {
    const actualConfig = await this.starshipPage.getEngineConfiguration();

    await this.assertionHelper.validateBooleanCheck(
      async () => actualConfig.includes(expectedConfig),
      `Engine configuration should contain "${expectedConfig}". Actual: "${actualConfig}"`
    );
  }

  @When("I read about interplanetary mission capabilities")
  async readInterplanetaryMissionCapabilities(): Promise<void> {
    await this.starshipPage.navigateToSection("Mars Missions");
  }

  @Then("I should learn that Starship is specifically designed for:")
  async verifyMarsMissionCapabilities(dataTable: DataTable): Promise<void> {
    const rows = dataTable.rows();
    const expectedCapabilities = rows.map((row: string[]) => row[0]);
    const actualCapabilities = await this.starshipPage.getMissionCapabilities(
      "mars"
    );

    for (const expectedCapability of expectedCapabilities) {
      await this.assertionHelper.validateBooleanCheck(
        async () =>
          actualCapabilities.some((cap) => cap.includes(expectedCapability)),
        `Should have Mars mission capability: "${expectedCapability}"`
      );
    }
  }

  @When("I read about lunar mission capabilities")
  async readLunarMissionCapabilities(): Promise<void> {
    await this.starshipPage.navigateToSection("Lunar Missions");
  }

  @Then(
    "I should learn that Starship serves as a lunar lander for key missions:"
  )
  async verifyLunarMissionCapabilities(dataTable: DataTable): Promise<void> {
    const rows = dataTable.rows();
    const expectedCapabilities = rows.map((row: string[]) => row[0]);
    const actualCapabilities = await this.starshipPage.getMissionCapabilities(
      "lunar"
    );

    for (const expectedCapability of expectedCapabilities) {
      await this.assertionHelper.validateBooleanCheck(
        async () =>
          actualCapabilities.some((cap) => cap.includes(expectedCapability)),
        `Should have lunar mission capability: "${expectedCapability}"`
      );
    }
  }

  @When("I read about Earth transportation applications")
  async readEarthTransportationApplications(): Promise<void> {
    await this.starshipPage.navigateToSection("Earth Transport");
  }

  @Then(
    "I should learn that Starship enables the following point-to-point capabilities:"
  )
  async verifyEarthTransportCapabilities(dataTable: DataTable): Promise<void> {
    const rows = dataTable.rows();
    const expectedCapabilities = rows.map((row: string[]) => row[0]);
    const actualCapabilities = await this.starshipPage.getMissionCapabilities(
      "earth"
    );

    for (const expectedCapability of expectedCapabilities) {
      await this.assertionHelper.validateBooleanCheck(
        async () =>
          actualCapabilities.some((cap) => cap.includes(expectedCapability)),
        `Should have Earth transport capability: "${expectedCapability}"`
      );
    }
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

  @Then("the Starship page should be responsive across all viewports")
  async verifyResponsiveDesign(): Promise<void> {
    await this.viewportUtility.checkAllViewports(async (viewportSize) => {
      const viewportInfo = `at ${viewportSize.width}x${viewportSize.height}`;

      await this.assertionHelper.validateBooleanCheck(
        async () => await this.starshipPage.isOverviewSectionVisible(),
        `Overview section should be visible ${viewportInfo}`
      );

      const headline = await this.starshipPage.getOverviewHeadline();
      this.assertionHelper.assertValuePresent(
        headline,
        `Headline should be present ${viewportInfo}`
      );

      this.assertionHelper.assertMetric(
        headline?.length,
        0,
        `Headline should not be empty ${viewportInfo}`
      );

      await this.assertionHelper.validateBooleanCheck(
        async () => await this.starshipPage.header.isHeaderVisible(),
        `Header should be visible ${viewportInfo}`
      );
    });
  }

  @Then("the page layout should adapt correctly to different screen sizes")
  async verifyAdaptiveLayout(): Promise<void> {
    await this.viewportUtility.checkAllViewports(async (viewportSize) => {
      const viewportInfo = `at ${viewportSize.width}x${viewportSize.height}`;

      const sections = [
        {
          name: "Overview",
          method: () => this.starshipPage.isOverviewSectionVisible(),
        },
        {
          name: "Capabilities",
          method: () => this.starshipPage.isCapabilitiesSectionVisible(),
        },
        {
          name: "Header",
          method: () => this.starshipPage.header.isHeaderVisible(),
        },
        {
          name: "Footer",
          method: () => this.starshipPage.footer.footer.isVisible(),
        },
      ];

      for (const section of sections) {
        await this.assertionHelper.validateBooleanCheck(
          section.method,
          `${section.name} section should be visible ${viewportInfo}`
        );
      }

      const headline = await this.starshipPage.getOverviewHeadline();
      this.assertionHelper.assertMetric(
        headline?.length,
        1000,
        `Content should remain readable (not too long) ${viewportInfo}`
      );
    });
  }

  @Then("the mobile navigation menu should work correctly")
  async verifyMobileNavigation(): Promise<void> {
    await this.page.setViewportSize({ width: 375, height: 667 });

    await this.assertionHelper.validateBooleanCheck(
      async () => await this.starshipPage.header.isMobileMenuButtonVisible(),
      "Mobile menu button should be visible on small screens"
    );

    await this.starshipPage.header.openNavigationMenu();
    await this.assertionHelper.validateBooleanCheck(
      async () => await this.starshipPage.header.isMobileMenuExpanded(),
      "Mobile menu should expand when menu button is clicked"
    );

    await this.starshipPage.header.clickMobileMenuCloseButton();
    await this.assertionHelper.validateBooleanCheck(
      async () => await this.starshipPage.header.isMenuCollapsed(),
      "Mobile menu should collapse when close button is clicked"
    );
  }

  @Then("all interactive elements should be accessible on touch devices")
  async verifyTouchAccessibility(): Promise<void> {
    await this.viewportUtility.checkAllViewports(async (viewportSize) => {
      if (viewportSize.width < 768) {
        const buttons = await this.starshipPage.page
          .locator('button, [role="button"], .btn, .button')
          .all();

        for (const button of buttons) {
          const box = await button.boundingBox();
          if (box) {
            this.assertionHelper.assertMetric(
              box.width,
              44,
              `Touch target should be wide enough (min 44px) at ${viewportSize.width}x${viewportSize.height}`
            );

            this.assertionHelper.assertMetric(
              box.height,
              44,
              `Touch target should be tall enough (min 44px) at ${viewportSize.width}x${viewportSize.height}`
            );
          }
        }
      }
    });
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

  @Then("the page should maintain proper layout on viewport resize")
  async verifyLayoutOnResize(): Promise<void> {
    await this.viewportUtility.checkAllViewports(async (viewportSize) => {
      const viewportName = this.getViewportNameFromSize(viewportSize);

      const criticalSections = [
        {
          name: "Overview",
          check: () => this.starshipPage.isOverviewSectionVisible(),
        },
        {
          name: "Header",
          check: () => this.starshipPage.header.isHeaderVisible(),
        },
        {
          name: "Footer",
          check: () => this.starshipPage.footer.footer.isVisible(),
        },
      ];

      for (const section of criticalSections) {
        await this.assertionHelper.validateBooleanCheck(
          section.check,
          `${section.name} should be visible on ${viewportName} viewport (${viewportSize.width}x${viewportSize.height})`
        );
      }

      const headline = await this.starshipPage.getOverviewHeadline();
      this.assertionHelper.assertValuePresent(
        headline,
        `Headline content should be present on ${viewportName} viewport`
      );

      const bodyWidth = await this.page.evaluate(
        () => document.body.scrollWidth
      );
      const viewportWidth = viewportSize.width;

      this.assertionHelper.assertMetric(
        bodyWidth,
        viewportWidth + 10,
        `Page should not have horizontal overflow on ${viewportName} viewport. Body width: ${bodyWidth}, Viewport: ${viewportWidth}`
      );
    });
  }

  private getViewportNameFromSize(viewportSize: {
    width: number;
    height: number;
  }): string {
    if (viewportSize.width <= 480) return "mobile";
    if (viewportSize.width <= 1024) return "tablet";
    return "desktop";
  }
}
