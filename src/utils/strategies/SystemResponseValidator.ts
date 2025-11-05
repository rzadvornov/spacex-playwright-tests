import { Page, expect } from "@playwright/test";
import { HumanSpaceflightPage } from "../../pages/ui/HumanSpaceflightPage";

export class SystemResponseValidator {
  private strategies: Map<
    string,
    (page: Page, humanSpaceflightPage: HumanSpaceflightPage) => Promise<void>
  >;

  constructor() {
    this.strategies = new Map([
      [
        "Navigate to /vehicles/dragon",
        this.validateDragonNavigation.bind(this),
      ],
      [
        "Navigate to /vehicles/starship",
        this.validateStarshipNavigation.bind(this),
      ],
      ["Navigate to /research", this.validateResearchNavigation.bind(this)],
      ["Start video playback", this.validateVideoPlayback.bind(this)],
      ["Show hover state", this.validateHoverState.bind(this)],
      ["Show touch feedback", this.validateTouchFeedback.bind(this)],
    ]);
  }

  async validate(
    response: string,
    page: Page,
    humanSpaceflightPage: HumanSpaceflightPage
  ): Promise<void> {
    const validator = this.strategies.get(response);
    if (!validator) {
      throw new Error(`Unknown system response: ${response}`);
    }
    await validator(page, humanSpaceflightPage);
  }

  private async validateDragonNavigation(
    page: Page,
    _humanSpaceflightPage: HumanSpaceflightPage
  ): Promise<void> {
    await expect(page).toHaveURL(/.*\/vehicles\/dragon/);
    await page.waitForLoadState("domcontentloaded");
  }

  private async validateStarshipNavigation(
    page: Page,
    _humanSpaceflightPage: HumanSpaceflightPage
  ): Promise<void> {
    await expect(page).toHaveURL(/.*\/vehicles\/starship/);
    await page.waitForLoadState("domcontentloaded");
  }

  private async validateResearchNavigation(
    page: Page,
    _humanSpaceflightPage: HumanSpaceflightPage
  ): Promise<void> {
    await expect(page).toHaveURL(/.*\/research/);
    await page.waitForLoadState("domcontentloaded");
  }

  private async validateVideoPlayback(
    page: Page,
    _humanSpaceflightPage: HumanSpaceflightPage
  ): Promise<void> {
    const video = page.locator("video").first();
    await expect(video).toBeVisible();

    await page.waitForTimeout(1000);

    const isPlaying = await video.evaluate((videoEl: HTMLVideoElement) => {
      return !videoEl.paused && !videoEl.ended && videoEl.currentTime > 0;
    });

    expect(isPlaying, {
      message: "Video should be playing after interaction",
    }).toBeTruthy();
  }

  private async validateHoverState(
    page: Page,
    _humanSpaceflightPage: HumanSpaceflightPage
  ): Promise<void> {
    const interactiveElements = page.locator(
      '[data-test="dragon-card"], [data-test="starship-card"], [data-test="research-card"]'
    );
    const firstElement = interactiveElements.first();

    await firstElement.hover();
    await page.waitForTimeout(300);

    const hasHoverStyles = await firstElement.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return (
        style.transform !== "none" ||
        style.boxShadow !== "none" ||
        style.filter !== "none" ||
        style.transition !== "all 0s ease 0s"
      );
    });

    expect(hasHoverStyles, {
      message: "Element should show visual hover state",
    }).toBeTruthy();
  }

  private async validateTouchFeedback(
    page: Page,
    _humanSpaceflightPage: HumanSpaceflightPage
  ): Promise<void> {
    const touchElements = page.locator(
      '[data-test="dragon-card"], [data-test="starship-card"], [data-test="research-card"]'
    );
    const firstElement = touchElements.first();

    await firstElement.click({ force: true });
    await page.waitForTimeout(300);

    const hasActiveState = await firstElement.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return (
        style.transform !== "none" ||
        style.opacity !== "1" ||
        el.classList.toString().includes("active") ||
        el.classList.toString().includes("pressed")
      );
    });

    expect(hasActiveState, {
      message: "Element should show touch feedback state",
    }).toBeTruthy();
  }
}
