import { Page, expect } from "@playwright/test";
import { Then, Fixture } from "playwright-bdd/decorators";
import { DataTable } from "playwright-bdd";
import { HumanSpaceflightPage } from "../../../pages/ui/HumanSpaceflightPage";
import {
  PerformanceMetricStrategy,
  RequirementMetric,
  MetadataStrategy,
  MetadataItem,
  BoundingBox,
} from "../../../utils/types/Types";
import {
  parsePerformanceMetrics,
  parseMetadataItems,
} from "../../../utils/types/TypeGuards";
import { ViewportUtility } from "../../../utils/ViewportUtility";

@Fixture("humanSpaceflightPerformanceSteps")
export class HumanSpaceflightPerformanceSteps {
  constructor(
    private page: Page,
    private humanSpaceflightPage: HumanSpaceflightPage,
    private viewportUtility: ViewportUtility
  ) {}

  @Then("the page should meet the following metrics:")
  async checkPerformanceMetrics(dataTable: DataTable) {
    const metrics = parsePerformanceMetrics(dataTable.hashes());
    await this.validatePerformanceMetrics(metrics);
  }

  private async validatePerformanceMetrics(
    metrics: RequirementMetric[]
  ): Promise<void> {
    for (const metric of metrics) {
      await this.validatePerformanceMetric(metric);
    }
  }

  private async validatePerformanceMetric(
    metric: RequirementMetric
  ): Promise<void> {
    const strategy = this.getPerformanceMetricStrategy(metric.Metric);
    if (strategy) {
      await strategy.validate(metric);
    } else {
      console.warn(`Unknown performance metric: ${metric.Metric}`);
    }
  }

  private getPerformanceMetricStrategy(
    metric: string
  ): PerformanceMetricStrategy | undefined {
    const strategies = new Map([
      ["Largest Contentful Paint", this.createLCPValidationStrategy()],
      ["First Input Delay", this.createFIDValidationStrategy()],
      ["Console Errors", this.createConsoleErrorsValidationStrategy()],
      ["Image Loading", this.createImageLoadingValidationStrategy()],
    ]);
    return strategies.get(metric);
  }

  private createLCPValidationStrategy(): {
    validate: (metric: RequirementMetric) => Promise<void>;
  } {
    return {
      validate: async (metric: RequirementMetric) => {
        this.validateLCP(metric.Requirement);
      },
    };
  }

  private createFIDValidationStrategy(): {
    validate: (metric: RequirementMetric) => Promise<void>;
  } {
    return {
      validate: async (metric: RequirementMetric) => {
        this.validateFID(metric.Requirement);
      },
    };
  }

  private createConsoleErrorsValidationStrategy(): {
    validate: (metric: RequirementMetric) => Promise<void>;
  } {
    return {
      validate: async (_metric: RequirementMetric) => {
        await this.validateConsoleErrors();
      },
    };
  }

  private createImageLoadingValidationStrategy(): {
    validate: (metric: RequirementMetric) => Promise<void>;
  } {
    return {
      validate: async (_metric: RequirementMetric) => {
        await this.validateImageLoading();
      },
    };
  }

  private async validateLCP(requirement: string): Promise<void> {
    const lcp =
      await this.humanSpaceflightPage.performanceSEO.getLargestContentfulPaint();
    const maxLCP = parseInt(requirement.split(" ")[0]);
    expect(lcp, `LCP (${lcp}ms) should be under ${maxLCP}ms`).toBeLessThan(
      maxLCP
    );
  }

  private async validateFID(requirement: string): Promise<void> {
    const fid =
      await this.humanSpaceflightPage.performanceSEO.getFirstInputDelay();
    const maxFID = parseInt(requirement.split(" ")[0]);
    expect(fid, `FID (${fid}ms) should be under ${maxFID}ms`).toBeLessThan(
      maxFID
    );
  }

  private async validateConsoleErrors(): Promise<void> {
    const errors = await this.humanSpaceflightPage.getConsoleErrors();
    expect(errors, "Console should have no errors").toEqual([]);
  }

