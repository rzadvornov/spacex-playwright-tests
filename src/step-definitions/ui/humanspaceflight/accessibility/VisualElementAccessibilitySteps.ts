import { Page, expect } from "@playwright/test";
import { Then, Fixture } from "playwright-bdd/decorators";
import { DataTable } from "playwright-bdd";
import { parseVisualElementExpectations } from "../../../../utils/types/TypeGuards";
import { VisualElementValidatorRegistry } from "../../../../utils/strategies/VisualElementValidatorRegistry";

@Fixture("visualElementAccessibilitySteps")
export class VisualElementAccessibilitySteps {
  private readonly ELEMENT_SELECTORS = {
    SVG_ELEMENTS: "svg, [role='img'], [role='button']",
  } as const;

  private visualElementValidatorRegistry: VisualElementValidatorRegistry;

  constructor(
    private page: Page,
  ) {
    this.visualElementValidatorRegistry = new VisualElementValidatorRegistry(
      page
    );
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
}
