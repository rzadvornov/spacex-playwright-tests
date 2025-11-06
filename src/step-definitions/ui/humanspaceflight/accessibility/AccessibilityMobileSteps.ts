import { Page, expect } from "@playwright/test";
import { DataTable } from "playwright-bdd";
import { When, Then, Fixture } from "playwright-bdd/decorators";
import { HumanSpaceflightPage } from "../../../../services/ui/HumanSpaceflightPage";
import {
  RequiredMobileOptimizationResult,
  MobileRequirement,
} from "../../../../utils/types/Types";

@Fixture("accessibilityMobileSteps")
export class AccessibilityMobileSteps {
  constructor(
    private page: Page,
    private humanSpaceflightPage: HumanSpaceflightPage
  ) {}

  @Then("the page should be mobile-friendly")
  async checkMobileFriendly() {
    const mobileOptimization =
      (await this.humanSpaceflightPage.performanceSEO.checkMobileOptimization()) as RequiredMobileOptimizationResult;

    this._assertMobileOptimization(
      mobileOptimization.textReadable,
      "Text should be readable on mobile devices"
    );

    this._assertMobileOptimization(
      mobileOptimization.touchTargetsSize,
      "Touch targets should be properly sized for mobile interaction"
    );

    this._assertMobileOptimization(
      mobileOptimization.noInterstitials,
      "No interstitials should block mobile content"
    );
  }

  @When("viewing on mobile device:")
  async setMobileViewport(dataTable: DataTable) {
    const mobileSettings = dataTable.hashes()[0];
    const viewportWidth = parseInt(
      mobileSettings["Viewport Width"].replace("px", "")
    );
    const viewportHeight = 812;

    await this.page.setViewportSize({
      width: viewportWidth,
      height: viewportHeight,
    });

    await this.page.waitForTimeout(500);
  }

  @Then("the page should provide optimal mobile experience including:")
  async verifyOptimalMobileExperience(dataTable: DataTable) {
    const requirements = dataTable.hashes() as unknown as MobileRequirement[];
    const requirementValidators = this._getRequirementValidators();

    for (const requirement of requirements) {
      const validator = requirementValidators[requirement.Requirement];
      if (!validator) {
        throw new Error(
          `Unknown mobile/accessibility requirement: ${requirement.Requirement}`
        );
      }
      await validator();
    }
  }

  private _assertMobileOptimization(
    condition: boolean | number,
    message: string
  ) {
    expect(condition, {
      message: message,
    }).toBeTruthy();
  }

  private _getRequirementValidators(): Record<string, () => Promise<void>> {
    return {
      "Proper Touch Target Size": this._checkTouchTargetSize,
      "Page Scaling": this._checkPageScaling,
      "Keyboard Navigation": this._checkKeyboardNavigation,
      "Focus Indicators": this._checkFocusIndicators,
    };
  }

  private _checkTouchTargetSize = async () => {
    const mobileOptimization =
      (await this.humanSpaceflightPage.performanceSEO.checkMobileOptimization()) as RequiredMobileOptimizationResult;
    this._assertMobileOptimization(
      mobileOptimization.touchTargetsSize,
      "Touch targets should be properly sized for mobile interaction"
    );
  };

  private _checkPageScaling = async () => {
    const mobileOptimization =
      (await this.humanSpaceflightPage.performanceSEO.checkMobileOptimization()) as RequiredMobileOptimizationResult;
    this._assertMobileOptimization(
      mobileOptimization.pageScaling,
      "Page scaling should be enabled via viewport meta tag"
    );
  };

  private _checkKeyboardNavigation = async () => {
    const accessibility =
      await this.humanSpaceflightPage.performanceSEO.checkAccessibility();
    this._assertMobileOptimization(
      accessibility.keyboardNavigable,
      "Page should be fully keyboard navigable"
    );
  };

  private _checkFocusIndicators = async () => {
    await this.page.keyboard.press("Tab");

    const focusedElement = await this.page.evaluate(() => {
      const active = document.activeElement as HTMLElement | null;
      if (!active || active.tagName === "BODY") return null;

      const style = window.getComputedStyle(active);
      return {
        tag: active.tagName,
        outline: style.outline,
        boxShadow: style.boxShadow,
      };
    });

    expect(focusedElement, {
      message: "Focus should land on an interactive element after tabbing",
    }).toBeDefined();

    const hasFocusIndicator =
      focusedElement!.outline !== "none" ||
      focusedElement!.boxShadow !== "none";

    this._assertMobileOptimization(
      hasFocusIndicator,
      `Focus indicators should be visible. Found: Outline: ${
        focusedElement!.outline
      }, BoxShadow: ${focusedElement!.boxShadow}`
    );
  };
}
