import { Locator, Page } from "@playwright/test";
import { MediaTile } from "../../../utils/types/Types";

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

  private async getTileIndex(title: string): Promise<number> {
    const tiles = await this.mediaTiles.all();
    
    for (let i = 0; i < tiles.length; i++) {
        const tileTitle = await this.getElementTextContent(
            tiles[i].locator(".title")
        );
        if (tileTitle === title) {
            return i;
        }
    }
    return -1;
  }

  async isVisible(): Promise<boolean> {
    return await this.carouselSection.isVisible();
  }

  async getMediaTiles(): Promise<MediaTile[]> {
    const tileLocators = await this.mediaTiles.all();
    
    if (tileLocators.length === 0) {
        return [];
    }

    const tilePromises = tileLocators.map(async (tile) => {
        const [Title, Type] = await Promise.all([
            this.getElementTextContent(tile.locator(".title")),
            this.getElementAttribute(tile, "data-media-type"),
        ]);
        return { Title, Type };
    });

    return Promise.all(tilePromises);
  }

  async checkTilesHaveMedia(): Promise<boolean> {
    const tiles = await this.mediaTiles.all();

    if (tiles.length === 0) {
      return false;
    }

    const mediaPresenceChecks = tiles.map(tile => 
        tile.locator("img, .player, video, audio").isVisible()
    );
    
    const results = await Promise.all(mediaPresenceChecks);
    return results.every(hasMedia => hasMedia);
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
    await this.navigationArrows.last().click();
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

    return await this.navigationArrows.first().isVisible();
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
    const tiles = await this.mediaTiles.all();
    
    for (let i = 0; i < tiles.length; i++) {
        if (await this.hasActiveClass(tiles[i])) {
            return i;
        }
    }

    return -1;
  }

  async areAllMediaTilesLoaded(): Promise<boolean> {
    const tiles = await this.mediaTiles.all();
    
    if (tiles.length === 0) return false;

    const visibilityChecks = tiles.map(tile => tile.isVisible());
    const results = await Promise.all(visibilityChecks);
    
    return results.every(isVisible => isVisible);
  }
}