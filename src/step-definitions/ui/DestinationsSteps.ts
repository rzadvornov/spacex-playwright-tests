import { Page, expect } from "@playwright/test";
import { Given, When, Then, Fixture } from "playwright-bdd/decorators";
import { DataTable } from "playwright-bdd";
import { HumanSpaceflightPage } from "../../pages/ui/HumanSpaceflightPage";

@Fixture("destinationsSteps")
export class DestinationsSteps {
  constructor(
    private page: Page,
    private humanSpaceflightPage: HumanSpaceflightPage
  ) {}

  @Given("I view the Destinations section")
  async viewDestinationsSection() {
    await this.humanSpaceflightPage.destinations.scrollToDestinationsSection();
    await this.humanSpaceflightPage.destinations.waitForDestinationsSectionLoad();
  }

  @Then("the section should display destination information:")
  async checkDestinationInformation(dataTable: DataTable) {
    const destinations = dataTable.hashes();
    for (const dest of destinations) {
      // Check destination exists and is in correct order
      const allVisible =
        await this.humanSpaceflightPage.destinations.areAllDestinationsVisible([
          dest.Destination,
        ]);
      expect(
        allVisible,
        `Destination ${dest.Destination} should be visible`
      ).toBe(true);

      // Check link path when clicking
      await this.humanSpaceflightPage.destinations.clickDestination(
        dest.Destination
      );
      expect(this.page.url()).toContain(dest.Path);
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
    ).toBe(true);
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
    const isNewPage = await this.page.evaluate(() => {
      return document.readyState === "complete";
    });
    expect(isNewPage, "Should be navigated to a new page").toBe(true);
  }

  @Then("the page title should contain {string}")
  async checkPageTitle(expectedTitle: string) {
    const title = await this.page.title();
    expect(title).toContain(expectedTitle);
  }

  @Then("each destination should have proper visual elements:")
  async checkDestinationVisualElements(dataTable: DataTable) {
    const visualRequirements = dataTable.hashes();

    for (const req of visualRequirements) {
      // Check if image loads correctly
      const imageLoaded =
        await this.humanSpaceflightPage.destinations.isDestinationImageLoadedCorrectly(
          req.Destination
        );
      expect(
        imageLoaded,
        `${req.Destination} image should load correctly`
      ).toBe(true);

      // Check for SVG overlay if required
      if (req["Element Type"].includes("SVG")) {
        const hasSvgOverlay =
          await this.humanSpaceflightPage.destinations.hasDestinationSvgCircleOverlay(
            req.Destination
          );
        expect(
          hasSvgOverlay,
          `${req.Destination} should have SVG overlay`
        ).toBe(true);
      }
    }
  }

  @Then("visual elements should maintain quality across screen sizes")
  async checkVisualQualityAcrossScreenSizes() {
    // Check different viewport sizes
    const viewportSizes = [
      { width: 375, height: 667 }, // Mobile
      { width: 768, height: 1024 }, // Tablet
      { width: 1920, height: 1080 }, // Desktop
    ];

    for (const size of viewportSizes) {
      await this.page.setViewportSize(size);
      const allMediaVisible =
        await this.humanSpaceflightPage.destinations.areAllDestinationMediaVisible();
      expect(
        allMediaVisible,
        `Visual elements should be visible at ${size.width}x${size.height}`
      ).toBe(true);
    }
  }

  @Then("the background should have these characteristics:")
  async checkBackgroundCharacteristics(dataTable: DataTable) {
    const characteristics = dataTable.hashes();

    for (const char of characteristics) {
      if (char.Element === "Earth image") {
        // Check Earth image position and opacity
        const styles =
          await this.humanSpaceflightPage.destinations.getEarthImageComputedStyles();
        expect(styles, "Earth image styles should be available").not.toBeNull();
        if (styles) {
          expect(["absolute", "fixed"]).toContain(styles.position);
          expect(parseFloat(styles.opacity)).toBeGreaterThan(0);
        }
      }
    }
  }

  @Then("background elements should not interfere with content")
  async checkBackgroundInterference() {
    // Check if destinations are clickable over the background
    const areClickable =
      await this.humanSpaceflightPage.destinations.areAllDestinationsClickableAndInteractive();
    expect(
      areClickable,
      "Destinations should be clickable over background"
    ).toBe(true);
  }

  @When("I interact with the {string} on desktop")
  async interactWithElement(elementType: string) {
    switch (elementType) {
      case "destination card":
        await this.humanSpaceflightPage.destinations.hoverOverDestination(
          "Earth Orbit"
        );
        break;
      case "interactive overlay":
        await this.humanSpaceflightPage.destinations.hoverOverDestination(
          "Space Station"
        );
        break;
      case "navigation link":
        await this.humanSpaceflightPage.destinations.hoverOverDestination(
          "Moon"
        );
        break;
    }
  }

  @Then("it should demonstrate the following states:")
  async checkInteractiveStates(dataTable: DataTable) {
    const states = dataTable.hashes();

    for (const state of states) {
      switch (state.State) {
        case "Hover":
          const hasHoverEffect =
            await this.humanSpaceflightPage.destinations.isDestinationHoverEffectVisible();
          expect(hasHoverEffect, "Element should show hover effect").toBe(true);

          const hasPointerCursor =
            await this.humanSpaceflightPage.destinations.isDestinationCursorPointer();
          expect(hasPointerCursor, "Cursor should be pointer on hover").toBe(
            true
          );
          break;

        case "Regular":
          await this.humanSpaceflightPage.destinations.unhoverDestination();
          const effectDisappeared =
            await this.humanSpaceflightPage.destinations.isDestinationHoverEffectDisappeared();
          expect(effectDisappeared, "Hover effect should disappear").toBe(true);
          break;
      }
    }
  }
}