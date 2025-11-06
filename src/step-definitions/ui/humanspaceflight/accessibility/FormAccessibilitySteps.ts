import { Page, expect, Locator } from "@playwright/test";
import { Then, Fixture, When } from "playwright-bdd/decorators";
import { DataTable } from "playwright-bdd";
import { HumanSpaceflightPage } from "../../../../services/ui/HumanSpaceflightPage";
import {
  parseAccessibilityRequirements,
  parseFormElementExpectations,
} from "../../../../utils/types/TypeGuards";
import { InputAccessibilityRequirement } from "../../../../utils/types/Types";
import { FormElementMatcherRegistry } from "../../../../utils/strategies/FormElementMatcherRegistry";

@Fixture("formAccessibilitySteps")
export class FormAccessibilitySteps {
  private readonly ELEMENT_SELECTORS = {
    FORM_INPUT: "input, textarea, select",
  } as const;

  private formElementMatcherRegistry: FormElementMatcherRegistry;

  constructor(
    private page: Page,
    private humanSpaceflightPage: HumanSpaceflightPage
  ) {
    this.formElementMatcherRegistry = new FormElementMatcherRegistry();
  }

  @When("I examine all form inputs on the page")
  async examineAllFormInputs(): Promise<void> {
    await this.page.waitForLoadState("domcontentloaded");
  }

  @Then("each form element should have correct attributes:")
  async checkFormElementAttributes(dataTable: DataTable): Promise<void> {
    const expectedAttributes = parseFormElementExpectations(dataTable.hashes());

    for (const expected of expectedAttributes) {
      const elementType = expected["Element Type"];
      const labelType = expected["Label Type"];
      const requirements = expected["Requirements"];

      await this.validateFormElementAttributes(
        elementType,
        labelType,
        requirements
      );
    }
  }

  private async validateFormElementAttributes(
    elementType: string,
    labelType: string,
    requirements: string
  ): Promise<void> {
    const elements = await this.page.$$(this.ELEMENT_SELECTORS.FORM_INPUT);

    for (const element of elements) {
      const tagName = await element.evaluate((el: Element) =>
        el.tagName.toLowerCase()
      );
      const inputType = await element.getAttribute("type");

      if (this.matchesFormElementType(tagName, inputType, elementType)) {
        await this.validateIndividualFormElement(
          element,
          labelType,
          requirements
        );
      }
    }
  }

  private async validateIndividualFormElement(
    element: any,
    labelType: string,
    requirements: string
  ): Promise<void> {
    const hasLabel = await this.checkFormElementHasLabel(element, labelType);
    const meetsRequirements = await this.checkFormElementRequirements(
      element,
      requirements
    );

    expect(
      hasLabel && meetsRequirements,
      `Form element should have ${labelType} label and meet requirements: ${requirements}`
    ).toBeTruthy();
  }

  private async checkFormElementRequirements(
    element: any,
    requirements: string
  ): Promise<boolean> {
    const requirementChecks = requirements.split(",").map((req) => req.trim());

    for (const requirement of requirementChecks) {
      const isValid = await this.validateSingleRequirement(
        element,
        requirement
      );
      if (!isValid) return false;
    }

    return true;
  }

  private async validateSingleRequirement(
    element: any,
    requirement: string
  ): Promise<boolean> {
    switch (requirement) {
      case "visible":
        return await element.isVisible();
      case "associated":
        return await this.hasAssociatedLabel(element);
      case "descriptive":
        return await this.hasDescriptiveAttributes(element);
      case "clear purpose":
        return await this.hasClearPurpose(element);
      case "unique":
        return await this.hasUniqueId(element);
      case "adjacent":
        return await this.hasAdjacentLabel(element);
      case "clear state":
        return await this.hasClearState(element);
      case "grouped":
        return await this.isGroupedInFieldset(element);
      case "legend present":
        return await this.hasLegend(element);
      default:
        return true;
    }
  }

