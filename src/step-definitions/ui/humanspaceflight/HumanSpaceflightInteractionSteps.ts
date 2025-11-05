import { Page, expect } from "@playwright/test";
import { When, Then, Fixture } from "playwright-bdd/decorators";
import { HumanSpaceflightPage } from "../../../pages/ui/HumanSpaceflightPage";

@Fixture("humanSpaceflightInteractionSteps")
export class HumanSpaceflightInteractionSteps {
  private readonly SCROLL_DELAY = 500;

  constructor(
    private page: Page,
    private humanSpaceflightPage: HumanSpaceflightPage
  ) {}

  @When("I see the scroll-down arrow animation")
  async checkScrollDownArrowVisible() {
    const isVisible =
      await this.humanSpaceflightPage.hero.isScrollDownArrowVisible();
    expect(isVisible, "Scroll-down arrow should be visible").toBeTruthy();
  }

  @When("I click on the arrow")
  async clickScrollDownArrow() {
    await this.humanSpaceflightPage.hero.clickScrollDownArrow();
    await this.page.waitForTimeout(this.SCROLL_DELAY);
  }

  @Then("the page should smoothly scroll to the Media Carousel section")
  async checkPageScrollsToMediaCarousel() {
    const isVisible =
      await this.humanSpaceflightPage.mediaCarousel.isSectionInViewport();
    expect(
      isVisible,
      "Media Carousel section should be in the viewport after scroll"
    ).toBeTruthy();
  }

  @Then("the upcoming launches widget should be displayed")
  async checkUpcomingLaunchesWidget() {
    const isWidgetVisible =
      await this.humanSpaceflightPage.ourMissions.isUpcomingLaunchesWidgetVisible();
    expect(
      isWidgetVisible,
      "Upcoming launches widget should be displayed"
    ).toBeTruthy();
  }
}
