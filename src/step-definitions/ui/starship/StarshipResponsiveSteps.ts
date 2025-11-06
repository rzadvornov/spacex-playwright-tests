import { Then, Fixture } from "playwright-bdd/decorators";
import { StarshipPage } from "../../../services/ui/StarshipPage";
import { AssertionHelper } from "../../../utils/AssertionHelper";
import { ViewportUtility } from "../../../utils/ViewportUtility";
import { Page } from "@playwright/test";

@Fixture("starshipResponsiveSteps")
export class StarshipResponsiveSteps {
  constructor(
    private page: Page,
    private starshipPage: StarshipPage,
    private assertionHelper: AssertionHelper,
    private viewportUtility: ViewportUtility
  ) {}

  @Then("the Starship page should be responsive across all viewports")
  async verifyResponsiveDesign(): Promise<void> {
    await this.viewportUtility.checkAllViewports(async (viewportSize) => {
      const viewportInfo = `at ${viewportSize.width}x${viewportSize.height}`;

      await this.assertionHelper.validateBooleanCheck(
        async () => await this.starshipPage.isOverviewSectionVisible(),
        `Overview section should be visible ${viewportInfo}`
      );

      const headline = await this.starshipPage.getOverviewHeadline();
      this.assertionHelper.assertValuePresent(
        headline,
        `Headline should be present ${viewportInfo}`
      );

      this.assertionHelper.assertMetric(
        headline?.length,
        0,
        `Headline should not be empty ${viewportInfo}`
      );

      await this.assertionHelper.validateBooleanCheck(
        async () => await this.starshipPage.header.isHeaderVisible(),
        `Header should be visible ${viewportInfo}`
      );
    });
  }

  @Then("the page layout should adapt correctly to different screen sizes")
  async verifyAdaptiveLayout(): Promise<void> {
    await this.viewportUtility.checkAllViewports(async (viewportSize) => {
      const viewportInfo = `at ${viewportSize.width}x${viewportSize.height}`;

      const sections = [
        {
          name: "Overview",
          method: () => this.starshipPage.isOverviewSectionVisible(),
        },
        {
          name: "Capabilities",
          method: () => this.starshipPage.isCapabilitiesSectionVisible(),
        },
        {
          name: "Header",
          method: () => this.starshipPage.header.isHeaderVisible(),
        },
        {
          name: "Footer",
          method: () => this.starshipPage.footer.footer.isVisible(),
        },
      ];

      for (const section of sections) {
        await this.assertionHelper.validateBooleanCheck(
          section.method,
          `${section.name} section should be visible ${viewportInfo}`
        );
      }

      const headline = await this.starshipPage.getOverviewHeadline();
      this.assertionHelper.assertMetric(
        headline?.length,
        1000,
        `Content should remain readable (not too long) ${viewportInfo}`
      );
    });
  }

  @Then("the mobile navigation menu should work correctly")
  async verifyMobileNavigation(): Promise<void> {
    await this.page.setViewportSize({ width: 375, height: 667 });

    await this.assertionHelper.validateBooleanCheck(
      async () => await this.starshipPage.header.isMobileMenuButtonVisible(),
      "Mobile menu button should be visible on small screens"
    );

    await this.starshipPage.header.openNavigationMenu();
    await this.assertionHelper.validateBooleanCheck(
      async () => await this.starshipPage.header.isMobileMenuExpanded(),
      "Mobile menu should expand when menu button is clicked"
    );

    await this.starshipPage.header.clickMobileMenuCloseButton();
    await this.assertionHelper.validateBooleanCheck(
      async () => await this.starshipPage.header.isMenuCollapsed(),
      "Mobile menu should collapse when close button is clicked"
    );
  }

  @Then("all interactive elements should be accessible on touch devices")
  async verifyTouchAccessibility(): Promise<void> {
    await this.viewportUtility.checkAllViewports(async (viewportSize) => {
      if (viewportSize.width < 768) {
        const buttons = await this.starshipPage.page
          .locator('button, [role="button"], .btn, .button')
          .all();

        for (const button of buttons) {
          const box = await button.boundingBox();
          if (box) {
            this.assertionHelper.assertMetric(
              box.width,
              44,
              `Touch target should be wide enough (min 44px) at ${viewportSize.width}x${viewportSize.height}`
            );

            this.assertionHelper.assertMetric(
              box.height,
              44,
              `Touch target should be tall enough (min 44px) at ${viewportSize.width}x${viewportSize.height}`
            );
          }
        }
      }
    });
  }

  @Then("the page should maintain proper layout on viewport resize")
  async verifyLayoutOnResize(): Promise<void> {
    await this.viewportUtility.checkAllViewports(async (viewportSize) => {
      const viewportName = this.getViewportNameFromSize(viewportSize);

      const criticalSections = [
        {
          name: "Overview",
          check: () => this.starshipPage.isOverviewSectionVisible(),
        },
        {
          name: "Header",
          check: () => this.starshipPage.header.isHeaderVisible(),
        },
        {
          name: "Footer",
          check: () => this.starshipPage.footer.footer.isVisible(),
        },
      ];

      for (const section of criticalSections) {
        await this.assertionHelper.validateBooleanCheck(
          section.check,
          `${section.name} should be visible on ${viewportName} viewport (${viewportSize.width}x${viewportSize.height})`
        );
      }

      const headline = await this.starshipPage.getOverviewHeadline();
      this.assertionHelper.assertValuePresent(
        headline,
        `Headline content should be present on ${viewportName} viewport`
      );

      const bodyWidth = await this.page.evaluate(
        () => document.body.scrollWidth
      );
      const viewportWidth = viewportSize.width;

      this.assertionHelper.assertMetric(
        bodyWidth,
        viewportWidth + 10,
        `Page should not have horizontal overflow on ${viewportName} viewport. Body width: ${bodyWidth}, Viewport: ${viewportWidth}`
      );
    });
  }

  private getViewportNameFromSize(viewportSize: {
    width: number;
    height: number;
  }): string {
    if (viewportSize.width <= 480) return "mobile";
    if (viewportSize.width <= 1024) return "tablet";
    return "desktop";
  }
}
