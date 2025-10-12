import { Page } from "@playwright/test";
import { BasePage } from "../base/BasePage";
import { AccessibilityPOF } from "../fragments/AccessibilityPOF";
import { DestinationsPOF } from "../fragments/DestinationsPOF";
import { FooterPOF } from "../fragments/FooterPOF";
import { HeaderPOF } from "../fragments/HeaderPOF";
import { HeroPOF } from "../fragments/HeroPOF";
import { MediaCarouselPOF } from "../fragments/MediaCarouselPOF";
import { OurMissionsPOF } from "../fragments/OurMissionsPOF";
import { PerformanceSEOPOF } from "../fragments/PerformanceSEOPOF";
import { ResponsiveDesignPOF } from "../fragments/ResponsiveDesignPOF";
import { TheSuitesPOF } from "../fragments/TheSuitesPOF";
import { TimelinePOF } from "../fragments/TimelinePOF";
import { VehiclesPOF } from "../fragments/VehiclesPOF";

export class HumanSpaceflightPage extends BasePage {
  readonly header: HeaderPOF;
  readonly hero: HeroPOF;
  readonly destinations: DestinationsPOF;
  readonly footer: FooterPOF;
  readonly accessibility: AccessibilityPOF;
  readonly mediaCarousel: MediaCarouselPOF;
  readonly ourMissions: OurMissionsPOF;
  readonly performanceSEO: PerformanceSEOPOF;
  readonly responsiveDesign: ResponsiveDesignPOF;
  readonly theSuites: TheSuitesPOF;
  readonly timeline: TimelinePOF;
  readonly vehicles: VehiclesPOF;

  public readonly page: Page;

  constructor(page: Page) {
    super(page);
    this.page = page;

    this.header = new HeaderPOF(page);
    this.hero = new HeroPOF(page);
    this.destinations = new DestinationsPOF(page);
    this.footer = new FooterPOF(page);
    this.accessibility = new AccessibilityPOF(page);
    this.mediaCarousel = new MediaCarouselPOF(page);
    this.ourMissions = new OurMissionsPOF(page);
    this.performanceSEO = new PerformanceSEOPOF(page);
    this.responsiveDesign = new ResponsiveDesignPOF(page);
    this.theSuites = new TheSuitesPOF(page);
    this.timeline = new TimelinePOF(page);
    this.vehicles = new VehiclesPOF(page);
  }

  async open(urlPath: string = "/humanspaceflight") {
    this.setupErrorListeners();
    await this.goto(this.baseURL + urlPath, { waitUntil: "domcontentloaded" });
  }

  async openWithMobileViewport(
    width: number = 375,
    height: number = 812,
    urlPath: string = "/humanspaceflight"
  ) {
    await this.page.setViewportSize({ width, height });
    await this.open(urlPath);
  }

  async isCopyrightTextRightAligned(): Promise<boolean> {
    const alignment = await this.footer.copyrightText.evaluate(
      (el) => window.getComputedStyle(el).textAlign
    );
    return alignment === "right";
  }

  async isSocialMediaOnLeft(): Promise<boolean> {
    const socialBox = await this.footer.socialMediaSection.boundingBox();
    const linksBox = await this.footer.footerLinksSection.boundingBox();

    return !!(socialBox && linksBox && socialBox.x < linksBox.x);
  }

  async isFooterLinksInCenter(): Promise<boolean> {
    const socialBox = await this.footer.socialMediaSection.boundingBox();
    const linksBox = await this.footer.footerLinksSection.boundingBox();
    const copyrightBox = await this.footer.copyrightText.boundingBox();

    if (!socialBox || !linksBox || !copyrightBox) return false;

    const isHorizontalBetween =
      linksBox.x > socialBox.x && linksBox.x + linksBox.width < copyrightBox.x;

    const isCenteredEnough = await this.footer.footerLinksSection.evaluate(
      (el) => {
        const style = window.getComputedStyle(el);
        return (
          style.justifyContent === "center" || style.alignItems === "center"
        );
      }
    );

    return isHorizontalBetween || isCenteredEnough;
  }

