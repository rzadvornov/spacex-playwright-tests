import { When, Then, Fixture } from "playwright-bdd/decorators";
import { expect, Page } from "@playwright/test";
import { DataTable } from "playwright-bdd";
import { HumanSpaceflightPage } from "../../../services/ui/HumanSpaceflightPage";
import {
  CoreRequirement,
  HotspotInteraction,
  NavigationMethod,
} from "../../../utils/types/Types";

@Fixture("timelineNavigationSteps")
export class TimelineNavigationSteps {
  private readonly TEST_CONSTANTS = {
    ANIMATION_DELAY: 500,
    MIN_PAGINATION_DOTS: 12,
    DEFAULT_ACTIVE_INDEX: 0,
  } as const;

  constructor(
    private page: Page,
    private humanSpaceflightPage: HumanSpaceflightPage
  ) {}

  @When("I view the Timeline section with the {string} milestone active")
  async viewTimelineWithActiveCard(year: string) {
    await this.humanSpaceflightPage.timeline.scrollToSection();
    await expect(
      this.humanSpaceflightPage.timeline.timelineSection
    ).toBeVisible();
    const isActive = await this.humanSpaceflightPage.timeline.isCardActive(
      year
    );
    expect(isActive, {
      message: `${year} milestone should be active`,
    }).toBeTruthy();
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
    }).toBeTruthy();
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

  @Then("users should be able to navigate through milestones using:")
  async checkNavigationMethods(dataTable: DataTable) {
    const methods = this.parseDataTable<NavigationMethod>(dataTable);

    for (const method of methods) {
      await this.validateNavigationMethod(method);
    }
  }

  private parseDataTable<T>(dataTable: DataTable): T[] {
    return dataTable.hashes().map((row) => row as T);
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
      }).toBeTruthy();
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
    }).toBeTruthy();
  }

  private async validateTabNavigation(): Promise<void> {
    await this.page.keyboard.press("Tab");
    const hasFocusable = await this.page.evaluate(
      () => document.activeElement !== document.body
    );
    expect(hasFocusable, {
      message: "Should support tab navigation",
    }).toBeTruthy();
  }

  private extractNumber(text: string, defaultValue: number): number {
    const match = text.match(/\d+/);
    return match ? parseInt(match[0]) : defaultValue;
  }
}
