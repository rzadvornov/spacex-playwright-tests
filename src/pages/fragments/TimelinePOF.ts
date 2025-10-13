import { Locator, Page } from "@playwright/test";
import { BasePage } from "../base/BasePage";
import { Milestone } from "../types/Milestone";
import { MobileResponsiveness } from "../types/MobileResponsiveness";
import { CardsConsistency } from "../types/CardsConsistency";
import { TextReadability } from "../types/TextReadability";
import { AccessibilityStatus } from "../types/AccessibilityStatus";

export class TimelinePOF extends BasePage {
  private static readonly MOBILE_VIEWPORT = { width: 375, height: 812 };
  private static readonly TABLET_VIEWPORT = { width: 768, height: 1024 };
  private static readonly MIN_TOUCH_TARGET = 44;
  private static readonly MIN_DOT_SIZE = 24;
  private static readonly MIN_FONT_SIZE = 14;
  private static readonly DIMENSION_TOLERANCE = 1;

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
      cards.map((card) => {
        const yearElement = card.querySelector(".year");
        const achievementElement = card.querySelector(".achievement-text");

        return {
          year:
            card.getAttribute("data-year") ||
            yearElement?.textContent?.trim() ||
            "",
          achievement: achievementElement?.textContent?.trim() || "",
        };
      })
    );
  }

  async getMilestoneCardByYear(year: string): Promise<Locator> {
    const card = this.milestoneCards.filter({ hasText: year }).first();

    const exists = await card.isVisible().catch(() => false);
    if (!exists) {
      throw new Error(`Milestone card for year '${year}' not found`);
    }

    return card;
  }

  async isCardActive(year: string): Promise<boolean> {
    const card = await this.getMilestoneCardByYear(year);
    return await card.evaluate((el) => el.classList.contains("active"));
  }

  async advanceCarousel(): Promise<void> {
    await this.nextArrow.click();
    await this.waitForCarouselTransition();
  }

  async navigateBack(): Promise<void> {
    await this.previousArrow.click();
    await this.waitForCarouselTransition();
  }

  async getPaginationDotsCount(): Promise<number> {
    return await this.paginationDots.count();
  }

  async clickPaginationDot(index: number): Promise<void> {
    const count = await this.getPaginationDotsCount();

    if (index < 0 || index >= count) {
      throw new Error(
        `Pagination dot index ${index} is out of bounds. Total dots: ${count}`
      );
    }

    await this.paginationDots.nth(index).click();
    await this.waitForCarouselTransition();
  }

  async getActivePaginationDotIndex(): Promise<number> {
    const count = await this.getPaginationDotsCount();

    const activeIndices = await Promise.all(
      Array.from({ length: count }, (_, i) =>
        this.paginationDots
          .nth(i)
          .evaluate((dot) => dot.classList.contains("active"))
      )
    );

    return activeIndices.findIndex((isActive) => isActive) || 0;
  }

  async areBackgroundImagesLoaded(): Promise<boolean> {
    return await this.milestoneCards.evaluateAll((cards) =>
      cards.every((card) => {
        const style = window.getComputedStyle(card);
        const backgroundImage = style.backgroundImage;

        return (
          backgroundImage !== "none" &&
          !backgroundImage.includes("undefined") &&
          !backgroundImage.includes("none")
        );
      })
    );
  }

  async getBackgroundImageUrl(year: string): Promise<string> {
    const card = await this.getMilestoneCardByYear(year);

    return await card.evaluate((el) => {
      const style = window.getComputedStyle(el);
      const backgroundImage = style.backgroundImage;

      const match = backgroundImage.match(/url\(['"]?([^'")]+)['"]?\)/);
      return match ? match[1] : "";
    });
  }

  async isHorizonImageVisible(): Promise<boolean> {
    return await this.horizonImage.isVisible();
  }

  async setMobileViewport(): Promise<void> {
    await this.page.setViewportSize(TimelinePOF.MOBILE_VIEWPORT);
  }

  async setTabletViewport(): Promise<void> {
    await this.page.setViewportSize(TimelinePOF.TABLET_VIEWPORT);
  }

  async checkMobileResponsiveness(): Promise<MobileResponsiveness> {
    return await this.page.evaluate(
      ({ MIN_TOUCH_TARGET, MIN_DOT_SIZE }) => {
        const carousel = document.querySelector(".timeline-carousel");
        const arrows = document.querySelectorAll(
          ".timeline-carousel button.arrow"
        );
        const dots = document.querySelectorAll(".pagination-dots button");

        const areArrowsSized = Array.from(arrows).every((arrow) => {
          const rect = arrow.getBoundingClientRect();
          return (
            rect.width >= MIN_TOUCH_TARGET && rect.height >= MIN_TOUCH_TARGET
          );
        });

        const areDotsTappable = Array.from(dots).every((dot) => {
          const rect = dot.getBoundingClientRect();
          return rect.width >= MIN_DOT_SIZE && rect.height >= MIN_DOT_SIZE;
        });

        return {
          isFullWidth: carousel
            ? carousel.clientWidth === window.innerWidth
            : false,
          areArrowsSized,
          areDotsTappable,
        };
      },
      {
        MIN_TOUCH_TARGET: TimelinePOF.MIN_TOUCH_TARGET,
        MIN_DOT_SIZE: TimelinePOF.MIN_DOT_SIZE,
      }
    );
  }

  async checkCardsConsistency(): Promise<CardsConsistency> {
    return await this.milestoneCards.evaluateAll((cards, tolerance) => {
      if (cards.length < 2) {
        return {
          hasConsistentWidth: true,
          hasConsistentHeight: true,
          hasUniformSpacing: true,
        };
      }

      const firstRect = cards[0].getBoundingClientRect();
      const expectedWidth = firstRect.width;
      const expectedHeight = firstRect.height;
      const expectedSpacing =
        cards[1].getBoundingClientRect().left - firstRect.right;

      const hasConsistentWidth = cards.every((card) => {
        const width = card.getBoundingClientRect().width;
        return Math.abs(width - expectedWidth) < tolerance;
      });

      const hasConsistentHeight = cards.every((card) => {
        const height = card.getBoundingClientRect().height;
        return Math.abs(height - expectedHeight) < tolerance;
      });

      const hasUniformSpacing = cards.slice(1).every((card, i) => {
        const prevRect = cards[i].getBoundingClientRect();
        const currentRect = card.getBoundingClientRect();
        const actualSpacing = currentRect.left - prevRect.right;
        return Math.abs(actualSpacing - expectedSpacing) < tolerance;
      });

      return {
        hasConsistentWidth,
        hasConsistentHeight,
        hasUniformSpacing,
      };
    }, TimelinePOF.DIMENSION_TOLERANCE);
  }

  async checkTextReadability(): Promise<TextReadability> {
    return await this.milestoneCards.evaluateAll((cards, minFontSize) => {
      const hasSufficientContrast = (
        textEl: Element,
        bgEl: Element
      ): boolean => {
        const textColor = window.getComputedStyle(textEl).color;
        const bgColor = window.getComputedStyle(bgEl).backgroundColor;
        return textColor !== bgColor && textColor !== "transparent";
      };

      const results = cards.map((card) => {
        const yearEl = card.querySelector(".year");
        const textEl = card.querySelector(".achievement-text");

        return {
          isYearVisible: yearEl
            ? window.getComputedStyle(yearEl).opacity !== "0"
            : false,
          isTextReadable: textEl
            ? parseInt(window.getComputedStyle(textEl).fontSize) >= minFontSize
            : false,
          hasSufficientContrast: textEl
            ? hasSufficientContrast(textEl, card)
            : false,
          hasNoOverflow: textEl
            ? textEl.scrollHeight <= textEl.clientHeight
            : true,
        };
      });

      return {
        isYearVisible: results.every((result) => result.isYearVisible),
        isTextReadable: results.every((result) => result.isTextReadable),
        hasSufficientContrast: results.every(
          (result) => result.hasSufficientContrast
        ),
        hasNoOverflow: results.every((result) => result.hasNoOverflow),
      };
    }, TimelinePOF.MIN_FONT_SIZE);
  }

  async getAccessibilityStatus(): Promise<AccessibilityStatus> {
    const [hasAriaLabels, isKeyboardNavigable, announceChanges] =
      await Promise.all([
        this.timelineCarousel.evaluate(
          (carousel) => carousel.querySelectorAll("[aria-label]").length > 0
        ),
        this.timelineCarousel.evaluate(
          (carousel) =>
            carousel.querySelectorAll('button, [tabindex="0"]').length > 0
        ),
        this.timelineCarousel.evaluate(
          (carousel) =>
            carousel.hasAttribute("aria-live") ||
            carousel.querySelector("[aria-live]") !== null
        ),
      ]);

    return {
      isKeyboardNavigable,
      hasAriaLabels,
      announceChanges,
    };
  }

  async getActiveMilestone(): Promise<Milestone | null> {
    const isActiveVisible = await this.activeCard.isVisible();

    if (!isActiveVisible) {
      return null;
    }

    return await this.activeCard.evaluate((card) => {
      const yearElement = card.querySelector(".year");
      const achievementElement = card.querySelector(".achievement-text");

      return {
        year:
          card.getAttribute("data-year") ||
          yearElement?.textContent?.trim() ||
          "",
        achievement: achievementElement?.textContent?.trim() || "",
      };
    });
  }

  async waitForCarouselTransition(timeout: number = 500): Promise<void> {
    await this.page.waitForTimeout(timeout);
    await this.page.waitForLoadState("domcontentloaded");
  }

  async verifyCarouselNavigation(): Promise<{
    canNavigateForward: boolean;
    canNavigateBackward: boolean;
    paginationSync: boolean;
  }> {
    const initialActiveDot = await this.getActivePaginationDotIndex();
    const initialActiveCard = await this.getActiveMilestone();

    await this.advanceCarousel();
    const afterForwardDot = await this.getActivePaginationDotIndex();
    const afterForwardCard = await this.getActiveMilestone();

    await this.navigateBack();
    const afterBackwardDot = await this.getActivePaginationDotIndex();
    const afterBackwardCard = await this.getActiveMilestone();

    return {
      canNavigateForward: afterForwardDot !== initialActiveDot,
      canNavigateBackward: afterBackwardDot === initialActiveDot,
      paginationSync:
        JSON.stringify(initialActiveCard) === JSON.stringify(afterBackwardCard),
    };
  }
}
