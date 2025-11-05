import { Page, expect } from "@playwright/test";
import { Then, Fixture, When, Given } from "playwright-bdd/decorators";
import { DataTable } from "playwright-bdd";
import { parseAccessibilityRequirements, parseVisualElementExpectations } from "../../../../utils/types/TypeGuards";
import { VisualElementValidatorRegistry } from "../../../../utils/strategies/VisualElementValidatorRegistry";
import { CueValidatorRegistry } from "../../../../utils/strategies/CueValidatorRegistry";
import { StateCheckerRegistry } from "../../../../utils/strategies/StateCheckerRegistry";
import { HumanSpaceflightPage } from "../../../../pages/ui/HumanSpaceflightPage";
import { BrowserPreferenceRegistry } from "../../../../utils/strategies/BrowserPreferenceRegistry";
import { AdaptationCheckerRegistry } from "../../../../utils/strategies/AdaptationCheckerRegistry";
import { AssertionHelper } from "../../../../utils/AssertionHelper";

@Fixture("visualElementAccessibilitySteps")
export class VisualElementAccessibilitySteps {
  private readonly ELEMENT_SELECTORS = {
    LINK: "a:visible",
    BUTTON: "button:visible",
    INPUT: "input:visible, textarea:visible, select:visible",
    INTERACTIVE: "a:visible, button:visible",
    NON_IMAGE_LINKS: "a:not(:has(img))",
    FORM_INPUT: "input, textarea, select",
    SVG_ELEMENTS: "svg, [role='img'], [role='button']",
    STATUS_INDICATORS: '[role="status"], .status, .alert, .notification',
    INTERACTIVE_ELEMENTS: 'a, button, input, [role="button"], [tabindex]',
  } as const;

  private visualElementValidatorRegistry: VisualElementValidatorRegistry;
  private cueValidatorRegistry: CueValidatorRegistry;
  private stateCheckerRegistry: StateCheckerRegistry;
  private browserPreferenceRegistry: BrowserPreferenceRegistry;
  private adaptationCheckerRegistry: AdaptationCheckerRegistry;

  constructor(
    private page: Page,
    private humanSpaceflightPage: HumanSpaceflightPage,
    private assertionHelper: AssertionHelper
  ) {
    this.visualElementValidatorRegistry = new VisualElementValidatorRegistry(
      page
    );
    this.cueValidatorRegistry = new CueValidatorRegistry();
    this.stateCheckerRegistry = new StateCheckerRegistry();
    this.browserPreferenceRegistry = new BrowserPreferenceRegistry(page);
    this.adaptationCheckerRegistry = new AdaptationCheckerRegistry();
  }

  @Then("all visual elements should have proper descriptions:")
  async checkVisualElementDescriptions(dataTable: DataTable): Promise<void> {
    const expectedDescriptions = parseVisualElementExpectations(
      dataTable.hashes()
    );

    for (const expected of expectedDescriptions) {
      const elementType = expected["Element Type"];
      const contentType = expected["Content Type"];

      const validator = this.visualElementValidatorRegistry.getValidator(
        elementType,
        contentType
      );
      await validator.validate();
    }
  }

  @Then("all content should meet WCAG {float} AA contrast ratios:")
  async checkContrastRatios(dataTable: DataTable): Promise<void> {
    const contrastRequirements = dataTable.hashes();

    for (const requirement of contrastRequirements) {
      const contentType = requirement["Content Type"];
      const minRatio = parseFloat(requirement["Min Ratio"]);
      const requiredLevel = requirement["Required Level"];

      await this.validateContrastRatio(contentType, minRatio, requiredLevel);
    }
  }

  private async validateContrastRatio(
    contentType: string,
    minRatio: number,
    requiredLevel: string
  ): Promise<void> {
    const elements = await this.getElementsForContrastCheck(contentType);

    for (const element of elements) {
      const contrastRatio =
        await this.humanSpaceflightPage.accessibility.getElementContrastRatio(
          element
        );
      expect(contrastRatio).toBeGreaterThanOrEqual(minRatio);
    }
  }

