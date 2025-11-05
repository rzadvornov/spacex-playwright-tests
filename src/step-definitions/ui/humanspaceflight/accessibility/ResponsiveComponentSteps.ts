import { expect } from "@playwright/test";
import { Then, Fixture } from "playwright-bdd/decorators";
import { HumanSpaceflightPage } from "../../../../pages/ui/HumanSpaceflightPage";

@Fixture("responsiveComponentSteps")
export class ResponsiveComponentSteps {
  constructor(private humanSpaceflightPage: HumanSpaceflightPage) {}

  @Then("the carousel should display in single-slide view")
  async checkCarouselSingleSlide() {
    const carouselChecks =
      await this.humanSpaceflightPage.responsiveDesign.checkCarouselResponsiveness();
    expect(
      carouselChecks.isSingleSlide,
      "Carousel should display single slide"
    ).toBeTruthy();
  }

  @Then("the media tiles should be full width")
  async checkMediaTilesFullWidth() {
    const carouselChecks =
      await this.humanSpaceflightPage.responsiveDesign.checkCarouselResponsiveness();
    expect(
      carouselChecks.isFullWidth,
      "Media tiles should be full width"
    ).toBeTruthy();
  }

  @Then("navigation arrows should be appropriately sized for touch")
  async checkArrowsSizedForTouch() {
    const carouselChecks =
      await this.humanSpaceflightPage.responsiveDesign.checkCarouselResponsiveness();
    expect(
      carouselChecks.areTouchTargetsSized,
      "Navigation arrows should be touch-sized"
    ).toBeTruthy();
  }

  @Then("the pagination dots should be visible and tappable")
  async checkPaginationDotsAccessible() {
    const carouselChecks =
      await this.humanSpaceflightPage.responsiveDesign.checkCarouselResponsiveness();
    expect(
      carouselChecks.arePaginationDotsAccessible,
      "Pagination dots should be accessible"
    ).toBeTruthy();
  }

  @Then("all destination images should display appropriately")
  async checkDestinationImages() {
    const destinationsCheck = await this.checkSectionAdaptability(
      '[data-test="destinations-section"]'
    );
    expect(
      destinationsCheck.isLayoutAdapted,
      "Destinations should adapt layout"
    ).toBeTruthy();
  }

  @Then("the destination layout should adapt for mobile screens")
  async checkDestinationLayout() {
    const destinationsCheck = await this.checkSectionAdaptability(
      '[data-test="destinations-section"]'
    );
    expect(
      destinationsCheck.isLayoutAdapted,
      "Destination layout should adapt"
    ).toBeTruthy();
  }

  @Then("each destination should remain clickable and functional")
  async checkDestinationsFunctional() {
    const destinationsCheck = await this.checkSectionAdaptability(
      '[data-test="destinations-section"]'
    );
    expect(
      destinationsCheck.areButtonsTappable,
      "Destinations should be clickable"
    ).toBeTruthy();
  }

  @Then("the mission tabs should display as a clickable list or dropdown")
  async checkMissionTabsDisplay() {
    const missionsCheck = await this.checkSectionAdaptability(
      '[data-test="our-missions-section"]'
    );
    expect(
      missionsCheck.isLayoutAdapted,
      "Mission tabs should adapt layout"
    ).toBeTruthy();
    expect(
      missionsCheck.areButtonsTappable,
      "Mission tabs should be tappable"
    ).toBeTruthy();
  }

  @Then("the metrics table should be reformatted for mobile view")
  async checkMetricsTableFormat() {
    const missionsCheck = await this.checkSectionAdaptability(
      '[data-test="our-missions-section"]'
    );
    expect(
      missionsCheck.isLayoutAdapted,
      "Metrics table should adapt layout"
    ).toBeTruthy();
  }

  @Then("all content should remain readable on small screens")
  async checkContentReadable() {
    const missionsCheck = await this.checkSectionAdaptability(
      '[data-test="our-missions-section"]'
    );
    expect(
      missionsCheck.isContentReadable,
      "Content should be readable"
    ).toBeTruthy();
  }

  @Then("the footer layout should adapt for mobile")
  async checkFooterLayout() {
    const footerCheck =
      await this.humanSpaceflightPage.responsiveDesign.checkFooterResponsiveness();
    expect(
      footerCheck.isVerticalLayout,
      "Footer should have vertical layout"
    ).toBeTruthy();
  }

  @Then("footer elements should stack vertically")
  async checkFooterStacking() {
    const footerCheck =
      await this.humanSpaceflightPage.responsiveDesign.checkFooterResponsiveness();
    expect(
      footerCheck.isVerticalLayout,
      "Footer elements should stack vertically"
    ).toBeTruthy();
  }

  @Then("all links and buttons should be tappable")
  async checkFooterTappableElements() {
    const footerCheck =
      await this.humanSpaceflightPage.responsiveDesign.checkFooterResponsiveness();
    expect(
      footerCheck.areLinksTappable,
      "Footer links should be tappable"
    ).toBeTruthy();
  }

  private async checkSectionAdaptability(selector: string) {
    return await this.humanSpaceflightPage.responsiveDesign.checkSectionAdaptsToMobile(
      selector
    );
  }
}
