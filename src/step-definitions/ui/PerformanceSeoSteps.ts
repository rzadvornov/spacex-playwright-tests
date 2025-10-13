import { Page, expect } from "@playwright/test";
import { When, Then, Fixture } from "playwright-bdd/decorators";
import { HumanSpaceflightPage } from "../../pages/ui/HumanSpaceflightPage";
import { CustomTestArgs } from "../../fixtures/BddFixtures";
import type { ImageInfo, PerformanceMetrics } from "../../pages/types/Types";

@Fixture("performanceSeoSteps")
export class PerformanceSeoSteps {
  private readonly PERFORMANCE_THRESHOLDS = {
    MAX_IMAGE_SIZE: 1_000_000, // 1MB
    MIN_COMPRESSION_RATIO: 0.8,
    MAX_LCP_STD_DEV: 1000,
    MAX_HEADING_LEVEL_SKIP: 1,
  } as const;

  constructor(
    private page: Page,
    private humanSpaceflightPage: HumanSpaceflightPage,
    private sharedContext: CustomTestArgs["sharedContext"]
  ) {}

  @Then("the Largest Contentful Paint should be less than {int} ms")
  async checkLCP(maxLCP: number) {
    const metrics = await this.getPerformanceMetrics();
    this.assertMetric(
      metrics.lcp,
      maxLCP,
      `LCP should be less than ${maxLCP}ms`
    );
  }

  @Then("the First Input Delay should be less than {int} ms")
  async checkFID(maxFID: number) {
    const metrics = await this.getPerformanceMetrics();
    this.assertMetric(
      metrics.fid,
      maxFID,
      `FID should be less than ${maxFID}ms`
    );
  }

  @Then("the Cumulative Layout Shift should be less than {float}")
  async checkCLS(maxCLS: number) {
    const metrics = await this.getPerformanceMetrics();
    this.assertMetric(metrics.cls, maxCLS, `CLS should be less than ${maxCLS}`);
  }

  @Then("the page should score at least {int} on Lighthouse performance")
  async checkLighthouseScore(minScore: number) {
    const score =
      await this.humanSpaceflightPage.performanceSEO.getLighthouseScore();
    expect(score, {
      message: `Lighthouse score should be at least ${minScore}`,
    }).toBeGreaterThanOrEqual(minScore);
  }

  @Then("the initial page load should complete within {int} seconds")
  async checkPageLoadTime(maxSeconds: number) {
    const loadTime = Date.now() - this.sharedContext.startTime;
    const maxMilliseconds = maxSeconds * 1000;
    expect(loadTime, {
      message: `Page load time should be less than ${maxSeconds} seconds`,
    }).toBeLessThan(maxMilliseconds);
  }

  @Then("the Time to First Byte should be less than {int} ms")
  async checkTTFB(maxTTFB: number) {
    const metrics = await this.getPerformanceMetrics();
    this.assertMetric(
      metrics.ttfb,
      maxTTFB,
      `TTFB should be less than ${maxTTFB}ms`
    );
  }

  @Then("the First Contentful Paint should be less than {int} ms")
  async checkFCP(maxFCP: number) {
    const metrics = await this.getPerformanceMetrics();
    this.assertMetric(
      metrics.fcp,
      maxFCP,
      `FCP should be less than ${maxFCP}ms`
    );
  }

  @Then("all images should be optimized for web")
  async checkImagesOptimized() {
    const imagesInfo = await this.getImageOptimizationInfo();

    for (const [index, img] of imagesInfo.entries()) {
      expect(img.size, {
        message: `Image at index ${index} should be less than ${this.PERFORMANCE_THRESHOLDS.MAX_IMAGE_SIZE} bytes`,
      }).toBeLessThan(this.PERFORMANCE_THRESHOLDS.MAX_IMAGE_SIZE);
    }
  }

  @Then("images should use modern formats \\(WebP, AVIF)")
  async checkModernImageFormats() {
    const imagesInfo = await this.getImageOptimizationInfo();
    const hasModernFormat = imagesInfo.some((img) => img.hasWebp);

    expect(hasModernFormat, {
      message: "At least one image should use modern formats (WebP, AVIF)",
    }).toBe(true);
  }

