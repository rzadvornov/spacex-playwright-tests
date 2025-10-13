import { Locator, Page } from "@playwright/test";
import { BasePage } from "../base/BasePage";
import { Position, HotspotDistribution } from "../types/Types";

export class TheSuitesPOF extends BasePage {
  private static readonly CALLOUT_WAIT_TIME = 200;
  private static readonly CENTER_TOLERANCE = 5;
  private static readonly MAX_CALLOUT_DISTANCE = 100;

  readonly suitsSection: Locator;
  readonly suitHeading: Locator;
  readonly ivaButton: Locator;
  readonly evaButton: Locator;
  readonly suitImage: Locator;
  readonly hotspots: Locator;
  readonly suitCallout: Locator;
  readonly backgroundGradient: Locator;

  constructor(page: Page) {
    super(page);
    this.suitsSection = page.locator('[data-test="suits-section"]');
    this.suitHeading = this.suitsSection.locator("h2");
    this.ivaButton = page.getByRole("button", {
      name: "INTRAVEHICULAR ACTIVITY (IVA)",
    });
    this.evaButton = page.getByRole("button", {
      name: "EXTRAVEHICULAR ACTIVITY (EVA)",
    });
    this.suitImage = this.suitsSection.locator(".suit-image");
    this.hotspots = this.suitsSection.locator(".suit-hotspot");
    this.suitCallout = this.suitsSection.locator(".suit-callout");
    this.backgroundGradient = this.suitsSection.locator(".gradient-background");
  }

  async scrollToSection(): Promise<void> {
    await this.suitsSection.scrollIntoViewIfNeeded();
    await this.page.waitForLoadState("domcontentloaded");
  }

  async isSuitImageCentered(): Promise<boolean> {
    return await this.suitImage.evaluate((element, tolerance) => {
      const rect = element.getBoundingClientRect();
      const parentRect = element.parentElement?.getBoundingClientRect();

      if (!parentRect) return false;

      const elementCenterX = (rect.left + rect.right) / 2;
      const parentCenterX = (parentRect.left + parentRect.right) / 2;
      const centerDiff = Math.abs(elementCenterX - parentCenterX);

      return centerDiff < tolerance;
    }, TheSuitesPOF.CENTER_TOLERANCE);
  }

  async areHotspotsVisible(): Promise<boolean> {
    const count = await this.hotspots.count();

    if (count === 0) return false;

    const visibilityChecks = await Promise.all(
      Array.from({ length: count }, (_, i) => this.hotspots.nth(i).isVisible())
    );

    return visibilityChecks.every((isVisible) => isVisible);
  }

  async isGradientVisible(): Promise<boolean> {
    return await this.backgroundGradient.isVisible();
  }

  async getHotspotCount(): Promise<number> {
    return await this.hotspots.count();
  }

  async hoverHotspot(index: number): Promise<void> {
    const count = await this.getHotspotCount();

    if (index < 0 || index >= count) {
      throw new Error(
        `Hotspot index ${index} is out of bounds. Total hotspots: ${count}`
      );
    }

    await this.hotspots.nth(index).hover();
  }

  async isCalloutVisible(): Promise<boolean> {
    return await this.suitCallout.isVisible();
  }

  async getCalloutText(): Promise<string> {
    return (await this.suitCallout.textContent())?.trim() || "";
  }

  async getCalloutPosition(): Promise<Position> {
    const box = await this.suitCallout.boundingBox();

    if (!box) {
      throw new Error(
        "Unable to get callout position - element not visible or not found"
      );
    }

    return { x: box.x, y: box.y };
  }

  async getAllHotspotTexts(): Promise<string[]> {
    const count = await this.getHotspotCount();
    const texts: string[] = [];

    for (let i = 0; i < count; i++) {
      await this.hoverHotspot(i);
      await this.waitForCallout();

      const text = await this.getCalloutText();
      texts.push(text);
    }

    return texts;
  }

