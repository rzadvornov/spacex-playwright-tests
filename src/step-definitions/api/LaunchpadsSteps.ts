import { expect } from "@playwright/test";
import { Given, When, Then, Fixture } from "playwright-bdd/decorators";
import { LaunchpadsAPI } from "../../services/api/LaunchpadsAPI";
import { APISharedSteps } from "./APISharedSteps";
import { APIBase } from "../../services/base/APIBase";

@Fixture("launchpadsSteps")
export class LaunchpadsSteps {
  private launchpadsAPI!: LaunchpadsAPI;

  constructor(private sharedSteps: APISharedSteps) {}

  @Given("a valid launchpad ID {string} is available")
  public async givenValidLaunchpadId(launchpadId: string): Promise<void> {
    this.sharedSteps.setResourceId(launchpadId);
  }

  @When("I query the Launchpads API using POST with filter:")
  public async whenQueryLaunchpadsAPIWithFilter(docString: string): Promise<void> {
    const queryBody = JSON.parse(docString);
    this.sharedSteps.queryBody = queryBody;

    expect(
      this.sharedSteps.activeAPI,
      "Active API not initialized or not LaunchpadsAPI"
    ).toBeInstanceOf(APIBase);
    this.launchpadsAPI = this.sharedSteps.activeAPI as LaunchpadsAPI;

    await this.launchpadsAPI.queryLaunchpads(queryBody);
  }

  @Then("the results should contain items matching {string} equals {string}")
  public async thenResultsShouldContainItemsMatchingString(
    field: string,
    expectedValue: string
  ): Promise<void> {
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    const items = body.docs || body;
    const value = expectedValue.replace(/\"/g, "");

    expect(
      Array.isArray(items),
      "Response is not a list or a query result (missing docs array)."
    ).toBeTruthy();

    for (const item of items) {
      expect(
        item,
        `Launchpad item is missing the field: ${field}`
      ).toHaveProperty(field);
      expect(
        item[field],
        `Expected launchpad ${field} to be '${value}', but got '${item[field]}'`
      ).toEqual(value);
    }
  }

  @Then("the latitude should be between -90 and 90")
  public async thenLatitudeShouldBeValid(): Promise<void> {
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    const latitude = body.latitude;

    expect(
      typeof latitude,
      `Latitude is not a number. Found type: ${typeof latitude}`
    ).toBe("number");

    expect(
      latitude,
      `Latitude ${latitude} is not between -90 and 90.`
    ).toBeGreaterThanOrEqual(-90);
    expect(
      latitude,
      `Latitude ${latitude} is not between -90 and 90.`
    ).toBeLessThanOrEqual(90);
  }

  @Then("the longitude should be between -180 and 180")
  public async thenLongitudeShouldBeValid(): Promise<void> {
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    const longitude = body.longitude;

    expect(
      typeof longitude,
      `Longitude is not a number. Found type: ${typeof longitude}`
    ).toBe("number");

    expect(
      longitude,
      `Longitude ${longitude} is not between -180 and 180.`
    ).toBeGreaterThanOrEqual(-180);
    expect(
      longitude,
      `Longitude ${longitude} is not between -180 and 180.`
    ).toBeLessThanOrEqual(180);
  }

  @Then("the field {string} should be less than or equal to {string}")
  public async thenFieldShouldBeLessThanOrEqualTo(
    field1: string,
    field2: string
  ): Promise<void> {
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    const value1 = body[field1];
    const value2 = body[field2];

    expect(
      typeof value1,
      `Field '${field1}' value is not a number. Found type: ${typeof value1}`
    ).toBe("number");
    
    expect(
      typeof value2,
      `Field '${field2}' value is not a number. Found type: ${typeof value2}`
    ).toBe("number");

    expect(
      value1,
      `Expected '${field1}' (${value1}) to be less than or equal to '${field2}' (${value2}).`
    ).toBeLessThanOrEqual(value2);
  }
}