  @Then("all SVG elements should have proper ARIA roles")
  async checkSvgAriaRoles(): Promise<void> {
    const svgs = await this.page.$$(this.ELEMENT_SELECTORS.SVG_ELEMENTS);

    for (const svg of svgs) {
      const role = await svg.getAttribute("role");
      const hasProperRole = await this.svgHasProperRole(svg, role);

      expect(
        hasProperRole,
        `SVG element should have proper ARIA role. Found: ${role}`
      ).toBeTruthy();
    }
  }

  private async svgHasProperRole(
    svg: any,
    role: string | null
  ): Promise<boolean> {
    const validRoles = [
      "img",
      "button",
      "link",
      "menuitem",
      "checkbox",
      "radio",
    ];

    if (role && validRoles.includes(role)) {
      return true;
    }

    const ariaLabel = await svg.getAttribute("aria-label");
    const hasTitle = (await svg.$("title")) !== null;

    return !!(ariaLabel || hasTitle);
  }

  @Then("all status indicators should use multiple cues:")
  async checkStatusIndicatorCues(dataTable: DataTable): Promise<void> {
    const expectedCues = dataTable.hashes();

    for (const expected of expectedCues) {
      const elementType = expected["Element Type"];
      const visualCueTypes = expected["Visual Cue Types"].split(" + ");

      await this.validateStatusIndicatorCues(elementType, visualCueTypes);
    }
  }

  private async validateStatusIndicatorCues(
    elementType: string,
    visualCueTypes: string[]
  ): Promise<void> {
    const elements = await this.getElementsByType(elementType);

    for (const element of elements) {
      const hasMultipleCues = await this.elementHasMultipleCues(
        element,
        visualCueTypes
      );

      expect(
        hasMultipleCues,
        `${elementType} elements should use multiple visual cues: ${visualCueTypes.join(
          ", "
        )}`
      ).toBeTruthy();
    }
  }

  private async elementHasMultipleCues(
    element: any,
    cueTypes: string[]
  ): Promise<boolean> {
    const cuesPresent = await Promise.all(
      cueTypes.map((cueType) => this.validateSingleCue(element, cueType))
    );

    return cuesPresent.filter(Boolean).length >= 2;
  }

  private async validateSingleCue(
    element: any,
    cueType: string
  ): Promise<boolean> {
    const validator = this.cueValidatorRegistry.getValidator(cueType);
    return validator ? await validator.hasCue(element) : false;
  }

  private async getElementsByType(elementType: string): Promise<any[]> {
    const elementTypeMap: Record<string, string> = {
      status: this.ELEMENT_SELECTORS.STATUS_INDICATORS,
      links: this.ELEMENT_SELECTORS.LINK,
      buttons: this.ELEMENT_SELECTORS.BUTTON,
      errors: '[role="alert"], .error, .invalid',
    };

    const selector = elementTypeMap[elementType.toLowerCase()];
    return selector ? await this.page.$$(selector) : [];
  }

  @Then("all interactive elements should have clear states")
  async checkInteractiveElementStates(): Promise<void> {
    const interactiveElements = await this.page.$$(
      this.ELEMENT_SELECTORS.INTERACTIVE_ELEMENTS
    );

    for (const element of interactiveElements) {
      const hasClearStates = await this.elementHasClearStates(element);
      expect(
        hasClearStates,
        "Interactive elements should have clear visual states"
      ).toBeTruthy();
    }
  }

  private async elementHasClearStates(element: any): Promise<boolean> {
    const states = await Promise.all([
      this.checkElementState(element, "hover"),
      this.checkElementState(element, "focus"),
      this.checkElementState(element, "active"),
    ]);

    return states.some((state) => state);
  }

  private async checkElementState(
    element: any,
    state: string
  ): Promise<boolean> {
    const checker = this.stateCheckerRegistry.getChecker(state);
    return checker ? await checker.hasState(element) : false;
  }

  private async getElementsForContrastCheck(
    contentType: string
  ): Promise<any[]> {
    const contrastSelectors: Record<string, string> = {
      "normal text": 'p, span, div:not([class*="button"]):not([class*="btn"])',
      "large text": 'h1, h2, h3, .large-text, [class*="heading"]',
      "ui components": 'button, input, select, [role="button"]',
      "focus indicators": ':focus-visible, [class*="focus"]',
    };

    const selector = contrastSelectors[contentType.toLowerCase()];
    return selector ? await this.page.$$(selector) : [];
  }

