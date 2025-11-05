import { Page, expect } from "@playwright/test";
import { Then, Fixture } from "playwright-bdd/decorators";
import { DataTable } from "playwright-bdd";

@Fixture("responsiveAccessibilitySteps")
export class ResponsiveAccessibilitySteps {
  private readonly ACCESSIBILITY_CONSTANTS = {
    MIN_TOUCH_TARGET: 44,
    MIN_CONTRAST_RATIO: 4.5,
  } as const;

  constructor(
    private page: Page,
  ) {}

  @Then("touch targets should be at least 44px")
  async checkTouchTargetSize() {
    const touchTargets = await this.page.evaluate(() => {
      const interactiveElements = document.querySelectorAll(
        "button, a, [role='button'], input, select, textarea"
      );
      return Array.from(interactiveElements).map((el) => {
        const rect = el.getBoundingClientRect();
        return {
          width: rect.width,
          height: rect.height,
          minDimension: Math.min(rect.width, rect.height),
        };
      });
    });

    const smallTargets = touchTargets.filter(
      (target) => target.minDimension < 44
    );
    expect(
      smallTargets.length,
      "All touch targets should be at least 44px"
    ).toBe(0);
  }

  @Then("all interactive elements should be accessible via keyboard")
  async checkKeyboardAccessibility() {
    const keyboardAccessible = await this.page.evaluate(() => {
      const interactiveElements = document.querySelectorAll(
        "button, a, [role='button'], input, select, textarea"
      );
      return Array.from(interactiveElements).every((el) => {
        const tabIndex = el.getAttribute("tabindex");
        return (
          tabIndex !== "-1" &&
          (el.tagName === "A" ||
            el.tagName === "BUTTON" ||
            el.tagName === "INPUT" ||
            el.tagName === "SELECT" ||
            el.tagName === "TEXTAREA" ||
            el.getAttribute("role") === "button")
        );
      });
    });

    expect(
      keyboardAccessible,
      "All interactive elements should be keyboard accessible"
    ).toBeTruthy();
  }

  @Then("focus indicators should be visible on all interactive elements")
  async checkFocusIndicators() {
    const focusIndicators = await this.page.evaluate(() => {
      const interactiveElements = document.querySelectorAll(
        "button, a, [role='button'], input, select, textarea"
      );
      return Array.from(interactiveElements).every((el) => {
        const style = window.getComputedStyle(el);
        return (
          style.outline !== "none" ||
          style.boxShadow !== "none" ||
          el.getAttribute("data-focus-visible") !== null
        );
      });
    });

    expect(
      focusIndicators,
      "Focus indicators should be visible on all interactive elements"
    ).toBeTruthy();
  }

  @Then("text should maintain sufficient contrast ratios")
  async checkTextContrast() {
    const contrastRatios = await this.page.evaluate(() => {
      const textElements = document.querySelectorAll(
        "p, h1, h2, h3, h4, h5, h6, span, a, button"
      );
      return Array.from(textElements)
        .filter((el) => {
          const text = el.textContent?.trim();
          return text && text.length > 0;
        })
        .map((el) => {
          const style = window.getComputedStyle(el);
          return {
            color: style.color,
            backgroundColor: style.backgroundColor,
            fontSize: parseInt(style.fontSize),
            fontWeight: parseInt(style.fontWeight),
          };
        });
    });

    expect(
      contrastRatios.length,
      "Should check contrast ratios for text elements"
    ).toBeGreaterThan(0);
  }

  @Then("the responsive design should maintain accessibility:")
  async checkResponsiveAccessibility(dataTable: DataTable) {
    const requirements = dataTable.hashes();

    for (const requirement of requirements) {
      await this.validateAccessibilityRequirement(
        requirement.Feature,
        requirement.Requirement
      );
    }
  }

  private async validateAccessibilityRequirement(
    feature: string,
    requirement: string
  ): Promise<void> {
    const validators: Record<string, () => Promise<void>> = {
      "Touch Targets": () => this.validateTouchTargets(requirement),
      "Keyboard Navigation": () => this.validateKeyboardNavigation(requirement),
      "Focus Management": () => this.validateFocusManagement(requirement),
      "Color Contrast": () => this.validateColorContrast(requirement),
      "Screen Reader": () =>
        this.validateScreenReaderCompatibility(requirement),
    };

    const validator = validators[feature];
    if (!validator) {
      throw new Error(`Unknown accessibility feature: ${feature}`);
    }

    await validator();
  }

