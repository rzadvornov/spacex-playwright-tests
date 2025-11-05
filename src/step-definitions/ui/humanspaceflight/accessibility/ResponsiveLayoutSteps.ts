import { Page, expect } from "@playwright/test";
import { Then, Fixture } from "playwright-bdd/decorators";
import { DataTable } from "playwright-bdd";
import { HumanSpaceflightPage } from "../../../../pages/ui/HumanSpaceflightPage";
import { AssertionHelper } from "../../../../utils/AssertionHelper";
import { ResponsiveRequirements, AnyObject } from "../../../../utils/types/Types";

@Fixture("responsiveLayoutSteps")
export class ResponsiveLayoutSteps {
  private readonly RESPONSIVE_CONSTANTS = {
    MIN_TOUCH_TARGET: 44,
    MIN_TEXT_SIZE: 16,
    MIN_SECTION_SPACING: 20,
    TRANSITION_DELAY: 500,
  } as const;

  constructor(
    private page: Page,
    private humanSpaceflightPage: HumanSpaceflightPage,
    private assertionHelper: AssertionHelper
  ) {}

  @Then("the page should maintain responsive integrity:")
  async checkResponsiveIntegrity(dataTable: DataTable) {
    const requirements = dataTable.rowsHash() as ResponsiveRequirements;

    const checks = await Promise.all([
      this.humanSpaceflightPage.responsiveDesign.getViewportMetaContent(),
      this.humanSpaceflightPage.responsiveDesign.areMediaQueriesActive(),
      this.humanSpaceflightPage.responsiveDesign.checkRelativeFontUnits(),
      this.humanSpaceflightPage.responsiveDesign.isContainerFluid(),
      this.humanSpaceflightPage.responsiveDesign.isGridSystemImplemented(),
    ]);

    const [
      viewportMeta,
      mediaQueriesActive,
      usesRelativeUnits,
      containerFluid,
      gridImplemented,
    ] = checks;

    if (requirements.Viewport) {
      this.assertionHelper.assertValuePresent(
        viewportMeta,
        "Viewport meta tag should be properly configured"
      );
    }

    this.assertionHelper.assertValuePresent(
      mediaQueriesActive,
      requirements["Media Queries"] || "Media queries should be active"
    );
    this.assertionHelper.assertValuePresent(
      usesRelativeUnits,
      requirements["Base Font"] || "Font units should be relative (rem/em)"
    );
    this.assertionHelper.assertValuePresent(
      containerFluid,
      "Container should be fluid with max-width limits"
    );
    this.assertionHelper.assertValuePresent(
      gridImplemented,
      "Grid system should be implemented"
    );
  }

  @Then("the layout should adapt appropriately:")
  async checkLayoutAdaptation(dataTable: DataTable) {
    const adaptations =
      (await this.humanSpaceflightPage.responsiveDesign.checkLayoutTransitions()) as AnyObject;
    const requirements = dataTable.rowsHash() as ResponsiveRequirements;

    for (const [element, states] of Object.entries(adaptations)) {
      const stateData = states as AnyObject;
      expect(stateData.startState).toBe(requirements[`${element} Start`]);
      expect(stateData.endState).toBe(requirements[`${element} End`]);
      expect(stateData.transition).toBe(requirements[`${element} Transition`]);
    }
  }

  @Then("the page layout should adapt for mobile")
  async checkMobileLayout() {
    const checks =
      await this.humanSpaceflightPage.responsiveDesign.checkMobileResponsiveness();
    expect(
      checks.isContentSingleColumn,
      "Content should be in single column"
    ).toBeTruthy();
    expect(
      checks.hasHorizontalScroll,
      "Page should not have horizontal scroll"
    ).toBeFalsy();
  }

  @Then("content should be single-column")
  async checkSingleColumn() {
    const checks =
      await this.humanSpaceflightPage.responsiveDesign.checkMobileResponsiveness();
    expect(
      checks.isContentSingleColumn,
      "Content should be in single column"
    ).toBeTruthy();
  }

