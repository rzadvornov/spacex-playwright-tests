import { expect } from "@playwright/test";
import { Given, When, Then, Fixture } from "playwright-bdd/decorators";
import { DragonsAPI } from "../../services/api/DragonsAPI";
import { APISharedSteps } from "./APISharedSteps";
import { APIBase } from "../../services/base/APIBase";

@Fixture("dragonsSteps")
export class DragonsSteps {
  private dragonsAPI!: DragonsAPI;

  constructor(private sharedSteps: APISharedSteps) {}

  @Given("a valid dragon ID {string} is available")
  public async givenValidDragonId(dragonId: string): Promise<void> {
    this.sharedSteps.setResourceId(dragonId);
  }

  @When("I query the Dragons API using POST with filter:")
  public async whenQueryDragonsAPIWithFilter(docString: string): Promise<void> {
    const queryBody = JSON.parse(docString);
    this.sharedSteps.queryBody = queryBody;

    expect(
      this.sharedSteps.activeAPI,
      "Active API not initialized or not DragonsAPI"
    ).toBeInstanceOf(APIBase);
    this.dragonsAPI = this.sharedSteps.activeAPI as DragonsAPI;

    await this.dragonsAPI.queryDragons(queryBody);
  }

  @Then("all results should have active status as {boolean}")
  public async thenAllResultsShouldHaveActiveStatus(
    expectedStatus: boolean
  ): Promise<void> {
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    const dragons = body.docs || body;

    expect(
      Array.isArray(dragons),
      "Response is not a list or a query result (missing docs array)."
    ).toBeTruthy();

    for (const dragon of dragons) {
      expect(
        dragon,
        `Dragon item is missing the 'active' field.`
      ).toHaveProperty("active");

      expect(
        dragon.active,
        `Expected dragon 'active' status to be ${expectedStatus}, but got ${dragon.active}`
      ).toEqual(expectedStatus);
    }
  }

  private getNestedPropertyValue(obj: any, path: string): any {
    return path
      .split(".")
      .reduce((prev, curr) => (prev ? prev[curr] : undefined), obj);
  }

  @Then("the nested field {string} in {string} should be a positive number")
  public async thenNestedFieldInShouldBeAPositiveNumber(
    nestedField: string,
    parentField: string
  ): Promise<void> {
    const fullPath = `${parentField}.${nestedField}`;
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    const value = this.getNestedPropertyValue(body, fullPath);

    expect(
      value,
      `Nested field '${fullPath}' is missing, null, or undefined in the response.`
    ).toBeDefined();

    expect(
      typeof value,
      `Nested field '${fullPath}' is not a number. Found type: ${typeof value}`
    ).toBe("number");

    expect(
      value,
      `Nested field '${fullPath}' with value ${value} is not a positive number (must be > 0).`
    ).toBeGreaterThan(0);
  }

  @Then("the field {string} should be a non-negative integer")
  public async thenFieldShouldBeANonNegativeInteger(
    field: string
  ): Promise<void> {
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
      Number.isInteger(value),
      `Field '${field}' with value ${value} is not an integer.`
    ).toBeTruthy();

    expect(
      value,
      `Field '${field}' with value ${value} is not a non-negative number (must be >= 0).`
    ).toBeGreaterThanOrEqual(0);
  }

  @Then("the nested field {string} in {string} should be a non-negative number")
  public async thenNestedFieldInShouldBeANonNegativeNumber(
    nestedField: string,
    parentField: string
  ): Promise<void> {
    const fullPath = `${parentField}.${nestedField}`;
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    const value = this.getNestedPropertyValue(body, fullPath);

    if (value === null || value === undefined) {
      console.log(
        `Nested field '${fullPath}' is null or undefined, skipping non-negative check.`
      );
      return;
    }

    expect(
      typeof value,
      `Nested field '${fullPath}' is not a number. Found type: ${typeof value}`
    ).toBe("number");

    expect(
      value,
      `Nested field '${fullPath}' with value ${value} is not a non-negative number (must be >= 0).`
    ).toBeGreaterThanOrEqual(0);
  }
}
