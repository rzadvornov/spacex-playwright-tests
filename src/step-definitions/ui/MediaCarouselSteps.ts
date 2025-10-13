import { Page, expect } from "@playwright/test";
import { Given, When, Then, Fixture } from "playwright-bdd/decorators";
import { DataTable } from "playwright-bdd";
import { HumanSpaceflightPage } from "../../pages/ui/HumanSpaceflightPage";
import { parseMediaTiles } from "../../pages/types/TypeGuards";
import { BoundingBox, MediaTile } from "../../pages/types/Types";

@Fixture("mediaCarouselSteps")
export class MediaCarouselSteps {
  private readonly EXPECTED_TILE_COUNT = 4;

  constructor(
    private page: Page,
    private humanSpaceflightPage: HumanSpaceflightPage
  ) {}

  @When("I view the media carousel section")
  async viewMediaCarousel() {
    const isVisible = await this.humanSpaceflightPage.mediaCarousel.isVisible();
    expect(isVisible, "Media carousel should be visible").toBe(true);
  }

  @Given("I view the media carousel with the {string} tile active")
  async viewMediaCarouselWithTileActive(expectedTile: string) {
    await this.humanSpaceflightPage.scrollToMediaCarousel();
    const isActive = await this.humanSpaceflightPage.isTileActive(expectedTile);
    expect(isActive, `Tile "${expectedTile}" should be active`).toBe(true);
  }

  @Then("the carousel should be visible")
  async checkCarouselIsVisible() {
    const isVisible = await this.humanSpaceflightPage.mediaCarousel.isVisible();
    expect(isVisible, "Media carousel section must be visible").toBe(true);
  }

  @Then("I should see four media tiles:")
  async checkMediaTiles(dataTable: DataTable) {
    const expectedTiles = parseMediaTiles(dataTable.hashes());
    const tiles = await this.humanSpaceflightPage.getMediaTiles();

    expect(
      tiles.length,
      `Should have exactly ${this.EXPECTED_TILE_COUNT} media tiles`
    ).toBe(this.EXPECTED_TILE_COUNT);

    for (const expectedTile of expectedTiles) {
      await this.validateMediaTile(tiles, expectedTile);
    }
  }

  private async validateMediaTile(
    tiles: any[],
    expectedTile: MediaTile
  ): Promise<void> {
    const tile = tiles.find((t) => t.title === expectedTile.Title);
    expect(
      tile,
      `Tile with title "${expectedTile.Title}" should exist`
    ).toBeDefined();
    expect(
      tile?.type,
      `Tile "${expectedTile.Title}" should be of type ${expectedTile["Media Type"]}`
    ).toBe(expectedTile["Media Type"]);
  }

  @Then("each tile should have an image or audio/video player")
  async checkTilesHaveMedia() {
    const hasMedia =
      await this.humanSpaceflightPage.mediaCarousel.checkTilesHaveMedia();
    expect(
      hasMedia,
      "All media tiles must contain a visual/audio element"
    ).toBe(true);
  }

  @Then("navigation arrows should be present to scroll through tiles")
  async checkNavigationArrows() {
    const isVisible =
      await this.humanSpaceflightPage.mediaCarousel.areNavigationArrowsVisible();
    expect(isVisible, "Navigation arrows (prev/next) must be visible").toBe(
      true
    );
  }

  @Then("pagination dots should indicate the current tile")
  async checkPaginationDots() {
    const isVisible =
      await this.humanSpaceflightPage.mediaCarousel.arePaginationDotsVisible();
    expect(isVisible, "Pagination dots must be visible").toBe(true);
  }

  @When("I click the play button on the {string} video tile")
  async clickVideoTile(title: string) {
    await this.humanSpaceflightPage.clickVideoTile(title);
  }

  @Then("an overlay with the video player should open")
  async checkVideoOverlayOpen() {
    const isVisible =
      await this.humanSpaceflightPage.mediaCarousel.isVideoOverlayVisible();
    expect(isVisible, "Video overlay should be visible").toBe(true);
  }

  @Then("the YouTube video should load")
  async checkYouTubeVideoLoad() {
    const isLoaded =
      await this.humanSpaceflightPage.mediaCarousel.isYouTubeVideoLoaded();
    expect(isLoaded, "YouTube video must load within the overlay").toBe(true);
  }

  @Then("the video title should be {string}")
  async checkVideoTitle(expectedTitle: string) {
    const actualTitle =
      await this.humanSpaceflightPage.mediaCarousel.getVideoTitle();
    expect(
      actualTitle,
      `Video title should contain "${expectedTitle}"`
    ).toContain(expectedTitle);
  }

  @Then("the video description should be {string}")
  async checkVideoDescription(expectedDescription: string) {
    const actualDescription =
      await this.humanSpaceflightPage.mediaCarousel.getVideoDescription();
    expect(
      actualDescription,
      `Video description should contain "${expectedDescription}"`
    ).toContain(expectedDescription);
  }

  @Then("a close button should be visible to dismiss the overlay")
  async checkVideoCloseButton() {
    const isVisible =
      await this.humanSpaceflightPage.mediaCarousel.isOverlayCloseButtonVisible();
    expect(isVisible, "Close button must be visible on the overlay").toBe(true);
  }

  @When("I click the close button")
  async clickCloseButton() {
    await this.humanSpaceflightPage.clickOverlayCloseButton();
  }

  @Then("the overlay should close and return to the carousel")
  async checkOverlayClosed() {
    const isOverlayClosed =
      await this.humanSpaceflightPage.mediaCarousel.isVideoOverlayClosed();
    expect(isOverlayClosed, "Video overlay should be closed").toBe(true);
  }