  private async hasAssociatedLabel(element: any): Promise<boolean> {
    const id = await element.getAttribute("id");
    return id ? !!(await this.page.$(`label[for="${id}"]`)) : false;
  }

  private async hasDescriptiveAttributes(element: any): Promise<boolean> {
    const ariaLabel = await element.getAttribute("aria-label");
    const placeholder = await element.getAttribute("placeholder");
    return !!(ariaLabel || placeholder);
  }

  private async hasClearPurpose(element: any): Promise<boolean> {
    const ariaLabel = await element.getAttribute("aria-label");
    return !!(ariaLabel && ariaLabel.length >= 3);
  }

  private async hasUniqueId(element: any): Promise<boolean> {
    const id = await element.getAttribute("id");
    if (!id) return true;

    const duplicateIds = await this.page.$$(`#${id}`);
    return duplicateIds.length <= 1;
  }

  private async hasAdjacentLabel(element: any): Promise<boolean> {
    const previousSibling = await element.evaluateHandle(
      (el: Element) => el.previousElementSibling
    );
    const isLabel = await (previousSibling as any).evaluate(
      (el: Element) => el.tagName.toLowerCase() === "label"
    );
    return isLabel;
  }

  private async hasClearState(element: any): Promise<boolean> {
    const checked = await element.getAttribute("checked");
    const ariaChecked = await element.getAttribute("aria-checked");
    return checked !== null || ariaChecked !== null;
  }

  private async isGroupedInFieldset(element: any): Promise<boolean> {
    const fieldset = await element.evaluateHandle((el: Element) =>
      el.closest("fieldset")
    );
    return !!(fieldset as any).asElement();
  }

  private async hasLegend(element: any): Promise<boolean> {
    const fieldset = await element.evaluateHandle((el: Element) =>
      el.closest("fieldset")
    );
    const legend = await (fieldset as any).evaluateHandle((fs: Element) =>
      fs.querySelector("legend")
    );
    return !!(legend as any).asElement();
  }

  private async checkFormElementHasLabel(
    element: any,
    labelType: string
  ): Promise<boolean> {
    switch (labelType) {
      case "label tag":
        return this.hasLabelTag(element);
      case "aria-label":
        return this.hasAriaLabel(element);
      case "fieldset":
        return this.hasFieldset(element);
      default:
        return false;
    }
  }

  private async hasLabelTag(element: any): Promise<boolean> {
    const id = await element.getAttribute("id");
    return id ? !!(await this.page.$(`label[for="${id}"]`)) : false;
  }

  private async hasAriaLabel(element: any): Promise<boolean> {
    const ariaLabel = await element.getAttribute("aria-label");
    return !!(ariaLabel && ariaLabel.length > 0);
  }

  private async hasFieldset(element: any): Promise<boolean> {
    const fieldset = await element.evaluateHandle((el: Element) =>
      el.closest("fieldset")
    );
    return !!(fieldset as any).asElement();
  }

  private matchesFormElementType(
    tagName: string,
    inputType: string | null,
    expectedType: string
  ): boolean {
    const matcher = this.formElementMatcherRegistry.getMatcher(expectedType);
    return matcher ? matcher.matches(tagName, inputType) : false;
  }

  @Then(
    "all form controls should be keyboard accessible, including custom components"
  )
  async checkAllFormControlsKeyboardAccessible() {
    const result =
      await this.humanSpaceflightPage.accessibility.checkKeyboardAccessibility(
        "form input, form select, form textarea, form button"
      );
    expect(result.isFocusable, "All form controls should be focusable").toBe(
      true
    );
    expect(result.isOperable, "All form controls should be operable").toBe(
      true
    );
  }

  @Then("the form should be submittable using only the keyboard")
  async checkFormSubmittableWithKeyboard() {
    const isSubmittable = await this._checkFormCanSubmitWithKeyboard();
    expect(
      isSubmittable,
      "The form should have a keyboard-accessible submit button"
    ).toBeTruthy();
  }

