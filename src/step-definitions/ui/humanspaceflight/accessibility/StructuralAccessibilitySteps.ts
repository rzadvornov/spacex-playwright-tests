import { Page, expect } from "@playwright/test";
import { Given, Then, Fixture } from "playwright-bdd/decorators";
import { DataTable } from "playwright-bdd";
import { HumanSpaceflightPage } from "../../../../services/ui/HumanSpaceflightPage";
import {
  parseHeadingExpectations,
  parseLandmarkExpectations,
} from "../../../../utils/types/TypeGuards";
import { AssertionHelper } from "../../../../utils/AssertionHelper";

@Fixture("structuralAccessibilitySteps")
export class StructuralAccessibilitySteps {
  constructor(
    private page: Page,
    private humanSpaceflightPage: HumanSpaceflightPage,
    private assertionHelper: AssertionHelper
  ) {}

  @Given("I am on the SpaceX Human Spaceflight homepage")
  async openHumanSpaceflightHomepage(): Promise<void> {
    await this.humanSpaceflightPage.navigate();
    await this.page.waitForLoadState("networkidle");
  }

  @Then("the page heading structure should be correct:")
  async checkHeadingStructure(dataTable: DataTable) {
    const expectedHeadings = parseHeadingExpectations(dataTable.hashes());
    const [actualCounts, h1Text] = await Promise.all([
      this.humanSpaceflightPage.accessibility.getHeadingCounts(),
      this.humanSpaceflightPage.accessibility.getH1Text(),
    ]);

    for (const row of expectedHeadings) {
      const level = row.Level.toUpperCase();
      const expectedContent = row.Content;
      const minCount = parseInt(row.Count.replace("+", ""), 10);

      await this.validateHeadingStructure(
        level,
        expectedContent,
        minCount,
        actualCounts,
        h1Text
      );
    }
  }

  private async validateHeadingStructure(
    level: string,
    expectedContent: string,
    minCount: number,
    actualCounts: any,
    h1Text: string | null
  ): Promise<void> {
    if (level === "H1") {
      expect(actualCounts.H1, "The page must have exactly one H1 tag").toBe(1);
      expect(h1Text?.toUpperCase()).toContain(expectedContent.toUpperCase());
    } else if (level === "H2") {
      expect(actualCounts.H2).toBeGreaterThanOrEqual(minCount);
    }
  }

  @Then("all headings should be properly nested")
  async checkHeadingNesting() {
    await this.assertionHelper.validateBooleanCheck(
      () => this.humanSpaceflightPage.accessibility.checkHeadingHierarchy(),
      "Heading hierarchy is not properly nested"
    );
  }

  @Then("each major section should have a descriptive heading")
  async checkSectionHeadings() {
    await this.assertionHelper.validateBooleanCheck(
      () => this.humanSpaceflightPage.accessibility.hasSectionHeadings(),
      "The page should have a sufficient number of H2/H3 tags for sections"
    );
  }

  @Then("the page should have the following landmarks:")
  async checkLandmarks(dataTable: DataTable) {
    const expectedLandmarks = parseLandmarkExpectations(dataTable.hashes());

    for (const row of expectedLandmarks) {
      const tag = row.Type.toLowerCase();
      const count =
        await this.humanSpaceflightPage.accessibility.getLandmarkCount(
          tag as any
        );
      expect(
        count,
        `The page must have a visible <${tag}> landmark`
      ).toBeGreaterThanOrEqual(1);
    }
  }

  @Then("each landmark should have appropriate ARIA roles")
  async checkAriaRoles() {
    const mainCount =
      await this.humanSpaceflightPage.accessibility.getLandmarkCount(
        "main",
        "main"
      );
    expect(
      mainCount,
      "The <main> element should either be present or a container should have role='main'"
    ).toBeGreaterThanOrEqual(1);
  }

