import { Given, Then, Fixture } from "playwright-bdd/decorators";
import { expect, Page } from "@playwright/test";
import { DataTable } from "playwright-bdd";
import { HumanSpaceflightPage } from "../../../../pages/ui/HumanSpaceflightPage";
import { CoreElement, StateChange } from "../../../../utils/types/Types";

@Fixture("theSuitesCoreSteps")
export class TheSuitesCoreSteps {
  private readonly TEST_CONSTANTS = {
    ANIMATION_DELAY: 500,
  } as const;

  constructor(
    private page: Page,
    private humanSpaceflightPage: HumanSpaceflightPage
  ) {}

  @Given("I view the Suits section")
  async viewSuitsSection() {
    await this.humanSpaceflightPage.theSuites.scrollToSection();
    await expect(
      this.humanSpaceflightPage.theSuites.suitsSection
    ).toBeVisible();
  }

  @Then("the Suits section should display core elements:")
  async checkCoreElements(dataTable: DataTable) {
    const elements = this.parseDataTable<CoreElement>(dataTable);

    for (const element of elements) {
      await this.validateCoreElement(element);
    }
  }

  @Given("I view the Suits section with the {string} suit displayed")
  async viewSuitType(suitType: string) {
    await this.viewSuitsSection();
    await this.ensureSuitActive(suitType);
  }

  @Then("the following state changes should occur:")
  async checkStateChanges(dataTable: DataTable) {
    const changes = this.parseDataTable<StateChange>(dataTable);

    for (const change of changes) {
      await this.validateStateChange(change);
    }
  }

  private parseDataTable<T>(dataTable: DataTable): T[] {
    return dataTable.hashes().map((row) => row as T);
  }

  private async validateCoreElement(element: CoreElement): Promise<void> {
    const { Element, Content, State } = element;

    switch (Element) {
      case "Heading":
        await this.validateHeading(Content);
        break;
      case "IVA Button":
        await this.validateIvaButton(Content, State);
        break;
      case "EVA Button":
        await this.validateEvaButton(Content, State);
        break;
      case "Suit Image":
        await this.validateSuitImage(State);
        break;
      case "Hotspots":
        await this.validateHotspotsVisibility(State);
        break;
      case "Background":
        await this.validateBackgroundVisibility(State);
        break;
      default:
        throw new Error(`Unknown core element: ${Element}`);
    }
  }

  private async validateHeading(expectedContent?: string): Promise<void> {
    await expect(this.humanSpaceflightPage.theSuites.suitHeading).toBeVisible();
    if (expectedContent) {
      await expect(this.humanSpaceflightPage.theSuites.suitHeading).toHaveText(
        expectedContent
      );
    }
  }

  private async validateIvaButton(
    expectedContent?: string,
    state?: string
  ): Promise<void> {
    await expect(this.humanSpaceflightPage.theSuites.ivaButton).toBeVisible();
    if (expectedContent) {
      await expect(this.humanSpaceflightPage.theSuites.ivaButton).toHaveText(
        expectedContent
      );
    }
    if (state === "Active by default") {
      await expect(this.humanSpaceflightPage.theSuites.ivaButton).toHaveClass(
        /active/
      );
    }
  }

  private async validateEvaButton(
    expectedContent?: string,
    state?: string
  ): Promise<void> {
    await expect(this.humanSpaceflightPage.theSuites.evaButton).toBeVisible();
    if (expectedContent) {
      await expect(this.humanSpaceflightPage.theSuites.evaButton).toHaveText(
        expectedContent
      );
    }
    if (state === "Inactive") {
      await expect(
        this.humanSpaceflightPage.theSuites.evaButton
      ).not.toHaveClass(/active/);
    }
  }

  private async validateSuitImage(state?: string): Promise<void> {
    await expect(this.humanSpaceflightPage.theSuites.suitImage).toBeVisible();
    if (state === "Centered") {
      const isCentered =
        await this.humanSpaceflightPage.theSuites.isSuitImageCentered();
      expect(isCentered).toBeTruthy();
    }
  }

  private async validateHotspotsVisibility(state?: string): Promise<void> {
    if (state === "Visible") {
      const areVisible =
        await this.humanSpaceflightPage.theSuites.areHotspotsVisible();
      expect(areVisible).toBeTruthy();
    }
  }

  private async validateBackgroundVisibility(state?: string): Promise<void> {
    if (state === "Visible") {
      const isVisible =
        await this.humanSpaceflightPage.theSuites.isGradientVisible();
      expect(isVisible).toBeTruthy();
    }
  }

  private async ensureSuitActive(suitType: string): Promise<void> {
    if (suitType === "IVA") {
      await expect(this.humanSpaceflightPage.theSuites.ivaButton).toHaveClass(
        /active/
      );
    } else if (suitType === "EVA") {
      const isActive = await this.humanSpaceflightPage.theSuites.evaButton
        .getAttribute("class")
        .then((className) => className?.includes("active"));

      if (!isActive) {
        await this.humanSpaceflightPage.theSuites.evaButton.click();
      }
      await expect(this.humanSpaceflightPage.theSuites.evaButton).toHaveClass(
        /active/
      );
    }
  }

  private async validateStateChange(change: StateChange): Promise<void> {
    const { Element, "State Change": stateChange } = change;

    switch (Element) {
      case "IVA Button":
        await this.validateButtonState(
          this.humanSpaceflightPage.theSuites.ivaButton,
          stateChange
        );
        break;
      case "EVA Button":
        await this.validateButtonState(
          this.humanSpaceflightPage.theSuites.evaButton,
          stateChange
        );
        break;
      case "Suit Image":
        await this.validateSuitImageChange(stateChange);
        break;
      case "Hotspots":
        await this.validateHotspotsUpdate(stateChange);
        break;
      default:
        throw new Error(`Unknown state change element: ${Element}`);
    }
  }

  private async validateButtonState(
    button: any,
    stateChange: string
  ): Promise<void> {
    if (stateChange === "Becomes active") {
      await expect(button).toHaveClass(/active/);
    } else if (stateChange === "Becomes inactive") {
      await expect(button).not.toHaveClass(/active/);
    }
  }

  private async validateSuitImageChange(stateChange: string): Promise<void> {
    if (stateChange.includes("Changes to")) {
      await this.page.waitForTimeout(this.TEST_CONSTANTS.ANIMATION_DELAY);
      const isLoaded =
        await this.humanSpaceflightPage.theSuites.isSuitImageLoaded();
      expect(isLoaded).toBeTruthy();
    }
  }

  private async validateHotspotsUpdate(stateChange: string): Promise<void> {
    if (stateChange === "Update for new suit type") {
      const areVisible =
        await this.humanSpaceflightPage.theSuites.areHotspotsVisible();
      expect(areVisible).toBeTruthy();
    }
  }
}
