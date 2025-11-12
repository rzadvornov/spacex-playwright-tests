import { Locator, Page } from "@playwright/test";
import { BasePage } from "../base/BasePage";
import { Milestone, MobileResponsiveness, CardsConsistency, TextReadability, AccessibilityStatus } from "../../utils/types/Types";

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
    return await this.milestoneCards.evaluateAll((cards: Element[]) =>
      (cards as HTMLElement[]).map((card) => {
        const yearElement = card.querySelector(".year");
        const achievementElement = card.querySelector(".achievement-text");

        return {
          year:
            card.getAttribute("data-year") ??
            yearElement?.textContent?.trim() ??
            "",
          achievement: achievementElement?.textContent?.trim() ?? "",
        };
      })
    );
  }

  async getMilestoneCardByYear(year: string): Promise<Locator> {
    const card = this.milestoneCards.filter({ hasText: year }).first();

    const count = await card.count();
    if (count === 0) {
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

    const activeIndex = activeIndices.findIndex((isActive) => isActive);

    return activeIndex === -1 ? 0 : activeIndex;
  }

  async areBackgroundImagesLoaded(): Promise<boolean> {
    return await this.milestoneCards.evaluateAll((cards: Element[]) =>
      (cards as HTMLElement[]).every((card) => {
        const style = window.getComputedStyle(card);
        const backgroundImage = style.backgroundImage;

        return backgroundImage.includes("url(") && backgroundImage !== "none";
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
      (params) => {
        const { MIN_TOUCH_TARGET, MIN_DOT_SIZE } = params;
        const carousel = document.querySelector(
          ".timeline-carousel"
        ) as HTMLElement | null;
        const arrows = document.querySelectorAll(
          ".timeline-carousel button.arrow"
        );
        const dots = document.querySelectorAll(".pagination-dots button");

        const arrowsArray = Array.from(arrows) as Array<HTMLElement>;
        const dotsArray = Array.from(dots) as Array<HTMLElement>;

        const areArrowsSized = arrowsArray.every((arrow) => {
          const rect = arrow.getBoundingClientRect();
          return (
            rect.width >= MIN_TOUCH_TARGET || rect.height >= MIN_TOUCH_TARGET
          );
        });

        const areDotsTappable = dotsArray.every((dot) => {
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
    return await this.milestoneCards.evaluateAll(
      (cards: Element[], tolerance) => {
        const htmlCards = cards as HTMLElement[];

        if (htmlCards.length < 2) {
          return {
            hasConsistentWidth: true,
            hasConsistentHeight: true,
            hasUniformSpacing: true,
          };
        }

        const firstRect = htmlCards[0].getBoundingClientRect();
        const expectedWidth = firstRect.width;
        const expectedHeight = firstRect.height;
        const expectedSpacing =
          htmlCards[1].getBoundingClientRect().left - firstRect.right;

        const hasConsistentWidth = htmlCards.every((card) => {
          const width = card.getBoundingClientRect().width;
          return Math.abs(width - expectedWidth) < tolerance;
        });

        const hasConsistentHeight = htmlCards.every((card) => {
          const height = card.getBoundingClientRect().height;
          return Math.abs(height - expectedHeight) < tolerance;
        });

        const hasUniformSpacing = htmlCards.slice(1).every((card, i) => {
          const prevRect = htmlCards[i].getBoundingClientRect();
          const currentRect = card.getBoundingClientRect();
          const actualSpacing = currentRect.left - prevRect.right;
          return Math.abs(actualSpacing - expectedSpacing) < tolerance;
        });

        return {
          hasConsistentWidth,
          hasConsistentHeight,
          hasUniformSpacing,
        };
      },
      TimelinePOF.DIMENSION_TOLERANCE
    );
  }

  async checkTextReadability(): Promise<TextReadability> {
    return await this.milestoneCards.evaluateAll(
      (cards: Element[], minFontSize) => {
        const htmlCards = cards as HTMLElement[];

        const hasSufficientContrastHeuristic = (
          textEl: HTMLElement,
          bgEl: HTMLElement
        ): boolean => {
          const textColor = window.getComputedStyle(textEl).color;
          const bgColor = window.getComputedStyle(bgEl).backgroundColor;
          return (
            textColor !== bgColor &&
            textColor !== "transparent" &&
            bgColor !== "transparent"
          );
        };

        const results = htmlCards.map((card) => {
          const yearEl = card.querySelector(".year") as HTMLElement | null;
          const textEl = card.querySelector(
            ".achievement-text"
          ) as HTMLElement | null;

          const isYearVisible = yearEl
            ? window.getComputedStyle(yearEl).opacity !== "0" &&
              window.getComputedStyle(yearEl).visibility !== "hidden"
            : false;

          const fontSize = textEl
            ? parseInt(window.getComputedStyle(textEl).fontSize)
            : 0;

          const isTextReadable = fontSize >= minFontSize;

          const hasSufficientContrast = textEl
            ? hasSufficientContrastHeuristic(textEl, card)
            : false;

          const hasNoOverflow = textEl
            ? textEl.scrollHeight <= textEl.clientHeight
            : true;

          return {
            isYearVisible,
            isTextReadable,
            hasSufficientContrast,
            hasNoOverflow,
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
      },
      TimelinePOF.MIN_FONT_SIZE
    );
  }

  async getAccessibilityStatus(): Promise<AccessibilityStatus> {
    const [status] = await Promise.all([
      this.timelineCarousel.evaluate((carousel) => {
        const hasAriaLabels =
          carousel.querySelectorAll("[aria-label]").length > 0;

        const hasFocusableElements =
          carousel.querySelectorAll('button, [tabindex="0"], a').length > 0;

        const announceChanges =
          carousel.hasAttribute("aria-live") ||
          carousel.querySelector("[aria-live]") !== null;

        return {
          isKeyboardNavigable: hasFocusableElements,
          hasAriaLabels,
          announceChanges,
        };
      }),
    ]);

    return status;
  }

  async getActiveMilestone(): Promise<Milestone | null> {
    const isActiveVisible = await this.activeCard.isVisible();

    if (!isActiveVisible) {
      return null;
    }

    return await this.activeCard.evaluate((card: Element) => {
      const yearElement = card.querySelector(".year");
      const achievementElement = card.querySelector(".achievement-text");

      return {
        year:
          card.getAttribute("data-year") ??
          yearElement?.textContent?.trim() ??
          "",
        achievement: achievementElement?.textContent?.trim() ?? "",
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
