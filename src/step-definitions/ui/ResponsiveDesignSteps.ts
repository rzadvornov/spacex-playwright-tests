import { Page, expect } from "@playwright/test";
import { When, Then, Fixture } from "playwright-bdd/decorators";
import { DataTable } from "playwright-bdd";
import { HumanSpaceflightPage } from "../../pages/ui/HumanSpaceflightPage";
import { AssertionHelper } from "../../utils/AssertionHelper";
import { ResponsiveRequirements, AnyObject } from "../../pages/types/Types";

@Fixture("responsiveDesignSteps")
export class ResponsiveDesignSteps {
  private readonly RESPONSIVE_CONSTANTS = {
    MIN_TOUCH_TARGET: 44,
    MIN_TEXT_SIZE: 16,
    MAX_RESPONSE_TIME: 100,
    MAX_LAYOUT_SHIFT: 0.1,
    MIN_LINE_HEIGHT_RATIO: 1.4,
    MAX_LINE_LENGTH: 800,
    MAX_LOAD_TIME: 3000,
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

  @Then("responsive images should be properly configured:")
  async checkResponsiveImages(dataTable: DataTable) {
    const requirements = dataTable.hashes();
    const imageConfigs =
      await this.humanSpaceflightPage.responsiveDesign.checkResponsiveImages();

    for (const requirement of requirements) {
      const { Feature, Implementation } = requirement;

      switch (Feature) {
        case "srcset":
          expect(
            imageConfigs.hasSrcset,
            `Images should have ${Implementation}`
          ).toBeTruthy();
          break;

        case "sizes":
          expect(
            imageConfigs.hasSizes,
            `Images should have ${Implementation}`
          ).toBeTruthy();
          break;

        case "lazy loading":
          expect(
            imageConfigs.hasLazyLoading,
            `Images should implement ${Implementation}`
          ).toBeTruthy();
          break;

        case "aspect ratio":
          expect(
            imageConfigs.preservesAspectRatio,
            `Images should have ${Implementation}`
          ).toBeTruthy();
          break;

        default:
          throw new Error(`Unknown responsive image feature: ${Feature}`);
      }
    }
  }

  @When("I view the {string} on a mobile device with width {string}px")
  async viewSectionOnMobile(section: string, width: string) {
    await this.setViewportSize(parseInt(width));
    await this.humanSpaceflightPage.responsiveDesign.scrollToSection(section);
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

  @When("I interact with {string} on {string} with width {string}px")
  async interactWithElement(element: string, device: string, width: string) {
    const viewportWidth = parseInt(width);
    await this.setViewportSize(viewportWidth);

    const interactionMethod = this.getInteractionMethod(device);

    switch (interactionMethod) {
      case "tap":
        await this.humanSpaceflightPage.responsiveDesign.tapElement(element);
        break;
      case "swipe":
        await this.humanSpaceflightPage.responsiveDesign.swipeElement(element);
        break;
      case "hover-click":
        await this.humanSpaceflightPage.responsiveDesign.hoverAndClickElement(
          element
        );
        break;
      case "focus-type":
        await this.humanSpaceflightPage.responsiveDesign.focusAndTypeInElement(
          element
        );
        break;
      default:
        await this.humanSpaceflightPage.responsiveDesign.clickElement(element);
    }
  }

  private getInteractionMethod(device: string): string {
    const deviceType = device.toLowerCase();

    switch (deviceType) {
      case "mobile":
        return "tap";
      case "tablet":
        return "tap";
      case "desktop":
        return "hover-click";
      default:
        return "click";
    }
  }

  @Then("the interaction should follow device patterns:")
  async checkDevicePatterns(dataTable: DataTable) {
    const requirements = dataTable.rowsHash() as ResponsiveRequirements;
    const patterns =
      await this.humanSpaceflightPage.responsiveDesign.checkInteractionPatterns();

    expect(patterns.inputMethod).toBe(requirements["Input Method"]);
    expect(patterns.feedback).toBe(requirements["Feedback Type"]);
    expect(patterns.responseTime, "Response time should be fast").toBeLessThan(
      this.RESPONSIVE_CONSTANTS.MAX_RESPONSE_TIME
    );
    expect(patterns.visualCues, "Visual cues should be present").toBeTruthy();
    expect(patterns.errorHandling).toBe(requirements["Error Feedback"]);
  }

  @When("the viewport width changes from {string} to {string} pixels")
  async changeViewportWidth(startWidth: string, endWidth: string) {
    await this.setViewportSize(parseInt(startWidth));
    await this.page.waitForTimeout(this.RESPONSIVE_CONSTANTS.TRANSITION_DELAY);
    await this.setViewportSize(parseInt(endWidth));
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

  @Then("responsive implementation should meet performance criteria:")
  async checkPerformanceCriteria(dataTable: DataTable) {
    const performance =
      await this.humanSpaceflightPage.responsiveDesign.checkPerformanceMetrics();

    expect(
      performance.cls,
      "Cumulative Layout Shift should be minimal"
    ).toBeLessThan(this.RESPONSIVE_CONSTANTS.MAX_LAYOUT_SHIFT);
    expect(
      performance.resizeResponse,
      "Resize response should be fast"
    ).toBeLessThan(this.RESPONSIVE_CONSTANTS.MAX_RESPONSE_TIME);
    expect(
      performance.imageLoading,
      "Image loading should be progressive and optimized"
    ).toBe("Progressive, optimized");
    expect(
      performance.animationFps,
      "Animation should be smooth"
    ).toBeGreaterThanOrEqual(60);
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

  @Then("the responsive design should maintain accessibility:")
  async checkAccessibility(dataTable: DataTable) {
    const accessibility =
      (await this.humanSpaceflightPage.responsiveDesign.checkAccessibilityCompliance()) as AnyObject;
    const requirements = dataTable.rowsHash() as ResponsiveRequirements;

    expect(accessibility.textScaling).toBe("Supports 200% zoom");
    expect(
      accessibility.touchTargets,
      "Touch targets should meet minimum size"
    ).toBeGreaterThanOrEqual(this.RESPONSIVE_CONSTANTS.MIN_TOUCH_TARGET);

    for (const [feature, requirement] of Object.entries(requirements)) {
      expect(accessibility[feature.toLowerCase()]).toBe(requirement);
    }
  }

  @When("I view the page on a mobile device with {int}px width")
  async setMobileViewport(width: number) {
    await this.setViewportSize(width);
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

  @Then("the header navigation should collapse")
  async checkNavigationCollapse() {
    const isCollapsed =
      await this.humanSpaceflightPage.responsiveDesign.isNavigationCollapsed();
    expect(
      isCollapsed,
      "Navigation should be collapsed on mobile"
    ).toBeTruthy();
  }

  @Then("a hamburger menu button should be visible")
  async checkHamburgerVisible() {
    const isVisible =
      await this.humanSpaceflightPage.responsiveDesign.isHamburgerMenuVisible();
    expect(isVisible, "Hamburger menu button should be visible").toBeTruthy();
  }

  @Then("the navigation links should not be displayed in the header")
  async checkNavigationLinksHidden() {
    const linksVisible =
      await this.humanSpaceflightPage.responsiveDesign.areNavigationLinksVisible();
    expect(
      linksVisible,
      "Navigation links should be hidden in header"
    ).toBeFalsy();
  }

  @Then("the hamburger menu should be clickable")
  async checkHamburgerClickable() {
    const button = this.humanSpaceflightPage.responsiveDesign.hamburgerButton;
    expect(
      await button.isEnabled(),
      "Hamburger menu should be clickable"
    ).toBeTruthy();
  }

  @When("I click the hamburger menu button")
  async clickHamburgerMenu() {
    await this.humanSpaceflightPage.responsiveDesign.clickHamburgerMenu();
  }

  @Then("the navigation menu should expand")
  async checkMenuExpanded() {
    const isExpanded =
      await this.humanSpaceflightPage.responsiveDesign.isNavigationMenuExpanded();
    expect(isExpanded, "Navigation menu should be expanded").toBeTruthy();
  }

  @Then("all navigation links should be visible")
  async checkAllLinksVisible() {
    const linksVisible =
      await this.humanSpaceflightPage.responsiveDesign.areNavigationLinksVisible();
    expect(linksVisible, "All navigation links should be visible").toBeTruthy();
  }

  @Then("the menu should overlay the page content")
  async checkMenuOverlay() {
    const menu = this.humanSpaceflightPage.responsiveDesign.navigationMenu;
    const isOverlay = await menu.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return style.position === "fixed" || style.position === "absolute";
    });
    expect(isOverlay, "Menu should overlay the page content").toBeTruthy();
  }

  @When("I click the close button or a navigation link")
  async closeMenu() {
    await this.humanSpaceflightPage.responsiveDesign.closeNavigationMenu();
  }

  @Then("the menu should collapse")
  async checkMenuCollapsed() {
    const isCollapsed =
      await this.humanSpaceflightPage.responsiveDesign.isMenuCollapsed();
    expect(isCollapsed, "Menu should be collapsed").toBeTruthy();
  }

  @Then("the carousel should display in single-slide view")
  async checkCarouselSingleSlide() {
    const carouselChecks =
      await this.humanSpaceflightPage.responsiveDesign.checkCarouselResponsiveness();
    expect(
      carouselChecks.isSingleSlide,
      "Carousel should display single slide"
    ).toBeTruthy();
  }

  @Then("the media tiles should be full width")
  async checkMediaTilesFullWidth() {
    const carouselChecks =
      await this.humanSpaceflightPage.responsiveDesign.checkCarouselResponsiveness();
    expect(
      carouselChecks.isFullWidth,
      "Media tiles should be full width"
    ).toBeTruthy();
  }

  @Then("navigation arrows should be appropriately sized for touch")
  async checkArrowsSizedForTouch() {
    const carouselChecks =
      await this.humanSpaceflightPage.responsiveDesign.checkCarouselResponsiveness();
    expect(
      carouselChecks.areTouchTargetsSized,
      "Navigation arrows should be touch-sized"
    ).toBeTruthy();
  }

  @Then("the pagination dots should be visible and tappable")
  async checkPaginationDotsAccessible() {
    const carouselChecks =
      await this.humanSpaceflightPage.responsiveDesign.checkCarouselResponsiveness();
    expect(
      carouselChecks.arePaginationDotsAccessible,
      "Pagination dots should be accessible"
    ).toBeTruthy();
  }

  @Then("all destination images should display appropriately")
  async checkDestinationImages() {
    const destinationsCheck = await this.checkSectionAdaptability(
      '[data-test="destinations-section"]'
    );
    expect(
      destinationsCheck.isLayoutAdapted,
      "Destinations should adapt layout"
    ).toBeTruthy();
  }

  @Then("the destination layout should adapt for mobile screens")
  async checkDestinationLayout() {
    const destinationsCheck = await this.checkSectionAdaptability(
      '[data-test="destinations-section"]'
    );
    expect(
      destinationsCheck.isLayoutAdapted,
      "Destination layout should adapt"
    ).toBeTruthy();
  }

  @Then("each destination should remain clickable and functional")
  async checkDestinationsFunctional() {
    const destinationsCheck = await this.checkSectionAdaptability(
      '[data-test="destinations-section"]'
    );
    expect(
      destinationsCheck.areButtonsTappable,
      "Destinations should be clickable"
    ).toBeTruthy();
  }

  @Then("the mission tabs should display as a clickable list or dropdown")
  async checkMissionTabsDisplay() {
    const missionsCheck = await this.checkSectionAdaptability(
      '[data-test="our-missions-section"]'
    );
    expect(
      missionsCheck.isLayoutAdapted,
      "Mission tabs should adapt layout"
    ).toBeTruthy();
    expect(
      missionsCheck.areButtonsTappable,
      "Mission tabs should be tappable"
    ).toBeTruthy();
  }

  @Then("the metrics table should be reformatted for mobile view")
  async checkMetricsTableFormat() {
    const missionsCheck = await this.checkSectionAdaptability(
      '[data-test="our-missions-section"]'
    );
    expect(
      missionsCheck.isLayoutAdapted,
      "Metrics table should adapt layout"
    ).toBeTruthy();
  }

  @Then("all content should remain readable on small screens")
  async checkContentReadable() {
    const missionsCheck = await this.checkSectionAdaptability(
      '[data-test="our-missions-section"]'
    );
    expect(
      missionsCheck.isContentReadable,
      "Content should be readable"
    ).toBeTruthy();
  }

  @Then("the footer layout should adapt for mobile")
  async checkFooterLayout() {
    const footerCheck =
      await this.humanSpaceflightPage.responsiveDesign.checkFooterResponsiveness();
    expect(
      footerCheck.isVerticalLayout,
      "Footer should have vertical layout"
    ).toBeTruthy();
  }

  @Then("footer elements should stack vertically")
  async checkFooterStacking() {
    const footerCheck =
      await this.humanSpaceflightPage.responsiveDesign.checkFooterResponsiveness();
    expect(
      footerCheck.isVerticalLayout,
      "Footer elements should stack vertically"
    ).toBeTruthy();
  }

  @Then("all links and buttons should be tappable")
  async checkFooterTappableElements() {
    const footerCheck =
      await this.humanSpaceflightPage.responsiveDesign.checkFooterResponsiveness();
    expect(
      footerCheck.areLinksTappable,
      "Footer links should be tappable"
    ).toBeTruthy();
  }

  @When("I view the page on a tablet device with {int}px width")
  async setTabletViewport(width: number) {
    await this.setViewportSize(width);
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

  @When("I view the page on a desktop browser with {int}px width")
  async setDesktopViewport(width: number) {
    await this.setViewportSize(width);
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

  @When("I resize the browser window from mobile to desktop")
  async resizeWindow() {
    await this.setViewportSize(375);
    await this.page.waitForTimeout(this.RESPONSIVE_CONSTANTS.TRANSITION_DELAY);
    await this.setViewportSize(1920);
  }

  @Then("all images should scale appropriately")
  async checkImageScaling() {
    const scalingCheck = await this.page.evaluate(() => {
      const images = document.querySelectorAll("img");
      return Array.from(images).every((img) => {
        const rect = img.getBoundingClientRect();
        return (
          rect.width > 0 && rect.height > 0 && rect.width <= window.innerWidth
        );
      });
    });
    expect(scalingCheck, "Images should scale appropriately").toBeTruthy();
  }

  @Then("images should not distort or lose quality")
  async checkImageQuality() {
    const qualityCheck = await this.page.evaluate(() => {
      const images = document.querySelectorAll("img");
      return Array.from(images).every((img) => {
        const naturalRatio = img.naturalWidth / img.naturalHeight;
        const displayRatio = img.width / img.height;
        return Math.abs(naturalRatio - displayRatio) < 0.1;
      });
    });
    expect(qualityCheck, "Images should maintain aspect ratio").toBeTruthy();
  }

  @When("I view the page on mobile, tablet, and desktop")
  async checkAllViewports() {
    const viewports = [375, 768, 1920];

    for (const width of viewports) {
      await this.setViewportSize(width);
      await this.page.waitForTimeout(
        this.RESPONSIVE_CONSTANTS.TRANSITION_DELAY
      );
    }
  }

  @Then("font sizes should be appropriate for each screen size")
  async checkFontSizes() {
    const fontCheck = await this.page.evaluate(() => {
      const textElements = document.querySelectorAll(
        "p, h1, h2, h3, h4, h5, h6"
      );
      return Array.from(textElements).every((el) => {
        const fontSize = parseInt(window.getComputedStyle(el).fontSize);
        return fontSize >= 12;
      });
    });
    expect(fontCheck, "Font sizes should be appropriate").toBeTruthy();
  }

  @Then("line-height should provide comfortable reading")
  async checkLineHeight() {
    const lineHeightCheck = await this.page.evaluate(() => {
      const textElements = document.querySelectorAll("p");
      return Array.from(textElements).every((el) => {
        const lineHeight = parseFloat(window.getComputedStyle(el).lineHeight);
        const fontSize = parseFloat(window.getComputedStyle(el).fontSize);
        return lineHeight / fontSize >= 1.4;
      });
    });
    expect(
      lineHeightCheck,
      "Line height should be comfortable for reading"
    ).toBeTruthy();
  }

  @Then("line length should not exceed recommended maximums")
  async checkLineLength() {
    const lineLengthCheck = await this.page.evaluate(() => {
      const paragraphs = document.querySelectorAll("p");
      return Array.from(paragraphs).every((p) => {
        const width = p.getBoundingClientRect().width;
        return width <= 800;
      });
    });
    expect(lineLengthCheck, "Line length should not be excessive").toBeTruthy();
  }

  @Then("text should not require horizontal scrolling")
  async checkTextScroll() {
    const noHorizontalScroll = await this.page.evaluate(() => {
      const body = document.body;
      return body.scrollWidth <= window.innerWidth;
    });
    expect(
      noHorizontalScroll,
      "Text should not cause horizontal scrolling"
    ).toBeTruthy();
  }

  @Then("all clickable elements should have a minimum touch target size")
  async checkTouchTargets() {
    const touchTargetCheck = await this.page.evaluate(() => {
      const elements = document.querySelectorAll("a, button, input, select");
      return Array.from(elements).every((el) => {
        const rect = el.getBoundingClientRect();
        return rect.width >= 44 && rect.height >= 44;
      });
    });
    expect(
      touchTargetCheck,
      "Touch targets should be appropriately sized"
    ).toBeTruthy();
  }

  @Then("spacing between interactive elements should be adequate")
  async checkElementSpacing() {
    const spacingCheck = await this.page.evaluate(() => {
      const elements = document.querySelectorAll("a, button");
      return Array.from(elements).every((el) => {
        const rect = el.getBoundingClientRect();
        const style = window.getComputedStyle(el);
        return (
          parseInt(style.marginBottom) >= 8 || parseInt(style.marginRight) >= 8
        );
      });
    });
    expect(
      spacingCheck,
      "Interactive elements should have adequate spacing"
    ).toBeTruthy();
  }

  @Then("the page should load quickly on all screen sizes")
  async checkPageLoad() {
    const loadCheck = await this.page.evaluate(() => {
      const perf = window.performance;
      const loadTime = perf.timing.loadEventEnd - perf.timing.navigationStart;
      return loadTime < 3000;
    });
    expect(loadCheck, "Page should load quickly").toBeTruthy();
  }

  @Then("interactions should be responsive")
  async checkInteractions() {
    const interactionCheck = await this.page.evaluate(() => {
      const buttons = document.querySelectorAll("button");
      return Array.from(buttons).every((button) => {
        const style = window.getComputedStyle(button);
        return style.transition !== "none" && style.cursor === "pointer";
      });
    });
    expect(interactionCheck, "Interactions should be responsive").toBeTruthy();
  }

  @Then("no layout shifts should occur during loading")
  async checkLayoutShifts() {
    const layoutShiftCheck = await this.page.evaluate(() => {
      const entries = performance.getEntriesByType("layout-shift");
      const totalShiftScore = entries.reduce(
        (sum, entry) => sum + (entry as any).value,
        0
      );
      return totalShiftScore < 0.1;
    });
    expect(
      layoutShiftCheck,
      "No significant layout shifts should occur"
    ).toBeTruthy();
  }

  @Then("the viewport meta tag should be present in the HTML head")
  async checkViewportMetaTag() {
    const hasViewportMeta = await this.page.evaluate(() => {
      const viewportMeta = document.querySelector('meta[name="viewport"]');
      return !!viewportMeta;
    });
    expect(hasViewportMeta, "Viewport meta tag should be present").toBeTruthy();
  }

  @Then("the viewport should be set to width=device-width")
  async checkViewportWidth() {
    const hasCorrectWidth = await this.page.evaluate(() => {
      const viewportMeta = document.querySelector('meta[name="viewport"]');
      return viewportMeta
        ?.getAttribute("content")
        ?.includes("width=device-width");
    });
    expect(
      hasCorrectWidth,
      "Viewport width should be set to device-width"
    ).toBeTruthy();
  }

  @Then("the initial-scale should be set to 1.0")
  async checkInitialScale() {
    const hasCorrectScale = await this.page.evaluate(() => {
      const viewportMeta = document.querySelector('meta[name="viewport"]');
      return viewportMeta?.getAttribute("content")?.includes("initial-scale=1");
    });
    expect(hasCorrectScale, "Initial scale should be set to 1.0").toBeTruthy();
  }

  @When("I rotate the device from portrait to landscape")
  async rotateDevice() {
    const currentSize = await this.page.viewportSize();
    if (currentSize) {
      await this.setViewportSize(currentSize.height, currentSize.width);
    }
  }

  @Then("the page layout should adapt appropriately")
  async checkRotationLayout() {
    const layoutCheck =
      await this.humanSpaceflightPage.responsiveDesign.checkTabletLayout();
    expect(
      layoutCheck.hasAppropriateColumns,
      "Layout should adapt to rotation"
    ).toBeTruthy();
  }

  @Then("content should be properly displayed in landscape mode")
  async checkLandscapeContent() {
    const landscapeCheck = await this.page.evaluate(() => {
      const main = document.querySelector("main");
      return main
        ? main.getBoundingClientRect().width <= window.innerWidth
        : false;
    });
    expect(landscapeCheck, "Content should fit in landscape mode").toBeTruthy();
  }

  private async setViewportSize(width: number, height?: number): Promise<void> {
    await this.humanSpaceflightPage.responsiveDesign.setViewportSize(
      width,
      height
    );
  }

  private async checkSectionAdaptability(selector: string) {
    return await this.humanSpaceflightPage.responsiveDesign.checkSectionAdaptsToMobile(
      selector
    );
  }
}
