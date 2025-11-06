import { expect, Page } from "@playwright/test";
import { Then, Fixture } from "playwright-bdd/decorators";
import { DataTable } from "playwright-bdd";
import { HomePage } from "../../../services/ui/HomePage";
import { CustomTestArgs } from "../../../fixtures/BddFixtures";
import {
  parseWcagStandards,
  parseAssistiveTechRequirements,
} from "../../../utils/types/TypeGuards";
import {
  PerformanceTable,
  TechnicalRequirementsTable,
} from "../../../utils/types/Types";

@Fixture("homePageTechnicalSteps")
export class HomePageTechnicalSteps {
  constructor(
    private page: Page,
    private homePage: HomePage,
    private sharedContext: CustomTestArgs["sharedContext"]
  ) {}

  @Then("the page should meet WCAG 2.1 AA standards:")
  async checkWcagStandards(dataTable: DataTable): Promise<void> {
    const requirements = parseWcagStandards(dataTable.hashes());
    await this.validateWcagRequirements(requirements);
  }

  private async validateWcagRequirements(requirements: any[]): Promise<void> {
    for (const req of requirements) {
      if (req.Requirement.includes("H1 tag")) {
        await this.validateSingleH1Tag();
      }
    }
  }

  private async validateSingleH1Tag(): Promise<void> {
    const h1Count = await this.page.locator("h1").count();
    expect(h1Count, "Page must have exactly one H1 tag (WCAG)").toBe(1);
  }

  @Then("assistive technology support should be verified:")
  async checkAssistiveTechSupport(dataTable: DataTable): Promise<void> {
    const requirements = parseAssistiveTechRequirements(dataTable.hashes());
    await this.validateAssistiveTechRequirements(requirements);
  }

  private async validateAssistiveTechRequirements(
    requirements: any[]
  ): Promise<void> {
    for (const req of requirements) {
      if (req["Support Type"].includes("language")) {
        await this.validateHtmlLangAttribute();
      }
    }
  }

  private async validateHtmlLangAttribute(): Promise<void> {
    const lang = await this.page.getAttribute("html", "lang");
    expect(lang, "HTML element must have a 'lang' attribute").not.toBeNull();
  }

  @Then("the homepage should load within performance benchmarks")
  async checkPerformanceBenchmarks(): Promise<void> {
    await this.validateLoadTimeBenchmark();
    await this.validateTimeToInteractive();
  }

  private async validateLoadTimeBenchmark(): Promise<void> {
    const PERFORMANCE_MAX_LOAD_TIME = 5000;
    const loadTime = Date.now() - this.sharedContext.startTime;
    expect(
      loadTime,
      `Homepage should load within ${PERFORMANCE_MAX_LOAD_TIME}ms`
    ).toBeLessThanOrEqual(PERFORMANCE_MAX_LOAD_TIME);
  }

  private async validateTimeToInteractive(): Promise<void> {
    const timeToInteractive = await this.page.evaluate(() => {
      const navigationEntry = performance.getEntriesByType(
        "navigation"
      )[0] as PerformanceNavigationTiming;
      if (navigationEntry) {
        return (
          navigationEntry.domContentLoadedEventEnd - navigationEntry.fetchStart
        );
      }
      return performance.now();
    });

    expect(
      timeToInteractive,
      "Time to interactive should be reasonable"
    ).toBeLessThan(3000);
  }

  @Then("the page should meet performance standards:")
  async checkPerformanceStandards(dataTable: DataTable): Promise<void> {
    const metrics = dataTable.hashes() as PerformanceTable;
    await this.validatePerformanceMetrics(metrics);
  }

  private async validatePerformanceMetrics(
    metrics: PerformanceTable
  ): Promise<void> {
    for (const metric of metrics) {
      await this.validateSinglePerformanceMetric(metric);
    }
  }

  private async validateSinglePerformanceMetric(
    metric: PerformanceTable[0]
  ): Promise<void> {
    const name = metric.Metric;
    const maxValue = parseInt(metric["Max Value (ms)"], 10);
    const actualValue = await this.homePage.getPerformanceMetric(name);

    expect(
      actualValue,
      `${name} should be less than or equal to ${maxValue}ms`
    ).toBeLessThanOrEqual(maxValue);
  }

  @Then("technical requirements should be met:")
  async checkTechnicalRequirements(dataTable: DataTable): Promise<void> {
    const requirements = dataTable.hashes() as TechnicalRequirementsTable;
    await this.validateTechnicalRequirements(requirements);
  }

  private async validateTechnicalRequirements(
    requirements: TechnicalRequirementsTable
  ): Promise<void> {
    for (const req of requirements) {
      await this.validateSingleTechnicalRequirement(req);
    }
  }

  private async validateSingleTechnicalRequirement(
    req: TechnicalRequirementsTable[0]
  ): Promise<void> {
    const requirementName = req["Requirement Name"].toLowerCase();

    if (requirementName.includes("single h1")) {
      await this.validateSingleH1TechnicalRequirement();
    } else if (requirementName.includes("lang attribute")) {
      await this.validateLangAttributeTechnicalRequirement();
    }
  }

  private async validateSingleH1TechnicalRequirement(): Promise<void> {
    const h1Count = await this.page.locator("h1").count();
    expect(
      h1Count,
      "Technical Requirement Failed: Page must have exactly one H1 tag"
    ).toBe(1);
  }

  private async validateLangAttributeTechnicalRequirement(): Promise<void> {
    const lang = await this.page.getAttribute("html", "lang");
    expect(
      lang,
      "Technical Requirement Failed: HTML element must have a 'lang' attribute"
    ).not.toBeNull();
    expect(
      lang?.toLowerCase(),
      "Technical Requirement Failed: 'lang' attribute should be 'en'"
    ).toBe("en");
  }
}
