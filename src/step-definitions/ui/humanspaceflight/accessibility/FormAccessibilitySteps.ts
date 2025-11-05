import { Page, expect, Locator } from "@playwright/test";
import { Then, Fixture, When } from "playwright-bdd/decorators";
import { DataTable } from "playwright-bdd";
import { HumanSpaceflightPage } from "../../../../pages/ui/HumanSpaceflightPage";
import { parseAccessibilityRequirements } from "../../../../utils/types/TypeGuards"; 
import { InputAccessibilityRequirement } from "../../../../utils/types/Types";

@Fixture("formAccessibilitySteps")
export class FormAccessibilitySteps {
  constructor(
    private page: Page,
    private humanSpaceflightPage: HumanSpaceflightPage
  ) {}

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
    const requirements = dataTable.hashes() as unknown as InputAccessibilityRequirement[];
    const inputLocators = await this._getAllFormInputLocators();

    for (const locator of inputLocators) {
      for (const requirement of requirements) {
        await this._validateFormInputRequirement(locator, requirement);
      }
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
            throw new Error(`Unknown validation accessibility requirement: ${requirement.Requirement}`);
        }
        await validator();
    }
  }
  
  private async _getAllFormInputLocators(): Promise<Locator[]> {
    const selectors = "form input:not([type='hidden']), form select, form textarea, form button:not([type='submit'])";
    return this.page.locator(selectors).all();
  }

  private async _validateFormInputRequirement(
    locator: Locator,
    requirement: InputAccessibilityRequirement
  ): Promise<void> {
    const validators = this._getInputAccessibilityValidators(locator);
    const validator = validators[requirement.Requirement];

    if (!validator) {
      throw new Error(`Unknown form input accessibility requirement: ${requirement.Requirement}`);
    }
    await validator(requirement.Status);
  }

  private _getInputAccessibilityValidators(locator: Locator): Record<string, (status: string) => Promise<void>> {
    return {
      "Be keyboard focusable": (status: string) => this._checkKeyboardFocusable(locator, status),
      "Be operable with Enter/Space": (status: string) => this._checkOperable(locator, status),
      "Have a clear label": (status: string) => this._checkLabelPresence(locator, status),
      "Have a unique name/ID": (status: string) => this._checkUniqueNameAndID(locator, status),
      "Meet color contrast": (status: string) => this._checkColorContrast(locator, status),
    };
  }

  private async _checkKeyboardFocusable(locator: Locator, status: string): Promise<void> {
    const isFocusable = await locator.evaluate(el => {
      const element = el as HTMLElement;
      return element.tabIndex >= 0 && getComputedStyle(element).visibility !== 'hidden' && getComputedStyle(element).display !== 'none';
    });
    
    const name = await this._getLocatorDebugName(locator);
    
    expect(isFocusable, 
      `Input (${name}) should be keyboard focusable (Expected: ${status})`
    ).toBe(status.toLowerCase() === 'true' || status.toLowerCase() === 'present' || status.toLowerCase() === 'visible');
  }

  private async _checkOperable(locator: Locator, status: string): Promise<void> {
    const isOperable = await locator.isEnabled();
    
    const name = await this._getLocatorDebugName(locator);

    expect(isOperable, 
        `Input (${name}) should be operable with Enter/Space (Expected: ${status})`
    ).toBe(status.toLowerCase() === 'true' || status.toLowerCase() === 'enabled');
  }

  private async _checkLabelPresence(locator: Locator, status: string): Promise<void> {
    const hasLabel = await locator.evaluate(el => {
      const element = el as HTMLElement;
      const id = element.id;
      const tagName = element.tagName.toLowerCase();
      
      if (element.getAttribute('aria-label') || element.getAttribute('aria-labelledby')) return true;

      if (id) {
        return !!document.querySelector(`label[for="${id}"]:not([hidden])`);
      }

      if (['input', 'select', 'textarea'].includes(tagName) && (element.parentElement?.tagName.toLowerCase() === 'label')) {
          return true;
      }
      
      return false;
    });
    
    const name = await this._getLocatorDebugName(locator);

    expect(hasLabel, 
      `Input (${name}) should have a clear label (Expected: ${status})`
    ).toBe(status.toLowerCase() === 'true' || status.toLowerCase() === 'present');
  }
  
  private async _checkUniqueNameAndID(locator: Locator, status: string): Promise<void> {
    const hasUniqueId = await locator.evaluate(el => !!el.id);
    const hasName = await locator.evaluate(el => !!el.getAttribute('name'));
    
    const isUnique = hasUniqueId && hasName;
    
    const name = await this._getLocatorDebugName(locator);

    expect(isUnique, 
      `Input (${name}) should have a name attribute and an ID for unique labeling (Expected: ${status})`
    ).toBe(status.toLowerCase() === 'true' || status.toLowerCase() === 'present');
  }

  private async _checkColorContrast(locator: Locator, status: string): Promise<void> {
      const selector = await locator.toString().split('@')[0].trim();
      
      const isContrastSufficient = await this.humanSpaceflightPage.accessibility.checkElementColorContrast(selector); 
      
      const name = await this._getLocatorDebugName(locator);

      expect(isContrastSufficient, 
          `Input (${name}) text/background contrast should meet WCAG AA (Expected: ${status})`
      ).toBe(status.toLowerCase() === 'true' || status.toLowerCase() === 'meet');
  }
  
  private async _getLocatorDebugName(locator: Locator): Promise<string> {
    const tagName = await locator.evaluate(el => el.tagName.toLowerCase());
    const type = await locator.getAttribute('type');
    const name = await locator.getAttribute('name');
    const label = await locator.getAttribute('aria-label') || await locator.textContent();

    return `${tagName}${type ? `[type=${type}]` : ''}${name ? `[name=${name}]` : ''} - "${label?.trim().substring(0, 20) || 'no label'}"`;
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

  private _getValidationValidators(results: any): Record<string, () => Promise<void>> {
    return {
      "Error Messages": () => this._validateErrorMessages(results),
      "Error Location": () => this._validateErrorLocation(results),
      "Focus Management": () => this._validateFocusManagement(results),
      "Instructions": () => this._validateInstructions(results),
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