import { Locator, Page } from "@playwright/test";
import { BasePage } from "../base/BasePage";

interface Hotspot {
  x: number;
  y: number;
  text: string;
}

export class TheSuitesPOF extends BasePage {
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
    return await this.suitImage.evaluate((element) => {
      const rect = element.getBoundingClientRect();
      const parentRect = element.parentElement?.getBoundingClientRect();
      if (!parentRect) return false;

      const centerDiff = Math.abs(
        (rect.left + rect.right) / 2 - (parentRect.left + parentRect.right) / 2
      );
      return centerDiff < 5; // Allow 5px tolerance
    });
  }

  async areHotspotsVisible(): Promise<boolean> {
    const count = await this.hotspots.count();
    for (let i = 0; i < count; i++) {
      if (!(await this.hotspots.nth(i).isVisible())) {
        return false;
      }
    }
    return true;
  }

  async isGradientVisible(): Promise<boolean> {
    return await this.backgroundGradient.isVisible();
  }

  async getHotspotCount(): Promise<number> {
    return await this.hotspots.count();
  }

  async hoverHotspot(index: number): Promise<void> {
    await this.hotspots.nth(index).hover();
  }

  async isCalloutVisible(): Promise<boolean> {
    return await this.suitCallout.isVisible();
  }

  async getCalloutText(): Promise<string> {
    return (await this.suitCallout.textContent()) || "";
  }

  async getCalloutPosition(): Promise<{ x: number; y: number }> {
    const box = await this.suitCallout.boundingBox();
    return {
      x: box ? box.x : 0,
      y: box ? box.y : 0,
    };
  }

  async getAllHotspotTexts(): Promise<string[]> {
    const texts: string[] = [];
    const count = await this.hotspots.count();

    for (let i = 0; i < count; i++) {
      await this.hotspots.nth(i).hover();
      await this.page.waitForTimeout(200); // Wait for callout to appear
      const text = await this.getCalloutText();
      texts.push(text);
    }

    return texts;
  }

  async getHotspotDistribution(): Promise<{ upper: number; lower: number }> {
    const distribution = await this.hotspots.evaluateAll((hotspots) => {
      const suitHeight =
        hotspots[0].parentElement?.getBoundingClientRect().height || 0;
      const midPoint = suitHeight / 2;

      return hotspots.reduce(
        (acc, hotspot) => {
          const rect = hotspot.getBoundingClientRect();
          if (rect.y < midPoint) {
            acc.upper++;
          } else {
            acc.lower++;
          }
          return acc;
        },
        { upper: 0, lower: 0 }
      );
    });

    return distribution;
  }

  async isCalloutPositionedCorrectly(hotspotIndex: number): Promise<boolean> {
    await this.hoverHotspot(hotspotIndex);
    await this.page.waitForTimeout(200);

    return await this.hotspots.nth(hotspotIndex).evaluate((hotspot) => {
      const callout = document.querySelector(".suit-callout");
      if (!callout) return false;

      const hotspotRect = hotspot.getBoundingClientRect();
      const calloutRect = callout.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Check if callout is fully visible in viewport
      const isInViewport =
        calloutRect.top >= 0 &&
        calloutRect.left >= 0 &&
        calloutRect.bottom <= viewportHeight &&
        calloutRect.right <= viewportWidth;

      // Check if callout is near its hotspot
      const maxDistance = 100; // Maximum acceptable distance from hotspot
      const distance = Math.sqrt(
        Math.pow(calloutRect.left - hotspotRect.left, 2) +
          Math.pow(calloutRect.top - hotspotRect.top, 2)
      );

      return isInViewport && distance <= maxDistance;
    });
  }

  async isSuitImageLoaded(): Promise<boolean> {
    return await this.suitImage.evaluate((img: HTMLImageElement) => {
      return img.complete && img.naturalWidth !== 0;
    });
  }

  async isGradientEnhancingSuitVisibility(): Promise<boolean> {
    return await this.backgroundGradient.evaluate((gradient) => {
      const style = window.getComputedStyle(gradient);
      const opacity = parseFloat(style.opacity);
      return opacity > 0 && opacity < 1; // Check if gradient has proper opacity
    });
  }

  async areGradientAndSuitVisible(): Promise<boolean> {
    const gradientVisible = await this.isGradientVisible();
    const suitVisible = await this.suitImage.isVisible();
    return gradientVisible && suitVisible;
  }
}
