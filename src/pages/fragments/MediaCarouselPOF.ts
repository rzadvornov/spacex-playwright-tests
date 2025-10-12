import { Locator, Page } from "@playwright/test";

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

  async isVisible(): Promise<boolean> {
    return await this.carouselSection.isVisible();
  }

  async getMediaTiles() {
    const tiles = [];
    const count = await this.mediaTiles.count();

    for (let i = 0; i < count; i++) {
      const tile = this.mediaTiles.nth(i);
      tiles.push({
        title: (await tile.locator(".title").textContent()) || "",
        type: (await tile.getAttribute("data-media-type")) || "",
      });
    }

    return tiles;
  }

  async checkTilesHaveMedia(): Promise<boolean> {
    const count = await this.mediaTiles.count();
    for (let i = 0; i < count; i++) {
      const tile = this.mediaTiles.nth(i);
      const hasMedia = await tile.locator("img, .player").isVisible();
      if (!hasMedia) return false;
    }
    return true;
  }

  async arePaginationDotsVisible(): Promise<boolean> {
    return await this.paginationDots.first().isVisible();
  }

  async clickVideoTilePlayButton(title: string): Promise<void> {
    const tile = this.mediaTiles.filter({ hasText: title });
    await tile.locator(".play-button").click();
  }

  async isVideoOverlayVisible(): Promise<boolean> {
    return await this.videoOverlay.isVisible();
  }

  async isYouTubeVideoLoaded(): Promise<boolean> {
    const iframe = this.videoOverlay.locator('iframe[src*="youtube"]');
    return await iframe.isVisible();
  }

  async getVideoTitle(): Promise<string> {
    return (
      (await this.videoOverlay.locator(".video-title").textContent()) || ""
    );
  }

  async getVideoDescription(): Promise<string> {
    return (
      (await this.videoOverlay.locator(".video-description").textContent()) ||
      ""
    );
  }

  async isOverlayCloseButtonVisible(): Promise<boolean> {
    return await this.videoOverlay.locator(".close-button").isVisible();
  }

  async clickOverlayCloseButton(): Promise<void> {
    await this.videoOverlay.locator(".close-button").click();
  }

  async isVideoOverlayClosed(): Promise<boolean> {
    return !(await this.videoOverlay.isVisible());
  }

  async clickAudioTile(title: string): Promise<void> {
    await this.mediaTiles.filter({ hasText: title }).click();
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
    return (await this.audioPlayer.locator(".audio-title").textContent()) || "";
  }

  async getAudioDescription(): Promise<string> {
    return (
      (await this.audioPlayer.locator(".audio-description").textContent()) || ""
    );
  }

  async clickPaginationDot(index: number): Promise<void> {
    await this.paginationDots.nth(index - 1).click();
  }

  async isTileActive(title: string): Promise<boolean> {
    const tile = this.mediaTiles.filter({ hasText: title });
    const classNames = (await tile.getAttribute("class")) || "";
    return classNames.includes("active");
  }

  async clickNextArrow(): Promise<void> {
    await this.navigationArrows.last().click();
  }

  async clickPreviousArrow(): Promise<void> {
    await this.navigationArrows.first().click();
  }

  async isMediaAutoplayDisabled(): Promise<boolean> {
    const autoplayVideos = await this.page.evaluate(() => {
      const videos = document.querySelectorAll("video[autoplay]");
      const audios = document.querySelectorAll("audio[autoplay]");
      return videos.length === 0 && audios.length === 0;
    });
    return autoplayVideos;
  }

  async isSectionInViewport(): Promise<boolean> {
    await this.carouselSection.waitFor({ state: "visible", timeout: 5000 });

    const boundingBox = await this.carouselSection.boundingBox();
    const viewport = this.page.viewportSize();

    if (!boundingBox || !viewport) {
      return false;
    }

    const isInViewport =
      boundingBox.y < viewport.height && boundingBox.y + boundingBox.height > 0;

    return isInViewport;
  }

  async areNavigationArrowsVisible(): Promise<boolean> {
    const count = await this.navigationArrows.count();
    return count >= 2 && (await this.navigationArrows.first().isVisible());
  }

  private async getTileIndex(title: string): Promise<number> {
    const tiles = await this.mediaTiles.all();
    for (let i = 0; i < tiles.length; i++) {
      const tileTitle = (
        await tiles[i].locator(".title").textContent()
      )?.trim();
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
    const classNames = (await dot.getAttribute("class")) || "";
    return classNames.includes("active");
  }

  async clickFirstVideoTile(): Promise<void> {
    const videoTileButton = this.mediaTiles
      .filter({ has: this.page.locator('[data-media-type="video"]') })
      .first()
      .locator('button[aria-label="Play"], button[role="button"]')
      .first();

    await videoTileButton.click();
  }

  async clickVideoTile(title: string): Promise<void> {
    const tile = this.mediaTiles.filter({ hasText: title });
    await tile
      .locator('button[aria-label*="Play"], .video-play-button')
      .click();
  }
}
