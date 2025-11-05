import { Locator, Page } from "@playwright/test";
import { BoundingBox } from "../../utils/types/Types";

export class HeroPOF {
  readonly heroSection: Locator;
  readonly heroTitle: Locator;
  readonly heroSubtitle: Locator;
  readonly upcomingLaunchesWidget: Locator;
  readonly scrollDownArrow: Locator;
  readonly mediaCarouselSection: Locator;
  readonly heroImage: Locator;

  private cachedHeroSectionHeight: number | null = null;

  constructor(page: Page) {
    this.heroSection = page
      .locator(".section-1, .hero-section, main > div")
      .first();
    this.heroTitle = this.heroSection
      .getByRole("heading", { level: 1 })
      .or(this.heroSection.locator("h1"))
      .first();
    this.heroSubtitle = this.heroSection
      .locator("h2, .subtitle, .hero-subtitle")
      .first();
    this.upcomingLaunchesWidget = page
      .locator(".upcoming-launches-widget, [aria-label='Upcoming Launches']")
      .first();
    this.scrollDownArrow = page
      .getByRole("link", { name: /scroll down/i })
      .or(page.locator(".scroll-down-arrow"))
      .first();
    this.mediaCarouselSection = page
      .locator(".media-carousel-section, .section-2")
      .first();
    this.heroImage = page.locator("img.hero-graphic").first();
  }

  private async waitForElementVisible(
    element: Locator,
    timeout: number = 5000
  ): Promise<boolean> {
    try {
      await element.waitFor({ state: "visible", timeout });
      return true;
    } catch {
      return false;
    }
  }

  private async getElementBoundingBox(
    element: Locator
  ): Promise<BoundingBox | null> {
    return await element.boundingBox();
  }

  private async getHeroSectionHeight(): Promise<number> {
    if (this.cachedHeroSectionHeight === null) {
      const box = await this.getElementBoundingBox(this.heroSection);
      this.cachedHeroSectionHeight = box ? box.height : 800;
    }
    return this.cachedHeroSectionHeight;
  }

  private getCTAButton(buttonText: string): Locator {
    return this.heroSection.getByRole("button", {
      name: buttonText,
      exact: true,
    });
  }

  public getHeroTitleLocator(): Locator {
    return this.heroTitle;
  }

  async isHeroSectionVisible(): Promise<boolean> {
    await this.getHeroSectionHeight();
    return await this.waitForElementVisible(this.heroSection, 5000);
  }

  async getHeroTitleText(): Promise<string> {
    const text = await this.heroTitle.textContent();
    return text?.trim() ?? "";
  }

  async getHeroSubtitleText(): Promise<string> {
    const text = await this.heroSubtitle.textContent();
    return text?.trim() ?? "";
  }

  async isScrollDownArrowVisible(): Promise<boolean> {
    return await this.scrollDownArrow.isVisible();
  }

  async isMissionStatusVisible(): Promise<boolean> {
    return await this.isUpcomingLaunchesWidgetDisplayed();
  }

  async isUpcomingLaunchesWidgetDisplayed(): Promise<boolean> {
    return await this.waitForElementVisible(this.upcomingLaunchesWidget, 5000);
  }

  async clickScrollDownArrow(): Promise<void> {
    await this.scrollDownArrow.click();
  }

  async scrollToNextSection(): Promise<void> {
    await this.mediaCarouselSection.scrollIntoViewIfNeeded();
  }

  async isPageScrolledPastHero(): Promise<boolean> {
    const [scrollPosition, heroHeight] = await Promise.all([
      this.heroSection.page().evaluate(() => window.scrollY),
      this.getHeroSectionHeight(),
    ]);

    return scrollPosition > heroHeight * 0.5;
  }

  async isMediaCarouselSectionVisible(): Promise<boolean> {
    try {
      await this.mediaCarouselSection.waitFor({
        state: "visible",
        timeout: 5000,
      });

      const [boundingBox, viewport] = await Promise.all([
        this.getElementBoundingBox(this.mediaCarouselSection),
        this.heroSection.page().viewportSize(),
      ]);

      if (!boundingBox || !viewport) {
        return false;
      }

      const isInViewport =
        boundingBox.y < viewport.height &&
        boundingBox.y + boundingBox.height > 0;

      return isInViewport;
    } catch {
      return false;
    }
  }

  async isCTAButtonVisible(buttonText: string): Promise<boolean> {
    const ctaButton = this.getCTAButton(buttonText);
    return await ctaButton.isVisible();
  }

  async clickCTAButton(buttonText: string): Promise<void> {
    const ctaButton = this.getCTAButton(buttonText);
    await ctaButton.click();
  }

  async getHeroSectionDimensions(): Promise<{
    width: number;
    height: number;
  } | null> {
    const box = await this.getElementBoundingBox(this.heroSection);
    return box ? { width: box.width, height: box.height } : null;
  }

  async isScrollDownArrowClickable(): Promise<boolean> {
    const [isVisible, isEnabled] = await Promise.all([
      this.scrollDownArrow.isVisible(),
      this.scrollDownArrow.isEnabled(),
    ]);
    return isVisible && isEnabled;
  }

  async getUpcomingLaunchesWidgetText(): Promise<string> {
    const text = await this.upcomingLaunchesWidget.textContent();
    return text?.trim() ?? "";
  }

  async isHeroContentCentered(): Promise<boolean> {
    const [heroBox, titleBox] = await Promise.all([
      this.getElementBoundingBox(this.heroSection),
      this.getElementBoundingBox(this.heroTitle),
    ]);

    if (!heroBox || !titleBox) {
      return false;
    }

    const heroCenter = heroBox.x + heroBox.width / 2;
    const titleCenter = titleBox.x + titleBox.width / 2;
    const centerOffset = Math.abs(heroCenter - titleCenter);

    return centerOffset < 50;
  }

  async getCurrentScrollPosition(): Promise<number> {
    return await this.heroSection.page().evaluate(() => window.scrollY);
  }
}