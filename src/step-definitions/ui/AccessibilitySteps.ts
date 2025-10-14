import { Page, expect } from "@playwright/test";
import { When, Then, Fixture } from "playwright-bdd/decorators";
import { DataTable } from "playwright-bdd";
import { HumanSpaceflightPage } from "../../pages/ui/HumanSpaceflightPage";
import { Requirement } from "../../pages/types/Types";
import {
  parseAccessibilityRequirements,
  parseHeadingExpectations,
  parseLandmarkExpectations,
} from "../../pages/types/TypeGuards";
import { AssertionHelper } from "../../utils/AssertionHelper";

@Fixture("accessibilitySteps")
export class AccessibilitySteps {
  private readonly ELEMENT_SELECTORS = {
    LINK: "a:visible",
    BUTTON: "button:visible",
    INPUT: "input:visible, textarea:visible, select:visible",
    INTERACTIVE: "a:visible, button:visible",
    NON_IMAGE_LINKS: "a:not(:has(img))",
  } as const;

  constructor(
    private page: Page,
    private humanSpaceflightPage: HumanSpaceflightPage,
    private assertionHelper: AssertionHelper
  ) {}

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
      expect(
        h1Text?.toUpperCase(),
        `H1 text should contain "${expectedContent.toUpperCase()}"`
      ).toContain(expectedContent.toUpperCase());
    } else if (level === "H2") {
      expect(
        actualCounts.H2,
        `The page should have at least ${minCount} H2 tags`
      ).toBeGreaterThanOrEqual(minCount);
    }
  }

  @Then("all headings should be properly nested")
  async checkHeadingNesting() {
    await this.assertionHelper.validateBooleanCheck(
      () => this.humanSpaceflightPage.accessibility.checkHeadingHierarchy(),
      "Heading hierarchy is not properly nested (e.g., skipped a level: H1 -> H3)"
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

  @Then("each {word} should:")
  async checkKeyboardAccessibility(elementType: string, dataTable: DataTable) {
    const selector = this.getElementSelector(elementType);
    const requirements = parseAccessibilityRequirements(dataTable.hashes());
    const checks =
      await this.humanSpaceflightPage.accessibility.checkKeyboardAccessibility(
        selector
      );

    this.validateKeyboardAccessibility(checks, elementType, requirements);
  }

  private getElementSelector(elementType: string): string {
    const normalizedType = elementType.toLowerCase();

    switch (normalizedType) {
      case "link":
        return this.ELEMENT_SELECTORS.LINK;
      case "button":
        return this.ELEMENT_SELECTORS.BUTTON;
      case "input":
        return this.ELEMENT_SELECTORS.INPUT;
      default:
        throw new Error(
          `Unsupported element type for accessibility check: ${elementType}`
        );
    }
  }

  private validateKeyboardAccessibility(
    checks: any,
    elementType: string,
    requirements: Requirement[]
  ): void {
    const requirementMap = new Map(
      requirements.map((req) => [req.Requirement, true])
    );

    if (requirementMap.has("Be keyboard focusable")) {
      expect(
        checks.isFocusable,
        `${elementType}s must be keyboard focusable (tabindex > -1)`
      ).toBe(true);
    }

    if (requirementMap.has("Be keyboard operable")) {
      expect(
        checks.isOperable,
        `${elementType}s must be operable using keyboard (Enter/Space)`
      ).toBe(true);
    }
  }

  @Then("links and buttons should have descriptive text:")
  async checkDescriptiveText() {
    const results =
      await this.humanSpaceflightPage.accessibility.checkDescriptiveLinkText();
    expect(
      results.nonDescriptiveLinkCount,
      `Found ${results.nonDescriptiveLinkCount} links/buttons with non-descriptive text (e.g., 'click here')`
    ).toBe(0);
  }

  @Then("all links should have a consistent visual focus indicator")
  async checkFocusIndicator() {
    await this.assertionHelper.validateBooleanCheck(
      () =>
        this.humanSpaceflightPage.accessibility
          .checkKeyboardAccessibility(this.ELEMENT_SELECTORS.INTERACTIVE)
          .then((results) => results.hasFocusIndicator),
      "Interactive elements must show a visible focus indicator"
    );
  }

  @Then(
    "the color contrast ratio should be at least {float}:{int} for normal text"
  )
  async checkContrast(ratio: number, ratioValue: number) {
    const fullRatio = `${ratio}:${ratioValue}`;
    await this.assertionHelper.validateBooleanCheck(
      () =>
        this.humanSpaceflightPage.accessibility.checkMinimumColorContrast(
          parseFloat(fullRatio)
        ),
      `Color contrast should meet the minimum ratio of ${fullRatio}`
    );
  }

  @Then("all links should be distinguishable without relying on color alone")
  async checkLinkDistinguishability() {
    const hasUnderlines = await this.page
      .locator(this.ELEMENT_SELECTORS.NON_IMAGE_LINKS)
      .first()
      .evaluate((el) => {
        const style = window.getComputedStyle(el);
        return (
          style.textDecorationLine.includes("underline") ||
          style.textDecoration.includes("underline")
        );
      })
      .catch(() => false);

    expect(
      hasUnderlines,
      "Links should be underlined or have another non-color visual cue for non-image links."
    ).toBe(true);
  }

  @Then("images should have appropriate text alternatives:")
  async checkImageAlternatives(dataTable: DataTable) {
    const results =
      await this.humanSpaceflightPage.accessibility.checkImageAccessibility();
    expect(
      results.missingAltCount,
      `Found ${results.missingAltCount} visible images missing an 'alt' attribute.`
    ).toBe(0);
  }

  @Then("{word} content should be fully accessible:")
  async checkMediaAccessibility(
    mediaType: "video" | "audio",
    dataTable: DataTable
  ) {
    const results =
      await this.humanSpaceflightPage.accessibility.checkMediaFeatures(
        mediaType
      );
    const requirements = parseAccessibilityRequirements(dataTable.hashes());
    const requirementMap = new Map(
      requirements.map((req) => [req.Requirement, true])
    );

    if (requirementMap.has("Controls available")) {
      expect(
        results.hasControls,
        `${mediaType} element must have visible controls.`
      ).toBe(true);
    }

    if (requirementMap.has("Captions/Transcripts")) {
      expect(
        results.hasCaptions,
        `${mediaType} must provide captions (for video) or a transcript (for audio).`
      ).toBe(true);
    }
  }

  @Then("motion and animation should be controlled:")
  async checkMotionControl(dataTable: DataTable) {
    const results =
      await this.humanSpaceflightPage.accessibility.checkMotionAccessibility();
    const requirements = parseAccessibilityRequirements(dataTable.hashes());
    const requirementMap = new Map(
      requirements.map((req) => [req.Requirement, true])
    );

    if (requirementMap.has("No Auto-advance")) {
      expect(
        results.noAutoAdvance,
        "Carousels/Sliders should not auto-advance."
      ).toBe(true);
    }

    if (requirementMap.has("Disabled")) {
      expect(
        results.noParallax,
        "Parallax scrolling should be disabled or absent."
      ).toBe(true);
    }
  }

  @Then("no content should flash more than {int} times/second")
  async checkFlashingContent(maxFrequency: number) {
    const isSafe =
      await this.humanSpaceflightPage.accessibility.checkFlashingContent();
    expect(
      isSafe,
      `Content should not flash/blink more than ${maxFrequency} times per second (WCAG 2.3.1).`
    ).toBe(true);
  }

  @When("I submit a form with invalid data")
  async submitForm() {
    await this.humanSpaceflightPage.accessibility.submitFormWithInvalidData();
  }

  @Then("validation should be accessible:")
  async checkValidationAccessibility(dataTable: DataTable) {
    const results =
      await this.humanSpaceflightPage.accessibility.checkAccessibleFormValidation();
    const requirements = parseAccessibilityRequirements(dataTable.hashes());
    const requirementMap = new Map(
      requirements.map((req) => [req.Requirement, true])
    );

    if (requirementMap.has("Error Messages")) {
      expect(
        results.errorMessagesPresent,
        "Clear, descriptive error messages should be visible after invalid submission."
      ).toBe(true);
    }
  }

  @Then("updates should be properly announced")
  async checkUpdatesAnnounced() {
    await this.assertionHelper.validateBooleanCheck(
      () => this.humanSpaceflightPage.accessibility.isAriaLiveRegionUsed(),
      "Dynamic content updates must be in an aria-live region to be announced"
    );
  }

  @Then("ARIA live regions should be appropriately used")
  async checkAriaLiveRegionUsage() {
    await this.assertionHelper.validateBooleanCheck(
      () => this.humanSpaceflightPage.accessibility.isAriaLiveRegionUsed(),
      "ARIA live regions (polite/assertive) must be used for dynamic content"
    );
  }

  @Then("language attributes should be correctly set:")
  async checkLangAttribute(dataTable: DataTable) {
    const data = dataTable.hashes();
    const htmlLangRow = data.find(
      (row: Record<string, string>) => row.Element === "HTML tag"
    );

    if (htmlLangRow?.Value) {
      const actualLang =
        await this.humanSpaceflightPage.accessibility.getHtmlLangAttribute();
      expect(
        actualLang,
        `The <html> 'lang' attribute should be set to "${htmlLangRow.Value}"`
      ).toBe(htmlLangRow.Value);
    }
  }

  @Then("screen readers should use correct pronunciation")
  async checkPronunciation() {
    const lang =
      await this.humanSpaceflightPage.accessibility.getHtmlLangAttribute();
    expect(
      lang,
      "Language must be set for screen readers to use correct pronunciation."
    ).toBeTruthy();
  }
}
