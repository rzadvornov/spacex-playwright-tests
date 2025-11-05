import { expect } from "@playwright/test";
import { When, Then, Fixture } from "playwright-bdd/decorators";
import { DataTable } from "playwright-bdd";
import { HumanSpaceflightPage } from "../../../../pages/ui/HumanSpaceflightPage";
import { ViewportUtility } from "../../../../utils/ViewportUtility";
import { BoundingBox } from "../../../../utils/types/Types";

@Fixture("ourMissionsPerformanceSteps")
export class OurMissionsPerformanceSteps {
  constructor(
    private humanSpaceflightPage: HumanSpaceflightPage,
    private viewportUtility: ViewportUtility
  ) {}

  @When("I perform rapid tab interactions:")
  async performRapidTabInteractions(_dataTable: DataTable) {
    const tabsToSwitch = [
      "Space Station",
      "Moon",
      "Earth Orbit",
      "Mars",
      "Space Station",
    ];
    await this.humanSpaceflightPage.ourMissions.performRapidTabSwitching(
      tabsToSwitch
    );
  }

  @Then("all content transitions should be smooth")
  async checkSmoothTransitions() {
    const isSmooth =
      await this.humanSpaceflightPage.ourMissions.isContentTransitionSmooth();
    expect(
      isSmooth,
      "Content transitions should be smooth (no console errors/blinking)"
    ).toBeTruthy();
  }

  @Then("the UI should remain responsive")
  async checkUIResponsive() {
    const isResponsive =
      await this.humanSpaceflightPage.ourMissions.isUIResponsive();
    expect(
      isResponsive,
      "The UI should remain responsive after rapid interactions"
    ).toBeTruthy();
  }

  @Then("the Our Missions section should be responsive across screen sizes")
  async checkOurMissionsResponsiveness() {
    await this.viewportUtility.checkAllViewports(async (size: BoundingBox) => {
      const sectionBox =
        await this.humanSpaceflightPage.ourMissions.ourMissionsSection.boundingBox();
      await this.validateResponsiveLayout(size, sectionBox);
    });
  }

  private async validateResponsiveLayout(
    viewport: BoundingBox,
    sectionBox: BoundingBox | null
  ): Promise<void> {
    const [sectionVisible, tabsExist] = await Promise.all([
      this.humanSpaceflightPage.ourMissions.ourMissionsSection.isVisible(),
      this.humanSpaceflightPage.ourMissions
        .getMissionTabs()
        .then((tabs) => tabs.length > 0),
    ]);

    expect(
      sectionVisible,
      `Section should be visible at ${viewport.width}x${viewport.height}`
    ).toBeTruthy();
    expect(
      tabsExist,
      `Tabs should exist at ${viewport.width}x${viewport.height}`
    ).toBeTruthy();

    if (sectionBox) {
      this.validateSectionDimensions(viewport, sectionBox);
    }
  }

  private validateSectionDimensions(
    viewport: BoundingBox,
    sectionBox: BoundingBox
  ): void {
    expect(sectionBox.width, `Section should have valid width`).toBeGreaterThan(
      0
    );
    expect(
      sectionBox.height,
      `Section should have valid height`
    ).toBeGreaterThan(0);
    expect(
      sectionBox.x,
      `Section should be positioned within viewport`
    ).toBeGreaterThanOrEqual(0);
    expect(
      sectionBox.y,
      `Section should be positioned within viewport`
    ).toBeGreaterThanOrEqual(0);

    const viewportArea = viewport.width * viewport.height;
    const sectionArea = sectionBox.width * sectionBox.height;
    const coverageRatio = sectionArea / viewportArea;

    expect(
      coverageRatio,
      `Section should have reasonable viewport coverage (${(
        coverageRatio * 100
      ).toFixed(1)}%)`
    ).toBeGreaterThan(0.1);
  }
}