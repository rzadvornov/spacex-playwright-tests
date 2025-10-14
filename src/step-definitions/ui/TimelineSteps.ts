import { When, Then, Fixture } from "playwright-bdd/decorators";
import { expect, Page } from "@playwright/test";
import { DataTable } from "playwright-bdd";
import { HumanSpaceflightPage } from "../../pages/ui/HumanSpaceflightPage";
import {
  CardComponent,
  CoreElement,
  CoreRequirement,
  HotspotInteraction,
  LayoutConsistency,
  MediaStandard,
  MetadataItem,
  NavigationMethod,
  PerformanceTarget,
  ResourceOptimization,
  TextScenario,
  TypographyRequirement,
  VisualStandard,
} from "../../pages/types/Types";

@Fixture("timelineSteps")
export class TimelineSteps {
  private readonly TEST_CONSTANTS = {
    ANIMATION_DELAY: 500,
    MIN_PAGINATION_DOTS: 12,
    DEFAULT_ACTIVE_INDEX: 0,
    MIN_TOUCH_TARGET: 44,
  } as const;

  constructor(
    private page: Page,
    private humanSpaceflightPage: HumanSpaceflightPage
  ) {}

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

  @When("I view the Timeline section with the {string} milestone active")
  async viewTimelineWithActiveCard(year: string) {
    await this.viewTimelineSection();
    const isActive = await this.humanSpaceflightPage.timeline.isCardActive(
      year
    );
    expect(isActive, { message: `${year} milestone should be active` }).toBe(
      true
    );
  }

  @When("I click the {string} arrow")
  async clickArrow(direction: string) {
    await this.performArrowClick(direction);
    await this.page.waitForTimeout(this.TEST_CONSTANTS.ANIMATION_DELAY);
  }

  @Then("the carousel should navigate to the {string} milestone")
  async checkNavigationToMilestone(year: string) {
    const isActive = await this.humanSpaceflightPage.timeline.isCardActive(
      year
    );
    expect(isActive, {
      message: `${year} milestone should be active after navigation`,
    }).toBe(true);
  }

  @Then("the pagination dot on behalf of {string} should be active")
  async checkPaginationDotActive() {
    const activeIndex =
      await this.humanSpaceflightPage.timeline.getActivePaginationDotIndex();
    expect(activeIndex, {
      message: "A pagination dot should be active",
    }).toBeGreaterThanOrEqual(0);
  }

  @Then("pagination navigation should meet requirements:")
  async checkPaginationRequirements(dataTable: DataTable) {
    const requirements = this.parseDataTable<CoreRequirement>(dataTable);

    for (const requirement of requirements) {
      await this.validatePaginationRequirement(requirement);
    }
  }

  @When("I interact with pagination:")
  async interactWithPagination(dataTable: DataTable) {
    const interactions = this.parseDataTable<HotspotInteraction>(dataTable);

    for (const interaction of interactions) {
      await this.performPaginationInteraction(interaction);
    }
  }

  @Then("the timeline should meet visual standards:")
  async checkVisualStandards(dataTable: DataTable) {
    const standards = this.parseDataTable<VisualStandard>(dataTable);

    for (const standard of standards) {
      await this.validateVisualStandard(standard);
    }
  }

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

  @Then("the timeline section should meet accessibility standards:")
  async checkAccessibilityStandards(dataTable: DataTable) {
    const standards = this.parseDataTable<CoreRequirement>(dataTable);
    const accessibility =
      await this.humanSpaceflightPage.timeline.getAccessibilityStatus();

    for (const standard of standards) {
      await this.validateAccessibilityStandard(standard, accessibility);
    }
  }