  @Then("each form input should:")
  async checkFormInputAccessibility(dataTable: DataTable): Promise<void> {
    const requirements =
      dataTable.hashes() as unknown as InputAccessibilityRequirement[];
    const inputLocators = await this._getAllFormInputLocators();

    for (const locator of inputLocators) {
      for (const requirement of requirements) {
        await this._validateFormInputRequirement(locator, requirement);
      }
    }
  }

  @When("I submit a form with invalid data")
  async submitForm() {
    await this.humanSpaceflightPage.accessibility.submitFormWithInvalidData();
  }

  @Then("form should remain usable with assistive tech")
  async checkFormAssistiveTechUsability() {
    const [
      hasProperLabels,
      hasAriaLabels,
      hasErrorIndicators,
      isKeyboardAccessible,
    ] = await Promise.all([
      this.checkFormHasProperLabels(),
      this.checkFormHasValidAriaAttributes(),
      this.checkFormHasErrorIndicators(),
      this.checkFormIsKeyboardAccessible(),
    ]);

    expect(hasProperLabels).toBeTruthy();
    expect(hasAriaLabels).toBeTruthy();
    expect(hasErrorIndicators).toBeTruthy();
    expect(isKeyboardAccessible).toBeTruthy();

    const canSubmitWithKeyboard = await this.checkFormCanSubmitWithKeyboard();
    expect(canSubmitWithKeyboard).toBeTruthy();
  }

  @Then("placeholders should only supplement labels")
  async checkPlaceholdersSupplementLabels(): Promise<void> {
    const inputsWithPlaceholders = await this.page.$$(
      "input[placeholder], textarea[placeholder]"
    );

    for (const input of inputsWithPlaceholders) {
      const placeholder = await input.getAttribute("placeholder");
      const hasLabel = await this.inputHasProperLabel(input);

      expect(
        hasLabel,
        `Input with placeholder "${placeholder}" should also have a proper label`
      ).toBeTruthy();
    }
  }

  @Then("validation should be accessible:")
  async checkValidationAccessibility(dataTable: DataTable) {
    const results =
      await this.humanSpaceflightPage.accessibility.checkAccessibleFormValidation();

    const requirements = parseAccessibilityRequirements(dataTable.hashes());
    const validators = this._getValidationValidators(results);

    for (const requirement of requirements) {
      const validator = validators[requirement.Requirement];
      if (!validator) {
        throw new Error(
          `Unknown validation accessibility requirement: ${requirement.Requirement}`
        );
      }
      await validator();
    }
  }

  private async checkFormCanSubmitWithKeyboard(): Promise<boolean> {
    return await this.page.evaluate(() => {
      const submitButtons = Array.from(
        document.querySelectorAll(
          'form button[type="submit"], form input[type="submit"]'
        )
      );
      return submitButtons.some((button) => {
        const tabIndex = button.hasAttribute("tabindex")
          ? parseInt(button.getAttribute("tabindex")!)
          : 0;
        const disabled = button.hasAttribute("disabled");
        return tabIndex >= 0 && !disabled;
      });
    });
  }

  private async checkFormIsKeyboardAccessible(): Promise<boolean> {
    const result =
      await this.humanSpaceflightPage.accessibility.checkKeyboardAccessibility(
        "form input, form select, form textarea, form button"
      );
    return result.isFocusable && result.isOperable;
  }

  private async checkFormHasErrorIndicators(): Promise<boolean> {
    const validationResult =
      await this.humanSpaceflightPage.accessibility.checkAccessibleFormValidation();
    return validationResult.errorMessagesPresent;
  }

  private async checkFormHasValidAriaAttributes(): Promise<boolean> {
    return await this.page.evaluate(() => {
      const formElements = Array.from(
        document.querySelectorAll("form input, form select, form textarea")
      );
      return formElements.every((element) => {
        const ariaInvalid = element.getAttribute("aria-invalid");
        const ariaRequired = element.getAttribute("aria-required");
        const hasValidAria =
          ariaInvalid !== "true" &&
          (ariaRequired === null || ariaRequired === "true");
        return hasValidAria;
      });
    });
  }