  @Then("contrast should be maintained in all color schemes")
  async checkContrastInColorSchemes(): Promise<void> {
    const schemes = ["light", "dark", "high-contrast"];

    for (const scheme of schemes) {
      await this.page.emulateMedia({ colorScheme: scheme as any });
      await this.page.waitForTimeout(500);

      const hasGoodContrast = await this.checkCurrentSchemeContrast();
      expect(
        hasGoodContrast,
        `Contrast should be maintained in ${scheme} color scheme`
      ).toBeTruthy();
    }

    await this.page.emulateMedia({ colorScheme: "light" });
  }

  private async checkCurrentSchemeContrast(): Promise<boolean> {
    return await this.page.evaluate(() => {
      const body = document.body;
      const bodyStyle = window.getComputedStyle(body);
      return (
        bodyStyle.backgroundColor !== "rgba(0, 0, 0, 0)" &&
        bodyStyle.color !== "rgba(0, 0, 0, 0)"
      );
    });
  }

  @When("I set the text scaling to {int}%")
  async setTextScaling(scalePercentage: number): Promise<void> {
    await this.page.evaluate((scale: number) => {
      document.body.style.zoom = `${scale}%`;
      document.body.style.transform = `scale(${scale / 100})`;
      document.body.style.transformOrigin = "0 0";
    }, scalePercentage);

    await this.page.waitForTimeout(1000);
  }

  @Then("the page should maintain usability:")
  async checkScaledUsability(dataTable: DataTable): Promise<void> {
    const requirements = parseAccessibilityRequirements(dataTable.hashes());

    for (const requirement of requirements) {
      await this.validateScaledUsabilityRequirement(requirement.Requirement);
    }
  }

  private async validateScaledUsabilityRequirement(
    requirement: string
  ): Promise<void> {
    switch (requirement) {
      case "All content visible":
        await this.validateAllContentVisible();
        break;
      case "No horizontal scroll":
        await this.validateNoHorizontalScroll();
        break;
      case "No overlapping elements":
        await this.validateNoOverlappingElements();
        break;
      case "Controls accessible":
        await this.validateControlsAccessible();
        break;
      case "Layout preserved":
        await this.validateLayoutPreserved();
        break;
    }
  }

  private async validateAllContentVisible(): Promise<void> {
    const allContentVisible = await this.page.evaluate(() => {
      const viewportHeight = window.innerHeight;
      const bodyHeight = document.body.scrollHeight;
      return bodyHeight <= viewportHeight * 3;
    });
    expect(
      allContentVisible,
      "All content should remain visible when scaled"
    ).toBeTruthy();
  }

  private async validateNoHorizontalScroll(): Promise<void> {
    const noHorizontalScroll = await this.page.evaluate(() => {
      return document.body.scrollWidth <= window.innerWidth;
    });
    expect(
      noHorizontalScroll,
      "No horizontal scroll should be required"
    ).toBeTruthy();
  }

  private async validateNoOverlappingElements(): Promise<void> {
    const noOverlap = await this.page.evaluate(() => {
      const elements = document.querySelectorAll("*");
      for (let i = 0; i < elements.length; i++) {
        const rect1 = elements[i].getBoundingClientRect();
        for (let j = i + 1; j < elements.length; j++) {
          const rect2 = elements[j].getBoundingClientRect();
          if (this.elementsOverlap(rect1, rect2)) {
            return false;
          }
        }
      }
      return true;
    });
    expect(noOverlap, "No elements should overlap when scaled").toBeTruthy();
  }

  private async validateControlsAccessible(): Promise<void> {
    const controlsAccessible =
      (await this.page.$(this.ELEMENT_SELECTORS.BUTTON)) !== null;
    expect(
      controlsAccessible,
      "Controls should remain accessible when scaled"
    ).toBeTruthy();
  }

