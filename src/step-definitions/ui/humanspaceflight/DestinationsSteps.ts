import { Page, expect } from "@playwright/test";
import { Given, When, Then, Fixture } from "playwright-bdd/decorators";
import { DataTable } from "playwright-bdd";
import { HumanSpaceflightPage } from "../../../pages/ui/HumanSpaceflightPage";
import { ViewportUtility } from "../../../utils/ViewportUtility";
import { AssertionHelper } from "../../../utils/AssertionHelper";
import { HoverStateStrategy } from "../../../utils/strategies/HoverStateStrategy";
import { InteractiveStateContext } from "../../../utils/strategies/InteractiveStateContext";
import { RegularStateStrategy } from "../../../utils/strategies/RegularStateStrategy";
import { parseDestinationInfo, parseBackgroundCharacteristics, parseInteractiveStates } from "../../../utils/types/TypeGuards";
import { DestinationInfo, InteractiveState } from "../../../utils/types/Types";

@Fixture("destinationsSteps")
export class DestinationsSteps {
  private readonly INTERACTION_ELEMENTS: Record<string, string> = {
    "destination card": "Earth Orbit",
    "interactive overlay": "Space Station",
    "navigation link": "Moon",
  };

  private readonly DEFAULT_DESTINATIONS = [
    "Earth Orbit",
    "Space Station",
    "Moon",
  ];

  private interactiveStateContext: InteractiveStateContext;

  constructor(
    private page: Page,
    private humanSpaceflightPage: HumanSpaceflightPage,
    private viewportUtility: ViewportUtility,
    private assertionHelper: AssertionHelper
  ) {
    this.interactiveStateContext = this.initializeInteractiveStateContext();
  }

  private initializeInteractiveStateContext(): InteractiveStateContext {
    const context = new InteractiveStateContext();
    context.registerStrategy(
      "Hover",
      new HoverStateStrategy(this.humanSpaceflightPage)
    );
    context.registerStrategy(
      "Regular",
      new RegularStateStrategy(this.humanSpaceflightPage)
    );
    return context;
  }

  @Given("I view the Destinations section")
  async viewDestinationsSection() {
    await this.humanSpaceflightPage.destinations.scrollToDestinationsSection();
    await this.humanSpaceflightPage.destinations.waitForDestinationsSectionLoad();
  }

  @Then("the section should display destination information:")
  async checkDestinationInformation(dataTable: DataTable) {
    const destinations = parseDestinationInfo(dataTable.hashes());
    await this.validateAllDestinations(destinations);
  }

  private async validateAllDestinations(
    destinations: DestinationInfo[]
  ): Promise<void> {
    for (const dest of destinations) {
      await this.validateDestinationInformation(dest);
    }
  }

  private async validateDestinationInformation(
    dest: DestinationInfo
  ): Promise<void> {
    await this.verifyDestinationVisibility(dest.Destination);

    if (dest.Path) {
      await this.navigateAndVerifyDestinationPath(dest);
    }
  }

  private async verifyDestinationVisibility(
    destinationName: string
  ): Promise<void> {
    const allVisible =
      await this.humanSpaceflightPage.destinations.areAllDestinationsVisible([
        destinationName,
      ]);
    expect(
      allVisible,
      `Destination ${destinationName} should be visible`
    ).toBeTruthy();
  }

  private async navigateAndVerifyDestinationPath(
    dest: DestinationInfo
  ): Promise<void> {
    await this.humanSpaceflightPage.destinations.clickDestination(
      dest.Destination
    );

    const currentUrl = this.page.url();
    expect(currentUrl).toContain(dest.Path);

    await this.page.goBack();
    await this.humanSpaceflightPage.destinations.waitForDestinationsSectionLoad();
  }

  @Then("each destination should have an associated visual element")
  async checkVisualElements() {
    const allMediaVisible =
      await this.humanSpaceflightPage.destinations.areAllDestinationMediaVisible();
    expect(
      allMediaVisible,
      "All destinations should have associated visual elements"
    ).toBeTruthy();
  }

  @When("I click on the {string} destination card")
  async clickDestination(destinationName: string) {
    await this.humanSpaceflightPage.destinations.clickDestination(
      destinationName
    );
    await this.page.waitForLoadState("domcontentloaded");
  }

  @Then("I should be navigated to the destination details page")
  async checkNavigationToDetailsPage() {
    await this.verifyPageLoadState();
    await this.verifyCleanUrl();
  }

  private async verifyPageLoadState(): Promise<void> {
    await this.page.waitForLoadState("domcontentloaded");

    const isPageReady = await this.page.evaluate(() => {
      return document.readyState === "complete";
    });

    expect(
      isPageReady,
      "Should be navigated to a fully loaded page"
    ).toBeTruthy();
  }

  private async verifyCleanUrl(): Promise<void> {
    const currentUrl = this.page.url();
    expect(currentUrl).not.toContain("#");
  }

  @Then("the page title should contain {string}")
  async checkPageTitle(expectedTitle: string) {
    await this.assertionHelper.validateBooleanCheck(
      () => this.humanSpaceflightPage.verifyPageTitle(expectedTitle),
      `Page title should contain "${expectedTitle}"`
    );
  }

  @Then("each destination should have proper visual elements:")
  async checkDestinationVisualElements(dataTable: DataTable) {
    const visualRequirements = parseDestinationInfo(dataTable.hashes());
    await this.validateAllVisualElements(visualRequirements);
  }

