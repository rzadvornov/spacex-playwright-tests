import { Locator, Page } from "@playwright/test";
import { EarthImageStyles } from "../types/Types";

export class DestinationsPOF {
  private readonly page: Page;
  private readonly destinationsSection: Locator;
  readonly destinationsHeading: Locator;
  private readonly destinationElements: Locator;

  private currentlyHoveredDestination: Locator | null = null;

  private readonly DESTINATION_CLASS_MAP: Readonly<Record<string, string>> = {
    "EARTH ORBIT": "earth-orbit",
    "SPACE STATION": "space-station",
    MOON: "moon",
    MARS: "mars",
  };

  constructor(page: Page) {
    this.page = page;
    this.destinationsSection = page.locator("div.destinations").first();
    this.destinationsHeading = page
      .getByRole("heading", { name: /Destinations/i })
      .first();
    this.destinationElements = this.destinationsSection.locator(".destination");
  }

  private getDestinationClassName(name: string): string {
    const className = this.DESTINATION_CLASS_MAP[name.toUpperCase()];
    if (!className) {
      throw new Error(`Unknown destination: ${name}`);
    }
    return className;
  }

  private getDestinationElement(name: string): Locator {
    const className = this.getDestinationClassName(name);
    return this.destinationsSection
      .locator(`.destination.${className}`)
      .first();
  }

  private getDestinationMedia(name: string): Locator {
    return this.getDestinationElement(name).locator("img, svg").first();
  }

  private getEarthImageBackground(): Locator {
    return this.destinationsSection.locator(".earth").first();
  }

  private async getAllDestinationElements(): Promise<Locator[]> {
    const count = await this.destinationElements.count();
    const elements: Locator[] = [];

    for (let i = 0; i < count; i++) {
      elements.push(this.destinationElements.nth(i));
    }

    return elements;
  }

  private async getDestinationMediaElement(
    destination: Locator
  ): Promise<Locator | null> {
    const media = destination.locator("img, svg").first();
    return (await media.count()) > 0 ? media : null;
  }

  private async evaluateMediaLoaded(media: Locator): Promise<boolean> {
    const tagName = await media.evaluate((el: Element) =>
      el.tagName.toLowerCase()
    );

    if (tagName === "img") {
      return await media.evaluate(
        (img: HTMLImageElement) => img.complete && img.naturalHeight > 0
      );
    }

    return true;
  }

  private async evaluateCursorStyle(element: Locator): Promise<string> {
    return await element.evaluate(
      (el: Element) => window.getComputedStyle(el).cursor
    );
  }

  private async evaluateOpacityStyle(element: Locator): Promise<string> {
    return await element.evaluate(
      (el: Element) => window.getComputedStyle(el).opacity
    );
  }

  async scrollToDestinationsSection(): Promise<void> {
    await this.destinationsSection.scrollIntoViewIfNeeded();
    await this.destinationsSection.waitFor({ state: "visible" });
  }

  async getDestinationsHeadingText(): Promise<string> {
    const text = await this.destinationsHeading.textContent();
    return text?.trim() ?? "";
  }

  async areAllDestinationsVisible(expectedNames: string[]): Promise<boolean> {
    try {
      for (const name of expectedNames) {
        const element = this.getDestinationElement(name);
        if (!(await element.isVisible())) {
          return false;
        }
      }

      const actualCount = await this.destinationElements.count();
      return actualCount === expectedNames.length;
    } catch {
      return false;
    }
  }

  async clickDestination(destinationName: string): Promise<void> {
    const media = this.getDestinationMedia(destinationName);
    await media.click();
  }

  async isDestinationImageLoadedCorrectly(
    destinationName: string
  ): Promise<boolean> {
    const media = this.getDestinationMedia(destinationName);

    if (!(await media.isVisible())) {
      return false;
    }

    return await this.evaluateMediaLoaded(media);
  }

  async hoverOverDestination(destinationName: string): Promise<void> {
    const media = this.getDestinationMedia(destinationName);
    this.currentlyHoveredDestination = media;
    await media.hover();
    await this.page.waitForTimeout(50);
  }

  async unhoverDestination(): Promise<void> {
    if (this.currentlyHoveredDestination) {
      await this.destinationsHeading.hover({ force: true });
      this.currentlyHoveredDestination = null;
    }
    await this.page.waitForTimeout(50);
  }

