import { Then, Fixture } from "playwright-bdd/decorators";
import { expect, Page } from "@playwright/test";
import { DataTable } from "playwright-bdd";
import { HumanSpaceflightPage } from "../../../../pages/ui/HumanSpaceflightPage";
import { HotspotRequirement, HotspotContent } from "../../../../utils/types/Types";

@Fixture("theSuitesHotspotSteps")
export class TheSuitesHotspotSteps {
  private readonly TEST_CONSTANTS = {
    MIN_HOTSPOTS: 6,
  } as const;

  constructor(
    private page: Page,
    private humanSpaceflightPage: HumanSpaceflightPage
  ) {}

  @Then("hotspots should be configured properly:")
  async checkHotspotConfiguration(dataTable: DataTable) {
    const requirements = this.parseDataTable<HotspotRequirement>(dataTable);

    for (const requirement of requirements) {
      await this.validateHotspotRequirement(requirement);
    }
  }

  @Then("each hotspot should provide:")
  async checkHotspotContent(dataTable: DataTable) {
    const contentTypes = this.parseDataTable<HotspotContent>(dataTable);
    await this.validateHotspotContent(contentTypes);
  }

  private parseDataTable<T>(dataTable: DataTable): T[] {
    return dataTable.hashes().map((row) => row as T);
  }

  private async validateHotspotRequirement(
    requirement: HotspotRequirement
  ): Promise<void> {
    const { Requirement, Specification } = requirement;

    switch (Requirement) {
      case "Quantity":
        await this.validateHotspotQuantity(Specification);
        break;
      case "Distribution":
        await this.validateHotspotDistribution();
        break;
      case "Upper Body":
        await this.validateUpperBodyHotspots(Specification);
        break;
      case "Lower Body":
        await this.validateLowerBodyHotspots(Specification);
        break;
      default:
        throw new Error(`Unknown hotspot requirement: ${Requirement}`);
    }
  }

  private async validateHotspotQuantity(specification: string): Promise<void> {
    const minCount = this.extractNumber(
      specification,
      this.TEST_CONSTANTS.MIN_HOTSPOTS
    );
    const count = await this.humanSpaceflightPage.theSuites.getHotspotCount();
    expect(count, {
      message: `Should have at least ${minCount} hotspots`,
    }).toBeGreaterThanOrEqual(minCount);
  }

  private async validateHotspotDistribution(): Promise<void> {
    const distribution =
      await this.humanSpaceflightPage.theSuites.getHotspotDistribution();
    expect(distribution.upper, {
      message: "Should have upper body hotspots",
    }).toBeGreaterThan(0);
    expect(distribution.lower, {
      message: "Should have lower body hotspots",
    }).toBeGreaterThan(0);
  }

  private async validateUpperBodyHotspots(
    specification: string
  ): Promise<void> {
    const minCount = this.extractNumber(specification, 2);
    const distribution =
      await this.humanSpaceflightPage.theSuites.getHotspotDistribution();
    expect(distribution.upper, {
      message: "Should have multiple upper body hotspots",
    }).toBeGreaterThanOrEqual(minCount);
  }

  private async validateLowerBodyHotspots(
    specification: string
  ): Promise<void> {
    const minCount = this.extractNumber(specification, 2);
    const distribution =
      await this.humanSpaceflightPage.theSuites.getHotspotDistribution();
    expect(distribution.lower, {
      message: "Should have multiple lower body hotspots",
    }).toBeGreaterThanOrEqual(minCount);
  }

  private async validateHotspotContent(
    contentTypes: HotspotContent[]
  ): Promise<void> {
    const count = await this.humanSpaceflightPage.theSuites.getHotspotCount();

    for (
      let i = 0;
      i < Math.min(count, 3); // Sample 3 hotspots
      i++
    ) {
      await this.humanSpaceflightPage.theSuites.hoverHotspot(i);
      await this.page.waitForTimeout(200);
      const calloutText =
        await this.humanSpaceflightPage.theSuites.getCalloutText();

      for (const contentType of contentTypes) {
        this.validateContentType(calloutText, contentType);
      }
    }

    await this.validateHotspotUniqueness();
  }

  private validateContentType(
    calloutText: string,
    contentType: HotspotContent
  ): void {
    const { "Content Type": type } = contentType;

    expect(calloutText.length, {
      message: `Should have ${type.toLowerCase()} description`,
    }).toBeGreaterThan(0);
  }

  private async validateHotspotUniqueness(): Promise<void> {
    const allTexts =
      await this.humanSpaceflightPage.theSuites.getAllHotspotTexts();
    const uniqueTexts = new Set(allTexts);
    expect(uniqueTexts.size, {
      message: "Each hotspot should have unique information",
    }).toBe(allTexts.length);
  }

  private extractNumber(text: string, defaultValue: number): number {
    const match = text.match(/\d+/);
    return match ? parseInt(match[0]) : defaultValue;
  }
}