  async getHotspotDistribution(): Promise<HotspotDistribution> {
    return await this.hotspots.evaluateAll((hotspots) => {
      const parentElement = hotspots[0]?.closest('[data-test="suits-section"]');
      const suitHeight = parentElement?.getBoundingClientRect().height || 0;

      if (suitHeight === 0) {
        return { upper: 0, lower: 0 };
      }

      const midPoint = suitHeight / 2;

      return hotspots.reduce(
        (acc, hotspot) => {
          const rect = hotspot.getBoundingClientRect();
          const relativeY =
            rect.y - (parentElement?.getBoundingClientRect().y || 0);

          if (relativeY < midPoint) {
            acc.upper++;
          } else {
            acc.lower++;
          }
          return acc;
        },
        { upper: 0, lower: 0 }
      );
    });
  }

  async isCalloutPositionedCorrectly(hotspotIndex: number): Promise<boolean> {
    await this.hoverHotspot(hotspotIndex);
    await this.waitForCallout();

    return await this.hotspots
      .nth(hotspotIndex)
      .evaluate((hotspot, maxDistance) => {
        const callout = document.querySelector(".suit-callout") as HTMLElement;

        if (!callout) return false;

        const hotspotRect = hotspot.getBoundingClientRect();
        const calloutRect = callout.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        const isInViewport =
          calloutRect.top >= 0 &&
          calloutRect.left >= 0 &&
          calloutRect.bottom <= viewportHeight &&
          calloutRect.right <= viewportWidth;

        const distance = Math.sqrt(
          Math.pow(calloutRect.left - hotspotRect.left, 2) +
            Math.pow(calloutRect.top - hotspotRect.top, 2)
        );

        return isInViewport && distance <= maxDistance;
      }, TheSuitesPOF.MAX_CALLOUT_DISTANCE);
  }

  async isSuitImageLoaded(): Promise<boolean> {
    return await this.suitImage.evaluate((img: HTMLImageElement) => {
      return img.complete && img.naturalWidth > 0;
    });
  }

  async isGradientEnhancingSuitVisibility(): Promise<boolean> {
    return await this.backgroundGradient.evaluate((gradient) => {
      const style = window.getComputedStyle(gradient);
      const opacity = parseFloat(style.opacity);

      return opacity > 0 && opacity < 1 && style.visibility !== "hidden";
    });
  }

  async areGradientAndSuitVisible(): Promise<boolean> {
    const [gradientVisible, suitVisible] = await Promise.all([
      this.isGradientVisible(),
      this.suitImage.isVisible(),
    ]);

    return gradientVisible && suitVisible;
  }

  async getHotspotPositions(): Promise<Position[]> {
    return await this.hotspots.evaluateAll((hotspots) => {
      return hotspots.map((hotspot) => {
        const rect = hotspot.getBoundingClientRect();
        return {
          x: rect.x + rect.width / 2,
          y: rect.y + rect.height / 2,
        };
      });
    });
  }

  async waitForCallout(
    timeout: number = TheSuitesPOF.CALLOUT_WAIT_TIME
  ): Promise<void> {
    await this.page.waitForTimeout(timeout);
  }

  async isCalloutContentValid(): Promise<boolean> {
    const text = await this.getCalloutText();
    return text.length > 0 && text !== "Loading...";
  }

  async verifyHotspotInteraction(hotspotIndex: number): Promise<{
    calloutVisible: boolean;
    positionCorrect: boolean;
    contentValid: boolean;
  }> {
    await this.hoverHotspot(hotspotIndex);
    await this.waitForCallout();

    const [calloutVisible, positionCorrect, contentValid] = await Promise.all([
      this.isCalloutVisible(),
      this.isCalloutPositionedCorrectly(hotspotIndex),
      this.isCalloutContentValid(),
    ]);

    return {
      calloutVisible,
      positionCorrect,
      contentValid,
    };
  }
}
