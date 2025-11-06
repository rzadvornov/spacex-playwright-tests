import { When, Then, Fixture } from "playwright-bdd/decorators";
import { StarshipPage } from "../../../services/ui/StarshipPage";
import { AssertionHelper } from "../../../utils/AssertionHelper";
import { DataTable } from "playwright-bdd";

@Fixture("starshipPropulsionSteps")
export class StarshipPropulsionSteps {
  constructor(
    private starshipPage: StarshipPage,
    private assertionHelper: AssertionHelper
  ) {}

  @When("I view the propulsion system details")
  async viewPropulsionSystemDetails(): Promise<void> {
    await this.starshipPage.navigateToSection("Propulsion");
  }

  @Then(
    "I should see the complete specifications for the Raptor sea-level engine:"
  )
  async verifyRaptorSeaLevelSpecs(dataTable: DataTable): Promise<void> {
    const seaLevelSpecs = await this.starshipPage.getRaptorEngineSpecs(
      "sea-level"
    );
    const rows = dataTable.rows();

    for (const row of rows) {
      const attribute = row[0];
      const expectedMetric = row[1];
      const actualValue = seaLevelSpecs.get(attribute) || "";

      await this.assertionHelper.validateBooleanCheck(
        async () => actualValue.includes(expectedMetric),
        `Raptor sea-level ${attribute} should contain "${expectedMetric}". Actual: "${actualValue}"`
      );
    }
  }

  @Then(
    "I should see the complete specifications for the Raptor Vacuum \\(RVac) engine:"
  )
  async verifyRaptorVacuumSpecs(dataTable: DataTable): Promise<void> {
    const vacuumSpecs = await this.starshipPage.getRaptorEngineSpecs("vacuum");
    const rows = dataTable.rows();

    for (const row of rows) {
      const attribute = row[0];
      const expectedMetric = row[1];
      const actualValue = vacuumSpecs.get(attribute) || "";

      await this.assertionHelper.validateBooleanCheck(
        async () => actualValue.includes(expectedMetric),
        `Raptor Vacuum ${attribute} should contain "${expectedMetric}". Actual: "${actualValue}"`
      );
    }
  }

  @Then("the page should clearly note that Starship uses {string}")
  async verifyEngineConfiguration(expectedConfig: string): Promise<void> {
    const actualConfig = await this.starshipPage.getEngineConfiguration();

    await this.assertionHelper.validateBooleanCheck(
      async () => actualConfig.includes(expectedConfig),
      `Engine configuration should contain "${expectedConfig}". Actual: "${actualConfig}"`
    );
  }
}
