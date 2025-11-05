import { Page, expect } from "@playwright/test";
import { When, Then, Fixture } from "playwright-bdd/decorators";
import { DataTable } from "playwright-bdd";
import { HumanSpaceflightPage } from "../../../../pages/ui/HumanSpaceflightPage";
import {
  Requirement,
  parseAccessibilityRequirements,
} from "../../../../utils/types/Types";
import { AssertionHelper } from "../../../../utils/AssertionHelper";

@Fixture("keyboardAccessibilitySteps")
export class KeyboardAccessibilitySteps {
  private readonly ELEMENT_SELECTORS = {
    LINK: "a:visible",
    BUTTON: "button:visible",
    INPUT: "input:visible, textarea:visible, select:visible",
    INTERACTIVE: "a:visible, button:visible",
    NON_IMAGE_LINKS: "a:not(:has(img))",
    INTERACTIVE_ELEMENTS: 'a, button, input, [role="button"], [tabindex]',
  } as const;

  constructor(
    private page: Page,
    private humanSpaceflightPage: HumanSpaceflightPage,
    private assertionHelper: AssertionHelper
  ) {}

  @When("I navigate through the page using the Tab key")
  async navigateWithTabKey(): Promise<void> {
    await this.page.keyboard.press("Home");
    await this.page.waitForTimeout(100);

    const focusableElements = await this.page.$$(
      'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );

    for (let i = 0; i < Math.min(focusableElements.length, 50); i++) {
      await this.page.keyboard.press("Tab");
      await this.page.waitForTimeout(50);
    }
  }

  @Then("no keyboard traps should exist")
  async checkNoKeyboardTraps(): Promise<void> {
    const hasKeyboardTrap = await this.page.evaluate(() => {
      const focusableElements = Array.from(
        document.querySelectorAll(
          'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
        )
      );

      let currentIndex = 0;
      const maxIterations = focusableElements.length * 2;

      for (let i = 0; i < maxIterations; i++) {
        const currentElement = focusableElements[currentIndex] as HTMLElement;
        if (!currentElement) return true;

        currentIndex = (currentIndex + 1) % focusableElements.length;

        if (currentIndex === 0 && i >= focusableElements.length) {
          return false;
        }
      }

      return true;
    });

    expect(
      hasKeyboardTrap,
      "No keyboard traps should exist on the page"
    ).toBeFalsy();
  }

  @Then("each {word} should:")
  async checkKeyboardAccessibility(elementType: string, dataTable: DataTable) {
    const selector = this.getElementSelector(elementType);
    const requirements = parseAccessibilityRequirements(dataTable.hashes());
    const checks =
      await this.humanSpaceflightPage.accessibility.checkKeyboardAccessibility(
        selector
      );

    this.validateKeyboardAccessibility(checks, elementType, requirements);
  }

  private getElementSelector(elementType: string): string {
    const normalizedType = elementType.toLowerCase();
    const selectorMap: Record<string, string> = {
      link: this.ELEMENT_SELECTORS.LINK,
      button: this.ELEMENT_SELECTORS.BUTTON,
      input: this.ELEMENT_SELECTORS.INPUT,
    };

    const selector = selectorMap[normalizedType];
    if (!selector) {
      throw new Error(
        `Unsupported element type for accessibility check: ${elementType}`
      );
    }

    return selector;
  }

  private validateKeyboardAccessibility(
    checks: any,
    elementType: string,
    requirements: Requirement[]
  ): void {
    const requirementMap = new Map(
      requirements.map((req) => [req.Requirement, true])
    );

    if (requirementMap.has("Be keyboard focusable")) {
      expect(
        checks.isFocusable,
        `${elementType}s must be keyboard focusable`
      ).toBeTruthy();
    }

    if (requirementMap.has("Be keyboard operable")) {
      expect(
        checks.isOperable,
        `${elementType}s must be operable using keyboard`
      ).toBeTruthy();
    }
  }

  @Then("links and buttons should have descriptive text:")
  async checkDescriptiveText() {
    const results =
      await this.humanSpaceflightPage.accessibility.checkDescriptiveLinkText();
    expect(
      results.nonDescriptiveLinkCount,
      `Found ${results.nonDescriptiveLinkCount} links/buttons with non-descriptive text`
    ).toBe(0);
  }

  @Then("each menu item should:")
  async checkMenuItemAccessibility(dataTable: DataTable): Promise<void> {
    await this.checkKeyboardAccessibility("menu item", dataTable);
  }

  @Then("each video player should:")
  async checkVideoPlayerAccessibility(dataTable: DataTable): Promise<void> {
    await this.checkKeyboardAccessibility("video player", dataTable);
  }

  @Then("all links should have a consistent visual focus indicator")
  async checkFocusIndicator() {
    await this.assertionHelper.validateBooleanCheck(
      () =>
        this.humanSpaceflightPage.accessibility
          .checkKeyboardAccessibility(this.ELEMENT_SELECTORS.INTERACTIVE)
          .then((results) => results.hasFocusIndicator),
      "Interactive elements must show a visible focus indicator"
    );
  }

  @Then("all links should be distinguishable without relying on color alone")
  async checkLinkDistinguishability() {
    const hasUnderlines = await this.page
      .locator(this.ELEMENT_SELECTORS.NON_IMAGE_LINKS)
      .first()
      .evaluate((el: Element) => {
        const style = window.getComputedStyle(el);
        return (
          style.textDecorationLine.includes("underline") ||
          style.textDecoration.includes("underline")
        );
      })
      .catch(() => false);

    expect(
      hasUnderlines,
      "Links should be underlined or have another non-color visual cue"
    ).toBeTruthy();
  }
}
