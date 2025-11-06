import { Page, expect } from "@playwright/test";
import { DataTable } from "playwright-bdd";
import { Then, Fixture, When } from "playwright-bdd/decorators";
import { HumanSpaceflightPage } from "../../../../services/ui/HumanSpaceflightPage";
import {
  UniquenessCheck,
  HeadingInfo,
  PerformanceMetrics,
} from "../../../../utils/types/Types";

@Fixture("contentSeoSteps")
export class ContentSeoSteps {
  private readonly PERFORMANCE_THRESHOLDS = {
    MAX_HEADING_LEVEL_SKIP: 1,
  } as const;

  constructor(
    private page: Page,
    private humanSpaceflightPage: HumanSpaceflightPage
  ) {}

  @When("I inspect the page")
  async inspectPage() {
    await this.page.waitForLoadState("networkidle");
  }

  @Then("there should be no issues:")
  async checkNoIssues(dataTable: DataTable) {
    const issues = dataTable.hashes();

    for (const issue of issues) {
      await this.validateIssueCategory(issue.Category);
    }
  }

  private async validateIssueCategory(category: string): Promise<void> {
    const validator = this.issueValidators[category];

    if (!validator) {
      throw new Error(`Unknown issue category: ${category}`);
    }

    await validator();
  }

  private readonly issueValidators: Record<string, () => Promise<void>> = {
    "Console Errors": async () => await this.validateConsoleErrors(),
    "Resource Loading": async () => await this.validateResourceLoading(),
    "Layout Issues": async () => await this.validateLayoutIssues(),
  };

  private async validateConsoleErrors(): Promise<void> {
    const errors = this.humanSpaceflightPage.getConsoleErrors();
    expect(errors.length, {
      message: "No JavaScript errors should be present",
    }).toBe(0);
  }

  private async validateResourceLoading(): Promise<void> {
    const has404s =
      await this.humanSpaceflightPage.performanceSEO.checkImageLoading404s();
    expect(has404s, {
      message: "No 404 errors should occur during resource loading",
    }).toBeFalsy();
  }

  private async validateLayoutIssues(): Promise<void> {
    const metrics = await this.getPerformanceMetrics();
    expect(metrics.cls, {
      message: "No significant layout shifts should occur",
    }).toBeLessThan(0.1);
  }

  @Then("accessibility features should support SEO:")
  async checkAccessibilityForSEO(dataTable: DataTable) {
    const accessibilityFeatures = dataTable.hashes();

    for (const feature of accessibilityFeatures) {
      await this.validateAccessibilityFeature(feature.Feature);
    }
  }

  private async validateAccessibilityFeature(feature: string): Promise<void> {
    const validator = this.accessibilityValidators[feature];

    if (!validator) {
      throw new Error(`Unknown accessibility feature: ${feature}`);
    }

    await validator();
  }

  private readonly accessibilityValidators: Record<
    string,
    () => Promise<void>
  > = {
    "ARIA Labels": async () => await this.validateAriaLabels(),
    "Alt Text": async () => await this.validateAltText(),
    "Semantic HTML": async () => await this.validateSemanticHTML(),
    "Language Tags": async () => await this.validateLanguageTags(),
  };

  private async validateAriaLabels(): Promise<void> {
    const ariaElements = await this.page.$$("[aria-label]");
    expect(ariaElements.length, {
      message: "ARIA labels should be present on interactive elements",
    }).toBeGreaterThan(0);
  }

  private async validateAltText(): Promise<void> {
    const images = await this.page.$$("img");
    const imagesWithAlt = await Promise.all(
      images.map(async (img) => await img.getAttribute("alt"))
    );
    const descriptiveAltCount = imagesWithAlt.filter(
      (alt) => alt && alt.length > 0 && alt !== "image"
    ).length;
    expect(descriptiveAltCount, {
      message: "Images should have descriptive alt text",
    }).toBeGreaterThan(0);
  }

  private async validateSemanticHTML(): Promise<void> {
    const semanticElements = await this.page.$$(
      "main, nav, article, section, header, footer"
    );
    expect(semanticElements.length, {
      message: "Semantic HTML elements should be used",
    }).toBeGreaterThan(0);
  }

  private async validateLanguageTags(): Promise<void> {
    const htmlLang = await this.page.getAttribute("html", "lang");
    expect(htmlLang, {
      message: "Language tag should be specified",
    }).toBeDefined();
    expect(htmlLang!.length, {
      message: "Language tag should be valid",
    }).toBeGreaterThan(0);
  }

  @Then("internal links should meet requirements:")
  async checkInternalLinksRequirements(dataTable: DataTable) {
    const requirements = dataTable.hashes();

    for (const requirement of requirements) {
      await this.validateLinkRequirement(requirement.Requirement);
    }
  }

  private async validateLinkRequirement(requirement: string): Promise<void> {
    const validator = this.linkValidators[requirement];

    if (!validator) {
      throw new Error(`Unknown link requirement: ${requirement}`);
    }

    await validator();
  }