  private async checkFormHasProperLabels(): Promise<boolean> {
    return await this.page.evaluate(() => {
      const formElements = Array.from(
        document.querySelectorAll("form input, form select, form textarea")
      );
      return formElements.every((element) => {
        const id = element.getAttribute("id");
        const hasLabel = id
          ? document.querySelector(`label[for="${id}"]`) !== null
          : false;
        const hasAriaLabel =
          element.hasAttribute("aria-label") ||
          element.hasAttribute("aria-labelledby");
        const hasTitle = element.hasAttribute("title");
        return hasLabel || hasAriaLabel || hasTitle;
      });
    });
  }

  private async inputHasProperLabel(input: any): Promise<boolean> {
    const id = await input.getAttribute("id");
    if (id && (await this.page.$(`label[for="${id}"]`))) return true;

    const ariaLabel = await input.getAttribute("aria-label");
    if (ariaLabel?.length) return true;

    const ariaLabelledBy = await input.getAttribute("aria-labelledby");
    if (ariaLabelledBy && (await this.page.$(`#${ariaLabelledBy}`)))
      return true;

    const parentLabel = await input.evaluateHandle((el: Element) =>
      el.closest("label")
    );
    return !!(parentLabel as any).asElement();
  }

  private async _getAllFormInputLocators(): Promise<Locator[]> {
    const selectors =
      "form input:not([type='hidden']), form select, form textarea, form button:not([type='submit'])";
    return this.page.locator(selectors).all();
  }

  private async _validateFormInputRequirement(
    locator: Locator,
    requirement: InputAccessibilityRequirement
  ): Promise<void> {
    const validators = this._getInputAccessibilityValidators(locator);
    const validator = validators[requirement.Requirement];

    if (!validator) {
      throw new Error(
        `Unknown form input accessibility requirement: ${requirement.Requirement}`
      );
    }
    await validator(requirement.Status);
  }

  private _getInputAccessibilityValidators(
    locator: Locator
  ): Record<string, (status: string) => Promise<void>> {
    return {
      "Be keyboard focusable": (status: string) =>
        this._checkKeyboardFocusable(locator, status),
      "Be operable with Enter/Space": (status: string) =>
        this._checkOperable(locator, status),
      "Have a clear label": (status: string) =>
        this._checkLabelPresence(locator, status),
      "Have a unique name/ID": (status: string) =>
        this._checkUniqueNameAndID(locator, status),
      "Meet color contrast": (status: string) =>
        this._checkColorContrast(locator, status),
    };
  }

  private async _checkKeyboardFocusable(
    locator: Locator,
    status: string
  ): Promise<void> {
    const isFocusable = await locator.evaluate((el) => {
      const element = el as HTMLElement;
      return (
        element.tabIndex >= 0 &&
        getComputedStyle(element).visibility !== "hidden" &&
        getComputedStyle(element).display !== "none"
      );
    });

    const name = await this._getLocatorDebugName(locator);

    expect(
      isFocusable,
      `Input (${name}) should be keyboard focusable (Expected: ${status})`
    ).toBe(
      status.toLowerCase() === "true" ||
        status.toLowerCase() === "present" ||
        status.toLowerCase() === "visible"
    );
  }

  private async _checkOperable(
    locator: Locator,
    status: string
  ): Promise<void> {
    const isOperable = await locator.isEnabled();

    const name = await this._getLocatorDebugName(locator);

    expect(
      isOperable,
      `Input (${name}) should be operable with Enter/Space (Expected: ${status})`
    ).toBe(
      status.toLowerCase() === "true" || status.toLowerCase() === "enabled"
    );
  }

