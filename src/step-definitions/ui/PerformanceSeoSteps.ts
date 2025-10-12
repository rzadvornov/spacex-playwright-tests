import { Page, expect } from "@playwright/test";
import { When, Then, Fixture } from "playwright-bdd/decorators";
import { HumanSpaceflightPage } from "../../pages/ui/HumanSpaceflightPage";
import { CustomTestArgs } from "../../fixtures/BddFixtures";

@Fixture("performanceSeoSteps")
export class PerformanceSeoSteps {
  constructor(
    private page: Page,
    private humanSpaceflightPage: HumanSpaceflightPage,
    private sharedContext: CustomTestArgs["sharedContext"]
  ) {}

  @Then("the Largest Contentful Paint should be less than {int} ms")
  async checkLCP(maxLCP: number) {
    const metrics =
      await this.humanSpaceflightPage.performanceSEO.getPerformanceMetrics();
    expect(metrics.lcp, { message: `LCP should be less than ${maxLCP}ms` }).toBeLessThan(maxLCP);
  }

  @Then("the First Input Delay should be less than {int} ms")
  async checkFID(maxFID: number) {
    const metrics =
      await this.humanSpaceflightPage.performanceSEO.getPerformanceMetrics();
    expect(metrics.fid, { message: `FID should be less than ${maxFID}ms` }).toBeLessThan(maxFID);
  }

  @Then("the Cumulative Layout Shift should be less than {float}")
  async checkCLS(maxCLS: number) {
    const metrics =
      await this.humanSpaceflightPage.performanceSEO.getPerformanceMetrics();
    expect(metrics.cls, { message: `CLS should be less than ${maxCLS}` }).toBeLessThan(maxCLS);
  }

  @Then("the page should score at least {int} on Lighthouse performance")
  async checkLighthouseScore(minScore: number) {
    const score =
      await this.humanSpaceflightPage.performanceSEO.getLighthouseScore();
    expect(score, { message: `Lighthouse score should be at least ${minScore}` }).toBeGreaterThanOrEqual(minScore);
  }

  @Then("the initial page load should complete within {int} seconds")
  async checkPageLoadTime(maxSeconds: number) {
    const loadTime = Date.now() - this.sharedContext.startTime;
    expect(loadTime, { message: `Page load time should be less than ${maxSeconds} seconds` }).toBeLessThan(maxSeconds * 1000);
  }

  @Then("the Time to First Byte should be less than {int} ms")
  async checkTTFB(maxTTFB: number) {
    const metrics =
      await this.humanSpaceflightPage.performanceSEO.getPerformanceMetrics();
    expect(metrics.ttfb, { message: `TTFB should be less than ${maxTTFB}ms` }).toBeLessThan(maxTTFB);
  }

  @Then("the First Contentful Paint should be less than {int} ms")
  async checkFCP(maxFCP: number) {
    const metrics =
      await this.humanSpaceflightPage.performanceSEO.getPerformanceMetrics();
    expect(metrics.fcp, { message: `FCP should be less than ${maxFCP}ms` }).toBeLessThan(maxFCP);
  }

  @Then("all images should be optimized for web")
  async checkImagesOptimized() {
    const imagesInfo =
      await this.humanSpaceflightPage.performanceSEO.getImageOptimizationInfo();
    for (const img of imagesInfo) {
      expect(img.size, { message: "Image size should be reasonable" }).toBeLessThan(1000000);
    }
  }

  @Then("images should use modern formats \\(WebP, AVIF)")
  async checkModernImageFormats() {
    const imagesInfo =
      await this.humanSpaceflightPage.performanceSEO.getImageOptimizationInfo();
    const hasModernFormat = imagesInfo.some((img) => img.hasWebp);
    expect(hasModernFormat, { message: "Images should use modern formats" }).toBe(true);
  }

  @Then("images should have responsive sizes \\(srcset)")
  async checkResponsiveImages() {
    const imagesInfo =
      await this.humanSpaceflightPage.performanceSEO.getImageOptimizationInfo();
    const hasResponsive = imagesInfo.some((img) => img.hasSrcset);
    expect(hasResponsive, { message: "Images should have srcset attribute" }).toBe(true);
  }

  @Then("images should load lazily when below the fold")
  async checkLazyLoading() {
    const imagesInfo =
      await this.humanSpaceflightPage.performanceSEO.getImageOptimizationInfo();
    const hasLazyLoad = imagesInfo.some((img) => img.loading === "lazy");
    expect(hasLazyLoad, { message: "Images should use lazy loading" }).toBe(true);
  }

  @Then("critical CSS should be inlined or loaded first")
  async checkCriticalCSS() {
    const cssResources =
      await this.humanSpaceflightPage.performanceSEO.getCSSResourcesInfo();
    const criticalCss = cssResources.find((r) => r.url.includes("critical"));
    expect(criticalCss, { message: "Critical CSS should be present" }).toBeDefined();
  }