  private async validateImageLoading(): Promise<void> {
    const has404s =
      await this.humanSpaceflightPage.performanceSEO.checkImageLoading404s();
    expect(has404s, "No image 404 errors should be present").toBeFalsy();
  }

  @Then("the page should have the following metadata:")
  async checkMetadata(dataTable: DataTable) {
    const metadata = parseMetadataItems(dataTable.hashes());
    await this.validateMetadataItems(metadata);
  }

  private async validateMetadataItems(metadata: MetadataItem[]): Promise<void> {
    for (const item of metadata) {
      await this.validateMetadataItem(item);
    }
  }

  private async validateMetadataItem(item: MetadataItem): Promise<void> {
    const strategy = this.getMetadataStrategy(item.Element);
    if (strategy) {
      await strategy.validate(item);
    } else {
      console.warn(`Unknown metadata element: ${item.Element}`);
    }
  }

  private getMetadataStrategy(element: string): MetadataStrategy | undefined {
    const strategies = new Map([
      [
        "Viewport",
        {
          validate: async (_item: MetadataItem) => this.validateViewportMeta(),
        },
      ],
      [
        "Description",
        {
          validate: (item: MetadataItem) =>
            this.validateDescriptionMeta(item.Content),
        },
      ],
      [
        "Keywords",
        {
          validate: (item: MetadataItem) =>
            this.validateKeywordsMeta(item.Content),
        },
      ],
      [
        "Open Graph",
        {
          validate: (item: MetadataItem) =>
            this.validateOpenGraphMeta(item.Content),
        },
      ],
    ]);
    return strategies.get(element);
  }

  private async validateViewportMeta(): Promise<void> {
    const viewportContent = await this.humanSpaceflightPage.getMetaTagContent(
      'name="viewport"'
    );
    expect(viewportContent).toContain("width=device-width");
    expect(viewportContent).toContain("initial-scale=1");
  }

  private async validateDescriptionMeta(
    expectedContent: string
  ): Promise<void> {
    const descContent = await this.humanSpaceflightPage.getMetaTagContent(
      'name="description"'
    );
    expect(descContent).toContain(expectedContent);
  }

  private async validateKeywordsMeta(expectedKeywords: string): Promise<void> {
    const keywordContent = await this.humanSpaceflightPage.getMetaTagContent(
      'name="keywords"'
    );
    const expectedKeywordsList = expectedKeywords
      .split(",")
      .map((k) => k.trim().toLowerCase());
    const hasKeyword = expectedKeywordsList.some((k) =>
      keywordContent?.toLowerCase().includes(k)
    );
    expect(
      hasKeyword,
      `Keywords meta tag should contain one of: ${expectedKeywords}`
    ).toBeTruthy();
  }

  private async validateOpenGraphMeta(expectedContent: string): Promise<void> {
    const ogTitle = await this.humanSpaceflightPage.getMetaTagContent(
      'property="og:title"'
    );
    expect(ogTitle).toContain(expectedContent.split(":")[1].trim());
  }

  @Then("all metadata should be properly formatted for search engines")
  async checkMetadataFormatting() {
    const [canonical, htmlLang] = await Promise.all([
      this.page.getAttribute('link[rel="canonical"]', "href"),
      this.page.getAttribute("html", "lang"),
    ]);

    expect(canonical, "Canonical URL should be present").not.toBeNull();
    expect(htmlLang, "HTML language attribute should be set").not.toBeNull();
  }

  @Then("the page should be responsive across different screen sizes")
  async checkPageResponsiveness() {
    await this.viewportUtility.checkAllViewports(async (_size: BoundingBox) => {
      const [heroVisible, headerVisible] = await Promise.all([
        this.humanSpaceflightPage.hero.isHeroSectionVisible(),
        this.humanSpaceflightPage.header.isHeaderVisible(),
      ]);

      expect(
        heroVisible && headerVisible,
        `Page should be responsive at ${_size.width}x${_size.height}`
      ).toBeTruthy();
    });
  }
}
