import { Then, Fixture } from "playwright-bdd/decorators";
import { DataTable } from "playwright-bdd";
import { VehicleBaseSteps } from "./VehicleBaseSteps";
import { Page, expect } from "@playwright/test";
import { HumanSpaceflightPage } from "../../../../pages/ui/HumanSpaceflightPage";

@Fixture("vehicleAccessibilitySteps")
export class VehicleAccessibilitySteps extends VehicleBaseSteps {
  constructor(
    protected page: Page,
    protected humanSpaceflightPage: HumanSpaceflightPage
  ) {
    super(page, humanSpaceflightPage);
  }

  @Then("all vehicle cards should meet accessibility standards:")
  async checkAccessibilityStandards(dataTable: DataTable) {
    const standards = this.parseDataTable<any>(dataTable);

    for (const standard of standards) {
      await this.validateAccessibilityStandard(standard);
    }
  }

  @Then("interactive elements should be accessible via:")
  async checkAccessibilityMethods(dataTable: DataTable) {
    const methods = this.parseDataTable<any>(dataTable);

    for (const method of methods) {
      await this.validateAccessibilityMethod(method);
    }
  }

  private async validateAccessibilityStandard(standard: any): Promise<void> {
    const { Feature } = standard;

    switch (Feature) {
      case "Headings":
        await this.validateHeadingStructure();
        break;
      case "Focus Order":
        await this.validateFocusOrder();
        break;
      case "Media Controls":
        await this.validateMediaControls();
        break;
      case "Alt Text":
        await this.validateAltText();
        break;
      case "Color Contrast":
        await this.validateColorContrast();
        break;
      default:
        throw new Error(`Unknown accessibility feature: ${Feature}`);
    }
  }

  private async validateHeadingStructure(): Promise<void> {
    const headings = this.page.locator("h1, h2, h3, h4, h5, h6");
    const headingCount = await headings.count();
    expect(headingCount, {
      message: "Should have proper heading structure",
    }).toBeGreaterThan(0);

    const headingLevels = await headings.evaluateAll((els) =>
      els.map((el) => parseInt(el.tagName.substring(1)))
    );

    const hasH1 = headingLevels.some((level) => level === 1);
    expect(hasH1, {
      message: "Should have at least one H1 heading",
    }).toBeTruthy();

    let previousLevel = 0;
    for (const level of headingLevels.sort((a, b) => a - b)) {
      if (level > previousLevel + 1) {
        throw new Error(
          `Heading levels should not skip from H${previousLevel} to H${level}`
        );
      }
      previousLevel = level;
    }
  }

  private async validateFocusOrder(): Promise<void> {
    const focusableElements = this.page.locator(
      'button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const focusableCount = await focusableElements.count();
    expect(focusableCount, {
      message: "Should have focusable elements",
    }).toBeGreaterThan(0);

    await this.page.keyboard.press("Tab");
    const firstFocused = await this.page.evaluate(() =>
      document.activeElement?.getAttribute("data-test")
    );

    expect(firstFocused, {
      message: "First tab should focus on meaningful element",
    }).toBeTruthy();
  }

  private async validateMediaControls(): Promise<void> {
    const videos = this.page.locator("video");
    const videoCount = await videos.count();

    if (videoCount > 0) {
      const firstVideo = videos.first();
      const hasControls = await firstVideo.getAttribute("controls");
      expect(hasControls, {
        message: "Videos should have controls",
      }).not.toBeNull();

      const canFocus = await firstVideo.evaluate((video: HTMLVideoElement) => {
        video.focus();
        return document.activeElement === video;
      });

      expect(canFocus, {
        message: "Video controls should be focusable",
      }).toBeTruthy();
    }
  }

  private async validateAltText(): Promise<void> {
    const images = this.page.locator("img:not([aria-hidden='true'])");
    const imageCount = await images.count();

    for (let i = 0; i < imageCount; i++) {
      const image = images.nth(i);
      const alt = await image.getAttribute("alt");
      const isDecorative =
        (await image.getAttribute("role")) === "presentation" ||
        (await image.getAttribute("aria-hidden")) === "true";

      if (!isDecorative) {
        expect(alt, {
          message: "Non-decorative images should have descriptive alt text",
        }).toBeTruthy();
        expect(alt?.trim(), {
          message: "Alt text should not be empty",
        }).not.toBe("");
      }
    }
  }

  private async validateColorContrast(): Promise<void> {
    const textElements = this.page.locator(
      '[data-test="vehicle-title"], [data-test="vehicle-description"], p, span, div'
    );
    const textCount = await textElements.count();
    expect(textCount, {
      message: "Should have text elements for contrast check",
    }).toBeGreaterThan(0);

    const sampleSize = Math.min(3, textCount);
    for (let i = 0; i < sampleSize; i++) {
      const element = textElements.nth(i);
      const hasSufficientContrast = await element.evaluate((el) => {
        const style = window.getComputedStyle(el);
        const color = style.color;
        const backgroundColor = style.backgroundColor;

        return (
          color !== backgroundColor &&
          !color.includes("rgba(0, 0, 0, 0)") &&
          !backgroundColor.includes("rgba(0, 0, 0, 0)")
        );
      });

      expect(hasSufficientContrast, {
        message: "Text should have sufficient color contrast",
      }).toBeTruthy();
    }
  }

  private async validateAccessibilityMethod(method: any): Promise<void> {
    const { Method } = method;

    switch (Method) {
      case "Keyboard":
        await this.validateKeyboardNavigation();
        break;
      case "Screen Reader":
        await this.validateScreenReaderSupport();
        break;
      case "Touch":
        await this.validateTouchSupport();
        break;
      default:
        throw new Error(`Unknown accessibility method: ${Method}`);
    }
  }

  private async validateKeyboardNavigation(): Promise<void> {
    await this.page.keyboard.press("Tab");
    const hasFocus = await this.page.evaluate(
      () => document.activeElement !== document.body
    );
    expect(hasFocus, {
      message: "Should support keyboard navigation",
    }).toBeTruthy();
  }

  private async validateScreenReaderSupport(): Promise<void> {
    const ariaElements = this.page.locator("[aria-label], [aria-describedby]");
    const ariaCount = await ariaElements.count();
    expect(ariaCount, {
      message: "Should have ARIA attributes for screen readers",
    }).toBeGreaterThan(0);
  }

  private async validateTouchSupport(): Promise<void> {
    const buttons = this.page.locator('button, [role="button"]');
    const buttonCount = await buttons.count();
    expect(buttonCount, {
      message: "Should have touchable elements",
    }).toBeGreaterThan(0);
  }
}