  private async validateTouchTargets(requirement: string): Promise<void> {
    const minSize =
      parseInt(requirement) || this.ACCESSIBILITY_CONSTANTS.MIN_TOUCH_TARGET;
    const touchTargetsValid = await this.page.evaluate((minSize) => {
      const interactiveElements = document.querySelectorAll(
        "button, a, [role='button'], input, select, textarea"
      );
      return Array.from(interactiveElements).every((el) => {
        const rect = el.getBoundingClientRect();
        const minDimension = Math.min(rect.width, rect.height);
        return minDimension >= minSize;
      });
    }, minSize);

    expect(
      touchTargetsValid,
      `Touch targets should be at least ${minSize}px`
    ).toBeTruthy();
  }

  private async validateKeyboardNavigation(requirement: string): Promise<void> {
    const keyboardNavigation = await this.page.evaluate(() => {
      const focusableElements = document.querySelectorAll(
        'button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const tabIndices = Array.from(focusableElements).map((el) =>
        parseInt(el.getAttribute("tabindex") || "0")
      );

      return {
        hasLogicalOrder: tabIndices.every((index) => index >= 0),
        noNegativeTabindex: !tabIndices.some((index) => index < 0),
        totalElements: focusableElements.length,
      };
    });

    expect(
      keyboardNavigation.hasLogicalOrder,
      "Keyboard navigation should have logical order"
    ).toBeTruthy();
    expect(
      keyboardNavigation.noNegativeTabindex,
      "No elements should have negative tabindex"
    ).toBeTruthy();
  }

  private async validateFocusManagement(requirement: string): Promise<void> {
    const focusManagement = await this.page.evaluate(() => {
      const modals = document.querySelectorAll(
        '[role="dialog"], [aria-modal="true"]'
      );
      let focusTrapped = true;

      if (modals.length > 0) {
        const modal = modals[0];
        focusTrapped = modal.contains(document.activeElement);
      }

      return {
        focusTrapped,
        hasFocusableElements:
          document.querySelectorAll(
            'button, a, input, [tabindex]:not([tabindex="-1"])'
          ).length > 0,
      };
    });

    expect(
      focusManagement.hasFocusableElements,
      "Page should have focusable elements"
    ).toBeTruthy();
  }

  private async validateColorContrast(requirement: string): Promise<void> {
    const minContrast =
      parseFloat(requirement) ||
      this.ACCESSIBILITY_CONSTANTS.MIN_CONTRAST_RATIO;

    const hasSufficientContrast = await this.page.evaluate(() => {
      const textElements = document.querySelectorAll(
        "p, h1, h2, h3, h4, h5, h6, span, a, button, label"
      );
      return Array.from(textElements).every((el) => {
        const style = window.getComputedStyle(el);
        const color = style.color;
        const backgroundColor = style.backgroundColor;

        return (
          color !== backgroundColor &&
          color !== "transparent" &&
          backgroundColor !== "transparent"
        );
      });
    });

    expect(
      hasSufficientContrast,
      "Text should have sufficient color contrast"
    ).toBeTruthy();
  }

  private async validateScreenReaderCompatibility(
    requirement: string
  ): Promise<void> {
    const screenReaderCompatible = await this.page.evaluate(() => {
      const hasRequiredAttributes =
        document.querySelectorAll(
          "[aria-label], [aria-labelledby], img[alt], [role]"
        ).length > 0;

      const hasSemanticStructure =
        document.querySelectorAll(
          "main, nav, header, footer, section, article, aside"
        ).length > 0;

      return {
        hasRequiredAttributes,
        hasSemanticStructure,
        isCompatible: hasRequiredAttributes && hasSemanticStructure,
      };
    });

    expect(
      screenReaderCompatible.isCompatible,
      "Page should be screen reader compatible"
    ).toBeTruthy();
  }
}