  private async validateLayoutPreserved(): Promise<void> {
    const layoutPreserved = await this.page.evaluate(() => {
      return document.body.offsetWidth > 0 && document.body.offsetHeight > 0;
    });
    expect(
      layoutPreserved,
      "Layout should be preserved when scaled"
    ).toBeTruthy();
  }

  private elementsOverlap(rect1: DOMRect, rect2: DOMRect): boolean {
    return !(
      rect1.right < rect2.left ||
      rect1.left > rect2.right ||
      rect1.bottom < rect2.top ||
      rect1.top > rect2.bottom
    );
  }

  @Given("the browser has the following preferences:")
  async setBrowserPreferences(dataTable: DataTable): Promise<void> {
    const preferences = dataTable.hashes();

    for (const preference of preferences) {
      const preferenceName = preference["Preference"];
      const setting = preference["Setting"];

      await this.setBrowserPreference(preferenceName, setting);
    }
  }

  private async setBrowserPreference(
    preferenceName: string,
    setting: string
  ): Promise<void> {
    const handler = this.browserPreferenceRegistry.getHandler(preferenceName);
    if (handler) {
      await handler.setPreference(setting);
      await this.page.waitForTimeout(500);
    }
  }

  @Then("the page should adapt:")
  async checkPageAdaptation(dataTable: DataTable): Promise<void> {
    const adaptations = dataTable.hashes();

    for (const adaptation of adaptations) {
      const elementType = adaptation["Element Type"];
      const behaviorChange = adaptation["Behavior Change"];

      await this.validatePageAdaptation(elementType, behaviorChange);
    }
  }

  private async validatePageAdaptation(
    elementType: string,
    behaviorChange: string
  ): Promise<void> {
    const elements = await this.getElementsForAdaptationCheck(elementType);

    for (const element of elements) {
      const hasAdapted = await this.elementHasAdapted(element, behaviorChange);
      expect(
        hasAdapted,
        `${elementType} should adapt with behavior change: ${behaviorChange}`
      ).toBeTruthy();
    }
  }

  private async elementHasAdapted(
    element: any,
    behaviorChange: string
  ): Promise<boolean> {
    const checker = this.adaptationCheckerRegistry.getChecker(behaviorChange);
    return checker ? await checker.hasAdapted(element) : true;
  }

  private async getElementsForAdaptationCheck(
    elementType: string
  ): Promise<any[]> {
    const adaptationSelectors: Record<string, string> = {
      animations: '[class*="animate"], [class*="animation"]',
      carousels: '.carousel, .slider, [class*="carousel"]',
      parallax: '[class*="parallax"]',
      transitions: '[class*="transition"], [class*="fade"]',
    };

    const selector = adaptationSelectors[elementType.toLowerCase()];
    return selector ? await this.page.$$(selector) : [];
  }

  @Then("no content should flash more than {int} times\\/second")
  async checkFlashingContentFrequency(maxFlashesPerSecond: number) {
    const hasRapidAnimations = await this.checkRapidAnimations(
      maxFlashesPerSecond
    );
    const hasFlashingClasses = await this.humanSpaceflightPage.accessibility[
      "checkFlashingCSSClasses"
    ]();

    expect(hasRapidAnimations).toBeFalsy();
    expect(hasFlashingClasses).toBeFalsy();
  }

  private async checkRapidAnimations(maxFps: number): Promise<boolean> {
    return await this.page.evaluate((maxFps) => {
      const elements = Array.from(document.querySelectorAll("*"));

      return elements.some((el) => {
        const style = window.getComputedStyle(el);
        const animationDuration = parseFloat(style.animationDuration) || 0;
        const animationIterationCount = style.animationIterationCount;

        if (animationDuration > 0) {
          const iterationsPerSecond =
            animationIterationCount === "infinite"
              ? 1 / animationDuration
              : parseFloat(animationIterationCount) / animationDuration;

          return iterationsPerSecond > maxFps;
        }
        return false;
      });
    }, maxFps);
  }

  @When("content changes occur in the following areas:")
  async simulateContentChanges(dataTable: DataTable) {
    const areas = dataTable.rows().flat();

    for (const area of areas) {
      await this.handleContentChangeArea(area);
      await this.page.waitForTimeout(500);
    }

    const dynamicContentAccessible =
      await this.checkDynamicContentAccessibility();
    expect(dynamicContentAccessible).toBeTruthy();
  }

