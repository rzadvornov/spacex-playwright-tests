import { Locator, Page } from "@playwright/test";
import { MediaTile } from "../types/Types";

export class MediaCarouselPOF {
  readonly page: Page;
  readonly carouselSection: Locator;
  private readonly mediaTiles: Locator;
  private readonly navigationArrows: Locator;
  private readonly paginationDots: Locator;
  private readonly videoOverlay: Locator;
  private readonly audioPlayer: Locator;

  constructor(page: Page) {
    this.page = page;
    this.carouselSection = page.locator('[data-test="media-carousel"]');
    this.mediaTiles = this.carouselSection.locator(".media-tile");
    this.navigationArrows = this.carouselSection.locator(".carousel-arrow");
    this.paginationDots = this.carouselSection.locator(".pagination-dot");
    this.videoOverlay = page.locator(".video-overlay");
    this.audioPlayer = page.locator(".audio-player");
  }

  private async getElementTextContent(element: Locator): Promise<string> {
    const text = await element.textContent();
    return text?.trim() ?? "";
  }

  private async getElementAttribute(
    element: Locator,
    attribute: string
  ): Promise<string> {
    const value = await element.getAttribute(attribute);
    return value ?? "";
  }

  private getMediaTileByTitle(title: string): Locator {
    return this.mediaTiles.filter({ hasText: title });
  }

  private getVideoPlayButton(tile: Locator): Locator {
    return tile.locator(
      'button[aria-label*="Play"], .video-play-button, .play-button'
    );
  }

  private async isElementInViewport(element: Locator): Promise<boolean> {
    const boundingBox = await element.boundingBox();
    const viewport = this.page.viewportSize();

    if (!boundingBox || !viewport) {
      return false;
    }

    return (
      boundingBox.y < viewport.height && boundingBox.y + boundingBox.height > 0
    );
  }

  private async hasActiveClass(element: Locator): Promise<boolean> {
    const classNames = await this.getElementAttribute(element, "class");
    return classNames.includes("active");
  }

  async isVisible(): Promise<boolean> {
    return await this.carouselSection.isVisible();
  }

  async getMediaTiles(): Promise<MediaTile[]> {
    const count = await this.mediaTiles.count();
    const tiles: MediaTile[] = [];

    for (let i = 0; i < count; i++) {
      const tile = this.mediaTiles.nth(i);
      const [Title, Type] = await Promise.all([
        this.getElementTextContent(tile.locator(".title")),
        this.getElementAttribute(tile, "data-media-type"),
      ]);

      tiles.push({ Title, Type });
    }

    return tiles;
  }

  async checkTilesHaveMedia(): Promise<boolean> {
    const count = await this.mediaTiles.count();

    for (let i = 0; i < count; i++) {
      const tile = this.mediaTiles.nth(i);
      const hasMedia = await tile
        .locator("img, .player, video, audio")
        .isVisible();
      if (!hasMedia) return false;
    }

    return count > 0;
  }

  async arePaginationDotsVisible(): Promise<boolean> {
    const firstDot = this.paginationDots.first();
    return await firstDot.isVisible();
  }

  async clickVideoTilePlayButton(title: string): Promise<void> {
    const tile = this.getMediaTileByTitle(title);
    const playButton = this.getVideoPlayButton(tile);
    await playButton.click();
  }

  async isVideoOverlayVisible(): Promise<boolean> {
    return await this.videoOverlay.isVisible();
  }

  async isYouTubeVideoLoaded(): Promise<boolean> {
    const iframe = this.videoOverlay.locator('iframe[src*="youtube"]');
    return await iframe.isVisible();
  }

  async getVideoTitle(): Promise<string> {
    return await this.getElementTextContent(
      this.videoOverlay.locator(".video-title")
    );
  }

  async getVideoDescription(): Promise<string> {
    return await this.getElementTextContent(
      this.videoOverlay.locator(".video-description")
    );
  }

  async isOverlayCloseButtonVisible(): Promise<boolean> {
    const closeButton = this.videoOverlay.locator(".close-button");
    return await closeButton.isVisible();
  }

  async clickOverlayCloseButton(): Promise<void> {
    const closeButton = this.videoOverlay.locator(".close-button");
    await closeButton.click();
  }

  async isVideoOverlayClosed(): Promise<boolean> {
    return !(await this.videoOverlay.isVisible());
  }

  async clickAudioTile(title: string): Promise<void> {
    const tile = this.getMediaTileByTitle(title);
    await tile.click();
  }

