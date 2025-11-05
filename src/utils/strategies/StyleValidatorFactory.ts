import { expect } from "@playwright/test";
import { HumanSpaceflightPage } from "../../pages/ui/HumanSpaceflightPage";
import { LayoutSpacingStyleValidator } from "../types/Types";

class BackgroundStyleValidator implements LayoutSpacingStyleValidator {
  async validate(footer: HumanSpaceflightPage["footer"]): Promise<void> {
    const isRounded = await footer.isTwitterButtonRounded();
    expect(
      isRounded,
      "Twitter/X button should have rounded shape"
    ).toBeTruthy();
  }
}

class DesignStyleValidator implements LayoutSpacingStyleValidator {
  async validate(footer: HumanSpaceflightPage["footer"]): Promise<void> {
    const hasConsistentStyle = await footer.hasTwitterButtonConsistentStyle();
    expect(hasConsistentStyle, "Button should have consistent design").toBe(
      true
    );
  }
}

class IconStyleValidator implements LayoutSpacingStyleValidator {
  async validate(footer: HumanSpaceflightPage["footer"]): Promise<void> {
    const isIconVisible = await footer.isTwitterIconVisible();
    expect(
      isIconVisible,
      "Twitter/X icon should be visible and centered"
    ).toBeTruthy();
  }
}

export class StyleValidatorFactory {
  private static readonly validators: Record<
    string,
    LayoutSpacingStyleValidator
  > = {
    Background: new BackgroundStyleValidator(),
    Icon: new IconStyleValidator(),
    Design: new DesignStyleValidator(),
  };

  static getValidator(styleElement: string): LayoutSpacingStyleValidator {
    const validator = this.validators[styleElement];
    if (!validator) {
      console.warn(`Unknown style element: ${styleElement}`);
      throw new Error(`No validator found for style element: ${styleElement}`);
    }
    return validator;
  }
}
