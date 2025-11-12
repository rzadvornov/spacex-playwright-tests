import { expect } from "@playwright/test";
import { Then, Fixture } from "playwright-bdd/decorators";
import { DataTable } from "playwright-bdd";
import { HumanSpaceflightPage } from "../../../../services/ui/HumanSpaceflightPage";
import { Element } from "../../../../utils/types/Types";
import { parseHeaderElements } from "../../../../utils/types/TypeGuards";
import { OurMissionsPOF } from "../../../../services/ui/fragments/OurMissionsPOF";

@Fixture("ourMissionsVisualSteps")
export class OurMissionsVisualSteps {
  private readonly OPACITY_RANGE = { min: 0.1, max: 1 };

  constructor(private humanSpaceflightPage: HumanSpaceflightPage) {}

  @Then("the primary image should change to reflect {string} mission")
  async checkPrimaryImageChange(missionName: string) {
    await this.verifyImageRelevance(
      missionName,
      `Image should change and be relevant to ${missionName}`
    );
  }

  @Then("the image should be relevant to {string}")
  async checkImageRelevance(missionName: string) {
    await this.verifyImageRelevance(
      missionName,
      `Image should be relevant to ${missionName}`
    );
  }

  private async verifyImageRelevance(
    missionName: string,
    message: string
  ): Promise<void> {
    const isRelevant =
      await this.humanSpaceflightPage.ourMissions.isBackgroundImageRelevantToMission(
        missionName
      );
    expect(isRelevant, message).toBeTruthy();
  }

  @Then("the mission information should align with {string} mission")
  async checkMissionInfoAlignment(missionName: string) {
    const title = await this.humanSpaceflightPage.ourMissions.getSectionTitle();
    expect(title.toUpperCase()).toContain("MISSIONS");

    const isTabActive = await this.humanSpaceflightPage.ourMissions.isTabActive(
      missionName
    );
    expect(isTabActive, `Tab ${missionName} should be active`).toBeTruthy();
  }

  @Then("the section should meet visual standards:")
  async checkVisualStandards(dataTable: DataTable) {
    const standards = parseHeaderElements(dataTable.hashes());
    const ourMissionsPOF = this.humanSpaceflightPage
      .ourMissions as OurMissionsPOF;

    for (const standard of standards) {
      await this.validateVisualStandard(ourMissionsPOF, standard);
    }
  }

  private async validateVisualStandard(
    ourMissionsPOF: OurMissionsPOF,
    standard: Element
  ): Promise<void> {
    const standardValidators: Record<string, () => Promise<void>> = {
      "Background Image": async () => {
        const [isVisible, isRelevant] = await Promise.all([
          ourMissionsPOF.isBackgroundImageVisible(),
          ourMissionsPOF.isBackgroundImageRelevantToMission("Earth Orbit"),
        ]);
        expect(
          isVisible && isRelevant,
          "Background image should be visible, left-aligned, and relevant"
        ).toBeTruthy();
      },
      "Image Opacity": async () => {
        const opacity = await ourMissionsPOF.getBackgroundImageOpacity();
        expect(opacity).toBeGreaterThan(this.OPACITY_RANGE.min);
        expect(opacity).toBeLessThan(this.OPACITY_RANGE.max);
      },
      "Tab Design": async () => {
        const isConsistent = await ourMissionsPOF.isTabDesignConsistent();
        expect(isConsistent, "Tab design should be consistent").toBeTruthy();
      },
      "Metrics Layout": async () => {
        const isCleanGrid = await ourMissionsPOF.isMetricsGridLayoutClean();
        expect(
          isCleanGrid,
          "Metrics table should have a clean, organized grid layout"
        ).toBeTruthy();
      },
      Typography: async () => {
        const isReadable = await ourMissionsPOF.isTypographyClearAndReadable();
        expect(isReadable, "Typography should be clear and readable").toBe(
          true
        );
      },
    };

    const validator = standardValidators[standard.Element];
    if (!validator) {
      throw new Error(`Unknown visual standard check: ${standard.Element}`);
    }
    await validator();
  }
}
