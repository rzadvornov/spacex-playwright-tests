import { Locator, Page } from "@playwright/test";
import { EarthImageStyles } from "../../../utils/types/Types";

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

  private async getDestinationMediaElement(
    destination: Locator
  ): Promise<Locator | null> {
    const media = destination.locator("img, svg").first();
    return (await media.count()) > 0 ? media : null;
  }

  private async evaluateComputedStyle(
    element: Locator,
    property: "cursor" | "opacity"
  ): Promise<string> {
    return await element.evaluate(
      (el: Element, prop) => window.getComputedStyle(el)[prop],
      property
    );
  }

  private async evaluateCursorStyle(element: Locator): Promise<string> {
    return this.evaluateComputedStyle(element, "cursor");
  }

  private async evaluateOpacityStyle(element: Locator): Promise<string> {
    return this.evaluateComputedStyle(element, "opacity");
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

  private async getAllDestinationElements(): Promise<Locator[]> {
    return this.destinationElements.all();
  }

  async scrollToDestinationsSection(): Promise<void> {
    await this.destinationsSection.scrollIntoViewIfNeeded();
    await this.destinationsSection.waitFor({ state: "visible" });
  }

  async getDestinationsHeadingText(): Promise<string> {
    const text = await this.destinationsHeading.textContent();
    return text?.trim() ?? "";
  }

  async getDestinationCount(): Promise<number> {
    return await this.destinationElements.count();
  }

  async getDestinationNames(): Promise<string[]> {
    const destinationElements = await this.getAllDestinationElements();
    const names: string[] = [];

    for (const destination of destinationElements) {
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

  async areAllDestinationsVisible(expectedNames: string[]): Promise<boolean> {
    try {
      const checkVisibility = expectedNames.map((name) =>
        this.getDestinationElement(name).isVisible()
      );

      const allVisible = (await Promise.all(checkVisibility)).every((v) => v);

      const actualCount = await this.destinationElements.count();
      return allVisible && actualCount === expectedNames.length;
    } catch {
      return false;
    }
  }

  async waitForDestinationsSectionLoad(): Promise<void> {
    await this.destinationsSection.waitFor({ state: "visible" });
  }

  async areAllDestinationMediaVisible(): Promise<boolean> {
    const destinations = await this.getAllDestinationElements();

    if (destinations.length === 0) {
      return false;
    }

    const visibilityChecks = destinations.map(async (destination) => {
      const media = await this.getDestinationMediaElement(destination);
      return !!media && (await media.isVisible());
    });

    return (await Promise.all(visibilityChecks)).every((v) => v);
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

  async clickDestination(destinationName: string): Promise<void> {
    const media = this.getDestinationMedia(destinationName);
    await media.click();
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
    const element = this.currentlyHoveredDestination;
    if (!element) return false;

    await this.unhoverDestination();
    const defaultOpacity = await this.evaluateOpacityStyle(element);

    await element.hover();
    const hoverOpacity = await this.evaluateOpacityStyle(element);

    await this.unhoverDestination();

    return defaultOpacity !== hoverOpacity;
  }

  async isDestinationHoverEffectDisappeared(): Promise<boolean> {
    return this.isDestinationHoverEffectVisible();
  }

  async hasDestinationSvgCircleOverlay(
    destinationName: string
  ): Promise<boolean> {
    const svgOverlay = this.getDestinationElement(destinationName)
      .locator("svg")
      .first();
    return await svgOverlay.isVisible();
  }

  async areAllDestinationsClickableAndInteractive(): Promise<boolean> {
    const destinations = await this.getAllDestinationElements();

    if (destinations.length === 0) {
      return false;
    }

    const interactivityChecks = destinations.map(async (destination) => {
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
      return cursorStyle === "pointer";
    });

    return (await Promise.all(interactivityChecks)).every((v) => v);
  }

  async isDestinationCursorPointer(): Promise<boolean> {
    if (!this.currentlyHoveredDestination) {
      const firstName = (await this.getDestinationNames())[0];
      if (!firstName) return false;
      await this.hoverOverDestination(firstName);
    }

    const cursorStyle = await this.evaluateCursorStyle(
      this.currentlyHoveredDestination!
    );
    return cursorStyle === "pointer";
  }

  async isDestinationInteractive(destinationName: string): Promise<boolean> {
    const element = this.getDestinationElement(destinationName);
    const media = this.getDestinationMedia(destinationName);

    const [isVisible, isEnabled, mediaVisible, cursorStyle] = await Promise.all(
      [
        element.isVisible(),
        element.isEnabled(),
        media.isVisible(),
        this.evaluateCursorStyle(media),
      ]
    );

    return isVisible && isEnabled && mediaVisible && cursorStyle === "pointer";
  }
}