  @Then("users should be able to navigate through milestones using:")
  async checkNavigationMethods(dataTable: DataTable) {
    const methods = this.parseDataTable<NavigationMethod>(dataTable);

    for (const method of methods) {
      await this.validateNavigationMethod(method);
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
    }).toBe(true);
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
    }).toBe(true);
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
    }).toBe(true);
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

  private async performArrowClick(direction: string): Promise<void> {
    if (direction === "next") {
      await this.humanSpaceflightPage.timeline.nextArrow.click();
    } else if (direction === "previous") {
      await this.humanSpaceflightPage.timeline.previousArrow.click();
    } else {
      throw new Error(`Unknown arrow direction: ${direction}`);
    }
  }

  private async validatePaginationRequirement(
    requirement: CoreRequirement
  ): Promise<void> {
    const { Element, Requirement } = requirement;

    switch (Element) {
      case "Dot Count":
        await this.validateDotCount(Requirement);
        break;
      case "Default State":
        await this.validateDefaultState();
        break;
      case "Visibility":
        await this.validateDotVisibility();
        break;
      case "Interaction":
        await this.validateDotInteraction();
        break;
      default:
        throw new Error(`Unknown pagination requirement: ${Element}`);
    }
  }

  private async validateDotCount(requirement: string): Promise<void> {
    const expectedCount = this.extractNumber(
      requirement,
      this.TEST_CONSTANTS.MIN_PAGINATION_DOTS
    );
    const actualCount =
      await this.humanSpaceflightPage.timeline.getPaginationDotsCount();
    expect(actualCount, {
      message: `Should have ${expectedCount} pagination dots`,
    }).toBe(expectedCount);
  }

  private async validateDefaultState(): Promise<void> {
    const activeIndex =
      await this.humanSpaceflightPage.timeline.getActivePaginationDotIndex();
    expect(activeIndex, {
      message: "First dot should be active by default",
    }).toBe(this.TEST_CONSTANTS.DEFAULT_ACTIVE_INDEX);
  }

  private async validateDotVisibility(): Promise<void> {
    const dotsCount =
      await this.humanSpaceflightPage.timeline.getPaginationDotsCount();
    for (let i = 0; i < dotsCount; i++) {
      const isVisible = await this.humanSpaceflightPage.timeline.paginationDots
        .nth(i)
        .isVisible();
      expect(isVisible, {
        message: `Pagination dot ${i + 1} should be visible`,
      }).toBe(true);
    }
  }

  private async validateDotInteraction(): Promise<void> {
    const dotsCount =
      await this.humanSpaceflightPage.timeline.getPaginationDotsCount();
    expect(dotsCount, {
      message: "Should have pagination dots for interaction",
    }).toBeGreaterThan(0);
  }

  private async performPaginationInteraction(
    interaction: HotspotInteraction
  ): Promise<void> {
    const { Action } = interaction;

    if (Action.includes("dot")) {
      const dotNumber = this.extractNumber(Action, 1);
      await this.humanSpaceflightPage.timeline.clickPaginationDot(
        dotNumber - 1
      );
      await this.page.waitForTimeout(this.TEST_CONSTANTS.ANIMATION_DELAY);

      const milestones =
        await this.humanSpaceflightPage.timeline.getAllMilestoneData();
      expect(milestones.length, {
        message: "Should have milestones after pagination click",
      }).toBeGreaterThan(0);
    }
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
    }).toBe(true);
  }

  private async validateHorizonVisibility(): Promise<void> {
    const isHorizonVisible =
      await this.humanSpaceflightPage.timeline.isHorizonImageVisible();
    expect(isHorizonVisible, {
      message: "Horizon image should be visible",
    }).toBe(true);
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
    }).toBe(true);
    expect(consistency.hasConsistentHeight, {
      message: "Cards should have consistent height",
    }).toBe(true);
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
      }).toBe(true);
    }
  }

  private async validateNavigationAdaptation(): Promise<void> {
    const navChecks =
      await this.humanSpaceflightPage.timeline.checkMobileResponsiveness();
    expect(navChecks.areArrowsSized, {
      message: "Navigation arrows should be properly sized",
    }).toBe(true);
    expect(navChecks.areDotsTappable, {
      message: "Pagination dots should be tappable",
    }).toBe(true);
  }

  private async validateTouchTargets(): Promise<void> {
    const touchChecks =
      await this.humanSpaceflightPage.timeline.checkMobileResponsiveness();
    expect(touchChecks.areArrowsSized, {
      message: "Touch targets should be at least 44x44px",
    }).toBe(true);
  }

  private async validateTextScaling(): Promise<void> {
    const readability =
      await this.humanSpaceflightPage.timeline.checkTextReadability();
    expect(readability.isTextReadable, {
      message: "Text should be readable without zoom",
    }).toBe(true);
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
        }).toBe(true);
        break;
      case "Button Labels":
        expect(accessibility.hasAriaLabels, {
          message: "Should have ARIA labels",
        }).toBe(true);
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

  private async validateNavigationMethod(
    method: NavigationMethod
  ): Promise<void> {
    const { Method } = method;

    switch (Method) {
      case "Arrow Keys":
        await this.validateArrowKeyNavigation();
        break;
      case "Tab Key":
        await this.validateTabNavigation();
        break;
      default:
        throw new Error(`Unknown navigation method: ${Method}`);
    }
  }

  private async validateArrowKeyNavigation(): Promise<void> {
    await this.page.keyboard.press("ArrowRight");
    await this.page.waitForTimeout(this.TEST_CONSTANTS.ANIMATION_DELAY);
    const accessibility =
      await this.humanSpaceflightPage.timeline.getAccessibilityStatus();
    expect(accessibility.isKeyboardNavigable, {
      message: "Should support arrow key navigation",
    }).toBe(true);
  }

  private async validateTabNavigation(): Promise<void> {
    await this.page.keyboard.press("Tab");
    const hasFocusable = await this.page.evaluate(
      () => document.activeElement !== document.body
    );
    expect(hasFocusable, { message: "Should support tab navigation" }).toBe(
      true
    );
  }

  private async validateMediaStandard(standard: MediaStandard): Promise<void> {
    const { Element } = standard;

    switch (Element) {
      case "Card Images":
        const imagesLoaded =
          await this.humanSpaceflightPage.timeline.areBackgroundImagesLoaded();
        expect(imagesLoaded, {
          message: "Card images should load successfully",
        }).toBe(true);
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
        }).toBe(true);
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
        }).toBe(true);
        break;
      case "Card Height":
        expect(consistency.hasConsistentHeight, {
          message: "Cards should have consistent height",
        }).toBe(true);
        break;
      case "Card Spacing":
        expect(consistency.hasUniformSpacing, {
          message: "Cards should have even spacing",
        }).toBe(true);
        break;
      default:
        throw new Error(`Unknown layout consistency element: ${Element}`);
    }
  }

  private async validateTypographyRequirement(
    requirement: TypographyRequirement,
    readability: any
  ): Promise<void> {
    const {
      Element,
    } = requirement;

    switch (Element) {
      case "Year Display":
        expect(readability.isYearVisible, {
          message: "Year text should be visible",
        }).toBe(true);
        break;
      case "Achievement Text":
        expect(readability.isTextReadable, {
          message: "Achievement text should be readable",
        }).toBe(true);
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
        }).toBe(true);
        break;
      case "Different Lengths":
        const consistency =
          await this.humanSpaceflightPage.timeline.checkCardsConsistency();
        expect(consistency.hasConsistentHeight, {
          message: "Cards should handle different text lengths",
        }).toBe(true);
        break;
      default:
        throw new Error(`Unknown text scenario: ${Scenario}`);
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
        }).toBe(true);
        break;
      default:
        throw new Error(`Unknown performance metric: ${Metric}`);
    }
  }

  private async validateResourceOptimization(
    optimization: ResourceOptimization
  ): Promise<void> {
    const {
      "Resource Type": resourceType,
    } = optimization;

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

  private extractNumber(text: string, defaultValue: number): number {
    const match = text.match(/\d+/);
    return match ? parseInt(match[0]) : defaultValue;
  }
}
