import { Locator, Page } from "@playwright/test";

export class DestinationsPOF {
  private readonly destinationsSection: Locator;
  readonly destinationsHeading: Locator;
  private currentlyHoveredLink: Locator | null = null;
  private readonly page: Page;

  private readonly DESTINATION_CLASS_MAP = {
    "EARTH ORBIT": "earth-orbit",
    "SPACE STATION": "space-station",
    MOON: "moon",
    MARS: "mars",
  } as const;

  constructor(page: Page) {
    this.page = page;
    this.destinationsSection = page.locator("div.destinations").first();
    this.destinationsHeading = page
      .getByRole("heading", { name: /Destinations/i })
      .first();
  }

  private destinationElement(name: string): Locator {
    const className = this.DESTINATION_CLASS_MAP[
      name.toUpperCase() as keyof typeof this.DESTINATION_CLASS_MAP
    ];
    if (!className) {
      return this.page.locator("non-existent-locator");
    }
    return this.destinationsSection.locator(`.destination.${className}`).first();
  }

  private destinationMedia(name: string): Locator {
    return this.destinationElement(name).locator("img, svg").first();
  }

  private getEarthImageBackground(): Locator {
    return this.destinationsSection.locator(".earth").first();
  }

  async scrollToDestinationsSection(): Promise<void> {
    await this.destinationsSection.scrollIntoViewIfNeeded({ timeout: 10000 });
  }

  async getDestinationsHeadingText(): Promise<string> {
    return (await this.destinationsHeading.textContent())?.trim() || "";
  }

  async areAllDestinationsVisible(expectedNames: string[]): Promise<boolean> {
    try {
      for (const name of expectedNames) {
        const element = this.destinationElement(name);
        if (!(await element.isVisible())) {
          return false;
        }
      }
      const actualDestinationCount = await this.destinationsSection
        .locator(".destination")
        .count();
      return actualDestinationCount === expectedNames.length;
    } catch (error) {
      return false;
    }
  }

  async clickDestination(destinationName: string): Promise<void> {
    await this.destinationMedia(destinationName).click();
  }

  async isDestinationImageLoadedCorrectly(destinationName: string): Promise<boolean> {
    const image = this.destinationMedia(destinationName);

    if (!(await image.isVisible())) return false;

    if ((await image.evaluate((el) => el.tagName.toLowerCase())) === "img") {
      const loaded = await image.evaluate(
        (img: HTMLImageElement) => img.complete && img.naturalHeight !== 0
      );
      return loaded;
    }
    return true;
  }

  async hoverOverDestination(destinationName: string): Promise<void> {
    this.currentlyHoveredLink = this.destinationMedia(destinationName);
    await this.currentlyHoveredLink.hover();
    await this.page.waitForTimeout(100);
  }

  async unhoverDestination(): Promise<void> {
    if (this.currentlyHoveredLink) {
      await this.destinationsHeading.hover();
      this.currentlyHoveredLink = null;
    }
    await this.page.waitForTimeout(100);
  }

  async isDestinationHoverEffectVisible(): Promise<boolean> {
    if (!this.currentlyHoveredLink) return false;

    const element = this.currentlyHoveredLink;

    const opacityOnHover = await element.evaluate(
      (el) => window.getComputedStyle(el).opacity
    );

    await this.destinationsHeading.hover();
    const opacityDefault = await element.evaluate(
      (el) => window.getComputedStyle(el).opacity
    );

    await element.hover();

    return opacityOnHover !== opacityDefault;
  }
  
  async hasDestinationSvgCircleOverlay(destinationName: string): Promise<boolean> {
      const svgOverlay = this.destinationElement(destinationName).locator('svg').first(); 
      return await svgOverlay.isVisible();
  }

   async waitForDestinationsSectionLoad(): Promise<void> {
      await this.destinationsSection.waitFor({ state: 'visible' });
   }
  
  async areAllDestinationMediaVisible(): Promise<boolean> {
      const destinationElements = this.destinationsSection.locator('.destination');
      const count = await destinationElements.count();
      
      for (let i = 0; i < count; i++) {
          const destination = destinationElements.nth(i);
          const media = destination.locator('img, svg').first();
          
          if (await media.count() === 0) {
              return false;
          }
          if (!(await media.isVisible())) {
              return false;
          }
      }
      return count > 0;
  }

  async areAllDestinationsClickableAndInteractive(): Promise<boolean> {
      const destinations = this.destinationsSection.locator('.destination');
      const count = await destinations.count();
      
      for (let i = 0; i < count; i++) {
          const destination = destinations.nth(i);
          
          if (!(await destination.isVisible() && await destination.isEnabled())) return false;
          
          const media = destination.locator('img, svg').first();
          if (await media.count() === 0) return false;
          
          const cursorStyle = await media.evaluate(el => window.getComputedStyle(el).cursor);
          if (cursorStyle !== 'pointer') return false;
      }
      return count > 0;
  }

  async isEarthImageBackgroundVisible(): Promise<boolean> {
      return await this.getEarthImageBackground().isVisible();
  }

  async getEarthImageComputedStyles(): Promise<{ position: string; bottom: string; left: string; transform: string; opacity: string } | null> {
      const earthImage = this.getEarthImageBackground();
      if (!(await earthImage.isVisible())) return null;

      const styles = await earthImage.evaluate(el => ({
          position: window.getComputedStyle(el).position,
          bottom: window.getComputedStyle(el).bottom,
          left: window.getComputedStyle(el).left,
          transform: window.getComputedStyle(el).transform,
          opacity: window.getComputedStyle(el).opacity,
      }));
      return styles;
  }

  async isDestinationCursorPointer(): Promise<boolean> {
      if (!this.currentlyHoveredLink) return false;
      const cursorStyle = await this.currentlyHoveredLink.evaluate(el => window.getComputedStyle(el).cursor);
      return cursorStyle === 'pointer';
  }

  async isDestinationHoverEffectDisappeared(): Promise<boolean> {
      const firstDestination = this.destinationsSection.locator('.destination').first();
      const firstMedia = firstDestination.locator('img, svg').first();
      
      if (await firstMedia.count() === 0) return true; 

      const opacityAfterUnhover = await firstMedia.evaluate(el => window.getComputedStyle(el).opacity);
      
      await firstMedia.hover();
      const opacityOnHover = await firstMedia.evaluate(el => window.getComputedStyle(el).opacity);
      
      await this.destinationsHeading.hover();
      
      return opacityAfterUnhover !== opacityOnHover;
  }
}