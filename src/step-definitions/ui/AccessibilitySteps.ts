import { Page, expect } from "@playwright/test";
import { When, Then, Fixture } from "playwright-bdd/decorators";
import { DataTable } from "playwright-bdd";
import { HumanSpaceflightPage } from "../../pages/ui/HumanSpaceflightPage";

@Fixture("accessibilitySteps")
export class AccessibilitySteps {
  constructor(
    private page: Page,
    private humanSpaceflightPage: HumanSpaceflightPage
  ) {}

  @Then("the page heading structure should be correct:")
  async checkHeadingStructure(dataTable: DataTable) {
    const expectedHeadings = dataTable.hashes();
    const actualCounts =
      await this.humanSpaceflightPage.accessibility.getHeadingCounts();
    const h1Text =
      await this.humanSpaceflightPage.accessibility.getH1Text();

    for (const row of expectedHeadings) {
      const level = row.Level.toUpperCase();
      const expectedContent = row.Content;
      const minCount = parseInt(row.Count.replace("+", ""), 10);

      if (level === "H1") {
        expect(
          actualCounts.H1,
          "The page must have exactly one H1 tag"
        ).toBe(1);
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
  }

  @Then("all headings should be properly nested")
  async checkHeadingNesting() {
    const isNested =
      await this.humanSpaceflightPage.accessibility.checkHeadingHierarchy();
    expect(
      isNested,
      "Heading hierarchy is not properly nested (e.g., skipped a level: H1 -> H3)"
    ).toBe(true);
  }

  @Then("each major section should have a descriptive heading")
  async checkSectionHeadings() {
    const hasHeadings =
      await this.humanSpaceflightPage.accessibility.hasSectionHeadings();
    expect(
      hasHeadings,
      "The page should have a sufficient number of H2/H3 tags for sections"
    ).toBe(true);
  }

  @Then("the page should have the following landmarks:")
  async checkLandmarks(dataTable: DataTable) {
    const expectedLandmarks = dataTable.hashes();
    for (const row of expectedLandmarks) {
      const tag = row.Type.toLowerCase();
      const count = await this.humanSpaceflightPage.accessibility.getLandmarkCount(
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
      await this.humanSpaceflightPage.accessibility.getLandmarkCount("main", "main");
    expect(
      mainCount,
      "The <main> element should either be present or a container should have role='main'"
    ).toBeGreaterThanOrEqual(1);
  }

  @Then("each {word} should:")
  async checkKeyboardAccessibility(elementType: string, dataTable: DataTable) {
    let selector: string;
    switch (elementType.toLowerCase()) {
      case "link":
        selector = "a:visible";
        break;
      case "button":
        selector = "button:visible";
        break;
      case "input":
        selector = "input:visible, textarea:visible, select:visible";
        break;
      default:
        throw new Error(`Unsupported element type for accessibility check: ${elementType}`);
    }

    const checks =
      await this.humanSpaceflightPage.accessibility.checkKeyboardAccessibility(
        selector
      );

    const requirements = dataTable.hashes().map((h) => h.Requirement);

    if (requirements.includes("Be keyboard focusable")) {
      expect(
        checks.isFocusable,
        `${elementType}s must be keyboard focusable (tabindex > -1)`
      ).toBe(true);
    }
    if (requirements.includes("Be keyboard operable")) {
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
    const results =
      await this.humanSpaceflightPage.accessibility.checkKeyboardAccessibility(
        "a:visible, button:visible"
      );
    expect(
      results.hasFocusIndicator,
      "Interactive elements must show a visible focus indicator"
    ).toBe(true);
  }

  @Then("the color contrast ratio should be at least {float}:{int} for normal text")
  async checkContrast(ratio: number) {
    const hasMinContrast =
      await this.humanSpaceflightPage.accessibility.checkMinimumColorContrast(
        ratio
      );
    expect(
      hasMinContrast,
      `Color contrast should meet the minimum ratio of ${ratio}:1`
    ).toBe(true);
  }

  @Then("all links should be distinguishable without relying on color alone")
  async checkLinkDistinguishability() {
    const hasUnderlines = await this.page.locator('a:not(:has(img))').first().evaluate((el) => {
        return window.getComputedStyle(el).textDecorationLine.includes('underline');
    });

    expect(
      hasUnderlines,
      "Links should be underlined or have another non-color visual cue for non-image links."
    ).toBe(true);
  }

  @Then("images should have appropriate text alternatives:")
  async checkImageAlternatives(dataTable: DataTable) {
    const results = await this.humanSpaceflightPage.accessibility.checkImageAccessibility();

    expect(
        results.missingAltCount,
        `Found ${results.missingAltCount} visible images missing an 'alt' attribute.`
    ).toBe(0);
  }

  @Then("{word} content should be fully accessible:")
  async checkMediaAccessiblity(mediaType: "video" | "audio", dataTable: DataTable) {
    const results = await this.humanSpaceflightPage.accessibility.checkMediaFeatures(mediaType);
    const requirements = dataTable.hashes().map((h) => h.Requirement);

    if (requirements.includes("Controls available")) {
        expect(
            results.hasControls,
            `${mediaType} element must have visible controls.`
        ).toBe(true);
    }
    
    if (requirements.includes("Captions/Transcripts")) {
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
    const requirements = dataTable.hashes().map((h) => h.Requirement);

    if (requirements.includes("No Auto-advance")) {
      expect(
        results.noAutoAdvance,
        "Carousels/Sliders should not auto-advance."
      ).toBe(true);
    }
    if (requirements.includes("Disabled")) {
      expect(
        results.noParallax,
        "Parallax scrolling should be disabled or absent."
      ).toBe(true);
    }
  }

  @Then("no content should flash more than {int} times/second")
  async checkFlashingContent() {
    const isSafe =
      await this.humanSpaceflightPage.accessibility.checkFlashingContent();
    expect(
      isSafe,
      "Content should not flash/blink aggressively (WCAG 2.3.1)."
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
    const requirements = dataTable.hashes().map((h) => h.Requirement);

    if (requirements.includes("Error Messages")) {
      expect(
        results.errorMessagesPresent,
        "Clear, descriptive error messages should be visible after invalid submission."
      ).toBe(true);
    }
  }

  @Then("updates should be properly announced")
  async checkUpdatesAnnounced() {
    const isAriaLiveUsed =
      await this.humanSpaceflightPage.accessibility.isAriaLiveRegionUsed();
    expect(
      isAriaLiveUsed,
      "Dynamic content updates must be in an aria-live region to be announced"
    ).toBe(true);
  }

  @Then("ARIA live regions should be appropriately used")
  async checkAriaLiveRegionUsage() {
    const isAriaLiveUsed =
      await this.humanSpaceflightPage.accessibility.isAriaLiveRegionUsed();
    expect(
      isAriaLiveUsed,
      "ARIA live regions (polite/assertive) must be used for dynamic content"
    ).toBe(true);
  }

  @Then("language attributes should be correctly set:")
  async checkLangAttribute(dataTable: DataTable) {
    const expectedLang = dataTable.hashes().find((h) => h.Element === "HTML tag")?.Value;
    if (expectedLang) {
        const actualLang = await this.humanSpaceflightPage.accessibility.getHtmlLangAttribute();
        expect(
            actualLang,
            `The <html> 'lang' attribute should be set to "${expectedLang}"`
        ).toBe(expectedLang);
    }
  }

  @Then("screen readers should use correct pronunciation")
  async checkPronunciation() {
    const lang = await this.humanSpaceflightPage.accessibility.getHtmlLangAttribute();
    expect(
        lang,
        "Language must be set for screen readers to use correct pronunciation."
    ).not.toBeNull();
  }
}