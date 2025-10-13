import { Given, When, Then, Fixture } from "playwright-bdd/decorators";
import { expect, Page } from "@playwright/test";
import { DataTable } from "playwright-bdd";
import { HumanSpaceflightPage } from "../../pages/ui/HumanSpaceflightPage";
import {
  CoreElement,
  HotspotContent,
  HotspotInteraction,
  HotspotRequirement,
  StateChange,
  SuitInfo,
  VisualStandard,
} from "../../pages/types/Types";

@Fixture("theSuitesSteps")
export class TheSuitesSteps {
  private readonly TEST_CONSTANTS = {
    ANIMATION_DELAY: 500,
    CALLOUT_DELAY: 300,
    HOVER_DELAY: 200,
    MIN_HOTSPOTS: 6,
    SAMPLE_HOTSPOTS: 3,
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

  @Then("the section should display core elements:")
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

  @When("I click on the {string} button")
  async clickSuitButton(buttonName: string) {
    const button = this.getSuitButton(buttonName);
    await button.click();
  }

  @Then("the following state changes should occur:")
  async checkStateChanges(dataTable: DataTable) {
    const changes = this.parseDataTable<StateChange>(dataTable);

    for (const change of changes) {
      await this.validateStateChange(change);
    }
  }

  @Then("hotspots should be configured properly:")
  async checkHotspotConfiguration(dataTable: DataTable) {
    const requirements = this.parseDataTable<HotspotRequirement>(dataTable);

    for (const requirement of requirements) {
      await this.validateHotspotRequirement(requirement);
    }
  }

  @When("I interact with hotspots:")
  async interactWithHotspots(dataTable: DataTable) {
    const interactions = this.parseDataTable<HotspotInteraction>(dataTable);

    for (const interaction of interactions) {
      await this.performHotspotInteraction(interaction);
    }
  }

  @Then("the suit display should meet visual standards:")
  async checkVisualStandards(dataTable: DataTable) {
    const standards = this.parseDataTable<VisualStandard>(dataTable);

    for (const standard of standards) {
      await this.validateVisualStandard(standard);
    }
  }

  @Then("each suit type should display complete information:")
  async checkSuitInformation(dataTable: DataTable) {
    const suitInfo = this.parseDataTable<SuitInfo>(dataTable);

    for (const suit of suitInfo) {
      await this.validateSuitInformation(suit);
    }
  }

  @Then("each hotspot should provide:")
  async checkHotspotContent(dataTable: DataTable) {
    const contentTypes = this.parseDataTable<HotspotContent>(dataTable);
    await this.validateHotspotContent(contentTypes);
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
      expect(isCentered).toBe(true);
    }
  }

  private async validateHotspotsVisibility(state?: string): Promise<void> {
    if (state === "Visible") {
      const areVisible =
        await this.humanSpaceflightPage.theSuites.areHotspotsVisible();
      expect(areVisible).toBe(true);
    }
  }