  @Then("CSS should be minified")
  async checkCSSMinified() {
    const cssResources =
      await this.humanSpaceflightPage.performanceSEO.getCSSResourcesInfo();
    for (const css of cssResources) {
      expect(css.size / css.transferSize).toBeGreaterThan(0.8);
    }
  }

  @Then("JavaScript should be minified")
  async checkJSMinified() {
    const jsResources =
      await this.humanSpaceflightPage.performanceSEO.getJavaScriptResourcesInfo();
    for (const js of jsResources) {
      expect(js.size / js.transferSize).toBeGreaterThan(0.8);
    }
  }

  @When("I open the browser console")
  async openBrowserConsole() {
    // Console is automatically monitored, no action needed
  }

  @Then("no JavaScript errors should be present")
  async checkNoJSErrors() {
    const errors = this.humanSpaceflightPage.getConsoleErrors();
    expect(errors.length, { message: "No JavaScript errors should be present" }).toBe(0);
  }

  @Then("the meta description should be present and under {int} characters")
  async checkMetaDescription(maxLength: number) {
    const metaTags =
      await this.humanSpaceflightPage.performanceSEO.getMetaTags();
    const description = metaTags["description"];
    expect(description, { message: "Meta description should be present" }).toBeDefined();
    expect(description.length, { message: "Meta description should not exceed max length" }).toBeLessThanOrEqual(maxLength);
  }

  @Then("the Open Graph title should be {string}")
  async checkOGTitle(expectedTitle: string) {
    const ogTags =
      await this.humanSpaceflightPage.performanceSEO.getOpenGraphTags();
    expect(ogTags["title"], { message: "Open Graph title should match" }).toBe(expectedTitle);
  }

  @Then("structured data \\(Schema.org) should be present")
  async checkStructuredData() {
    const structuredData =
      await this.humanSpaceflightPage.performanceSEO.getStructuredData();
    expect(structuredData.length, { message: "Structured data should be present" }).toBeGreaterThan(0);
  }

  @Then("heading tags should be hierarchical \\(H1 > H2 > H3)")
  async checkHeadingHierarchy() {
    const headings =
      await this.humanSpaceflightPage.performanceSEO.getHeadingStructure();
    let currentLevel = 1;
    for (const heading of headings) {
      const level = parseInt(heading.tag[1]);
      expect(level, { message: "Heading levels should not skip" }).toBeLessThanOrEqual(currentLevel + 1);
      currentLevel = level;
    }
  }

  @Then("the robots meta tag should be present")
  async checkRobotsTag() {
    const robotsContent =
      await this.humanSpaceflightPage.performanceSEO.getRobotsMetaContent();
    expect(robotsContent, { message: "Robots meta tag should be present" }).toBeDefined();
  }

  @Then("a canonical link should be present")
  async checkCanonicalLink() {
    const canonicalUrl =
      await this.humanSpaceflightPage.performanceSEO.getCanonicalUrl();
    expect(canonicalUrl, { message: "Canonical link should be present" }).toBeDefined();
  }

  @Then("all internal links should use relative URLs")
  async checkRelativeUrls() {
    const links =
      await this.humanSpaceflightPage.performanceSEO.getInternalLinks();
    for (const link of links) {
      expect(link.href.startsWith("http"), { message: "Internal links should use relative URLs" }).toBe(false);
    }
  }

  @Then("no duplicate content should be present on the page")
  async checkNoDuplicateContent() {
    const duplicateInfo =
      await this.humanSpaceflightPage.performanceSEO.checkDuplicateContent();
    expect(duplicateInfo.duplicateParagraphs, { message: "No duplicate paragraphs should be present" }).toBe(0);
  }

  @Then("the page should be mobile-friendly")
  async checkMobileFriendly() {
    const mobileOptimization =
      await this.humanSpaceflightPage.performanceSEO.checkMobileOptimization();
    expect(mobileOptimization.textReadable, { message: "Text should be readable on mobile" }).toBe(true);
    expect(mobileOptimization.touchTargetsSize, { message: "Touch targets should be properly sized" }).toBe(true);
    expect(mobileOptimization.noInterstitials, { message: "No interstitials should be present" }).toBe(true);
  }

  @Then("these metrics should be consistent across page loads")
  async checkMetricsConsistency() {
    const metricsResults = [];
    for (let i = 0; i < 3; i++) {
      await this.humanSpaceflightPage.open();
      const metrics =
        await this.humanSpaceflightPage.performanceSEO.getPerformanceMetrics();
      metricsResults.push(metrics);
    }

    // Calculate standard deviation for LCP
    const lcps = metricsResults.map((m) => m.lcp || 0);
    const lcpStdDev = this.calculateStandardDeviation(lcps);
    expect(lcpStdDev, { message: "LCP should be consistent" }).toBeLessThan(1000); 
  }

  private calculateStandardDeviation(values: number[]): number {
    const mean = values.reduce((a, b) => a + b) / values.length;
    const variance =
      values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;
    return Math.sqrt(variance);
  }
}