import { expect } from "@playwright/test";
import { Given, When, Then, Fixture } from "playwright-bdd/decorators";
import { LaunchesAPI } from "../../services/api/LaunchesAPI";
import { APISharedSteps } from "./APISharedSteps";
import { APIBase } from "../../services/base/APIBase";

@Fixture("launchesSteps")
export class LaunchesSteps {
  private launchesAPI!: LaunchesAPI;

  constructor(private sharedSteps: APISharedSteps) {}

  @Given("a valid launch ID {string} is available")
  public async givenValidLaunchId(launchId: string): Promise<void> {
    this.sharedSteps.setResourceId(launchId);
  }

  @When("I query the Launches API using POST with filter:")
  public async whenQueryLaunchesAPIWithFilter(docString: string): Promise<void> {
    const queryBody = JSON.parse(docString);
    this.sharedSteps.queryBody = queryBody;

    expect(
      this.sharedSteps.activeAPI,
      "Active API not initialized or not LaunchesAPI"
    ).toBeInstanceOf(APIBase);
    this.launchesAPI = this.sharedSteps.activeAPI as LaunchesAPI;

    await this.launchesAPI.queryLaunches(queryBody);
  }

  @When("I query the Launches API using POST with options:")
  public async whenQueryLaunchesAPIWithOptions(docString: string): Promise<void> {
    const queryBody = JSON.parse(docString);
    this.sharedSteps.queryBody = queryBody;

    expect(
      this.sharedSteps.activeAPI,
      "Active API not initialized or not LaunchesAPI"
    ).toBeInstanceOf(APIBase);
    this.launchesAPI = this.sharedSteps.activeAPI as LaunchesAPI;

    await this.launchesAPI.queryLaunches(queryBody);
  }

  @Then("the field {string} should be a valid ISO 8601 timestamp")
  public async thenFieldShouldBeAValidISO8601Timestamp(field: string): Promise<void> {
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    const timestamp = body[field];

    expect(
      typeof timestamp,
      `Field '${field}' is not a string. Found type: ${typeof timestamp}`
    ).toBe("string");

    const dateObject = new Date(timestamp);
    expect(
      !isNaN(dateObject.getTime()),
      `Field '${field}' with value '${timestamp}' is not a valid ISO 8601 timestamp.`
    ).toBeTruthy();
  }

  @Then("the results should contain launches matching {string} equals {string}")
  public async thenResultsShouldContainLaunchesMatchingString(
    field: string,
    expectedValue: string
  ): Promise<void> {
    let valueToMatch: string | boolean;
    const lowerCaseValue = expectedValue.toLowerCase().replace(/\"/g, "");

    if (lowerCaseValue === "true") {
        valueToMatch = true;
    } else if (lowerCaseValue === "false") {
        valueToMatch = false;
    } else {
        valueToMatch = expectedValue.replace(/\"/g, "");
    }
    
    await this.validateLaunchesMatch(field, valueToMatch);
  }

  @Then("the results should contain launches matching {string} equals {boolean}")
  public async thenResultsShouldContainLaunchesMatchingBoolean(
    field: string,
    expectedValue: boolean
  ): Promise<void> {
    await this.validateLaunchesMatch(field, expectedValue);
  }

  private async validateLaunchesMatch(field: string, valueToMatch: any): Promise<void> {
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    const launches = body.docs || body;

    expect(
      Array.isArray(launches),
      "Response is not a list or a query result (missing docs array)."
    ).toBeTruthy();

    for (const launch of launches) {
      expect(
        launch,
        `Launch item is missing the field: ${field}`
      ).toHaveProperty(field);
      expect(
        launch[field],
        `Expected launch ${field} to be ${valueToMatch}, but got ${launch[field]}`
      ).toEqual(valueToMatch);
    }
  }

  @Then("the results should be sorted by {string} in {string} order")
  public async thenResultsShouldBeSortedByDate(
    field: string,
    order: "asc" | "desc"
  ): Promise<void> {
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    const launches = body.docs || body;

    expect(
      Array.isArray(launches),
      "Response is not a list or a query result (missing docs array)."
    ).toBeTruthy();
    
    if (launches.length < 2) {
      return; 
    }

    for (let i = 0; i < launches.length - 1; i++) {
      const date1 = new Date(launches[i][field]);
      const date2 = new Date(launches[i + 1][field]);

      expect(
        date1.getTime(),
        `Launch date ${field} at index ${i} ('${launches[i][field]}') is not a valid date.`
      ).not.toBeNaN();
      expect(
        date2.getTime(),
        `Launch date ${field} at index ${i + 1} ('${launches[i + 1][field]}') is not a valid date.`
      ).not.toBeNaN();

      const comparison = date1.getTime() - date2.getTime();

      if (order === "asc") {
        expect(
          comparison,
          `Ascending order failure at index ${i}: Launch date ${date1.toISOString()} is greater than ${date2.toISOString()}`
        ).toBeLessThanOrEqual(0);
      } else {
        expect(
          comparison,
          `Descending order failure at index ${i}: Launch date ${date1.toISOString()} is less than ${date2.toISOString()}`
        ).toBeGreaterThanOrEqual(0);
      }
    }
  }
}