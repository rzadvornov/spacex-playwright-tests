import { expect } from "@playwright/test";
import { Given, When, Then, Fixture } from "playwright-bdd/decorators";
import { RocketsAPI } from "../../services/api/RocketsAPI";
import { APISharedSteps } from "./APISharedSteps";
import { APIBase } from "../../services/base/APIBase";

@Fixture("rocketsSteps")
export class RocketsSteps {
  private rocketsAPI!: RocketsAPI;

  constructor(private sharedSteps: APISharedSteps) {}

  @Given("a valid rocket ID {string} is available")
  public async givenValidRocketId(rocketId: string): Promise<void> {
    this.sharedSteps.setResourceId(rocketId);
  }

  @When("I query the Rockets API using POST with filter:")
  public async whenQueryRocketsAPIWithFilter(docString: string): Promise<void> {
    const queryBody = JSON.parse(docString);
    this.sharedSteps.queryBody = queryBody;

    expect(
      this.sharedSteps.activeAPI,
      "Active API not initialized or not RocketsAPI"
    ).toBeInstanceOf(APIBase);
    this.rocketsAPI = this.sharedSteps.activeAPI as RocketsAPI;

    await this.rocketsAPI.queryRockets(queryBody);
  }

  @Then("the results should contain rockets matching {string} equals {string}")
  public async thenResultsShouldContainItemsMatchingString(
    field: string,
    expectedValue: string
  ): Promise<void> {
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    const rockets = body.docs || body;
    const value = expectedValue.replace(/\"/g, "");

    expect(Array.isArray(rockets), "Response is not a list or a query result (missing docs array).").toBeTruthy();

    for (const rocket of rockets) {
      expect(rocket, `Rocket item is missing the field: ${field}`).toHaveProperty(field);
      expect(
        rocket[field],
        `Expected rocket ${field} to be '${value}', but got '${rocket[field]}'`
      ).toEqual(value);
    }
  }

  @Then("the results should contain rockets matching {string} equals {boolean}")
  public async thenResultsShouldContainItemsMatchingBoolean(
    field: string,
    expectedBooleanValue: boolean
  ): Promise<void> {
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    const rockets = body.docs || body;

    expect(Array.isArray(rockets), "Response is not a list or a query result (missing docs array).").toBeTruthy();

    for (const rocket of rockets) {
      expect(rocket, `Rocket item is missing the field: ${field}`).toHaveProperty(field);
      expect(
        rocket[field],
        `Expected rocket ${field} to be ${expectedBooleanValue}, but got ${rocket[field]}`
      ).toEqual(expectedBooleanValue);
    }
  }

  private getNestedPropertyValue(obj: any, path: string): any {
    return path
      .split(".")
      .reduce((prev, curr) => (prev ? prev[curr] : undefined), obj);
  }

  @Then("the field {string} should be a positive number")
  public async thenFieldShouldBeAPositiveNumber(field: string): Promise<void> {
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    const value = this.getNestedPropertyValue(body, field);

    expect(
      value,
      `Field '${field}' is missing, null, or undefined in the response.`
    ).toBeDefined();

    expect(
      typeof value,
      `Field '${field}' is not a number. Found type: ${typeof value}`
    ).toBe("number");

    expect(
      value,
      `Field '${field}' with value ${value} is not a positive number.`
    ).toBeGreaterThan(0);
  }
}
