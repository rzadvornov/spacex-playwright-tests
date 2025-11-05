import { expect, Page } from "@playwright/test";
import { InteractiveStateStrategy } from "../types/Types";

class ContentImageValidator implements InteractiveStateStrategy {
  constructor(private page: Page, private contentType: string) {}

  async validate(): Promise<void> {
    const images = await this.page.$$("img:visible");

    for (const image of images) {
      const alt = await image.getAttribute("alt");
      const isDecorative = await image.evaluate(
        (img: HTMLImageElement) => img.width <= 50 && img.height <= 50
      );

      if (!isDecorative) {
        expect(
          alt?.length,
          `Content images must have descriptive alt text. Found: ${alt}`
        ).toBeGreaterThan(0);

        if (this.contentType === "Descriptive") {
          expect(alt?.length).toBeGreaterThan(3);
          expect(alt).not.toMatch(/image|img/i);
        }
      }
    }
  }
}

class DecorativeImageValidator implements InteractiveStateStrategy {
  constructor(private page: Page) {}

  async validate(): Promise<void> {
    const images = await this.page.$$("img:visible");

    for (const image of images) {
      const isDecorative = await image.evaluate(
        (img: HTMLImageElement) =>
          (img.width <= 50 && img.height <= 50) ||
          img.getAttribute("role") === "presentation" ||
          img.getAttribute("aria-hidden") === "true"
      );

      if (isDecorative) {
        const alt = await image.getAttribute("alt");
        expect([null, ""]).toContain(alt);
      }
    }
  }
}

class SvgIconValidator implements InteractiveStateStrategy {
  constructor(private page: Page, private contentType: string) {}

  async validate(): Promise<void> {
    const svgs = await this.page.$$("svg:visible");

    for (const svg of svgs) {
      const ariaLabel = await svg.getAttribute("aria-label");
      const title = await svg.$("title");
      const hasAccessibleName = !!ariaLabel || !!title;

      expect(
        hasAccessibleName,
        "SVG icons must have aria-label or title element"
      ).toBeTruthy();

      if (this.contentType === "Purpose/action") {
        const labelText = ariaLabel || (await this.getTitleText(svg));
        expect(
          labelText?.length,
          "SVG icon labels should describe purpose or action"
        ).toBeGreaterThan(0);
      }
    }
  }

  private async getTitleText(svg: any): Promise<string> {
    return svg.$eval("title", (el: Element) => el.textContent).catch(() => "");
  }
}

class ComplexImageValidator implements InteractiveStateStrategy {
  constructor(private page: Page) {}

  async validate(): Promise<void> {
    const complexImages = await this.page.$$("img[aria-describedby]");

    for (const image of complexImages) {
      const describedBy = await image.getAttribute("aria-describedby");
      expect(
        describedBy,
        "Complex images with aria-describedby must reference existing element"
      ).toBeTruthy();

      if (describedBy) {
        const descriptionElement = await this.page.$(`#${describedBy}`);
        expect(
          descriptionElement,
          `Element referenced by aria-describedby must exist: #${describedBy}`
        ).toBeTruthy();
      }
    }
  }
}

export class VisualElementValidatorRegistry {
  constructor(private page: Page) {}

  getValidator(
    elementType: string,
    contentType: string
  ): InteractiveStateStrategy {
    const normalizedType = elementType.toLowerCase();

    switch (normalizedType) {
      case "content images":
        return new ContentImageValidator(this.page, contentType);
      case "decorative":
        return new DecorativeImageValidator(this.page);
      case "svg icons":
        return new SvgIconValidator(this.page, contentType);
      case "complex images":
        return new ComplexImageValidator(this.page);
      default:
        throw new Error(`Unknown visual element type: ${elementType}`);
    }
  }
}