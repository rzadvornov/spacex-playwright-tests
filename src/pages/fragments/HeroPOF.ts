import { Locator, Page } from "@playwright/test";

export class HeroPOF {
  private readonly heroSection: Locator;
  private readonly heroTitle: Locator;
  private readonly heroSubtitle: Locator;
  private readonly upcomingLaunchesWidget: Locator;
  private readonly scrollDownArrow: Locator;
  private readonly mediaCarouselSection: Locator;
  private initialHeroSectionHeight: number | null = null;

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
  }

  public getHeroTitleLocator(): Locator {
    return this.heroTitle;
  }

  async isHeroSectionVisible(): Promise<boolean> {
    try {
      if (this.initialHeroSectionHeight === null) {
        const box = await this.heroSection.boundingBox();
        this.initialHeroSectionHeight = box ? box.height : 0;
      }
      await this.heroSection.waitFor({ state: "visible", timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async getHeroTitleText(): Promise<string> {
    return (await this.heroTitle.textContent())?.trim() || "";
  }

  async getHeroSubtitleText(): Promise<string> {
    return (await this.heroSubtitle.textContent())?.trim() || "";
  }

  async isScrollDownArrowVisible(): Promise<boolean> {
    return await this.scrollDownArrow.isVisible();
  }

  async isMissionStatusVisible(): Promise<boolean> {
    return this.isUpcomingLaunchesWidgetDisplayed(); 
  }
  
  async isUpcomingLaunchesWidgetDisplayed(): Promise<boolean> {
    try {
      await this.upcomingLaunchesWidget.waitFor({
        state: "visible",
        timeout: 5000,
      });
      return await this.upcomingLaunchesWidget.isVisible();
    } catch {
      return false;
    }
  }

  async clickScrollDownArrow(): Promise<void> {
    await this.scrollDownArrow.click();
  }
  
  async scrollToNextSection(): Promise<void> {
    await this.mediaCarouselSection.scrollIntoViewIfNeeded(); 
  }
  
  async isPageScrolledPastHero(): Promise<boolean> {
    const scrollPosition = await this.heroSection.page().evaluate(() => window.scrollY);
    
    if (this.initialHeroSectionHeight === null) {
        const box = await this.heroSection.boundingBox();
        this.initialHeroSectionHeight = box ? box.height : 800; // Default estimate
    }
    
    return scrollPosition > (this.initialHeroSectionHeight * 0.5); 
  }


  async isMediaCarouselSectionVisible(): Promise<boolean> {
    try {
      await this.mediaCarouselSection.waitFor({
        state: "visible",
        timeout: 5000,
      });
      const boundingBox = await this.mediaCarouselSection.boundingBox();
      const viewport = this.mediaCarouselSection.page().viewportSize();

      return !!(
        boundingBox &&
        viewport &&
        boundingBox.y < viewport.height &&
        boundingBox.y > 0
      );
    } catch {
      return false;
    }
  }

  async isCTAButtonVisible(buttonText: string): Promise<boolean> {
    const ctaButton = this.heroSection.getByRole("button", {
      name: buttonText,
      exact: true,
    });
    return await ctaButton.isVisible();
  }

  async clickCTAButton(buttonText: string): Promise<void> {
    const ctaButton = this.heroSection.getByRole("button", {
      name: buttonText,
      exact: true,
    });
    await ctaButton.click();
  }
}