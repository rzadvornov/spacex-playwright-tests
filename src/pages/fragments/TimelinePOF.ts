import { Locator, Page } from "@playwright/test";
import { BasePage } from "../base/BasePage";

export interface Milestone {
  year: string;
  achievement: string;
}

export class TimelinePOF extends BasePage {
  readonly timelineSection: Locator;
  readonly sectionHeading: Locator;
  readonly timelineCarousel: Locator;
  readonly milestoneCards: Locator;
  readonly nextArrow: Locator;
  readonly previousArrow: Locator;
  readonly paginationDots: Locator;
  readonly horizonImage: Locator;
  readonly activeCard: Locator;

  constructor(page: Page) {
    super(page);
    this.timelineSection = page.locator('[data-test="timeline-section"]');
    this.sectionHeading = this.timelineSection.locator("h2");
    this.timelineCarousel = this.timelineSection.locator(".timeline-carousel");
    this.milestoneCards = this.timelineCarousel.locator(".milestone-card");
    this.nextArrow = this.timelineCarousel.locator("button.next-arrow");
    this.previousArrow = this.timelineCarousel.locator("button.previous-arrow");
    this.paginationDots = this.timelineCarousel.locator(
      ".pagination-dots button"
    );
    this.horizonImage = this.timelineSection.locator(".horizon-image");
    this.activeCard = this.timelineCarousel.locator(".milestone-card.active");
  }

  async scrollToSection(): Promise<void> {
    await this.timelineSection.scrollIntoViewIfNeeded();
    await this.page.waitForLoadState("domcontentloaded");
  }

  async getAllMilestoneData(): Promise<Milestone[]> {
    return await this.milestoneCards.evaluateAll((cards) =>
      cards.map((card) => ({
        year: card.getAttribute("data-year") || "",
        achievement: card.querySelector(".achievement-text")?.textContent || "",
      }))
    );
  }

  async getMilestoneCardByYear(year: string): Promise<Locator> {
    return this.milestoneCards.filter({ hasText: year }).first();
  }

  async isCardActive(year: string): Promise<boolean> {
    const card = await this.getMilestoneCardByYear(year);
    const classes = await card.getAttribute("class");
    return classes?.includes("active") || false;
  }

  async advanceCarousel(): Promise<void> {
    await this.nextArrow.click();
    await this.page.waitForLoadState("domcontentloaded");
  }

  async navigateBack(): Promise<void> {
    await this.previousArrow.click();
    await this.page.waitForLoadState("domcontentloaded");
  }

  async getPaginationDotsCount(): Promise<number> {
    return await this.paginationDots.count();
  }

  async clickPaginationDot(index: number): Promise<void> {
    await this.paginationDots.nth(index).click();
    await this.page.waitForLoadState("domcontentloaded");
  }

  async getActivePaginationDotIndex(): Promise<number> {
    const count = await this.paginationDots.count();
    for (let i = 0; i < count; i++) {
      const classes = await this.paginationDots.nth(i).getAttribute("class");
      if (classes?.includes("active")) {
        return i;
      }
    }
    return 0;
  }

  async areBackgroundImagesLoaded(): Promise<boolean> {
    return await this.milestoneCards.evaluateAll((cards) =>
      cards.every((card) => {
        const style = window.getComputedStyle(card);
        return (
          style.backgroundImage !== "none" &&
          !style.backgroundImage.includes("undefined")
        );
      })
    );
  }