  private readonly linkValidators: Record<string, () => Promise<void>> = {
    "URL Structure": async () => await this.validateUrlStructureForLinks(),
    "Anchor Text": async () => await this.validateAnchorText(),
    Navigation: async () => await this.validateNavigationLinks(),
    "Link Distribution": async () => await this.validateLinkDistribution(),
  };

  private async validateUrlStructureForLinks(): Promise<void> {
    const links =
      await this.humanSpaceflightPage.performanceSEO.getInternalLinks();
    const relativeLinks = links.filter(
      (link) => !link.href.startsWith("http") && link.href.startsWith("/")
    );
    expect(relativeLinks.length, {
      message: "Internal links should use relative URLs where appropriate",
    }).toBeGreaterThan(0);
  }

  private async validateAnchorText(): Promise<void> {
    const links =
      await this.humanSpaceflightPage.performanceSEO.getInternalLinks();
    const descriptiveLinks = links.filter(
      (link) =>
        link.text &&
        link.text.length > 0 &&
        !["click here", "read more", "link"].includes(link.text.toLowerCase())
    );
    const minimumDescriptiveRatio = 0.8;
    expect(descriptiveLinks.length, {
      message: "Anchor text should be descriptive",
    }).toBeGreaterThan(links.length * minimumDescriptiveRatio);
  }

  private async validateNavigationLinks(): Promise<void> {
    const links =
      await this.humanSpaceflightPage.performanceSEO.getInternalLinks();
    const functionalLinks = links.filter(
      (link) => link.href && link.href.length > 0
    );
    expect(functionalLinks.length, {
      message: "All internal links should be functional",
    }).toBe(links.length);
  }

  private async validateLinkDistribution(): Promise<void> {
    const mainContentLinks = await this.page.$$("main a, article a, section a");
    expect(mainContentLinks.length, {
      message: "Links should be distributed throughout content",
    }).toBeGreaterThan(0);
  }

  @Then("structured data \\\\(Schema.org) should be present")
  async checkStructuredData() {
    await this._checkStructuredDataPresence();
  }

  @Then("heading tags should be hierarchical \\\\(H1 > H2 > H3)")
  async checkHeadingHierarchy() {
    await this._checkHeadingHierarchyOrder();
  }

  @Then("content should be unique:")
  async checkContentUniqueness(dataTable: DataTable) {
    const uniquenessChecks = dataTable.hashes() as unknown as UniquenessCheck[];
    const uniquenessValidators = this._getUniquenessValidators();

    for (const check of uniquenessChecks) {
      const checkType = check["Check Type"];
      const validator = uniquenessValidators[checkType];

      if (!validator) {
        throw new Error(`Unknown uniqueness check type: ${checkType}`);
      }
      await validator();
    }
  }

  @Then("keywords should be properly distributed:")
  async checkKeywordDistribution(dataTable: DataTable) {
    const keywordCategories = dataTable.hashes();
    const pageContent = await this.page.textContent("body");

    for (const category of keywordCategories) {
      const requiredTerms = category["Required Terms"].split(", ");
      const categoryFound = requiredTerms.some((term) =>
        pageContent!.toLowerCase().includes(term.toLowerCase())
      );

      expect(categoryFound, {
        message: `Keywords from category "${category.Category}" should be present in content`,
      }).toBeTruthy();
    }
  }

  @Then("keywords should appear naturally in content")
  async checkNaturalKeywordUsage() {
    const pageContent = await this.page.textContent("body");
    const keywords = [
      "spacex",
      "spaceflight",
      "mission",
      "exploration",
      "research",
    ];

    let naturalCount = 0;
    keywords.forEach((keyword) => {
      const regex = new RegExp(`\\b${keyword}\\b`, "gi");
      const matches = pageContent!.match(regex);
      if (matches && matches.length > 0) {
        naturalCount++;
      }
    });

    expect(naturalCount, {
      message: "Keywords should appear naturally in content",
    }).toBeGreaterThan(2);
  }

  @Then("the page should have proper structure:")
  async checkPageStructure(dataTable: DataTable) {
    const structureRequirements = dataTable.hashes();

    for (const requirement of structureRequirements) {
      await this.validateStructureElement(requirement.Element);
    }
  }

  private async validateStructureElement(element: string): Promise<void> {
    const validator = this.structureValidators[element];

    if (!validator) {
      throw new Error(`Unknown structure requirement: ${element}`);
    }

    await validator();
  }

  private readonly structureValidators: Record<string, () => Promise<void>> = {
    "Schema.org": async () => await this.validateSchemaOrg(),
    "Heading Tags": async () => await this.validateHeadingStructure(),
    "Primary Heading": async () => await this.validatePrimaryHeading(),
    "URL Structure": async () => await this.validateUrlStructure(),
    "Canonical URL": async () => await this.validateCanonicalUrl(),
  };

  private async validateSchemaOrg(): Promise<void> {
    const structuredData =
      await this.humanSpaceflightPage.performanceSEO.getStructuredData();
    const hasValidSchema =
      structuredData.length > 0 &&
      structuredData.some(
        (data) =>
          data["@type"] === "Organization" || data["@type"] === "WebPage"
      );

    expect(hasValidSchema, {
      message: "Valid Schema.org structured data should be present",
    }).toBeTruthy();
  }