  // Media Carousel Methods
  async isMediaCarouselVisible(): Promise<boolean> {
    return await this.mediaCarousel.isVisible();
  }

  async getMediaTiles() {
    return await this.mediaCarousel.getMediaTiles();
  }

  async checkTilesHaveMedia(): Promise<boolean> {
    return await this.mediaCarousel.checkTilesHaveMedia();
  }

  async areCarouselArrowsVisible(): Promise<boolean> {
    return await this.mediaCarousel.areNavigationArrowsVisible();
  }

  async arePaginationDotsVisible(): Promise<boolean> {
    return await this.mediaCarousel.arePaginationDotsVisible();
  }

  async clickVideoTilePlayButton(title: string): Promise<void> {
    await this.mediaCarousel.clickVideoTilePlayButton(title);
  }

  async isVideoOverlayVisible(): Promise<boolean> {
    return await this.mediaCarousel.isVideoOverlayVisible();
  }

  async isYouTubeVideoLoaded(): Promise<boolean> {
    return await this.mediaCarousel.isYouTubeVideoLoaded();
  }

  async getVideoTitle(): Promise<string> {
    return await this.mediaCarousel.getVideoTitle();
  }

  async getVideoDescription(): Promise<string> {
    return await this.mediaCarousel.getVideoDescription();
  }

  async isOverlayCloseButtonVisible(): Promise<boolean> {
    return await this.mediaCarousel.isOverlayCloseButtonVisible();
  }

  async clickOverlayCloseButton(): Promise<void> {
    await this.mediaCarousel.clickOverlayCloseButton();
  }

  async isVideoOverlayClosed(): Promise<boolean> {
    return await this.mediaCarousel.isVideoOverlayClosed();
  }

  async clickAudioTile(title: string): Promise<void> {
    await this.mediaCarousel.clickAudioTile(title);
  }

  async isAudioPlayerVisible(): Promise<boolean> {
    return await this.mediaCarousel.isAudioPlayerVisible();
  }

  async hasAudioPlayerControls(): Promise<boolean> {
    return await this.mediaCarousel.hasAudioPlayerControls();
  }

  async hasAudioDuration(): Promise<boolean> {
    return await this.mediaCarousel.hasAudioDuration();
  }

  async hasAudioProgressBar(): Promise<boolean> {
    return await this.mediaCarousel.hasAudioProgressBar();
  }

  async getAudioTitle(): Promise<string> {
    return await this.mediaCarousel.getAudioTitle();
  }

  async getAudioDescription(): Promise<string> {
    return await this.mediaCarousel.getAudioDescription();
  }

  async scrollToMediaCarousel(): Promise<void> {
    await this.mediaCarousel.carouselSection.scrollIntoViewIfNeeded();
    await this.page.waitForLoadState("domcontentloaded");
  }

  async isTileActive(title: string): Promise<boolean> {
    return await this.mediaCarousel.isTileActive(title);
  }

  async clickPaginationDot(index: number): Promise<void> {
    await this.mediaCarousel.clickPaginationDot(index);
  }

  async clickNextArrow(): Promise<void> {
    await this.mediaCarousel.clickNextArrow();
  }

  async clickPreviousArrow(): Promise<void> {
    await this.mediaCarousel.clickPreviousArrow();
  }

  async isMediaAutoplayDisabled(): Promise<boolean> {
    return await this.mediaCarousel.isMediaAutoplayDisabled();
  }

  async getMetaTagContent(selector: string): Promise<string | null> {
    const locator = this.page.locator(`meta[${selector}]`);
    return locator.getAttribute('content');
  }

  async clickVideoTile(title: string): Promise<void> { 
    await this.mediaCarousel.clickVideoTile(title);
  }

}