  @Then("images should have responsive sizes \\(srcset)")
  async checkResponsiveImages() {
    const imagesInfo = await this.getImageOptimizationInfo();
    const hasResponsive = imagesInfo.some((img) => img.hasSrcset);

    expect(hasResponsive, {
      message:
        "At least one image should have srcset attribute for responsive sizing",
    }).toBe(true);
  }

  @Then("images should load lazily when below the fold")
  async checkLazyLoading() {
    const imagesInfo = await this.getImageOptimizationInfo();
    const hasLazyLoad = imagesInfo.some((img) => img.loading === "lazy");

    expect(hasLazyLoad, {
      message: "At least one image should use lazy loading",
    }).toBe(true);
  }

  @Then("critical CSS should be inlined or loaded first")
  async checkCriticalCSS() {
    const cssResources =
      await this.humanSpaceflightPage.performanceSEO.getCSSResourcesInfo();
    const criticalCss = cssResources.find(
      (r) => r.url.includes("critical") || r.url.includes("inline")
    );

    expect(criticalCss, {
      message: "Critical CSS should be present (inlined or loaded first)",
    }).toBeDefined();
  }

  @Then("CSS should be minified")
  async checkCSSMinified() {
    const cssResources =
      await this.humanSpaceflightPage.performanceSEO.getCSSResourcesInfo();

    for (const [index, css] of cssResources.entries()) {
      const compressionRatio = css.size / css.transferSize;
      expect(compressionRatio, {
        message: `CSS resource at index ${index} should be minified (compression ratio: ${compressionRatio.toFixed(
          2
        )})`,
      }).toBeGreaterThan(this.PERFORMANCE_THRESHOLDS.MIN_COMPRESSION_RATIO);
    }
  }

  @Then("JavaScript should be minified")
  async checkJSMinified() {
    const jsResources =
      await this.humanSpaceflightPage.performanceSEO.getJavaScriptResourcesInfo();

    for (const [index, js] of jsResources.entries()) {
      const compressionRatio = js.size / js.transferSize;
      expect(compressionRatio, {
        message: `JavaScript resource at index ${index} should be minified (compression ratio: ${compressionRatio.toFixed(
          2
        )})`,
      }).toBeGreaterThan(this.PERFORMANCE_THRESHOLDS.MIN_COMPRESSION_RATIO);
    }
  }

  @When("I open the browser console")
  async openBrowserConsole() {
    // This step is for test readability only
  }

  @Then("no JavaScript errors should be present")
  async checkNoJSErrors() {
    const errors = this.humanSpaceflightPage.getConsoleErrors();
    expect(errors.length, {
      message: `No JavaScript errors should be present. Found: ${errors.length}`,
    }).toBe(0);
  }

  @Then("the meta description should be present and under {int} characters")
  async checkMetaDescription(maxLength: number) {
    const metaTags =
      await this.humanSpaceflightPage.performanceSEO.getMetaTags();
    const description = metaTags["description"];

    expect(description, {
      message: "Meta description should be present",
    }).toBeDefined();

    expect(description!.length, {
      message: `Meta description should not exceed ${maxLength} characters (current: ${
        description!.length
      })`,
    }).toBeLessThanOrEqual(maxLength);
  }

  @Then("the Open Graph title should be {string}")
  async checkOGTitle(expectedTitle: string) {
    const ogTags =
      await this.humanSpaceflightPage.performanceSEO.getOpenGraphTags();
    expect(ogTags["title"], {
      message: `Open Graph title should be "${expectedTitle}"`,
    }).toBe(expectedTitle);
  }

  @Then("structured data \\(Schema.org) should be present")
  async checkStructuredData() {
    const structuredData =
      await this.humanSpaceflightPage.performanceSEO.getStructuredData();
    expect(structuredData.length, {
      message: `Structured data should be present. Found ${structuredData.length} items`,
    }).toBeGreaterThan(0);
  }

