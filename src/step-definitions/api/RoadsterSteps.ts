import { expect } from "@playwright/test";
import { Then, Fixture } from "playwright-bdd/decorators";
import { APISharedSteps } from "./APISharedSteps";
import { RoadsterAPI } from "../../services/api/RoadsterAPI";

@Fixture("roadsterSteps")
export class RoadsterSteps {
  private roadsterAPI!: RoadsterAPI;

  constructor(private sharedSteps: APISharedSteps) {
    this.roadsterAPI = this.sharedSteps.activeAPI as RoadsterAPI;
  }

  @Then("the name field should contain {string}")
  public async thenNameFieldShouldContain(expectedName: string): Promise<void> {
    const body = await this.roadsterAPI.getResponseBody();

    expect(
      body,
      "Roadster response body is missing or not a JSON object."
    ).toBeDefined();

    expect(
      body.name,
      `Response does not contain 'name' field, or it's not a string.`
    ).toEqual(expect.any(String));

    expect(
      body.name,
      `Expected name '${body.name}' to contain '${expectedName}'.`
    ).toContain(expectedName);
  }

  @Then("the launch_date_utc should be a valid ISO 8601 timestamp")
  public async thenLaunchDateUtcShouldBeValidIso8601(): Promise<void> {
    const body = await this.roadsterAPI.getResponseBody();
    const iso8601Regex = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})Z$/;

    expect(
      body.launch_date_utc,
      `'launch_date_utc' field is missing or not a string.`
    ).toEqual(expect.any(String));

    expect(
      body.launch_date_utc,
      `'launch_date_utc' with value '${body.launch_date_utc}' is not a valid ISO 8601 timestamp.`
    ).toMatch(iso8601Regex);
  }

  @Then("the field {string} should be present")
  public async thenFieldShouldBePresent(field: string): Promise<void> {
    const body = await this.roadsterAPI.getResponseBody();

    expect(
      body,
      "Roadster response body is missing or not a JSON object."
    ).toBeDefined();

    expect(
      body,
      `Field '${field}' is not present in the response body.`
    ).toHaveProperty(field);
  }

  @Then("the {string} value should be a {string}")
  public async thenFieldValueShouldBeA(
    field: string,
    validationType: string
  ): Promise<void> {
    const body = await this.roadsterAPI.getResponseBody();
    const value = body[field];

    expect(
      value,
      `Field '${field}' is missing, null, or undefined.`
    ).toBeDefined();

    switch (validationType.toLowerCase()) {
      case "positive integer":
        this.validatePositiveInteger(field, value);
        break;

      case "positive number":
        this.validatePositiveNumber(field, value);
        break;

      default:
        throw new Error(`Unsupported validation type: ${validationType}`);
    }
  }

  private validatePositiveNumber(field: string, value: any): void {
    expect(
      typeof value,
      `Field '${field}' value is not a number. Found type: ${typeof value}`
    ).toBe("number");
    expect(
      value,
      `Field '${field}' value ${value} is not a positive number.`
    ).toBeGreaterThan(0);
  }

  private validatePositiveInteger(field: string, value: any): void {
    this.validatePositiveNumber(field, value);
    expect(
      Number.isInteger(value),
      `Field '${field}' value ${value} is not an integer.`
    ).toBeTruthy();
  }

  @Then("the {string} field should be a valid URL")
  public async thenFieldShouldBeAValidUrl(field: string): Promise<void> {
    const body = await this.roadsterAPI.getResponseBody();
    const urlString = body[field];

    expect(urlString, `Field '${field}' is missing or not a string.`).toEqual(
      expect.any(String)
    );

    let isValidUrl = true;
    try {
      new URL(urlString);
    } catch (e) {
      isValidUrl = false;
    }

    expect(
      isValidUrl,
      `Field '${field}' with value '${urlString}' is not a valid URL.`
    ).toBeTruthy();

    expect(
      urlString.length,
      `Field '${field}' is an empty string.`
    ).toBeGreaterThan(0);
  }
  
}
