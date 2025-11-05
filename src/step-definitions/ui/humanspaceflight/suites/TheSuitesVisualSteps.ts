import { Then, Fixture } from "playwright-bdd/decorators";
import { expect } from "@playwright/test";
import { DataTable } from "playwright-bdd";
import { HumanSpaceflightPage } from "../../../../pages/ui/HumanSpaceflightPage";
import { VisualStandard, SuitInfo } from "../../../../utils/types/Types";

@Fixture("theSuitesVisualSteps")
export class TheSuitesVisualSteps {
  private readonly TEST_CONSTANTS = {
    SAMPLE_HOTSPOTS: 3,
  } as const;

  constructor(
    private humanSpaceflightPage: HumanSpaceflightPage
  ) {}

  @Then("the suit display should meet visual standards:")
  async checkVisualStandards(dataTable: DataTable) {
    const standards = this.parseDataTable<VisualStandard>(dataTable);

    for (const standard of standards) {
      await this.validateVisualStandard(standard);
    }
  }

  @Then("each suit type should display complete information:")
  async checkSuitInformation(dataTable: DataTable) {
    const suitInfo = this.parseDataTable<SuitInfo>(dataTable);

    for (const suit of suitInfo) {
      await this.validateSuitInformation(suit);
    }
  }

  private parseDataTable<T>(dataTable: DataTable): T[] {
    return dataTable.hashes().map((row) => row as T);
  }

  private async validateVisualStandard(
    standard: VisualStandard
  ): Promise<void> {
    const { Element, Requirement } = standard;

    switch (Element) {
      case "Suit Image":
        await this.validateSuitImageStandard(Requirement);
        break;
      case "Image Position":
        await this.validateImagePositionStandard(Requirement);
        break;
      case "Background":
        await this.validateBackgroundStandard(Requirement);
        break;
      case "Hotspot Markers":
        await this.validateHotspotMarkersStandard(Requirement);
        break;
      case "Callouts":
        await this.validateCalloutsStandard(Requirement);
        break;
      default:
        throw new Error(`Unknown visual standard element: ${Element}`);
    }
  }

  private async validateSuitImageStandard(requirement: string): Promise<void> {
    if (requirement === "Properly loaded") {
      const isLoaded =
        await this.humanSpaceflightPage.theSuites.isSuitImageLoaded();
      expect(isLoaded, { message: "Suit image should load properly" }).toBe(
        true
      );
    }
  }

  private async validateImagePositionStandard(
    requirement: string
  ): Promise<void> {
    if (requirement === "Centered in viewport") {
      const isCentered =
        await this.humanSpaceflightPage.theSuites.isSuitImageCentered();
      expect(isCentered, { message: "Suit image should be centered" }).toBe(
        true
      );
    }
  }

  private async validateBackgroundStandard(requirement: string): Promise<void> {
    if (requirement === "Gradient effect") {
      const isVisible =
        await this.humanSpaceflightPage.theSuites.isGradientVisible();
      expect(isVisible, {
        message: "Background gradient should be visible",
      }).toBeTruthy();

      const enhancesVisibility =
        await this.humanSpaceflightPage.theSuites.isGradientEnhancingSuitVisibility();
      expect(enhancesVisibility, {
        message: "Gradient should enhance visibility",
      }).toBeTruthy();
    }
  }

  private async validateHotspotMarkersStandard(
    requirement: string
  ): Promise<void> {
    if (requirement === "Clearly visible") {
      const areVisible =
        await this.humanSpaceflightPage.theSuites.areHotspotsVisible();
      expect(areVisible, { message: "Hotspot markers should be visible" }).toBe(
        true
      );
    }
  }

  private async validateCalloutsStandard(requirement: string): Promise<void> {
    if (requirement === "Position adapts") {
      const count = await this.humanSpaceflightPage.theSuites.getHotspotCount();
      for (
        let i = 0;
        i < Math.min(count, this.TEST_CONSTANTS.SAMPLE_HOTSPOTS);
        i++
      ) {
        const isPositioned =
          await this.humanSpaceflightPage.theSuites.isCalloutPositionedCorrectly(
            i
          );
        expect(isPositioned, {
          message: `Callout should adapt position for hotspot ${i + 1}`,
        }).toBeTruthy();
      }
    }
  }

  private async validateSuitInformation(suit: SuitInfo): Promise<void> {
    const { "Suit Type": suitType, "Required Information": requiredInfo } =
      suit;

    await this.ensureSuitActive(suitType);

    const isLoaded =
      await this.humanSpaceflightPage.theSuites.isSuitImageLoaded();
    expect(isLoaded, {
      message: `${suitType} suit image should load`,
    }).toBeTruthy();

    const hotspotCount =
      await this.humanSpaceflightPage.theSuites.getHotspotCount();
    expect(hotspotCount, {
      message: `${suitType} suit should have hotspots`,
    }).toBeGreaterThan(0);
  }

  private async ensureSuitActive(suitType: string): Promise<void> {
    if (suitType === "IVA") {
      await expect(this.humanSpaceflightPage.theSuites.ivaButton).toHaveClass(
        /active/
      );
    } else if (suitType === "EVA") {
      const isActive = await this.humanSpaceflightPage.theSuites.evaButton
        .getAttribute("class")
        .then((className) => className?.includes("active"));

      if (!isActive) {
        await this.humanSpaceflightPage.theSuites.evaButton.click();
      }
      await expect(this.humanSpaceflightPage.theSuites.evaButton).toHaveClass(
        /active/
      );
    }
  }
}
