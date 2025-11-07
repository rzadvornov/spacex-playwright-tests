import { expect } from "@playwright/test";
import { Given, When, Then, Fixture } from "playwright-bdd/decorators";
import { CoresAPI } from "../../services/api/CoresAPI";
import { APISharedSteps } from "./APISharedSteps";
import { APIBase } from "../../services/base/APIBase";

@Fixture("coresSteps")
export class CoresSteps {
  private coresAPI!: CoresAPI;

  constructor(private sharedSteps: APISharedSteps) {}

  @Given("a valid core ID {string} is available")
  public async givenValidCoreId(coreId: string): Promise<void> {
    this.sharedSteps.setResourceId(coreId);
  }

  @When("I query the Cores API using POST with filter:")
  public async whenQueryCoresAPIWithFilter(docString: string): Promise<void> {
    const queryBody = JSON.parse(docString);
    this.sharedSteps.queryBody = queryBody;

    expect(
      this.sharedSteps.activeAPI,
      "Active API not initialized or not CoresAPI"
    ).toBeInstanceOf(APIBase);
    this.coresAPI = this.sharedSteps.activeAPI as CoresAPI;

    await this.coresAPI.queryCores(queryBody);
  }

  @Then("all core results should have {string} equal to {string}")
  public async thenAllResultsShouldHaveFieldEqualToValue(
    field: string,
    expectedValue: string
  ): Promise<void> {
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    const cores = body.docs || body;
    let expected: any;

    try {
      expected = JSON.parse(expectedValue);
    } catch {
      expected = expectedValue.replace(/"/g, "");
    }

    expect(
      Array.isArray(cores),
      "Response is not a list or a query result (missing docs array)."
    ).toBeTruthy();

    for (const core of cores) {
      expect(core, `Core item is missing the field: ${field}`).toHaveProperty(
        field
      );
      const actualValue = core[field];

      if (typeof expected === "object" && expected !== null) {
        for (const operator in expected) {
          const operatorValue = expected[operator];
          switch (operator) {
            case "$eq":
            case "$in":
              expect(actualValue).toEqual(operatorValue);
              break;
            case "$gte":
              expect(actualValue).toBeGreaterThanOrEqual(operatorValue);
              break;
            case "$lte":
              expect(actualValue).toBeLessThanOrEqual(operatorValue);
              break;
            default:
              throw new Error(`Unsupported MongoDB operator: ${operator}`);
          }
        }
      } else {
        expect(
          actualValue,
          `Expected core ${field} to be ${expected}, but got ${actualValue}`
        ).toEqual(expected);
      }
    }
  }

  @Then("all core results should have {string} equal to {int}")
  public async thenAllCoreResultsShouldHaveFieldEqualToInt(
    field: string,
    expectedValue: number
  ): Promise<void> {
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    const cores = body.docs || body;

    expect(
      Array.isArray(cores),
      "Response is not a list or a query result (missing docs array)."
    ).toBeTruthy();

    for (const core of cores) {
      expect(core, `Core item is missing the field: ${field}`).toHaveProperty(
        field
      );
      expect(
        core[field],
        `Expected core ${field} to be ${expectedValue}, but got ${core[field]}`
      ).toEqual(expectedValue);
    }
  }

  @Then("all core results should have {string} equal to \\{ {string}: {int} }")
  public async thenAllCoreResultsShouldHaveFieldMatchingRange(
    field: string,
    operator: string,
    expectedValue: number
  ): Promise<void> {
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    const cores = body.docs || body;

    expect(
      Array.isArray(cores),
      "Response is not a list or a query result (missing docs array)."
    ).toBeTruthy();

    for (const core of cores) {
      expect(core, `Core item is missing the field: ${field}`).toHaveProperty(
        field
      );
      const actualValue = core[field];

      expect(
        typeof actualValue,
        `Field '${field}' is not a number. Found type: ${typeof actualValue}`
      ).toBe("number");

      let conditionMet = false;

      switch (operator) {
        case "$gte":
          conditionMet = actualValue >= expectedValue;
          break;
        case "$lte":
          conditionMet = actualValue <= expectedValue;
          break;
        case "$gt":
          conditionMet = actualValue > expectedValue;
          break;
        case "$lt":
          conditionMet = actualValue < expectedValue;
          break;
        default:
          throw new Error(
            `Unsupported query operator in step: ${operator}. Only $gte, $lte, $gt, and $lt are supported by this step definition.`
          );
      }

      expect(
        conditionMet,
        `Expected core ${field} (${actualValue}) to satisfy the condition ${operator} ${expectedValue}, but it did not.`
      ).toBeTruthy();
    }
  }
}
