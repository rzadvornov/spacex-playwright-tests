import { expect } from "@playwright/test";
import { HumanSpaceflightPage } from "../../services/ui/HumanSpaceflightPage";
import { LayoutSpacingStyleValidator } from "../types/Types";

class CopyrightTextLayoutValidator implements LayoutSpacingStyleValidator {
  async validate(footer: HumanSpaceflightPage["footer"]): Promise<void> {
    const copyrightText = await footer.getCopyrightText();
    expect(copyrightText, "Copyright text should be present").toBeTruthy();
    expect(
      copyrightText.length,
      "Copyright text should not be empty"
    ).toBeGreaterThan(0);
  }
}

class SocialMediaLayoutValidator implements LayoutSpacingStyleValidator {
  async validate(footer: HumanSpaceflightPage["footer"]): Promise<void> {
    const isVisible = await footer.isSocialMediaSectionVisible();
    expect(isVisible, "Social media section should be visible").toBeTruthy();
  }
}

class NavigationLinksLayoutValidator implements LayoutSpacingStyleValidator {
  async validate(footer: HumanSpaceflightPage["footer"]): Promise<void> {
    const linksExist = await footer.checkFooterLinksExist([
      "Careers",
      "Updates",
      "Suppliers",
    ]);
    expect(linksExist, "Navigation links should exist").toBeTruthy();
  }
}

export class LayoutValidatorFactory {
  private static readonly validators: Record<
    string,
    LayoutSpacingStyleValidator
  > = {
    "Social Media": new SocialMediaLayoutValidator(),
    "Navigation Links": new NavigationLinksLayoutValidator(),
    "Copyright Text": new CopyrightTextLayoutValidator(),
  };

  static getValidator(element: string): LayoutSpacingStyleValidator {
    const validator = this.validators[element];
    if (!validator) {
      console.warn(`Unknown layout element: ${element}`);
      throw new Error(`No validator found for layout element: ${element}`);
    }
    return validator;
  }
}
