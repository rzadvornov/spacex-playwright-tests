import { When, Fixture } from "playwright-bdd/decorators";
import { expect, Page } from "@playwright/test";
import { DataTable } from "playwright-bdd";
import { HumanSpaceflightPage } from "../../../../pages/ui/HumanSpaceflightPage";
import { HotspotInteraction } from "../../../../utils/types/Types";

@Fixture("theSuitesInteractionSteps")
export class TheSuitesInteractionSteps {
  private readonly TEST_CONSTANTS = {
    CALLOUT_DELAY: 300,
    HOVER_DELAY: 200,
    SAMPLE_HOTSPOTS: 3,
  } as const;

  constructor(
    private page: Page,
    private humanSpaceflightPage: HumanSpaceflightPage
  ) {}

  @When("I click on the {string} button")
  async clickSuitButton(buttonName: string) {
    const button = this.getSuitButton(buttonName);
    await button.click();
  }

  @When("I interact with hotspots:")
  async interactWithHotspots(dataTable: DataTable) {
    const interactions = this.parseDataTable<HotspotInteraction>(dataTable);

    for (const interaction of interactions) {
      await this.performHotspotInteraction(interaction);
    }
  }

  private parseDataTable<T>(dataTable: DataTable): T[] {
    return dataTable.hashes().map((row) => row as T);
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
}
