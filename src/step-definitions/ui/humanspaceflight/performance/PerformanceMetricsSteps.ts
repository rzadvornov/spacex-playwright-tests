import { Page, expect } from "@playwright/test";
import { Then, Fixture } from "playwright-bdd/decorators";
import { HumanSpaceflightPage } from "../../../../pages/ui/HumanSpaceflightPage";
import { CustomTestArgs } from "../../../../fixtures/BddFixtures";
import type { PerformanceMetrics } from "../../../../utils/types/Types";
import { AssertionHelper } from "../../../../utils/AssertionHelper";
import { DataTable } from "playwright-bdd";

@Fixture("performanceMetricsSteps")
export class PerformanceMetricsSteps {
  private readonly PERFORMANCE_THRESHOLDS = {
    MAX_LCP_STD_DEV: 1000,
  } as const;

  constructor(
    private page: Page,
    private humanSpaceflightPage: HumanSpaceflightPage,
    private sharedContext: CustomTestArgs["sharedContext"],
    private assertionHelper: AssertionHelper
  ) {}

  @Then("the Largest Contentful Paint should be less than {int} ms")
  async checkLCP(maxLCP: number) {
    const metrics = await this.getPerformanceMetrics();
    this.assertionHelper.assertMetric(
      metrics.lcp,
      maxLCP,
      `LCP should be less than ${maxLCP}ms`
    );
  }

  @Then("the First Input Delay should be less than {int} ms")
  async checkFID(maxFID: number) {
    const metrics = await this.getPerformanceMetrics();
    this.assertionHelper.assertMetric(
      metrics.fid,
      maxFID,
      `FID should be less than ${maxFID}ms`
    );
  }

  @Then("the Cumulative Layout Shift should be less than {float}")
  async checkCLS(maxCLS: number) {
    const metrics = await this.getPerformanceMetrics();
    this.assertionHelper.assertMetric(
      metrics.cls,
      maxCLS,
      `CLS should be less than ${maxCLS}`
    );
  }

  @Then("the Time to First Byte should be less than {int} ms")
  async checkTTFB(maxTTFB: number) {
    const metrics = await this.getPerformanceMetrics();
    this.assertionHelper.assertMetric(
      metrics.ttfb,
      maxTTFB,
      `TTFB should be less than ${maxTTFB}ms`
    );
  }

  @Then("the First Contentful Paint should be less than {int} ms")
  async checkFCP(maxFCP: number) {
    const metrics = await this.getPerformanceMetrics();
    this.assertionHelper.assertMetric(
      metrics.fcp,
      maxFCP,
      `FCP should be less than ${maxFCP}ms`
    );
  }

  private async getPerformanceMetrics(): Promise<PerformanceMetrics> {
    return await this.humanSpaceflightPage.performanceSEO.getPerformanceMetrics();
  }

  @Then("the page should score at least {int} on Lighthouse performance")
  async checkLighthouseScore(minScore: number) {
    const score =
      await this.humanSpaceflightPage.performanceSEO.getLighthouseScore();
    expect(score, {
      message: `Lighthouse score should be at least ${minScore}`,
    }).toBeGreaterThanOrEqual(minScore);
  }

  @Then("the Lighthouse performance score should be at least {int}")
  async checkLighthousePerformanceScore(minScore: number) {
    await this.checkLighthouseScore(minScore);
  }

  @Then("the initial page load should complete within {int} seconds")
  async checkPageLoadTime(maxSeconds: number) {
    const loadTime = Date.now() - this.sharedContext.startTime;
    const maxMilliseconds = maxSeconds * 1000;
    expect(loadTime, {
      message: `Page load time should be less than ${maxSeconds} seconds`,
    }).toBeLessThan(maxMilliseconds);
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

  private calculateStandardDeviation(values: number[]): number {
    if (values.length === 0) return 0;

    const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
    const variance =
      values.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) /
      values.length;
    return Math.sqrt(variance);
  }

  @Then("the page should meet core web vitals:")
  async checkCoreWebVitals(dataTable: DataTable) {
    const webVitals = dataTable.hashes();
    const metrics = await this.getPerformanceMetrics();

    for (const vital of webVitals) {
      const { Metric, Threshold } = vital;
      const thresholdValue = parseInt(Threshold.replace(/[<>\s]/g, ""));

      const metricValidators: Record<string, () => void> = {
        "Largest Contentful Paint": () => {
          this.assertionHelper.assertMetric(
            metrics.lcp,
            thresholdValue,
            `LCP should be less than ${thresholdValue}ms`
          );
        },
        "First Input Delay": () => {
          this.assertionHelper.assertMetric(
            metrics.fid,
            thresholdValue,
            `FID should be less than ${thresholdValue}ms`
          );
        },
        "Cumulative Layout Shift": () => {
          this.assertionHelper.assertMetric(
            metrics.cls,
            thresholdValue,
            `CLS should be less than ${thresholdValue}`
          );
        },
        "First Contentful Paint": () => {
          this.assertionHelper.assertMetric(
            metrics.fcp,
            thresholdValue,
            `FCP should be less than ${thresholdValue}ms`
          );
        },
        "Time to First Byte": () => {
          this.assertionHelper.assertMetric(
            metrics.ttfb,
            thresholdValue,
            `TTFB should be less than ${thresholdValue}ms`
          );
        },
        "Initial Page Load": () => {
          const loadTime = Date.now() - this.sharedContext.startTime;
          expect(loadTime, {
            message: `Initial page load should be less than ${thresholdValue}ms`,
          }).toBeLessThan(thresholdValue);
        },
      };

      const validator = metricValidators[Metric];
      if (!validator) {
        throw new Error(`Unknown core web vital: ${Metric}`);
      }
      validator();
    }
  }
}