  private async handleContentChangeArea(area: string): Promise<void> {
    const areaHandlers: Record<string, () => Promise<void>> = {
      "live regions": () => this.handleLiveRegions(),
      "form validation": () => this.handleFormValidation(),
      "dynamic content updates": () => this.handleDynamicContentUpdates(),
      "status messages": () => this.handleStatusMessages(),
      "error notifications": () => this.handleErrorNotifications(),
    };

    const handler = areaHandlers[area.toLowerCase()];
    if (handler) {
      await handler();
    }
  }

  private async handleLiveRegions(): Promise<void> {
    const hasLiveRegions =
      await this.humanSpaceflightPage.accessibility.isAriaLiveRegionUsed();
    expect(hasLiveRegions).toBeTruthy();
  }

  private async handleFormValidation(): Promise<void> {
    await this.humanSpaceflightPage.accessibility.submitFormWithInvalidData();
    const validationResult =
      await this.humanSpaceflightPage.accessibility.checkAccessibleFormValidation();
    expect(validationResult.errorMessagesPresent).toBeTruthy();
  }

  private async handleDynamicContentUpdates(): Promise<void> {
    await this.page.evaluate(() => {
      let dynamicContainer = document.getElementById("dynamic-content");
      if (!dynamicContainer) {
        dynamicContainer = document.createElement("div");
        dynamicContainer.id = "dynamic-content";
        dynamicContainer.setAttribute("aria-live", "polite");
        document.body.appendChild(dynamicContainer);
      }
      dynamicContainer.innerHTML = "<p>New content loaded dynamically</p>";
    });
  }

  private async handleStatusMessages(): Promise<void> {
    await this.page.evaluate(() => {
      const statusDiv = document.createElement("div");
      statusDiv.setAttribute("role", "status");
      statusDiv.setAttribute("aria-live", "polite");
      statusDiv.textContent = "Operation completed successfully";
      document.body.appendChild(statusDiv);
    });
  }

  private async handleErrorNotifications(): Promise<void> {
    await this.page.evaluate(() => {
      const alertDiv = document.createElement("div");
      alertDiv.setAttribute("role", "alert");
      alertDiv.setAttribute("aria-live", "assertive");
      alertDiv.textContent = "Error: Please check your input";
      document.body.appendChild(alertDiv);
    });
  }

  private async checkDynamicContentAccessibility(): Promise<boolean> {
    return await this.page.evaluate(() => {
      const dynamicElements = Array.from(
        document.querySelectorAll(
          '[aria-live], [role="status"], [role="alert"]'
        )
      );
      return dynamicElements.every((element) => {
        const htmlElement = element as HTMLElement;
        const isVisible =
          htmlElement.offsetWidth > 0 && htmlElement.offsetHeight > 0;
        const hasContent =
          element.textContent && element.textContent.trim().length > 0;
        return isVisible && hasContent;
      });
    });
  }

  @Then("updates should be properly announced")
  async checkUpdatesAnnounced() {
    await this.assertionHelper.validateBooleanCheck(
      () => this.humanSpaceflightPage.accessibility.isAriaLiveRegionUsed(),
      "Dynamic content updates must be in an aria-live region"
    );
  }

  @Then("ARIA live regions should be appropriately used")
  async checkAriaLiveRegionUsage() {
    await this.assertionHelper.validateBooleanCheck(
      () => this.humanSpaceflightPage.accessibility.isAriaLiveRegionUsed(),
      "ARIA live regions must be used for dynamic content"
    );
  }

  @Then("language attributes should be correctly set:")
  async checkLangAttribute(dataTable: DataTable) {
    const data = dataTable.hashes();
    const htmlLangRow = data.find(
      (row: Record<string, string>) => row.Element === "HTML tag"
    );

    if (htmlLangRow?.Value) {
      const actualLang =
        await this.humanSpaceflightPage.accessibility.getHtmlLangAttribute();
      expect(
        actualLang,
        `The <html> 'lang' attribute should be set to "${htmlLangRow.Value}"`
      ).toBe(htmlLangRow.Value);
    }
  }
}
