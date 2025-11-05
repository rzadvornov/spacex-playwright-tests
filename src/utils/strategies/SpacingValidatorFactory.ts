import { expect } from "@playwright/test";
import { HumanSpaceflightPage } from "../../pages/ui/HumanSpaceflightPage";
import { LayoutSpacingStyleValidator } from "../types/Types";

class HorizontalSpacingValidator implements LayoutSpacingStyleValidator {
  async validate(footer: HumanSpaceflightPage["footer"]): Promise<void> {
    const [socialVisible, linksExist] = await Promise.all([
      footer.isSocialMediaSectionVisible(),
      footer.checkFooterLinksExist(["Careers"]),
    ]);
    expect(
      socialVisible && linksExist,
      "Footer elements should have proper horizontal layout"
    ).toBeTruthy();
  }
}

class VerticalSpacingValidator implements LayoutSpacingStyleValidator {
  async validate(footer: HumanSpaceflightPage["footer"]): Promise<void> {
    const elementsExist = await footer.checkFooterLinksExist([
      "Careers",
      "Updates",
    ]);
    expect(elementsExist, "Footer should have proper vertical layout").toBe(
      true
    );
  }
}

class OverallSpacingValidator implements LayoutSpacingStyleValidator {
  async validate(footer: HumanSpaceflightPage["footer"]): Promise<void> {
    const isNotCramped = await footer.isFooterNotCramped();
    expect(isNotCramped, "Layout should not appear cramped").toBeTruthy();
  }
}

export class SpacingValidatorFactory {
  private static readonly validators: Record<string, LayoutSpacingStyleValidator> = {
    Horizontal: new HorizontalSpacingValidator(),
    Vertical: new VerticalSpacingValidator(),
    Overall: new OverallSpacingValidator(),
  };

  static getValidator(spacingType: string): LayoutSpacingStyleValidator {
    const validator = this.validators[spacingType];
    if (!validator) {
      console.warn(`Unknown spacing type: ${spacingType}`);
      throw new Error(`No validator found for spacing type: ${spacingType}`);
    }
    return validator;
  }
}