import { Page, expect } from "@playwright/test";
import { When, Then, Fixture } from "playwright-bdd/decorators";
import { HumanSpaceflightPage } from "../../../../services/ui/HumanSpaceflightPage";
import { DataTable } from "playwright-bdd";
import {
  AnyObject,
  ResponsiveRequirements,
} from "../../../../utils/types/Types";

@Fixture("responsiveCommonSteps")
export class ResponsiveCommonSteps {
  private readonly RESPONSIVE_CONSTANTS = {
    TRANSITION_DELAY: 500,
  } as const;

  constructor(
    private page: Page,
    private humanSpaceflightPage: HumanSpaceflightPage
  ) {}

  @When("I test the responsive design across multiple viewports")
  async testMultipleViewports() {
    const viewports = [375, 768, 1024, 1440, 1920];

    for (const width of viewports) {
      await this.setViewportSize(width);
      await this.page.waitForTimeout(
        this.RESPONSIVE_CONSTANTS.TRANSITION_DELAY
      );

      const hasHorizontalScroll = await this.page.evaluate(() => {
        return document.body.scrollWidth > window.innerWidth;
      });

      const isLayoutStable = await this.page.evaluate(() => {
        const main = document.querySelector("main");
        return main ? main.getBoundingClientRect().width > 0 : false;
      });

      expect(
        isLayoutStable,
        `Layout should be stable at ${width}px`
      ).toBeTruthy();
      expect(
        !hasHorizontalScroll,
        `No horizontal scroll at ${width}px`
      ).toBeTruthy();
    }
  }

  @Then("the design should be fully responsive across all screen sizes")
  async checkFullResponsiveness() {
    const viewports = [375, 768, 1920];
    let mobileOptimized = true;
    let tabletOptimized = true;
    let desktopOptimized = true;

    for (const width of viewports) {
      await this.setViewportSize(width);
      await this.page.waitForTimeout(
        this.RESPONSIVE_CONSTANTS.TRANSITION_DELAY
      );

      const checks = await this.performBasicChecks();

      if (width <= 375) {
        mobileOptimized =
          mobileOptimized && checks.isStable && !checks.hasHorizontalScroll;
      } else if (width <= 768) {
        tabletOptimized =
          tabletOptimized && checks.isStable && !checks.hasHorizontalScroll;
      } else {
        desktopOptimized =
          desktopOptimized && checks.isStable && !checks.hasHorizontalScroll;
      }
    }

    expect(
      mobileOptimized,
      "Design should be optimized for mobile"
    ).toBeTruthy();
    expect(
      tabletOptimized,
      "Design should be optimized for tablet"
    ).toBeTruthy();
    expect(
      desktopOptimized,
      "Design should be optimized for desktop"
    ).toBeTruthy();
  }

  @Then("all responsive breakpoints should function correctly")
  async checkBreakpoints() {
    const breakpoints = [375, 768, 1024, 1200];

    for (const width of breakpoints) {
      await this.setViewportSize(width);
      await this.page.waitForTimeout(
        this.RESPONSIVE_CONSTANTS.TRANSITION_DELAY
      );

      const checks = await this.performBasicChecks();
      expect(
        checks.isStable,
        `Breakpoint at ${width}px should function correctly`
      ).toBeTruthy();
    }
  }

  @Then("the user experience should be consistent across devices")
  async checkConsistentExperience() {
    const viewports = [375, 768, 1920];
    let contentConsistency = true;
    let functionalityConsistency = true;

    for (const width of viewports) {
      await this.setViewportSize(width);
      await this.page.waitForTimeout(
        this.RESPONSIVE_CONSTANTS.TRANSITION_DELAY
      );

      const checks = await this.performBasicChecks();
      contentConsistency = contentConsistency && checks.hasContent;
      functionalityConsistency =
        functionalityConsistency && checks.isFunctional;
    }

    expect(
      contentConsistency,
      "Content should be consistent across devices"
    ).toBeTruthy();
    expect(
      functionalityConsistency,
      "Functionality should be consistent across devices"
    ).toBeTruthy();
  }

  @When("I test responsive behavior for {string}")
  async testResponsiveBehaviorForSection(section: string) {
    const viewports = [375, 768, 1920];

    for (const width of viewports) {
      await this.setViewportSize(width);
      await this.page.waitForTimeout(
        this.RESPONSIVE_CONSTANTS.TRANSITION_DELAY
      );

      const sectionChecks = await this.checkSectionAdaptability(section);

      expect(
        sectionChecks.isAdapted,
        `${section} should adapt to ${width}px viewport`
      ).toBeTruthy();
      expect(
        sectionChecks.isFunctional,
        `${section} should remain functional at ${width}px`
      ).toBeTruthy();
    }
  }

  @Then("the {string} should maintain functionality across viewports")
  async checkSectionFunctionality(section: string) {
    const viewports = [375, 768, 1920];

    for (const width of viewports) {
      await this.setViewportSize(width);
      await this.page.waitForTimeout(
        this.RESPONSIVE_CONSTANTS.TRANSITION_DELAY
      );

      const sectionChecks = await this.checkSectionAdaptability(section);

      expect(
        sectionChecks.interactiveElements,
        `${section} interactive elements should work at ${width}px`
      ).toBeTruthy();
      expect(
        sectionChecks.contentAccessible,
        `${section} content should be accessible at ${width}px`
      ).toBeTruthy();
    }
  }

  private async setViewportSize(width: number, height?: number): Promise<void> {
    await this.humanSpaceflightPage.responsiveDesign.setViewportSize(
      width,
      height
    );
  }

  private async performBasicChecks() {
    return await this.page.evaluate(() => {
      const hasHorizontalScroll = document.body.scrollWidth > window.innerWidth;
      const main = document.querySelector("main");
      const isStable = main ? main.getBoundingClientRect().width > 0 : false;
      const hasContent = document.body.textContent?.trim().length > 0;
      const buttons = document.querySelectorAll("button, a");
      const isFunctional = buttons.length > 0;

      return {
        hasHorizontalScroll,
        isStable,
        hasContent,
        isFunctional,
      };
    });
  }

  private async checkSectionAdaptability(section: string) {
    return await this.page.evaluate((sectionSelector) => {
      const sectionEl = document.querySelector(sectionSelector);
      if (!sectionEl) {
        return {
          isAdapted: false,
          isFunctional: false,
          interactiveElements: false,
          contentAccessible: false,
        };
      }

      const rect = sectionEl.getBoundingClientRect();
      const interactiveElements =
        sectionEl.querySelectorAll("button, a, input");
      const hasContent = sectionEl.textContent?.trim().length > 0;

      return {
        isAdapted: rect.width > 0 && rect.width <= window.innerWidth,
        isFunctional: interactiveElements.length > 0,
        interactiveElements: interactiveElements.length > 0,
        contentAccessible: hasContent,
      };
    }, section);
  }

  @Then("responsive assets should be optimized:")
  async checkAssetOptimization(dataTable: DataTable) {
    const optimization =
      (await this.humanSpaceflightPage.responsiveDesign.checkAssetOptimization()) as AnyObject;
    const requirements = dataTable.rowsHash() as ResponsiveRequirements;

    for (const [assetType, strategy] of Object.entries(optimization)) {
      expect(strategy).toBe(requirements[assetType]);
    }
  }
}