  @Then("heading tags should be hierarchical \\(H1 > H2 > H3)")
  async checkHeadingHierarchy() {
    const headings =
      await this.humanSpaceflightPage.performanceSEO.getHeadingStructure();
    let currentLevel = 1;

    for (const [index, heading] of headings.entries()) {
      const level = parseInt(heading.tag[1]);
      const maxAllowedLevel =
        currentLevel + this.PERFORMANCE_THRESHOLDS.MAX_HEADING_LEVEL_SKIP;

      expect(level, {
        message: `Heading at index ${index} (${heading.tag}) should not skip more than ${this.PERFORMANCE_THRESHOLDS.MAX_HEADING_LEVEL_SKIP} level(s) from previous heading`,
      }).toBeLessThanOrEqual(maxAllowedLevel);

      currentLevel = level;
    }
  }

  @Then("the robots meta tag should be present")
  async checkRobotsTag() {
    const robotsContent =
      await this.humanSpaceflightPage.performanceSEO.getRobotsMetaContent();
    expect(robotsContent, {
      message: "Robots meta tag should be present",
    }).toBeDefined();
  }

  @Then("a canonical link should be present")
  async checkCanonicalLink() {
    const canonicalUrl =
      await this.humanSpaceflightPage.performanceSEO.getCanonicalUrl();
    expect(canonicalUrl, {
      message: "Canonical link should be present",
    }).toBeDefined();
  }

  @Then("all internal links should use relative URLs")
  async checkRelativeUrls() {
    const links =
      await this.humanSpaceflightPage.performanceSEO.getInternalLinks();

    for (const [index, link] of links.entries()) {
      const isAbsoluteUrl = link.href.startsWith("http");
      expect(isAbsoluteUrl, {
        message: `Internal link at index ${index} should use relative URL instead of: ${link.href}`,
      }).toBe(false);
    }
  }

  @Then("no duplicate content should be present on the page")
  async checkNoDuplicateContent() {
    const duplicateInfo =
      await this.humanSpaceflightPage.performanceSEO.checkDuplicateContent();
    expect(duplicateInfo.duplicateParagraphs, {
      message: `No duplicate paragraphs should be present. Found: ${duplicateInfo.duplicateParagraphs}`,
    }).toBe(0);
  }

  @Then("the page should be mobile-friendly")
  async checkMobileFriendly() {
    const mobileOptimization =
      await this.humanSpaceflightPage.performanceSEO.checkMobileOptimization();

    expect(mobileOptimization.textReadable, {
      message: "Text should be readable on mobile devices",
    }).toBe(true);

    expect(mobileOptimization.touchTargetsSize, {
      message: "Touch targets should be properly sized for mobile interaction",
    }).toBe(true);

    expect(mobileOptimization.noInterstitials, {
      message: "No interstitials should block mobile content",
    }).toBe(true);
  }

  @Then("these metrics should be consistent across page loads")
  async checkMetricsConsistency() {
    const metricsResults: PerformanceMetrics[] = [];
    const numberOfLoads = 3;

    for (let i = 0; i < numberOfLoads; i++) {
      await this.humanSpaceflightPage.open();
      const metrics = await this.getPerformanceMetrics();
      metricsResults.push(metrics);

      if (i < numberOfLoads - 1) {
        await this.page.waitForTimeout(500);
      }
    }

    const lcps = metricsResults.map((m) => m.lcp || 0).filter((lcp) => lcp > 0);
    const lcpStdDev = this.calculateStandardDeviation(lcps);

    expect(lcpStdDev, {
      message: `LCP should be consistent across loads (standard deviation: ${lcpStdDev.toFixed(
        2
      )}ms)`,
    }).toBeLessThan(this.PERFORMANCE_THRESHOLDS.MAX_LCP_STD_DEV);
  }

  private async getPerformanceMetrics(): Promise<PerformanceMetrics> {
    return await this.humanSpaceflightPage.performanceSEO.getPerformanceMetrics();
  }

  private async getImageOptimizationInfo(): Promise<ImageInfo[]> {
    return await this.humanSpaceflightPage.performanceSEO.getImageOptimizationInfo();
  }

  private assertMetric(
    actual: number | undefined,
    maxAllowed: number,
    message: string
  ): void {
    expect(actual, {
      message: `${message}. Actual value: ${actual}`,
    }).toBeLessThan(maxAllowed);
  }

  private calculateStandardDeviation(values: number[]): number {
    if (values.length === 0) return 0;

    const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
    const variance =
      values.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) /
      values.length;
    return Math.sqrt(variance);
  }
}