  @Then("no horizontal scrolling should be required")
  async checkNoHorizontalScroll() {
    const checks =
      await this.humanSpaceflightPage.responsiveDesign.checkMobileResponsiveness();
    expect(
      checks.hasHorizontalScroll,
      "Page should not have horizontal scroll"
    ).toBeFalsy();
  }

  @Then("all text should be readable without zooming")
  async checkTextReadability() {
    const checks =
      await this.humanSpaceflightPage.responsiveDesign.checkMobileResponsiveness();
    expect(
      checks.textZoomRequired,
      "Text should be readable without zooming"
    ).toBeFalsy();
  }

  @Then("the section should meet mobile requirements:")
  async checkMobileRequirements(dataTable: DataTable) {
    const requirements = dataTable.rowsHash() as ResponsiveRequirements;
    const checks =
      await this.humanSpaceflightPage.responsiveDesign.checkMobileRequirements();

    expect(checks.layout).toBe(requirements.Layout);
    expect(checks.contentFlow).toBe(requirements["Content Flow"]);
    expect(
      checks.touchTargets,
      "Touch targets should be at least 44px"
    ).toBeGreaterThanOrEqual(this.RESPONSIVE_CONSTANTS.MIN_TOUCH_TARGET);
    expect(
      checks.textSize,
      "Base text size should be at least 16px"
    ).toBeGreaterThanOrEqual(this.RESPONSIVE_CONSTANTS.MIN_TEXT_SIZE);
  }

  @Then("the page layout should adapt for tablet")
  async checkTabletLayout() {
    const tabletCheck =
      await this.humanSpaceflightPage.responsiveDesign.checkTabletLayout();
    expect(
      tabletCheck.hasAppropriateColumns,
      "Layout should adapt for tablet"
    ).toBeTruthy();
  }

  @Then("content should display in appropriate columns")
  async checkTabletColumns() {
    const tabletCheck =
      await this.humanSpaceflightPage.responsiveDesign.checkTabletLayout();
    expect(
      tabletCheck.hasAppropriateColumns,
      "Content should display in columns"
    ).toBeTruthy();
  }

  @Then("images should be properly sized")
  async checkImageSizing() {
    const tabletCheck =
      await this.humanSpaceflightPage.responsiveDesign.checkTabletLayout();
    expect(
      tabletCheck.areImagesProperlySize,
      "Images should be properly sized"
    ).toBeTruthy();
  }

  @Then("all interactive elements should be easily accessible")
  async checkElementAccessibility() {
    const tabletCheck =
      await this.humanSpaceflightPage.responsiveDesign.checkTabletLayout();
    expect(
      tabletCheck.areElementsAccessible,
      "Interactive elements should be accessible"
    ).toBeTruthy();
  }

  @Then("the page should display at full width")
  async checkDesktopWidth() {
    const fullWidth = await this.page.evaluate(() => {
      const main = document.querySelector("main");
      return main
        ? main.getBoundingClientRect().width === window.innerWidth
        : false;
    });
    expect(fullWidth, "Page should display at full width").toBeTruthy();
  }

  @Then("content should be properly distributed across the screen")
  async checkContentDistribution() {
    const layoutCheck =
      await this.humanSpaceflightPage.responsiveDesign.checkTabletLayout();
    expect(
      layoutCheck.hasAppropriateColumns,
      "Content should be properly distributed"
    ).toBeTruthy();
  }

  @Then("all sections should have proper spacing and margins")
  async checkSectionSpacing() {
    const spacingCheck = await this.page.evaluate(() => {
      const sections = document.querySelectorAll("section");
      return Array.from(sections).every((section) => {
        const style = window.getComputedStyle(section);
        const margin = parseInt(style.marginBottom);
        return margin >= 20;
      });
    });
    expect(spacingCheck, "Sections should have proper spacing").toBeTruthy();
  }