  @Then("the page should have a logical tab order")
  async checkLogicalTabOrder() {
    const isLogical = await this.page.evaluate(() => {
      const focusableElements = Array.from(
        document.querySelectorAll(
          'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
        )
      );

      const viewportRects = focusableElements.map((el) => {
        const rect = el.getBoundingClientRect();
        return {
          element: el,
          top: rect.top,
          left: rect.left,
        };
      });

      const sortedByPosition = viewportRects.sort((a, b) => {
        if (Math.abs(a.top - b.top) < 10) {
          return a.left - b.left;
        }
        return a.top - b.top;
      });

      const tabIndexes = sortedByPosition.map((item) =>
        item.element.hasAttribute("tabindex")
          ? parseInt(item.element.getAttribute("tabindex")!)
          : 0
      );

      return tabIndexes.every(
        (index, i, arr) => i === 0 || index >= arr[i - 1]
      );
    });

    expect(isLogical, "Page should have a logical tab order").toBeTruthy();
  }

  @Then("the page should have a descriptive title")
  async checkPageTitle() {
    const pageTitle = await this.page.title();
    expect(
      pageTitle.length,
      "Page title should be descriptive and not empty"
    ).toBeGreaterThan(0);
    expect(pageTitle).not.toMatch(/untitled/i);
  }

  @Then("the page language should be specified")
  async checkPageLanguage() {
    const htmlLang = await this.page.getAttribute("html", "lang");
    expect(htmlLang, "Page language should be specified").toBeTruthy();
  }

  @Then("the page should have a skip link")
  async checkSkipLink() {
    const skipLink = await this.page.$('a[href*="#main"], a[href*="#content"]');
    expect(skipLink, "Page should have a skip link").toBeTruthy();

    if (skipLink) {
      const isVisible = await skipLink.isVisible();
      expect(
        isVisible,
        "Skip link should be visible or focusable"
      ).toBeTruthy();
    }
  }

  @Then("all content should be contained within landmarks")
  async checkContentInLandmarks() {
    const hasUncontainedContent = await this.page.evaluate(() => {
      const landmarks = document.querySelectorAll(
        '[role="banner"], [role="main"], [role="contentinfo"], [role="navigation"], [role="complementary"], [role="search"], main, header, footer, nav, aside'
      );

      const landmarkAreas: Element[] = [];
      landmarks.forEach((landmark) => landmarkAreas.push(landmark));

      const allElements = document.querySelectorAll("body > *");
      const uncontainedElements = Array.from(allElements).filter((element) => {
        return !landmarkAreas.some((landmark) => landmark.contains(element));
      });

      return uncontainedElements.length > 0;
    });

    expect(
      hasUncontainedContent,
      "All content should be contained within appropriate landmarks"
    ).toBeFalsy();
  }

  @Then("the page should maintain proper reading order")
  async checkReadingOrder() {
    const isLogical = await this.page.evaluate(() => {
      const headings = Array.from(
        document.querySelectorAll("h1, h2, h3, h4, h5, h6")
      );
      let previousLevel = 0;

      for (const heading of headings) {
        const currentLevel = parseInt(heading.tagName.substring(1));
        if (currentLevel > previousLevel + 1) {
          return false;
        }
        previousLevel = currentLevel;
      }

      const visuallyOrdered = Array.from(
        document.querySelectorAll('div, p, span, [class*="container"]')
      ).every((element) => {
        const style = window.getComputedStyle(element);
        return (
          !style.display.includes("flex") ||
          style.flexDirection === "row" ||
          style.flexDirection === "column"
        );
      });

      return visuallyOrdered;
    });

    expect(
      isLogical,
      "Page should maintain proper reading and visual order"
    ).toBeTruthy();
  }

  @Then("the page should have proper semantic structure")
  async checkSemanticStructure() {
    const hasProperStructure = await this.page.evaluate(() => {
      const hasHeader = document.querySelector("header, [role='banner']");
      const hasMain = document.querySelector("main, [role='main']");
      const hasFooter = document.querySelector("footer, [role='contentinfo']");
      const hasNavigation = document.querySelector("nav, [role='navigation']");

      return !!(hasHeader && hasMain && hasFooter && hasNavigation);
    });

    expect(
      hasProperStructure,
      "Page should have proper semantic structure with header, main, footer, and navigation"
    ).toBeTruthy();
  }
}