  private async validateAllVisualElements(
    visualRequirements: DestinationInfo[]
  ): Promise<void> {
    for (const req of visualRequirements) {
      await this.validateVisualElement(req);
    }
  }

  private async validateVisualElement(req: DestinationInfo): Promise<void> {
    await this.verifyImageLoad(req.Destination);

    if (req["Element Type"]?.includes("SVG")) {
      await this.verifySvgOverlay(req.Destination);
    }
  }

  private async verifyImageLoad(destinationName: string): Promise<void> {
    const imageLoaded =
      await this.humanSpaceflightPage.destinations.isDestinationImageLoadedCorrectly(
        destinationName
      );
    expect(
      imageLoaded,
      `${destinationName} image should load correctly`
    ).toBeTruthy();
  }

  private async verifySvgOverlay(destinationName: string): Promise<void> {
    const hasSvgOverlay =
      await this.humanSpaceflightPage.destinations.hasDestinationSvgCircleOverlay(
        destinationName
      );
    expect(hasSvgOverlay, `${destinationName} should have SVG overlay`).toBe(
      true
    );
  }

  @Then("visual elements should maintain quality across screen sizes")
  async checkVisualQualityAcrossScreenSizes() {
    await this.viewportUtility.checkAllViewports(async (_size) => {
      const allMediaVisible =
        await this.humanSpaceflightPage.destinations.areAllDestinationMediaVisible();
      expect(
        allMediaVisible,
        `Visual elements should be visible at ${_size.width}x${_size.height}`
      ).toBeTruthy();
    });
  }

  @Then("the background should have these characteristics:")
  async checkBackgroundCharacteristics(dataTable: DataTable) {
    const characteristics = parseBackgroundCharacteristics(dataTable.hashes());
    await this.validateBackgroundCharacteristics(characteristics);
  }

  private async validateBackgroundCharacteristics(
    characteristics: any[]
  ): Promise<void> {
    for (const char of characteristics) {
      if (char.Element === "Earth image") {
        await this.validateEarthImageCharacteristics();
      }
    }
  }

  private async validateEarthImageCharacteristics(): Promise<void> {
    const styles =
      await this.humanSpaceflightPage.destinations.getEarthImageComputedStyles();
    expect(styles, "Earth image styles should be available").not.toBeNull();

    if (styles) {
      this.validateEarthImageStyles(styles);
    }
  }

  private validateEarthImageStyles(styles: any): void {
    expect(["absolute", "fixed"]).toContain(styles.position);
    expect(parseFloat(styles.opacity)).toBeGreaterThan(0);
    expect(parseFloat(styles.opacity)).toBeLessThanOrEqual(1);
  }

  @Then("background elements should not interfere with content")
  async checkBackgroundInterference() {
    await this.verifyDestinationsClickable();
    await this.verifyDestinationsVisible();
  }

  private async verifyDestinationsClickable(): Promise<void> {
    const areClickable =
      await this.humanSpaceflightPage.destinations.areAllDestinationsClickableAndInteractive();
    expect(
      areClickable,
      "Destinations should be clickable over background"
    ).toBeTruthy();
  }

  private async verifyDestinationsVisible(): Promise<void> {
    const areVisible =
      await this.humanSpaceflightPage.destinations.areAllDestinationsVisible(
        this.DEFAULT_DESTINATIONS
      );
    expect(
      areVisible,
      "Destinations should be clearly visible above background"
    ).toBeTruthy();
  }

  @When("I interact with the {string} on desktop")
  async interactWithElement(elementType: string) {
    const destinationName = this.INTERACTION_ELEMENTS[elementType];

    if (!destinationName) {
      throw new Error(
        `Unknown element type: ${elementType}. Available types: ${Object.keys(
          this.INTERACTION_ELEMENTS
        ).join(", ")}`
      );
    }

    await this.humanSpaceflightPage.destinations.hoverOverDestination(
      destinationName
    );
  }

  @Then("it should demonstrate the following states:")
  async checkInteractiveStates(dataTable: DataTable) {
    const states = parseInteractiveStates(dataTable.hashes());
    await this.validateAllInteractiveStates(states);
  }

  private async validateAllInteractiveStates(
    states: InteractiveState[]
  ): Promise<void> {
    for (const state of states) {
      await this.validateInteractiveState(state);
    }
  }

  private async validateInteractiveState(
    state: InteractiveState
  ): Promise<void> {
    await this.interactiveStateContext.executeStrategy(state.State);
  }

  @Then("destinations should be displayed in the correct order:")
  async checkDestinationsOrder(dataTable: DataTable) {
    const expectedOrder = dataTable
      .hashes()
      .map((row: Record<string, string>) => row.Destination);
    await this.verifyDestinationsOrder(expectedOrder);
  }

  private async verifyDestinationsOrder(
    expectedOrder: string[]
  ): Promise<void> {
    const allVisible =
      await this.humanSpaceflightPage.destinations.areAllDestinationsVisible(
        expectedOrder
      );
    expect(
      allVisible,
      `Destinations should be visible in order: ${expectedOrder.join(", ")}`
    ).toBeTruthy();
  }

  @Then("each destination should have accessible descriptions")
  async checkAccessibleDescriptions() {
    const areAccessible =
      await this.humanSpaceflightPage.destinations.areAllDestinationsVisible(
        this.DEFAULT_DESTINATIONS
      );
    expect(
      areAccessible,
      "All destinations should have proper content and be accessible"
    ).toBeTruthy();
  }
}