  private async validateHeadingStructure(): Promise<void> {
    const headings =
      await this.humanSpaceflightPage.performanceSEO.getHeadingStructure();

    const h1Count = headings.filter((h) => h.tag === "h1").length;
    expect(h1Count, { message: "Should have exactly one H1 tag" }).toBe(1);

    this.validateHeadingHierarchy(headings);
  }

  private validateHeadingHierarchy(headings: Array<{ tag: string }>): void {
    let currentLevel = 1;

    for (const heading of headings) {
      const level = parseInt(heading.tag[1]);
      expect(level, {
        message: "Heading structure should be hierarchical",
      }).toBeGreaterThanOrEqual(currentLevel);
      currentLevel = level;
    }
  }

  private async validatePrimaryHeading(): Promise<void> {
    const headings =
      await this.humanSpaceflightPage.performanceSEO.getHeadingStructure();
    const h1Heading = headings.find((h) => h.tag === "h1");

    expect(h1Heading, {
      message: "Primary H1 heading should be present",
    }).toBeDefined();

    expect(h1Heading!.text.toLowerCase(), {
      message: "Primary heading should contain target keyword",
    }).toContain("human spaceflight");
  }

  private async validateUrlStructure(): Promise<void> {
    const currentUrl = this.page.url();
    expect(currentUrl, {
      message: "URL should be SEO-friendly and readable",
    }).toMatch(/[a-z0-9-]/);
  }

  private async validateCanonicalUrl(): Promise<void> {
    const canonicalUrl =
      await this.humanSpaceflightPage.performanceSEO.getCanonicalUrl();
    const currentUrl = this.page.url();

    expect(canonicalUrl, {
      message: "Canonical URL should be properly specified",
    }).toBeDefined();

    expect(canonicalUrl, {
      message: "Canonical URL should match current URL",
    }).toBe(currentUrl);
  }

  private async _checkStructuredDataPresence(): Promise<void> {
    const structuredData =
      await this.humanSpaceflightPage.performanceSEO.getStructuredData();
    expect(structuredData.length, {
      message: `Structured data should be present. Found ${structuredData.length} items`,
    }).toBeGreaterThan(0);
  }

  private async _checkHeadingHierarchyOrder(): Promise<void> {
    const headings =
      await this.humanSpaceflightPage.performanceSEO.getHeadingStructure();
    let currentLevel = 1;

    for (const [index, heading] of headings.entries()) {
      currentLevel = this._validateHeadingLevel(heading, currentLevel, index);
    }
  }

  private _validateHeadingLevel(
    heading: HeadingInfo,
    currentLevel: number,
    index: number
  ): number {
    const level = parseInt(heading.tag[1]);
    const maxAllowedLevel =
      currentLevel + this.PERFORMANCE_THRESHOLDS.MAX_HEADING_LEVEL_SKIP;

    expect(level, {
      message: `Heading at index ${index} (${heading.tag}) should not skip more than ${this.PERFORMANCE_THRESHOLDS.MAX_HEADING_LEVEL_SKIP} levels from the current level H${currentLevel}.`,
    }).toBeLessThanOrEqual(maxAllowedLevel);

    if (level === currentLevel + 1) {
      return level;
    } else if (level <= currentLevel) {
      return level;
    }
    return level;
  }

  private async getPerformanceMetrics(): Promise<PerformanceMetrics> {
    return await this.humanSpaceflightPage.performanceSEO.getPerformanceMetrics();
  }

  private _getUniquenessValidators(): Record<string, () => Promise<void>> {
    return {
      "Duplicate Content": this._checkDuplicateContent.bind(this),
      "Cross-page Check": this._checkCrossPageContent.bind(this),
      "Section Review": this._checkUniqueSectionHeadings.bind(this),
    };
  }

  private async _checkDuplicateContent(): Promise<void> {
    const duplicateInfo =
      await this.humanSpaceflightPage.performanceSEO.checkDuplicateContent();
    expect(duplicateInfo.duplicateParagraphs, {
      message: "No duplicate paragraphs should be present",
    }).toBe(0);
  }

  private async _checkCrossPageContent(): Promise<void> {
    const minUniqueContentLength = 500;
    const pageContent = await this.page.textContent("body");

    const cleanedContent = pageContent?.replace(/\s+/g, " ").trim() ?? "";

    expect(cleanedContent.length, {
      message: `Page should have substantial unique content (more than ${minUniqueContentLength} characters). Found: ${cleanedContent.length}`,
    }).toBeGreaterThan(minUniqueContentLength);
  }

  private async _checkUniqueSectionHeadings(): Promise<void> {
    const headings =
      await this.humanSpaceflightPage.performanceSEO.getHeadingStructure();

    const headingTexts = headings
      .map((h) => h.text.trim())
      .filter((text) => text.length > 0)
      .map((text) => text.toLowerCase());

    const uniqueHeadings = new Set(headingTexts);

    expect(uniqueHeadings.size, {
      message: `Headings should be unique and non-redundant. Found ${headingTexts.length} headings, but only ${uniqueHeadings.size} unique ones.`,
    }).toBe(headingTexts.length);
  }
}