  async isAudioPlayerVisible(): Promise<boolean> {
    return await this.audioPlayer.isVisible();
  }

  async hasAudioPlayerControls(): Promise<boolean> {
    const playButton = this.audioPlayer.locator(".play-pause-button");
    return await playButton.isVisible();
  }

  async hasAudioDuration(): Promise<boolean> {
    const duration = this.audioPlayer.locator(".duration");
    return await duration.isVisible();
  }

  async hasAudioProgressBar(): Promise<boolean> {
    const progressBar = this.audioPlayer.locator(".progress-bar");
    return await progressBar.isVisible();
  }

  async getAudioTitle(): Promise<string> {
    return await this.getElementTextContent(
      this.audioPlayer.locator(".audio-title")
    );
  }

  async getAudioDescription(): Promise<string> {
    return await this.getElementTextContent(
      this.audioPlayer.locator(".audio-description")
    );
  }

  async clickPaginationDot(index: number): Promise<void> {
    await this.paginationDots.nth(index - 1).click();
  }

  async isTileActive(title: string): Promise<boolean> {
    const tile = this.getMediaTileByTitle(title);
    return await this.hasActiveClass(tile);
  }

  async clickNextArrow(): Promise<void> {
    const arrowsCount = await this.navigationArrows.count();
    await this.navigationArrows.nth(arrowsCount - 1).click();
  }

  async clickPreviousArrow(): Promise<void> {
    await this.navigationArrows.first().click();
  }

  async isMediaAutoplayDisabled(): Promise<boolean> {
    return await this.page.evaluate(() => {
      const autoplayVideos = document.querySelectorAll("video[autoplay]");
      const autoplayAudios = document.querySelectorAll("audio[autoplay]");
      return autoplayVideos.length === 0 && autoplayAudios.length === 0;
    });
  }

  async isSectionInViewport(): Promise<boolean> {
    await this.carouselSection.waitFor({ state: "visible", timeout: 5000 });
    return await this.isElementInViewport(this.carouselSection);
  }

  async areNavigationArrowsVisible(): Promise<boolean> {
    const arrowsCount = await this.navigationArrows.count();
    if (arrowsCount < 2) return false;

    const firstArrow = this.navigationArrows.first();
    return await firstArrow.isVisible();
  }

  private async getTileIndex(title: string): Promise<number> {
    const count = await this.mediaTiles.count();

    for (let i = 0; i < count; i++) {
      const tile = this.mediaTiles.nth(i);
      const tileTitle = await this.getElementTextContent(
        tile.locator(".title")
      );
      if (tileTitle === title) {
        return i;
      }
    }

    return -1;
  }

  async isPaginationDotActive(title: string): Promise<boolean> {
    const index = await this.getTileIndex(title);
    if (index === -1) return false;

    const dot = this.paginationDots.nth(index);
    return await this.hasActiveClass(dot);
  }

  async clickFirstVideoTile(): Promise<void> {
    const videoTile = this.mediaTiles
      .filter({ has: this.page.locator('[data-media-type="video"]') })
      .first();

    const playButton = this.getVideoPlayButton(videoTile);
    await playButton.click();
  }

  async clickVideoTile(title: string): Promise<void> {
    const tile = this.getMediaTileByTitle(title);
    const playButton = this.getVideoPlayButton(tile);
    await playButton.click();
  }

  async getMediaTilesCount(): Promise<number> {
    return await this.mediaTiles.count();
  }

  async getPaginationDotsCount(): Promise<number> {
    return await this.paginationDots.count();
  }

  async isNavigationArrowEnabled(
    direction: "previous" | "next"
  ): Promise<boolean> {
    const arrow =
      direction === "previous"
        ? this.navigationArrows.first()
        : this.navigationArrows.last();

    return await arrow.isEnabled();
  }

  async getActiveTileIndex(): Promise<number> {
    const count = await this.mediaTiles.count();

    for (let i = 0; i < count; i++) {
      const tile = this.mediaTiles.nth(i);
      if (await this.hasActiveClass(tile)) {
        return i;
      }
    }

    return -1;
  }

  async areAllMediaTilesLoaded(): Promise<boolean> {
    const count = await this.mediaTiles.count();

    for (let i = 0; i < count; i++) {
      const tile = this.mediaTiles.nth(i);
      const isVisible = await tile.isVisible();
      if (!isVisible) return false;
    }

    return count > 0;
  }
}
