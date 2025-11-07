import { expect } from "@playwright/test";
import { Given, When, Then, Fixture } from "playwright-bdd/decorators";
import { PayloadsAPI } from "../../services/api/PayloadsAPI";
import { APISharedSteps } from "./APISharedSteps";
import { APIBase } from "../../services/base/APIBase";

@Fixture("payloadsSteps")
export class PayloadsSteps {
  private payloadsAPI!: PayloadsAPI;

  constructor(private sharedSteps: APISharedSteps) {}

  @Given("a valid payload ID {string} is available")
  public async givenValidPayloadId(payloadId: string): Promise<void> {
    this.sharedSteps.setResourceId(payloadId);
  }

  @When("I query the Payloads API using POST with filter:")
  public async whenQueryPayloadsAPIWithFilter(docString: string): Promise<void> {
    const queryBody = JSON.parse(docString);
    this.sharedSteps.queryBody = queryBody;

    expect(
      this.sharedSteps.activeAPI,
      "Active API not initialized or not PayloadsAPI"
    ).toBeInstanceOf(APIBase);
    this.payloadsAPI = this.sharedSteps.activeAPI as PayloadsAPI;

    await this.payloadsAPI.queryPayloads(queryBody);
  }

  @Then("the results should contain payloads matching {string} equals {string}")
  public async thenResultsShouldContainPayloadsMatchingString(
    field: string,
    expectedValue: string
  ): Promise<void> {
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    const payloads = body.docs || body;
    const value = expectedValue.replace(/\"/g, "");

    expect(
      Array.isArray(payloads),
      "Response is not a list or a query result (missing docs array)."
    ).toBeTruthy();

    for (const payload of payloads) {
      expect(
        payload,
        `Payload item is missing the field: ${field}`
      ).toHaveProperty(field);
      expect(
        payload[field],
        `Expected payload ${field} to be '${value}', but got '${payload[field]}'`
      ).toEqual(value);
    }
  }

  @Then("the results should contain payloads matching {string} equals {boolean}")
  public async thenResultsShouldContainPayloadsMatchingBoolean(
    field: string,
    expectedBooleanValue: boolean
  ): Promise<void> {
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    const payloads = body.docs || body;

    expect(
      Array.isArray(payloads),
      "Response is not a list or a query result (missing docs array)."
    ).toBeTruthy();

    for (const payload of payloads) {
      expect(
        payload,
        `Payload item is missing the field: ${field}`
      ).toHaveProperty(field);
      expect(
        payload[field],
        `Expected payload ${field} to be ${expectedBooleanValue}, but got ${payload[field]}`
      ).toEqual(expectedBooleanValue);
    }
  }

  @Then("the field {string} should be a non-negative number or null")
  public async thenFieldShouldBeNonNegativeNumberOrNull(field: string): Promise<void> {
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    const value = body[field];

    if (value === null) {
      return;
    }

    expect(
      value,
      `Field '${field}' is missing or undefined and not null.`
    ).toBeDefined();

    expect(
      typeof value,
      `Field '${field}' is not a number or null. Found type: ${typeof value}`
    ).toBe("number");

    expect(
      value,
      `Field '${field}' with value ${value} is a negative number.`
    ).toBeGreaterThanOrEqual(0);
  }

  @Then("the mass_kg should be approximately equal to mass_lbs converted from pounds")
  public async thenMassKgShouldBeApproximateToMassLbsConversion(): Promise<void> {
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    const massKg = body.mass_kg;
    const massLbs = body.mass_lbs;
    const KG_TO_LBS_CONVERSION_FACTOR = 2.20462;
    const TOLERANCE = 0.01;

    if (massKg === null && massLbs === null) {
      return;
    }

    expect(
        typeof massKg === 'number' && typeof massLbs === 'number',
        `Mass fields must be defined as numbers (or both null) for comparison. Found mass_kg: ${massKg} (${typeof massKg}), mass_lbs: ${massLbs} (${typeof massLbs})`
    ).toBeTruthy();

    const convertedLbsToKg = massLbs / KG_TO_LBS_CONVERSION_FACTOR;
    const absoluteDifference = Math.abs(massKg - convertedLbsToKg);
    const relativeDifference = absoluteDifference / massKg;

    expect(
      relativeDifference,
      `Mass conversion failed. Expected ${massKg} kg to be approximately ${convertedLbsToKg.toFixed(4)} kg (from ${massLbs} lbs). Relative difference: ${relativeDifference.toFixed(4)}`
    ).toBeLessThan(TOLERANCE);
  }
}