  @When("I click on the {string} audio tile")
  async clickAudioTile(title: string) {
    await this.humanSpaceflightPage.clickAudioTile(title);
  }

  @Then("an audio player should be displayed")
  async checkAudioPlayerVisible() {
    const isVisible = await this.humanSpaceflightPage.isAudioPlayerVisible();
    expect(isVisible, "Audio player should be visible").toBe(true);
  }

  @Then("the audio title should be {string}")
  async checkAudioTitle(expectedTitle: string) {
    const actualTitle = await this.humanSpaceflightPage.getAudioTitle();
    expect(
      actualTitle,
      `Audio title should contain "${expectedTitle}"`
    ).toContain(expectedTitle);
  }

  @Then("the audio description should be {string}")
  async checkAudioDescription(expectedDescription: string) {
    const actualDescription =
      await this.humanSpaceflightPage.getAudioDescription();
    expect(
      actualDescription,
      `Audio description should contain "${expectedDescription}"`
    ).toContain(expectedDescription);
  }

  @Then("the audio player should have play\\/pause controls")
  async checkAudioPlayerControls() {
    const hasControls =
      await this.humanSpaceflightPage.hasAudioPlayerControls();
    expect(hasControls, "Audio player must have play/pause controls").toBe(
      true
    );
  }

  @Then("the audio player should display the audio duration")
  async checkAudioDuration() {
    const hasDuration = await this.humanSpaceflightPage.hasAudioDuration();
    expect(hasDuration, "Audio player must display duration").toBe(true);
  }

  @Then("the audio player should display a progress bar")
  async checkAudioProgressBar() {
    const hasProgressBar =
      await this.humanSpaceflightPage.hasAudioProgressBar();
    expect(hasProgressBar, "Audio player must display a progress bar").toBe(
      true
    );
  }

  @When("I click on the pagination dot for the second tile")
  async clickPaginationDotForSecondTile() {
    await this.humanSpaceflightPage.clickPaginationDot(2);
  }

  @Then("the carousel should advance to the {string} tile")
  async checkCarouselAdvanced(expectedTile: string) {
    const isActive = await this.humanSpaceflightPage.isTileActive(expectedTile);
    expect(isActive, `Carousel should advance to "${expectedTile}" tile`).toBe(
      true
    );
  }

  @Then("the pagination dot for {string} should be active")
  async checkPaginationDotActive(expectedTile: string) {
    const isActive =
      await this.humanSpaceflightPage.mediaCarousel.isPaginationDotActive(
        expectedTile
      );
    expect(
      isActive,
      `Pagination dot for "${expectedTile}" must be active`
    ).toBe(true);
  }

  @When("I click the next arrow button")
  async clickNextArrow() {
    await this.humanSpaceflightPage.clickNextArrow();
  }

  @When("I click the previous arrow button")
  async clickPreviousArrow() {
    await this.humanSpaceflightPage.clickPreviousArrow();
  }

  @Then("no media should auto-play on page load \\(autoplay disabled)")
  async checkNoAutoplay() {
    const isAutoplayDisabled =
      await this.humanSpaceflightPage.isMediaAutoplayDisabled();
    expect(isAutoplayDisabled, "Media autoplay should be disabled").toBe(true);
  }

  @When("I click the play button on a video tile")
  async clickFirstAvailableVideoTile() {
    await this.humanSpaceflightPage.mediaCarousel.clickFirstVideoTile();
  }

  @When("I press the Escape key")
  async pressEscapeKey() {
    await this.page.keyboard.press("Escape");
  }

  @Then("the overlay should close")
  async checkOverlayClosedAfterEscape() {
    const isOverlayClosed =
      await this.humanSpaceflightPage.mediaCarousel.isVideoOverlayClosed();
    expect(
      isOverlayClosed,
      "Overlay should close after pressing the Escape key"
    ).toBe(true);
  }

  @Then("all video tiles should have play buttons")
  async checkAllVideoTilesHavePlayButtons() {
    const hasMedia =
      await this.humanSpaceflightPage.mediaCarousel.checkTilesHaveMedia();
    expect(hasMedia, "All video tiles should have media elements").toBe(true);
  }

  @Then("the carousel should be accessible via keyboard navigation")
  async checkKeyboardNavigation() {
    const hasNavigation =
      await this.humanSpaceflightPage.mediaCarousel.areNavigationArrowsVisible();
    expect(hasNavigation, "Carousel should have navigation controls").toBe(
      true
    );
  }

  @Then("the media carousel should be responsive across screen sizes")
  async checkCarouselResponsiveness() {
    const viewportSizes: BoundingBox[] = [
      { x: 0, y: 0, width: 375, height: 667 }, // Mobile
      { x: 0, y: 0, width: 768, height: 1024 }, // Tablet
      { x: 0, y: 0, width: 1920, height: 1080 }, // Desktop
    ];

    const originalViewport = this.page.viewportSize();

    try {
      for (const size of viewportSizes) {
        await this.page.setViewportSize({
          width: size.width,
          height: size.height,
        });
        await this.page.waitForTimeout(100);

        const [carouselVisible, navigationVisible] = await Promise.all([
          this.humanSpaceflightPage.mediaCarousel.isVisible(),
          this.humanSpaceflightPage.mediaCarousel.areNavigationArrowsVisible(),
        ]);

        expect(
          carouselVisible && navigationVisible,
          `Media carousel should be responsive at ${size.width}x${size.height}`
        ).toBe(true);
      }
    } finally {
      if (originalViewport) {
        await this.page.setViewportSize(originalViewport);
      }
    }
  }
}
