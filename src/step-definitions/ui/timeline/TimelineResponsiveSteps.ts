import { When, Then, Fixture } from "playwright-bdd/decorators";
import { expect, Page } from "@playwright/test";
import { DataTable } from "playwright-bdd";
import { HumanSpaceflightPage } from "../../../services/ui/HumanSpaceflightPage";
import {
  CoreRequirement,
  PerformanceTarget,
  ResourceOptimization,
} from "../../../utils/types/Types";

@Fixture("timelineResponsiveSteps")
export class TimelineResponsiveSteps {
  constructor(
    private page: Page,
    private humanSpaceflightPage: HumanSpaceflightPage
  ) {}

  @When("viewing on {string} with width {string}px")
  async setViewportForDevice(width: string) {
    const widthNum = parseInt(width);
    await this.page.setViewportSize({ width: widthNum, height: 812 });
  }

  @Then("the timeline should adapt appropriately:")
  async checkTimelineAdaptation(dataTable: DataTable) {
    const adaptations = this.parseDataTable<CoreRequirement>(dataTable);

    for (const adaptation of adaptations) {
      await this.validateTimelineAdaptation(adaptation);
    }
  }

  private parseDataTable<T>(dataTable: DataTable): T[] {
    return dataTable.hashes().map((row) => row as T);
  }

  private async validateTimelineAdaptation(
    adaptation: CoreRequirement
  ): Promise<void> {
    const { Element, Requirement } = adaptation;

    switch (Element) {
      case "Card Width":
        await this.validateCardWidthAdaptation(Requirement);
        break;
      case "Navigation":
        await this.validateNavigationAdaptation();
        break;
      case "Touch Targets":
        await this.validateTouchTargets();
        break;
      case "Text Scaling":
        await this.validateTextScaling();
        break;
      default:
        throw new Error(`Unknown adaptation element: ${Element}`);
    }
  }

  private async validateCardWidthAdaptation(
    requirement: string
  ): Promise<void> {
    const mobileChecks =
      await this.humanSpaceflightPage.timeline.checkMobileResponsiveness();
    if (requirement === "Full width") {
      expect(mobileChecks.isFullWidth, {
        message: "Cards should be full width on mobile",
      }).toBeTruthy();
    }
  }

  private async validateNavigationAdaptation(): Promise<void> {
    const navChecks =
      await this.humanSpaceflightPage.timeline.checkMobileResponsiveness();
    expect(navChecks.areArrowsSized, {
      message: "Navigation arrows should be properly sized",
    }).toBeTruthy();
    expect(navChecks.areDotsTappable, {
      message: "Pagination dots should be tappable",
    }).toBeTruthy();
  }

  private async validateTouchTargets(): Promise<void> {
    const touchChecks =
      await this.humanSpaceflightPage.timeline.checkMobileResponsiveness();
    expect(touchChecks.areArrowsSized, {
      message: "Touch targets should be at least 44x44px",
    }).toBeTruthy();
  }

  private async validateTextScaling(): Promise<void> {
    const readability =
      await this.humanSpaceflightPage.timeline.checkTextReadability();
    expect(readability.isTextReadable, {
      message: "Text should be readable without zoom",
    }).toBeTruthy();
  }

  @Then("the timeline should meet performance targets:")
  async checkPerformanceTargets(dataTable: DataTable) {
    const targets = this.parseDataTable<PerformanceTarget>(dataTable);

    for (const target of targets) {
      await this.validatePerformanceTarget(target);
    }
  }

  @Then("resource optimization should be verified:")
  async checkResourceOptimization(dataTable: DataTable) {
    const optimizations = this.parseDataTable<ResourceOptimization>(dataTable);

    for (const optimization of optimizations) {
      await this.validateResourceOptimization(optimization);
    }
  }

  private async validatePerformanceTarget(
    target: PerformanceTarget
  ): Promise<void> {
    const { Metric } = target;

    switch (Metric) {
      case "Initial Load":
        await expect(this.humanSpaceflightPage.timeline.timelineSection, {
          message: "Timeline section should load",
        }).toBeVisible();
        break;
      case "Image Loading":
        const imagesLoaded =
          await this.humanSpaceflightPage.timeline.areBackgroundImagesLoaded();
        expect(imagesLoaded, {
          message: "Images should load successfully",
        }).toBeTruthy();
        break;
      default:
        throw new Error(`Unknown performance metric: ${Metric}`);
    }
  }

  private async validateResourceOptimization(
    optimization: ResourceOptimization
  ): Promise<void> {
    const { "Resource Type": resourceType } = optimization;

    switch (resourceType) {
      case "Images":
        const imagesLoaded =
          await this.humanSpaceflightPage.timeline.areBackgroundImagesLoaded();
        expect(imagesLoaded, { message: "Images should be optimized" }).toBe(
          true
        );
        break;
      default:
        throw new Error(`Unknown resource type: ${resourceType}`);
    }
  }
}