  async isDestinationHoverEffectVisible(): Promise<boolean> {
    if (!this.currentlyHoveredDestination) {
      return false;
    }

    const element = this.currentlyHoveredDestination;

    await this.unhoverDestination();
    const defaultOpacity = await this.evaluateOpacityStyle(element);

    await element.hover();
    const hoverOpacity = await this.evaluateOpacityStyle(element);

    if (this.currentlyHoveredDestination === element) {
      await element.hover();
    }

    return defaultOpacity !== hoverOpacity;
  }

  async hasDestinationSvgCircleOverlay(
    destinationName: string
  ): Promise<boolean> {
    const svgOverlay = this.getDestinationElement(destinationName)
      .locator("svg")
      .first();
    return await svgOverlay.isVisible();
  }

  async waitForDestinationsSectionLoad(): Promise<void> {
    await this.destinationsSection.waitFor({ state: "visible" });
  }

  async areAllDestinationMediaVisible(): Promise<boolean> {
    const destinations = await this.getAllDestinationElements();

    if (destinations.length === 0) {
      return false;
    }

    for (const destination of destinations) {
      const media = await this.getDestinationMediaElement(destination);
      if (!media || !(await media.isVisible())) {
        return false;
      }
    }

    return true;
  }

  async areAllDestinationsClickableAndInteractive(): Promise<boolean> {
    const destinations = await this.getAllDestinationElements();

    if (destinations.length === 0) {
      return false;
    }

    for (const destination of destinations) {
      if (
        !(await destination.isVisible()) ||
        !(await destination.isEnabled())
      ) {
        return false;
      }

      const media = await this.getDestinationMediaElement(destination);
      if (!media) {
        return false;
      }

      const cursorStyle = await this.evaluateCursorStyle(media);
      if (cursorStyle !== "pointer") {
        return false;
      }
    }

    return true;
  }

  async isEarthImageBackgroundVisible(): Promise<boolean> {
    const earthImage = this.getEarthImageBackground();
    return await earthImage.isVisible();
  }

  async getEarthImageComputedStyles(): Promise<EarthImageStyles | null> {
    const earthImage = this.getEarthImageBackground();

    if (!(await earthImage.isVisible())) {
      return null;
    }

    return await earthImage.evaluate((el: Element): EarthImageStyles => {
      const style = window.getComputedStyle(el);
      return {
        position: style.position,
        bottom: style.bottom,
        left: style.left,
        transform: style.transform,
        opacity: style.opacity,
      };
    });
  }

  async isDestinationCursorPointer(): Promise<boolean> {
    if (!this.currentlyHoveredDestination) {
      return false;
    }

    const cursorStyle = await this.evaluateCursorStyle(
      this.currentlyHoveredDestination
    );
    return cursorStyle === "pointer";
  }

  async isDestinationHoverEffectDisappeared(): Promise<boolean> {
    const firstDestination = this.destinationElements.first();

    if ((await firstDestination.count()) === 0) {
      return true;
    }

    const media = await this.getDestinationMediaElement(firstDestination);
    if (!media) {
      return true;
    }

    await media.hover();
    const hoverOpacity = await this.evaluateOpacityStyle(media);

    await this.unhoverDestination();
    const defaultOpacity = await this.evaluateOpacityStyle(media);

    return hoverOpacity !== defaultOpacity;
  }

  async getDestinationCount(): Promise<number> {
    return await this.destinationElements.count();
  }

  async getDestinationNames(): Promise<string[]> {
    const destinations = await this.getAllDestinationElements();
    const names: string[] = [];

    for (const destination of destinations) {
      const className = await destination.getAttribute("class");
      const destinationName = Object.entries(this.DESTINATION_CLASS_MAP).find(
        ([, value]) => className?.includes(value)
      )?.[0];

      if (destinationName) {
        names.push(destinationName);
      }
    }

    return names;
  }

  async isDestinationInteractive(destinationName: string): Promise<boolean> {
    const element = this.getDestinationElement(destinationName);
    const media = this.getDestinationMedia(destinationName);

    return (
      (await element.isVisible()) &&
      (await element.isEnabled()) &&
      (await media.isVisible()) &&
      (await this.evaluateCursorStyle(media)) === "pointer"
    );
  }
}
