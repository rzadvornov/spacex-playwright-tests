import { Page, expect } from "@playwright/test";
import { DataTable } from "playwright-bdd";
import { Then, Fixture } from "playwright-bdd/decorators";
import { HumanSpaceflightPage } from "../../../../pages/ui/HumanSpaceflightPage";
import { UniquenessCheck, HeadingInfo } from "../../../../utils/types/Types";

@Fixture("contentSeoSteps")
export class ContentSeoSteps {
  private readonly PERFORMANCE_THRESHOLDS = {
    MAX_HEADING_LEVEL_SKIP: 1,
  } as const;

  constructor(
    private page: Page,
    private humanSpaceflightPage: HumanSpaceflightPage
  ) {}

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
