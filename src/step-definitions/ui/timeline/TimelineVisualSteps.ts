import { Then, Fixture } from "playwright-bdd/decorators";
import { expect } from "@playwright/test";
import { DataTable } from "playwright-bdd";
import { HumanSpaceflightPage } from "../../../pages/ui/HumanSpaceflightPage";
import {
  VisualStandard,
  MediaStandard,
  LayoutConsistency,
} from "../../../utils/types/Types";

@Fixture("timelineVisualSteps")
export class TimelineVisualSteps {
  constructor(private humanSpaceflightPage: HumanSpaceflightPage) {}

  @Then("the timeline should meet visual standards:")
  async checkVisualStandards(dataTable: DataTable) {
    const standards = this.parseDataTable<VisualStandard>(dataTable);

    for (const standard of standards) {
      await this.validateVisualStandard(standard);
    }
  }

  @Then("timeline media elements should meet quality standards:")
  async checkMediaQualityStandards(dataTable: DataTable) {
    const standards = this.parseDataTable<MediaStandard>(dataTable);

    for (const standard of standards) {
      await this.validateMediaStandard(standard);
    }
  }

  @Then("layout consistency should be maintained:")
  async checkLayoutConsistency(dataTable: DataTable) {
    const consistencyChecks = this.parseDataTable<LayoutConsistency>(dataTable);
    const consistency =
      await this.humanSpaceflightPage.timeline.checkCardsConsistency();

    for (const check of consistencyChecks) {
      await this.validateLayoutConsistency(check, consistency);
    }
  }

  private parseDataTable<T>(dataTable: DataTable): T[] {
    return dataTable.hashes().map((row) => row as T);
  }

  private async validateVisualStandard(
    standard: VisualStandard
  ): Promise<void> {
    const { Element } = standard;

    switch (Element) {
      case "Card Images":
        await this.validateCardImages();
        break;
      case "Horizon Image":
        await this.validateHorizonVisibility();
        break;
      case "Arrow Buttons":
        await this.validateArrowButtons();
        break;
      case "Card Layout":
        await this.validateCardLayout();
        break;
      default:
        throw new Error(`Unknown visual standard: ${Element}`);
    }
  }

  private async validateCardImages(): Promise<void> {
    const imagesLoaded =
      await this.humanSpaceflightPage.timeline.areBackgroundImagesLoaded();
    expect(imagesLoaded, {
      message: "Card images should load successfully",
    }).toBeTruthy();
  }

  private async validateHorizonVisibility(): Promise<void> {
    const isHorizonVisible =
      await this.humanSpaceflightPage.timeline.isHorizonImageVisible();
    expect(isHorizonVisible, {
      message: "Horizon image should be visible",
    }).toBeTruthy();
  }

  private async validateArrowButtons(): Promise<void> {
    await expect(this.humanSpaceflightPage.timeline.nextArrow, {
      message: "Next arrow should be visible",
    }).toBeVisible();
    await expect(this.humanSpaceflightPage.timeline.previousArrow, {
      message: "Previous arrow should be visible",
    }).toBeVisible();
  }

  private async validateCardLayout(): Promise<void> {
    const consistency =
      await this.humanSpaceflightPage.timeline.checkCardsConsistency();
    expect(consistency.hasConsistentWidth, {
      message: "Cards should have consistent width",
    }).toBeTruthy();
    expect(consistency.hasConsistentHeight, {
      message: "Cards should have consistent height",
    }).toBeTruthy();
  }

  private async validateMediaStandard(standard: MediaStandard): Promise<void> {
    const { Element } = standard;

    switch (Element) {
      case "Card Images":
        const imagesLoaded =
          await this.humanSpaceflightPage.timeline.areBackgroundImagesLoaded();
        expect(imagesLoaded, {
          message: "Card images should load successfully",
        }).toBeTruthy();
        break;
      case "Image Quality":
        const milestones =
          await this.humanSpaceflightPage.timeline.getAllMilestoneData();
        expect(milestones.length, {
          message: "Should have milestone images",
        }).toBeGreaterThan(0);
        break;
      case "Image Opacity":
        const cards = this.humanSpaceflightPage.timeline.milestoneCards;
        const opacityCheck = await cards.evaluateAll((elements) =>
          elements.every((el) => {
            const opacity = window.getComputedStyle(el).opacity;
            return parseFloat(opacity) > 0 && parseFloat(opacity) <= 1;
          })
        );
        expect(opacityCheck, {
          message: "Images should have consistent opacity",
        }).toBeTruthy();
        break;
      default:
        throw new Error(`Unknown media standard: ${Element}`);
    }
  }

  private async validateLayoutConsistency(
    check: LayoutConsistency,
    consistency: any
  ): Promise<void> {
    const { Element } = check;

    switch (Element) {
      case "Card Width":
        expect(consistency.hasConsistentWidth, {
          message: "Cards should have uniform width",
        }).toBeTruthy();
        break;
      case "Card Height":
        expect(consistency.hasConsistentHeight, {
          message: "Cards should have consistent height",
        }).toBeTruthy();
        break;
      case "Card Spacing":
        expect(consistency.hasUniformSpacing, {
          message: "Cards should have even spacing",
        }).toBeTruthy();
        break;
      default:
        throw new Error(`Unknown layout consistency element: ${Element}`);
    }
  }
}
