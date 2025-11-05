import { When, Then, Fixture } from "playwright-bdd/decorators";
import { StarshipPage } from "../../../pages/ui/StarshipPage";
import { AssertionHelper } from "../../../utils/AssertionHelper";
import { DataTable } from "playwright-bdd";

@Fixture("starshipMissionsSteps")
export class StarshipMissionsSteps {
  constructor(
    private starshipPage: StarshipPage,
    private assertionHelper: AssertionHelper
  ) {}

  @When("I read about interplanetary mission capabilities")
  async readInterplanetaryMissionCapabilities(): Promise<void> {
    await this.starshipPage.navigateToSection("Mars Missions");
  }

  @Then("I should learn that Starship is specifically designed for:")
  async verifyMarsMissionCapabilities(dataTable: DataTable): Promise<void> {
    const rows = dataTable.rows();
    const expectedCapabilities = rows.map((row: string[]) => row[0]);
    const actualCapabilities = await this.starshipPage.getMissionCapabilities(
      "mars"
    );

    for (const expectedCapability of expectedCapabilities) {
      await this.assertionHelper.validateBooleanCheck(
        async () =>
          actualCapabilities.some((cap) => cap.includes(expectedCapability)),
        `Should have Mars mission capability: "${expectedCapability}"`
      );
    }
  }

  @When("I read about lunar mission capabilities")
  async readLunarMissionCapabilities(): Promise<void> {
    await this.starshipPage.navigateToSection("Lunar Missions");
  }

  @Then(
    "I should learn that Starship serves as a lunar lander for key missions:"
  )
  async verifyLunarMissionCapabilities(dataTable: DataTable): Promise<void> {
    const rows = dataTable.rows();
    const expectedCapabilities = rows.map((row: string[]) => row[0]);
    const actualCapabilities = await this.starshipPage.getMissionCapabilities(
      "lunar"
    );

    for (const expectedCapability of expectedCapabilities) {
      await this.assertionHelper.validateBooleanCheck(
        async () =>
          actualCapabilities.some((cap) => cap.includes(expectedCapability)),
        `Should have lunar mission capability: "${expectedCapability}"`
      );
    }
  }

  @When("I read about Earth transportation applications")
  async readEarthTransportationApplications(): Promise<void> {
    await this.starshipPage.navigateToSection("Earth Transport");
  }

  @Then(
    "I should learn that Starship enables the following point-to-point capabilities:"
  )
  async verifyEarthTransportCapabilities(dataTable: DataTable): Promise<void> {
    const rows = dataTable.rows();
    const expectedCapabilities = rows.map((row: string[]) => row[0]);
    const actualCapabilities = await this.starshipPage.getMissionCapabilities(
      "earth"
    );

    for (const expectedCapability of expectedCapabilities) {
      await this.assertionHelper.validateBooleanCheck(
        async () =>
          actualCapabilities.some((cap) => cap.includes(expectedCapability)),
        `Should have Earth transport capability: "${expectedCapability}"`
      );
    }
  }
}