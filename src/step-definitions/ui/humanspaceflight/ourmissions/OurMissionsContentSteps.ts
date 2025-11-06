import { expect } from "@playwright/test";
import { Then, Fixture } from "playwright-bdd/decorators";
import { DataTable } from "playwright-bdd";
import { HumanSpaceflightPage } from "../../../../services/ui/HumanSpaceflightPage";
import { OurMissionsPOF } from "../../../../services/fragments/OurMissionsPOF";
import { CoreElement, StructureCheck } from "../../../../utils/types/Types";
import {
  parseCoreElements,
  parseStructureChecks,
} from "../../../../utils/types/TypeGuards";

@Fixture("ourMissionsContentSteps")
export class OurMissionsContentSteps {
  constructor(private humanSpaceflightPage: HumanSpaceflightPage) {}

  @Then("the cargo and science capabilities should list more than {int} items")
  async checkCargoScienceCount(count: number) {
    const lines =
      await this.humanSpaceflightPage.ourMissions.getCargoScienceLines();
    expect(
      lines.length,
      `Cargo/Science section should list more than ${count} items`
    ).toBeGreaterThan(count);
  }

  @Then("the key content should be structured logically:")
  async checkKeyContentStructure(dataTable: DataTable) {
    const checks = parseStructureChecks(dataTable.hashes());
    const ourMissionsPOF = this.humanSpaceflightPage
      .ourMissions as OurMissionsPOF;

    for (const check of checks) {
      await this.validateStructureCheck(ourMissionsPOF, check);
    }
  }

  private async validateStructureCheck(
    ourMissionsPOF: OurMissionsPOF,
    check: StructureCheck
  ): Promise<void> {
    const elementValidators: Record<string, () => Promise<void>> = {
      "Mission Title": async () => {
        const title = await ourMissionsPOF.getSectionTitle();
        expect(title.length).toBeGreaterThan(0);
      },
      "Metrics Table": async () => {
        const isGrid = await ourMissionsPOF.isMetricsGridLayoutClean();
        expect(isGrid).toBeTruthy();
      },
      "Tab Content": async () => {
        const isVisible = await (
          await ourMissionsPOF.getTabByName(check["Default Tab"]!)
        ).isVisible();
        expect(isVisible).toBeTruthy();
      },
      "CTA Button": async () => {
        const isButtonVisible =
          await ourMissionsPOF.isJoinMissionButtonVisible();
        expect(isButtonVisible).toBeTruthy();
      },
      "Primary Tab": async () => {
        const isActive = await ourMissionsPOF.isTabActive(
          check["Default Tab"]!
        );
        expect(isActive).toBeTruthy();
      },
    };

    const validator = elementValidators[check.Element];
    if (!validator) {
      throw new Error(`Unknown structure element check: ${check.Element}`);
    }
    await validator();
  }

  @Then("the Our Missions section should display core elements:")
  async checkCoreElements(dataTable: DataTable) {
    const coreElements = parseCoreElements(dataTable.hashes());
    const ourMissionsPOF = this.humanSpaceflightPage
      .ourMissions as OurMissionsPOF;

    for (const element of coreElements) {
      await this.validateCoreElement(ourMissionsPOF, element);
    }
  }

  private async validateCoreElement(
    ourMissionsPOF: OurMissionsPOF,
    element: CoreElement
  ): Promise<void> {
    const elementValidators: Record<string, () => Promise<void>> = {
      Title: async () => {
        const title = await ourMissionsPOF.getSectionTitle();
        expect(title).toBe(element.Content!);
      },
      Description: async () => {
        const description = await ourMissionsPOF.getSectionDescription();
        expect(description).toContain(element.Description!.split(" and ")[0]);
      },
      "Default Tab": async () => {
        const isActive = await ourMissionsPOF.isTabActive(element.Content!);
        expect(
          isActive,
          `Default tab "${element.Content}" should be active`
        ).toBeTruthy();
      },
    };

    const validator = elementValidators[element.Element];
    if (!validator) {
      throw new Error(`Unknown core element check: ${element.Element}`);
    }
    await validator();
  }
}