  private async validateBackgroundVisibility(state?: string): Promise<void> {
    if (state === "Visible") {
      const isVisible =
        await this.humanSpaceflightPage.theSuites.isGradientVisible();
      expect(isVisible).toBe(true);
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

  private getSuitButton(buttonName: string) {
    switch (buttonName) {
      case "IVA":
        return this.humanSpaceflightPage.theSuites.ivaButton;
      case "EVA":
        return this.humanSpaceflightPage.theSuites.evaButton;
      default:
        throw new Error(`Unknown suit button: ${buttonName}`);
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
      expect(isLoaded).toBe(true);
    }
  }

  private async validateHotspotsUpdate(stateChange: string): Promise<void> {
    if (stateChange === "Update for new suit type") {
      const areVisible =
        await this.humanSpaceflightPage.theSuites.areHotspotsVisible();
      expect(areVisible).toBe(true);
    }
  }

  private async validateHotspotRequirement(
    requirement: HotspotRequirement
  ): Promise<void> {
    const { Requirement, Specification } = requirement;

    switch (Requirement) {
      case "Quantity":
        await this.validateHotspotQuantity(Specification);
        break;
      case "Distribution":
        await this.validateHotspotDistribution();
        break;
      case "Upper Body":
        await this.validateUpperBodyHotspots(Specification);
        break;
      case "Lower Body":
        await this.validateLowerBodyHotspots(Specification);
        break;
      default:
        throw new Error(`Unknown hotspot requirement: ${Requirement}`);
    }
  }

  private async validateHotspotQuantity(specification: string): Promise<void> {
    const minCount = this.extractNumber(
      specification,
      this.TEST_CONSTANTS.MIN_HOTSPOTS
    );
    const count = await this.humanSpaceflightPage.theSuites.getHotspotCount();
    expect(count, {
      message: `Should have at least ${minCount} hotspots`,
    }).toBeGreaterThanOrEqual(minCount);
  }

  private async validateHotspotDistribution(): Promise<void> {
    const distribution =
      await this.humanSpaceflightPage.theSuites.getHotspotDistribution();
    expect(distribution.upper, {
      message: "Should have upper body hotspots",
    }).toBeGreaterThan(0);
    expect(distribution.lower, {
      message: "Should have lower body hotspots",
    }).toBeGreaterThan(0);
  }

  private async validateUpperBodyHotspots(
    specification: string
  ): Promise<void> {
    const minCount = this.extractNumber(specification, 2);
    const distribution =
      await this.humanSpaceflightPage.theSuites.getHotspotDistribution();
    expect(distribution.upper, {
      message: "Should have multiple upper body hotspots",
    }).toBeGreaterThanOrEqual(minCount);
  }

  private async validateLowerBodyHotspots(
    specification: string
  ): Promise<void> {
    const minCount = this.extractNumber(specification, 2);
    const distribution =
      await this.humanSpaceflightPage.theSuites.getHotspotDistribution();
    expect(distribution.lower, {
      message: "Should have multiple lower body hotspots",
    }).toBeGreaterThanOrEqual(minCount);
  }

  private async performHotspotInteraction(
    interaction: HotspotInteraction
  ): Promise<void> {
    const { Action, "Expected Result": expectedResult } = interaction;

    switch (Action) {
      case "Hover":
        await this.performHoverInteraction(expectedResult);
        break;
      case "Move Away":
        await this.performMoveAwayInteraction();
        break;
      case "Multiple Hover":
        await this.performMultipleHoverInteraction();
        break;
      default:
        throw new Error(`Unknown hotspot interaction: ${Action}`);
    }
  }

  private async performHoverInteraction(expectedResult: string): Promise<void> {
    await this.humanSpaceflightPage.theSuites.hoverHotspot(0);

    if (expectedResult.includes("after delay")) {
      await this.page.waitForTimeout(this.TEST_CONSTANTS.CALLOUT_DELAY);
    }

    await expect(this.humanSpaceflightPage.theSuites.suitCallout, {
      message: "Callout should appear on hover",
    }).toBeVisible();
  }

  private async performMoveAwayInteraction(): Promise<void> {
    await this.humanSpaceflightPage.theSuites.hoverHotspot(0);
    await this.page.waitForTimeout(this.TEST_CONSTANTS.HOVER_DELAY);
    await this.humanSpaceflightPage.theSuites.suitsSection.hover({
      position: { x: 0, y: 0 },
    });

    await expect(this.humanSpaceflightPage.theSuites.suitCallout, {
      message: "Callout should disappear when moving away",
    }).not.toBeVisible();
  }

  private async performMultipleHoverInteraction(): Promise<void> {
    const count = await this.humanSpaceflightPage.theSuites.getHotspotCount();
    const texts: string[] = [];

    for (
      let i = 0;
      i < Math.min(count, this.TEST_CONSTANTS.SAMPLE_HOTSPOTS);
      i++
    ) {
      await this.humanSpaceflightPage.theSuites.hoverHotspot(i);
      await this.page.waitForTimeout(this.TEST_CONSTANTS.HOVER_DELAY);
      const text = await this.humanSpaceflightPage.theSuites.getCalloutText();
      texts.push(text);
    }

    const uniqueTexts = new Set(texts);
    expect(uniqueTexts.size, {
      message: "Each hotspot should show unique information",
    }).toBe(texts.length);
  }

  private async validateVisualStandard(
    standard: VisualStandard
  ): Promise<void> {
    const { Element, Requirement, Details } = standard;

    switch (Element) {
      case "Suit Image":
        await this.validateSuitImageStandard(Requirement);
        break;
      case "Image Position":
        await this.validateImagePositionStandard(Requirement);
        break;
      case "Background":
        await this.validateBackgroundStandard(Requirement);
        break;
      case "Hotspot Markers":
        await this.validateHotspotMarkersStandard(Requirement);
        break;
      case "Callouts":
        await this.validateCalloutsStandard(Requirement);
        break;
      default:
        throw new Error(`Unknown visual standard element: ${Element}`);
    }
  }

  private async validateSuitImageStandard(requirement: string): Promise<void> {
    if (requirement === "Properly loaded") {
      const isLoaded =
        await this.humanSpaceflightPage.theSuites.isSuitImageLoaded();
      expect(isLoaded, { message: "Suit image should load properly" }).toBe(
        true
      );
    }
  }

  private async validateImagePositionStandard(
    requirement: string
  ): Promise<void> {
    if (requirement === "Centered in viewport") {
      const isCentered =
        await this.humanSpaceflightPage.theSuites.isSuitImageCentered();
      expect(isCentered, { message: "Suit image should be centered" }).toBe(
        true
      );
    }
  }

  private async validateBackgroundStandard(requirement: string): Promise<void> {
    if (requirement === "Gradient effect") {
      const isVisible =
        await this.humanSpaceflightPage.theSuites.isGradientVisible();
      expect(isVisible, {
        message: "Background gradient should be visible",
      }).toBe(true);

      const enhancesVisibility =
        await this.humanSpaceflightPage.theSuites.isGradientEnhancingSuitVisibility();
      expect(enhancesVisibility, {
        message: "Gradient should enhance visibility",
      }).toBe(true);
    }
  }

  private async validateHotspotMarkersStandard(
    requirement: string
  ): Promise<void> {
    if (requirement === "Clearly visible") {
      const areVisible =
        await this.humanSpaceflightPage.theSuites.areHotspotsVisible();
      expect(areVisible, { message: "Hotspot markers should be visible" }).toBe(
        true
      );
    }
  }

  private async validateCalloutsStandard(requirement: string): Promise<void> {
    if (requirement === "Position adapts") {
      const count = await this.humanSpaceflightPage.theSuites.getHotspotCount();
      for (
        let i = 0;
        i < Math.min(count, this.TEST_CONSTANTS.SAMPLE_HOTSPOTS);
        i++
      ) {
        const isPositioned =
          await this.humanSpaceflightPage.theSuites.isCalloutPositionedCorrectly(
            i
          );
        expect(isPositioned, {
          message: `Callout should adapt position for hotspot ${i + 1}`,
        }).toBe(true);
      }
    }
  }

  private async validateSuitInformation(suit: SuitInfo): Promise<void> {
    const { "Suit Type": suitType, "Required Information": requiredInfo } =
      suit;

    await this.ensureSuitActive(suitType);

    const isLoaded =
      await this.humanSpaceflightPage.theSuites.isSuitImageLoaded();
    expect(isLoaded, { message: `${suitType} suit image should load` }).toBe(
      true
    );

    const hotspotCount =
      await this.humanSpaceflightPage.theSuites.getHotspotCount();
    expect(hotspotCount, {
      message: `${suitType} suit should have hotspots`,
    }).toBeGreaterThan(0);
  }

  private async validateHotspotContent(
    contentTypes: HotspotContent[]
  ): Promise<void> {
    const count = await this.humanSpaceflightPage.theSuites.getHotspotCount();

    for (
      let i = 0;
      i < Math.min(count, this.TEST_CONSTANTS.SAMPLE_HOTSPOTS);
      i++
    ) {
      await this.humanSpaceflightPage.theSuites.hoverHotspot(i);
      await this.page.waitForTimeout(this.TEST_CONSTANTS.HOVER_DELAY);
      const calloutText =
        await this.humanSpaceflightPage.theSuites.getCalloutText();

      for (const contentType of contentTypes) {
        this.validateContentType(calloutText, contentType);
      }
    }

    await this.validateHotspotUniqueness();
  }

  private validateContentType(
    calloutText: string,
    contentType: HotspotContent
  ): void {
    const { "Content Type": type } = contentType;

    expect(calloutText.length, {
      message: `Should have ${type.toLowerCase()} description`,
    }).toBeGreaterThan(0);
  }

  private async validateHotspotUniqueness(): Promise<void> {
    const allTexts =
      await this.humanSpaceflightPage.theSuites.getAllHotspotTexts();
    const uniqueTexts = new Set(allTexts);
    expect(uniqueTexts.size, {
      message: "Each hotspot should have unique information",
    }).toBe(allTexts.length);
  }

  private extractNumber(text: string, defaultValue: number): number {
    const match = text.match(/\d+/);
    return match ? parseInt(match[0]) : defaultValue;
  }
}