  async getBackgroundImageUrl(year: string): Promise<string> {
    const card = await this.getMilestoneCardByYear(year);
    return await card.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return style.backgroundImage.replace(/url\(['"](.+)['"]\)/, "$1");
    });
  }

  async isHorizonImageVisible(): Promise<boolean> {
    return await this.horizonImage.isVisible();
  }

  async setMobileViewport(): Promise<void> {
    await this.page.setViewportSize({ width: 375, height: 812 });
  }

  async setTabletViewport(): Promise<void> {
    await this.page.setViewportSize({ width: 768, height: 1024 });
  }

  async checkMobileResponsiveness(): Promise<{
    isFullWidth: boolean;
    areArrowsSized: boolean;
    areDotsTappable: boolean;
  }> {
    return await this.page.evaluate(() => {
      const carousel = document.querySelector(".timeline-carousel");
      const arrows = document.querySelectorAll(
        ".timeline-carousel button.arrow"
      );
      const dots = document.querySelectorAll(".pagination-dots button");

      return {
        isFullWidth: carousel?.clientWidth === window.innerWidth,
        areArrowsSized: Array.from(arrows).every((arrow) => {
          const rect = arrow.getBoundingClientRect();
          return rect.width >= 44 && rect.height >= 44;
        }),
        areDotsTappable: Array.from(dots).every((dot) => {
          const rect = dot.getBoundingClientRect();
          return rect.width >= 24 && rect.height >= 24;
        }),
      };
    });
  }

  async checkCardsConsistency(): Promise<{
    hasConsistentWidth: boolean;
    hasConsistentHeight: boolean;
    hasUniformSpacing: boolean;
  }> {
    return await this.milestoneCards.evaluateAll((cards) => {
      if (cards.length < 2)
        return {
          hasConsistentWidth: true,
          hasConsistentHeight: true,
          hasUniformSpacing: true,
        };

      const firstRect = cards[0].getBoundingClientRect();
      const width = firstRect.width;
      const height = firstRect.height;
      const spacing = cards[1].getBoundingClientRect().left - firstRect.right;

      return {
        hasConsistentWidth: cards.every(
          (card) => Math.abs(card.getBoundingClientRect().width - width) < 1
        ),
        hasConsistentHeight: cards.every(
          (card) => Math.abs(card.getBoundingClientRect().height - height) < 1
        ),
        hasUniformSpacing: cards.slice(1).every((card, i) => {
          const prevRect = cards[i].getBoundingClientRect();
          const currentRect = card.getBoundingClientRect();
          return Math.abs(currentRect.left - prevRect.right - spacing) < 1;
        }),
      };
    });
  }

  async checkTextReadability(): Promise<{
    isYearVisible: boolean;
    isTextReadable: boolean;
    hasSufficientContrast: boolean;
    hasNoOverflow: boolean;
  }> {
    return await this.milestoneCards.evaluateAll((cards) => {
      const checkContrast = (textEl: Element, bgEl: Element) => {
        const textColor = window.getComputedStyle(textEl).color;
        const bgColor = window.getComputedStyle(bgEl).backgroundColor;
        // Simple contrast check, can be enhanced for more accuracy
        return textColor !== bgColor;
      };

      return {
        isYearVisible: cards.every((card) => {
          const yearEl = card.querySelector(".year");
          return yearEl && window.getComputedStyle(yearEl).opacity !== "0";
        }),
        isTextReadable: cards.every((card) => {
          const textEl = card.querySelector(".achievement-text");
          return (
            textEl && parseInt(window.getComputedStyle(textEl).fontSize) >= 14
          );
        }),
        hasSufficientContrast: cards.every((card) => {
          const textEl = card.querySelector(".achievement-text");
          return textEl && checkContrast(textEl, card);
        }),
        hasNoOverflow: cards.every((card) => {
          const textEl = card.querySelector(".achievement-text");
          return textEl && textEl.scrollHeight <= textEl.clientHeight;
        }),
      };
    });
  }

  async getAccessibilityStatus(): Promise<{
    isKeyboardNavigable: boolean;
    hasAriaLabels: boolean;
    announceChanges: boolean;
  }> {
    const hasAriaLabels = await this.timelineCarousel.evaluate((carousel) => {
      const ariaElements = carousel.querySelectorAll("[aria-label]");
      return ariaElements.length > 0;
    });

    const isKeyboardNavigable = await this.timelineCarousel.evaluate(
      (carousel) => {
        const focusableElements = carousel.querySelectorAll(
          'button, [tabindex="0"]'
        );
        return focusableElements.length > 0;
      }
    );

    const announceChanges = await this.timelineCarousel.evaluate((carousel) => {
      return carousel.hasAttribute("aria-live");
    });

    return {
      isKeyboardNavigable,
      hasAriaLabels,
      announceChanges,
    };
  }
}
