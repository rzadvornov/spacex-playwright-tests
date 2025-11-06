import { Then, Fixture } from "playwright-bdd/decorators";
import { expect, Page } from "@playwright/test";
import { DataTable } from "playwright-bdd";
import { HumanSpaceflightPage } from "../../../services/ui/HumanSpaceflightPage";
import {
  TypographyRequirement,
  TextScenario,
  CoreRequirement,
} from "../../../utils/types/Types";

@Fixture("timelineContentSteps")
export class TimelineContentSteps {
  constructor(
    private page: Page,
    private humanSpaceflightPage: HumanSpaceflightPage
  ) {}

  @Then("text elements should meet readability requirements:")
  async checkTypographyRequirements(dataTable: DataTable) {
    const requirements = this.parseDataTable<TypographyRequirement>(dataTable);
    const readability =
      await this.humanSpaceflightPage.timeline.checkTextReadability();

    for (const requirement of requirements) {
      await this.validateTypographyRequirement(requirement, readability);
    }
  }

  @Then("text handling should be robust:")
  async checkTextHandling(dataTable: DataTable) {
    const scenarios = this.parseDataTable<TextScenario>(dataTable);

    for (const scenario of scenarios) {
      await this.validateTextScenario(scenario);
    }
  }

  private parseDataTable<T>(dataTable: DataTable): T[] {
    return dataTable.hashes().map((row) => row as T);
  }

  private async validateTypographyRequirement(
    requirement: TypographyRequirement,
    readability: any
  ): Promise<void> {
    const { Element } = requirement;

    switch (Element) {
      case "Year Display":
        expect(readability.isYearVisible, {
          message: "Year text should be visible",
        }).toBeTruthy();
        break;
      case "Achievement Text":
        expect(readability.isTextReadable, {
          message: "Achievement text should be readable",
        }).toBeTruthy();
        break;
      case "Navigation Labels":
        await expect(this.humanSpaceflightPage.timeline.nextArrow, {
          message: "Navigation should be visible",
        }).toBeVisible();
        break;
      default:
        throw new Error(`Unknown typography requirement: ${Element}`);
    }
  }

  private async validateTextScenario(scenario: TextScenario): Promise<void> {
    const { Scenario } = scenario;

    switch (Scenario) {
      case "Long Content":
        const readability =
          await this.humanSpaceflightPage.timeline.checkTextReadability();
        expect(readability.hasNoOverflow, {
          message: "Text should not overflow",
        }).toBeTruthy();
        break;
      case "Different Lengths":
        const consistency =
          await this.humanSpaceflightPage.timeline.checkCardsConsistency();
        expect(consistency.hasConsistentHeight, {
          message: "Cards should handle different text lengths",
        }).toBeTruthy();
        break;
      default:
        throw new Error(`Unknown text scenario: ${Scenario}`);
    }
  }

  @Then("the timeline section should meet accessibility standards:")
  async checkAccessibilityStandards(dataTable: DataTable) {
    const standards = this.parseDataTable<CoreRequirement>(dataTable);
    const accessibility =
      await this.humanSpaceflightPage.timeline.getAccessibilityStatus();

    for (const standard of standards) {
      await this.validateAccessibilityStandard(standard, accessibility);
    }
  }

  private async validateAccessibilityStandard(
    standard: CoreRequirement,
    accessibility: any
  ): Promise<void> {
    const { Element } = standard;

    switch (Element) {
      case "Navigation":
        expect(accessibility.isKeyboardNavigable, {
          message: "Should be keyboard navigable",
        }).toBeTruthy();
        break;
      case "Button Labels":
        expect(accessibility.hasAriaLabels, {
          message: "Should have ARIA labels",
        }).toBeTruthy();
        break;
      case "Focus States":
        await this.validateFocusStates();
        break;
      default:
        throw new Error(`Unknown accessibility standard: ${Element}`);
    }
  }

  private async validateFocusStates(): Promise<void> {
    const focusableCount = await this.page
      .locator("button, [tabindex]")
      .count();
    expect(focusableCount, {
      message: "Should have focusable elements",
    }).toBeGreaterThan(0);
  }
}