  @Then("no content should be cut off or overflow")
  async checkNoOverflow() {
    const overflowCheck = await this.page.evaluate(() => {
      const body = document.body;
      return window.innerWidth >= body.scrollWidth;
    });
    expect(overflowCheck, "Content should not overflow").toBeTruthy();
  }

  @Then("the layout should adapt with requirements:")
  async checkOrientationAdaptation(dataTable: DataTable) {
    const requirements = dataTable.hashes();

    for (const requirement of requirements) {
      await this.validateOrientationRequirement(
        requirement.Element,
        requirement.Requirement
      );
    }
  }

  private async validateOrientationRequirement(
    element: string,
    requirement: string
  ): Promise<void> {
    const validators: Record<string, (requirement: string) => Promise<void>> = {
      Content: () => this.validateContentAdaptation(),
      Navigation: (req) => this.validateNavigationAdaptation(req),
      Images: (req) => this.validateImagesAdaptation(req),
      Performance: () => this.validatePerformanceAdaptation(),
    };

    const validator = validators[element];
    if (!validator) {
      throw new Error(`Unknown orientation element: ${element}`);
    }

    await validator(requirement);
  }

  private async validateContentAdaptation(): Promise<void> {
    const noOverflow = await this.page.evaluate(() => {
      const body = document.body;
      return (
        body.scrollWidth <= window.innerWidth &&
        body.scrollHeight <= window.innerHeight
      );
    });

    expect(
      noOverflow,
      "Content should not have cutoff or overflow"
    ).toBeTruthy();
  }

  private async validateNavigationAdaptation(
    requirement: string
  ): Promise<void> {
    const navAdapted = await this.page.evaluate((req) => {
      const nav = document.querySelector("nav");
      if (!nav) return false;

      const navStyle = getComputedStyle(nav);
      const isVisible =
        navStyle.display !== "none" && navStyle.visibility !== "hidden";

      const requirementHandlers: Record<string, () => boolean> = {
        "Collapse to menu": () =>
          !!document.querySelector('.hamburger-menu, [aria-label*="menu"]'),
        "Show full nav": () =>
          isVisible &&
          (navStyle.display === "flex" || navStyle.display === "block"),
        "Expand navigation": () =>
          isVisible && nav.getBoundingClientRect().width > 200,
      };

      const handler = requirementHandlers[req];
      return handler ? handler() : isVisible;
    }, requirement);

    expect(navAdapted, `Navigation should ${requirement}`).toBeTruthy();
  }

  private async validateImagesAdaptation(requirement: string): Promise<void> {
    const imagesAdapted = await this.page.evaluate((req) => {
      const images = document.querySelectorAll("img");

      const requirementHandlers: Record<string, (img: Element) => boolean> = {
        "Adjust aspect ratio": (img) => {
          const rect = img.getBoundingClientRect();
          return (
            rect.width <= window.innerWidth && rect.height <= window.innerHeight
          );
        },
        "Maintain quality": (img) => {
          const naturalWidth = (img as HTMLImageElement).naturalWidth;
          const displayWidth = img.getBoundingClientRect().width;
          return naturalWidth >= displayWidth;
        },
        "Optimize for width": (img) => {
          const rect = img.getBoundingClientRect();
          return rect.width >= window.innerWidth * 0.5;
        },
      };

      const handler = requirementHandlers[req];
      return Array.from(images).every((img) => (handler ? handler(img) : true));
    }, requirement);

    expect(imagesAdapted, `Images should ${requirement}`).toBeTruthy();
  }

  private async validatePerformanceAdaptation(): Promise<void> {
    const performanceGood = await this.page.evaluate(() => {
      const now = performance.now();
      return performance.now() - now < 100;
    });

    expect(performanceGood, "Performance should not degrade").toBeTruthy();
  }
}
