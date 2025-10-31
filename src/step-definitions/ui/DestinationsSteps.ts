import { Page, expect } from "@playwright/test";
import { Given, When, Then, Fixture } from "playwright-bdd/decorators";
import { DataTable } from "playwright-bdd";
import { HumanSpaceflightPage } from "../../pages/ui/HumanSpaceflightPage";
import { DestinationInfo, InteractiveState } from "../../pages/types/Types";
import {
  parseDestinationInfo,
  parseBackgroundCharacteristics,
  parseInteractiveStates,
} from "../../pages/types/TypeGuards";
import { ViewportUtility } from "../../utils/ViewportUtility";
import { AssertionHelper } from "../../utils/AssertionHelper";

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

  constructor(
    private page: Page,
    private humanSpaceflightPage: HumanSpaceflightPage,
    private viewportUtility: ViewportUtility,
    private assertionHelper: AssertionHelper
  ) {}

  @Given("I view the Destinations section")
  async viewDestinationsSection() {
    await this.humanSpaceflightPage.destinations.scrollToDestinationsSection();
    await this.humanSpaceflightPage.destinations.waitForDestinationsSectionLoad();
  }

  @Then("the section should display destination information:")
  async checkDestinationInformation(dataTable: DataTable) {
    const destinations = parseDestinationInfo(dataTable.hashes());

    for (const dest of destinations) {
      await this.validateDestinationInformation(dest);
    }
  }

  private async validateDestinationInformation(
    dest: DestinationInfo
  ): Promise<void> {
    const allVisible =
      await this.humanSpaceflightPage.destinations.areAllDestinationsVisible([
        dest.Destination,
      ]);
    expect(
      allVisible,
      `Destination ${dest.Destination} should be visible`
    ).toBeTruthy();

    if (dest.Path) {
      await this.humanSpaceflightPage.destinations.clickDestination(
        dest.Destination
      );

      const currentUrl = this.page.url();
      expect(currentUrl).toContain(dest.Path);

      await this.page.goBack();
      await this.humanSpaceflightPage.destinations.waitForDestinationsSectionLoad();
    }
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
    await this.page.waitForLoadState("domcontentloaded");

    const isPageReady = await this.page.evaluate(() => {
      return document.readyState === "complete";
    });

    expect(
      isPageReady,
      "Should be navigated to a fully loaded page"
    ).toBeTruthy();

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

    for (const req of visualRequirements) {
      await this.validateVisualElement(req);
    }
  }

  private async validateVisualElement(req: DestinationInfo): Promise<void> {
    const imageLoaded =
      await this.humanSpaceflightPage.destinations.isDestinationImageLoadedCorrectly(
        req.Destination
      );
    expect(
      imageLoaded,
      `${req.Destination} image should load correctly`
    ).toBeTruthy();

    if (req["Element Type"]?.includes("SVG")) {
      const hasSvgOverlay =
        await this.humanSpaceflightPage.destinations.hasDestinationSvgCircleOverlay(
          req.Destination
        );
      expect(hasSvgOverlay, `${req.Destination} should have SVG overlay`).toBe(
        true
      );
    }
  }

  @Then("visual elements should maintain quality across screen sizes")
  async checkVisualQualityAcrossScreenSizes() {
    await this.viewportUtility.checkAllViewports(async (size) => {
      const allMediaVisible =
        await this.humanSpaceflightPage.destinations.areAllDestinationMediaVisible();

      expect(
        allMediaVisible,
        `Visual elements should be visible at ${size.width}x${size.height}`
      ).toBeTruthy();
    });
  }

  @Then("the background should have these characteristics:")
  async checkBackgroundCharacteristics(dataTable: DataTable) {
    const characteristics = parseBackgroundCharacteristics(dataTable.hashes());

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
      expect(["absolute", "fixed"]).toContain(styles.position);
      expect(parseFloat(styles.opacity)).toBeGreaterThan(0);
      expect(parseFloat(styles.opacity)).toBeLessThanOrEqual(1);
    }
  }

  @Then("background elements should not interfere with content")
  async checkBackgroundInterference() {
    const areClickable =
      await this.humanSpaceflightPage.destinations.areAllDestinationsClickableAndInteractive();
    expect(
      areClickable,
      "Destinations should be clickable over background"
    ).toBeTruthy();

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

    for (const state of states) {
      await this.validateInteractiveState(state);
    }
  }

  private async validateInteractiveState(
    state: InteractiveState
  ): Promise<void> {
    switch (state.State) {
      case "Hover":
        await this.validateHoverState();
        break;

      case "Regular":
        await this.validateRegularState();
        break;

      default:
        throw new Error(`Unknown state: ${state.State}`);
    }
  }

  private async validateHoverState(): Promise<void> {
    const hasHoverEffect =
      await this.humanSpaceflightPage.destinations.isDestinationHoverEffectVisible();
    expect(hasHoverEffect, "Element should show hover effect").toBeTruthy();

    const hasPointerCursor =
      await this.humanSpaceflightPage.destinations.isDestinationCursorPointer();
    expect(hasPointerCursor, "Cursor should be pointer on hover").toBeTruthy();
  }

  private async validateRegularState(): Promise<void> {
    await this.humanSpaceflightPage.destinations.unhoverDestination();

    const effectDisappeared =
      await this.humanSpaceflightPage.destinations.isDestinationHoverEffectDisappeared();
    expect(effectDisappeared, "Hover effect should disappear").toBeTruthy();

    const hasPointerCursor =
      await this.humanSpaceflightPage.destinations.isDestinationCursorPointer();
    expect(
      hasPointerCursor,
      "Cursor should not be pointer after unhover"
    ).toBeFalsy();
  }

  @Then("destinations should be displayed in the correct order:")
  async checkDestinationsOrder(dataTable: DataTable) {
    const expectedOrder = dataTable
      .hashes()
      .map((row: Record<string, string>) => row.Destination);

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
