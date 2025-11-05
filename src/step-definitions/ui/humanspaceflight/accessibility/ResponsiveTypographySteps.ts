import { Page, expect } from "@playwright/test";
import { Then, Fixture } from "playwright-bdd/decorators";
import { DataTable } from "playwright-bdd";

@Fixture("responsiveTypographySteps")
export class ResponsiveTypographySteps {
  constructor(
    private page: Page,
  ) {}

  @Then("font sizes should be appropriate for each screen size")
  async checkFontSizes() {
    const fontCheck = await this.page.evaluate(() => {
      const textElements = document.querySelectorAll(
        "p, h1, h2, h3, h4, h5, h6"
      );
      return Array.from(textElements).every((el) => {
        const fontSize = parseInt(window.getComputedStyle(el).fontSize);
        return fontSize >= 12;
      });
    });
    expect(fontCheck, "Font sizes should be appropriate").toBeTruthy();
  }

  @Then("line-height should provide comfortable reading")
  async checkLineHeight() {
    const lineHeightCheck = await this.page.evaluate(() => {
      const textElements = document.querySelectorAll("p");
      return Array.from(textElements).every((el) => {
        const lineHeight = parseFloat(window.getComputedStyle(el).lineHeight);
        const fontSize = parseFloat(window.getComputedStyle(el).fontSize);
        return lineHeight / fontSize >= 1.4;
      });
    });
    expect(
      lineHeightCheck,
      "Line height should be comfortable for reading"
    ).toBeTruthy();
  }

  @Then("line length should not exceed recommended maximums")
  async checkLineLength() {
    const lineLengthCheck = await this.page.evaluate(() => {
      const paragraphs = document.querySelectorAll("p");
      return Array.from(paragraphs).every((p) => {
        const width = p.getBoundingClientRect().width;
        return width <= 800;
      });
    });
    expect(lineLengthCheck, "Line length should not be excessive").toBeTruthy();
  }

  @Then("text should not require horizontal scrolling")
  async checkTextScroll() {
    const noHorizontalScroll = await this.page.evaluate(() => {
      const body = document.body;
      return body.scrollWidth <= window.innerWidth;
    });
    expect(
      noHorizontalScroll,
      "Text should not cause horizontal scrolling"
    ).toBeTruthy();
  }

  @Then("typography should meet readability standards:")
  async checkTypographyReadability(dataTable: DataTable) {
    const standards = dataTable.hashes();

    for (const standard of standards) {
      await this.validateTypographyStandard(standard.Element, standard.Value);
    }
  }

  private async validateTypographyStandard(
    element: string,
    value: string
  ): Promise<void> {
    const validators: Record<string, () => Promise<void>> = {
      "Base Size": () => this.validateBaseFontSize(value),
      "Line Height": () => this.validateLineHeight(value),
      "Line Length": () => this.validateLineLength(value),
      "Font Scale": () => this.validateFontScale(),
    };

    const validator = validators[element];
    if (!validator) {
      throw new Error(`Unknown typography element: ${element}`);
    }

    await validator();
  }

  private async validateBaseFontSize(expectedValue: string): Promise<void> {
    const baseSize = await this.page.evaluate(() => {
      return parseInt(getComputedStyle(document.body).fontSize);
    });

    expect(
      baseSize,
      "Base font size should meet standard"
    ).toBeGreaterThanOrEqual(parseInt(expectedValue));
  }

  private async validateLineHeight(expectedValue: string): Promise<void> {
    const lineHeight = await this.page.evaluate(() => {
      const paragraphs = document.querySelectorAll("p");
      if (paragraphs.length === 0) return 1.5;

      const firstParagraph = paragraphs[0];
      const computedStyle = getComputedStyle(firstParagraph);
      const fontSize = parseInt(computedStyle.fontSize);
      const lineHeightValue = parseInt(computedStyle.lineHeight);
      return lineHeightValue / fontSize;
    });

    const expectedLineHeight = parseFloat(expectedValue);
    expect(
      lineHeight,
      "Line height should meet standard"
    ).toBeGreaterThanOrEqual(expectedLineHeight);
  }

  private async validateLineLength(expectedValue: string): Promise<void> {
    const maxChars = parseInt(expectedValue);
    const lineLengths = await this.page.evaluate(() => {
      const paragraphs = document.querySelectorAll("p");
      return Array.from(paragraphs).map((p) => {
        const text = p.textContent || "";
        const words = text.split(" ");
        return Math.max(...words.map((word) => word.length));
      });
    });

    const maxLineLength = Math.max(...lineLengths);
    expect(
      maxLineLength,
      "Line length should not exceed maximum"
    ).toBeLessThanOrEqual(maxChars);
  }

  private async validateFontScale(): Promise<void> {
    const fontScales = await this.page.evaluate(() => {
      const elements = document.querySelectorAll("h1, h2, h3, h4, h5, h6, p");
      const scales: Record<string, number> = {};

      elements.forEach((el) => {
        const tagName = el.tagName.toLowerCase();
        const fontSize = parseInt(getComputedStyle(el).fontSize);
        if (!scales[tagName] || fontSize > scales[tagName]) {
          scales[tagName] = fontSize;
        }
      });

      return scales;
    });

    expect(
      Object.keys(fontScales).length,
      "Font scale should be properly implemented"
    ).toBeGreaterThan(0);
  }
}