  private async _checkLabelPresence(
    locator: Locator,
    status: string
  ): Promise<void> {
    const hasLabel = await locator.evaluate((el) => {
      const element = el as HTMLElement;
      const id = element.id;
      const tagName = element.tagName.toLowerCase();

      if (
        element.getAttribute("aria-label") ||
        element.getAttribute("aria-labelledby")
      )
        return true;

      if (id) {
        return !!document.querySelector(`label[for="${id}"]:not([hidden])`);
      }

      if (
        ["input", "select", "textarea"].includes(tagName) &&
        element.parentElement?.tagName.toLowerCase() === "label"
      ) {
        return true;
      }

      return false;
    });

    const name = await this._getLocatorDebugName(locator);

    expect(
      hasLabel,
      `Input (${name}) should have a clear label (Expected: ${status})`
    ).toBe(
      status.toLowerCase() === "true" || status.toLowerCase() === "present"
    );
  }

  private async _checkUniqueNameAndID(
    locator: Locator,
    status: string
  ): Promise<void> {
    const hasUniqueId = await locator.evaluate((el) => !!el.id);
    const hasName = await locator.evaluate((el) => !!el.getAttribute("name"));

    const isUnique = hasUniqueId && hasName;

    const name = await this._getLocatorDebugName(locator);

    expect(
      isUnique,
      `Input (${name}) should have a name attribute and an ID for unique labeling (Expected: ${status})`
    ).toBe(
      status.toLowerCase() === "true" || status.toLowerCase() === "present"
    );
  }

  private async _checkColorContrast(
    locator: Locator,
    status: string
  ): Promise<void> {
    const selector = await locator.toString().split("@")[0].trim();

    const isContrastSufficient =
      await this.humanSpaceflightPage.accessibility.checkElementColorContrast(
        selector
      );

    const name = await this._getLocatorDebugName(locator);

    expect(
      isContrastSufficient,
      `Input (${name}) text/background contrast should meet WCAG AA (Expected: ${status})`
    ).toBe(status.toLowerCase() === "true" || status.toLowerCase() === "meet");
  }

  private async _getLocatorDebugName(locator: Locator): Promise<string> {
    const tagName = await locator.evaluate((el) => el.tagName.toLowerCase());
    const type = await locator.getAttribute("type");
    const name = await locator.getAttribute("name");
    const label =
      (await locator.getAttribute("aria-label")) ||
      (await locator.textContent());

    return `${tagName}${type ? `[type=${type}]` : ""}${
      name ? `[name=${name}]` : ""
    } - "${label?.trim().substring(0, 20) || "no label"}"`;
  }

  private async _checkFormCanSubmitWithKeyboard(): Promise<boolean> {
    return await this.page.evaluate(() => {
      const submitButtons = Array.from(
        document.querySelectorAll(
          'form button[type="submit"], form input[type="submit"]'
        )
      );
      return submitButtons.some((button) => {
        const tabIndex = button.hasAttribute("tabindex")
          ? parseInt(button.getAttribute("tabindex")!)
          : 0;
        const disabled = button.hasAttribute("disabled");
        return tabIndex >= 0 && !disabled;
      });
    });
  }

  private _getValidationValidators(
    results: any
  ): Record<string, () => Promise<void>> {
    return {
      "Error Messages": () => this._validateErrorMessages(results),
      "Error Location": () => this._validateErrorLocation(results),
      "Focus Management": () => this._validateFocusManagement(results),
      Instructions: () => this._validateInstructions(results),
    };
  }

  private async _validateErrorMessages(results: any): Promise<void> {
    expect(
      results.errorMessagesPresent,
      "Clear, descriptive error messages should be visible"
    ).toBeTruthy();
  }

  private async _validateErrorLocation(results: any): Promise<void> {
    expect(
      results.errorLocationEasilyIdentifiable,
      "Error location should be easily identifiable (e.g., visual cue, ARIA)"
    ).toBeTruthy();
  }

  private async _validateFocusManagement(results: any): Promise<void> {
    expect(
      results.focusMovesToFirstError,
      "Focus should automatically move to the first erroneous field or error summary"
    ).toBeTruthy();
  }

  private async _validateInstructions(results: any): Promise<void> {
    expect(
      results.instructionsExplainHowToFix,
      "Error instructions should explain how to fix the error"
    ).toBeTruthy();
  }
}
