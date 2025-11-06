import { When, Then, Fixture } from "playwright-bdd/decorators";
import { expect } from "@playwright/test";
import { DataTable } from "playwright-bdd";
import { HumanSpaceflightPage } from "../../../services/ui/HumanSpaceflightPage";
import {
  CoreElement,
  CardComponent,
  MetadataItem,
} from "../../../utils/types/Types";

@Fixture("timelineCoreSteps")
export class TimelineCoreSteps {
  constructor(private humanSpaceflightPage: HumanSpaceflightPage) {}

  @When("I view the Timeline section")
  async viewTimelineSection() {
    await this.humanSpaceflightPage.timeline.scrollToSection();
    await expect(
      this.humanSpaceflightPage.timeline.timelineSection
    ).toBeVisible();
  }

  @Then("the Timeline section should display core elements:")
  async checkCoreElements(dataTable: DataTable) {
    const elements = this.parseDataTable<CoreElement>(dataTable);

    for (const element of elements) {
      await this.validateCoreElement(element);
    }
  }

  @Then("each milestone card should contain:")
  async checkMilestoneCardComponents(dataTable: DataTable) {
    const components = this.parseDataTable<CardComponent>(dataTable);
    await this.validateMilestoneComponents(components);
  }

  @When("I view the {string} milestone card")
  async viewMilestoneCard(year: string) {
    const card =
      await this.humanSpaceflightPage.timeline.getMilestoneCardByYear(year);
    await card.scrollIntoViewIfNeeded();
    await expect(card).toBeVisible();
  }

  @Then("it should display the following information:")
  async checkMilestoneInformation(dataTable: DataTable) {
    const info = this.parseDataTable<MetadataItem>(dataTable);

    for (const item of info) {
      await this.validateMilestoneInfo(item);
    }
  }

  private parseDataTable<T>(dataTable: DataTable): T[] {
    return dataTable.hashes().map((row) => row as T);
  }

  private async validateCoreElement(element: CoreElement): Promise<void> {
    const { Element, Content } = element;

    switch (Element) {
      case "Heading":
        await this.validateHeading(Content);
        break;
      case "Carousel":
        await this.validateCarousel();
        break;
      case "Navigation":
        await this.validateNavigation();
        break;
      case "Horizon Image":
        await this.validateHorizonImage();
        break;
      default:
        throw new Error(`Unknown core element: ${Element}`);
    }
  }

  private async validateHeading(expectedContent?: string): Promise<void> {
    await expect(
      this.humanSpaceflightPage.timeline.sectionHeading
    ).toBeVisible();
    if (expectedContent) {
      await expect(
        this.humanSpaceflightPage.timeline.sectionHeading
      ).toHaveText(expectedContent);
    }
  }

  private async validateCarousel(): Promise<void> {
    await expect(
      this.humanSpaceflightPage.timeline.timelineCarousel
    ).toBeVisible();
  }

  private async validateNavigation(): Promise<void> {
    await expect(this.humanSpaceflightPage.timeline.nextArrow).toBeVisible();
    await expect(
      this.humanSpaceflightPage.timeline.previousArrow
    ).toBeVisible();
    await expect(
      this.humanSpaceflightPage.timeline.paginationDots
    ).toBeVisible();
  }

  private async validateHorizonImage(): Promise<void> {
    const isHorizonVisible =
      await this.humanSpaceflightPage.timeline.isHorizonImageVisible();
    expect(isHorizonVisible, {
      message: "Horizon image should be visible",
    }).toBeTruthy();
  }

  private async validateMilestoneComponents(
    components: CardComponent[]
  ): Promise<void> {
    const milestones =
      await this.humanSpaceflightPage.timeline.getAllMilestoneData();

    for (const component of components) {
      const { Component } = component;

      switch (Component) {
        case "Year":
          this.validateMilestoneYears(milestones);
          break;
        case "Achievement":
          this.validateMilestoneAchievements(milestones);
          break;
        case "Background":
          await this.validateMilestoneBackgrounds();
          break;
        default:
          throw new Error(`Unknown milestone component: ${Component}`);
      }
    }
  }

  private validateMilestoneYears(milestones: any[]): void {
    for (const milestone of milestones) {
      expect(milestone.year, {
        message: "Each milestone should have a year",
      }).toBeTruthy();
    }
  }

  private validateMilestoneAchievements(milestones: any[]): void {
    for (const milestone of milestones) {
      expect(milestone.achievement, {
        message: "Each milestone should have achievement text",
      }).toBeTruthy();
    }
  }

  private async validateMilestoneBackgrounds(): Promise<void> {
    const imagesLoaded =
      await this.humanSpaceflightPage.timeline.areBackgroundImagesLoaded();
    expect(imagesLoaded, {
      message: "All milestone cards should have background images",
    }).toBeTruthy();
  }

  private async validateMilestoneInfo(item: MetadataItem): Promise<void> {
    const { Element, Content } = item;

    switch (Element) {
      case "Year":
        await this.validateMilestoneYear(Content);
        break;
      case "Achievement":
        await this.validateMilestoneAchievement(Content);
        break;
      case "Image":
        await this.validateMilestoneImage(Content);
        break;
      default:
        throw new Error(`Unknown milestone info element: ${Element}`);
    }
  }

  private async validateMilestoneYear(expectedYear: string): Promise<void> {
    const milestones =
      await this.humanSpaceflightPage.timeline.getAllMilestoneData();
    const foundMilestone = milestones.find((m) => m.year === expectedYear);
    expect(foundMilestone, {
      message: `Should find milestone for year ${expectedYear}`,
    }).toBeTruthy();
  }

  private async validateMilestoneAchievement(
    expectedContent: string
  ): Promise<void> {
    const allMilestones =
      await this.humanSpaceflightPage.timeline.getAllMilestoneData();
    const hasAchievement = allMilestones.some((m) =>
      m.achievement.includes(expectedContent)
    );
    expect(hasAchievement, {
      message: `Should find achievement: ${expectedContent}`,
    }).toBeTruthy();
  }

  private async validateMilestoneImage(expectedContent: string): Promise<void> {
    const imageUrl =
      await this.humanSpaceflightPage.timeline.getBackgroundImageUrl(
        expectedContent
      );
    expect(imageUrl.toLowerCase(), {
      message: `Image should contain ${expectedContent}`,
    }).toContain(expectedContent.toLowerCase());
  }
}
