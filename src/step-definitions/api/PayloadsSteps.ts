import { expect } from "@playwright/test";
import { Given, When, Then, Fixture } from "playwright-bdd/decorators";
import { PayloadsAPI } from "../../services/api/PayloadsAPI";
import { APISharedSteps } from "./APISharedSteps";
import { APIBase } from "../../services/base/APIBase";
import { DragonSchema } from "../../services/api/schemas/DragonsSchemas";
import { PayloadPaginatedResponseSchema, PayloadArraySchema, PayloadSchema } from "../../services/api/schemas/PayloadsSchemas";

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
    const response = this.sharedSteps.activeAPI.getResponse();
    expect(response).toBeTruthy();
    
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    if (body.docs) {
      await expect(response).toMatchSchema(PayloadPaginatedResponseSchema);
    } else {
      await expect(response).toMatchSchema(PayloadArraySchema);
    }

    const payloads = body.docs || body;
    const value = expectedValue.replace(/\"/g, "");

    expect(
      Array.isArray(payloads),
      "Response is not a list or a query result (missing docs array)."
    ).toBeTruthy();

    for (const payload of payloads) {
      const validationResult = PayloadSchema.safeParse(payload);
      expect(validationResult.success, `Payload validation failed: ${!validationResult.success ? JSON.stringify(validationResult.error.issues) : ''}`).toBeTruthy();
      
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
    const response = this.sharedSteps.activeAPI.getResponse();
    expect(response).toBeTruthy();
    
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    if (body.docs) {
      await expect(response).toMatchSchema(PayloadPaginatedResponseSchema);
    } else {
      await expect(response).toMatchSchema(PayloadArraySchema);
    }

    const payloads = body.docs || body;

    expect(
      Array.isArray(payloads),
      "Response is not a list or a query result (missing docs array)."
    ).toBeTruthy();

    for (const payload of payloads) {
      const validationResult = PayloadSchema.safeParse(payload);
      expect(validationResult.success, `Payload validation failed: ${!validationResult.success ? JSON.stringify(validationResult.error.issues) : ''}`).toBeTruthy();
      
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
    const response = this.sharedSteps.activeAPI.getResponse();
    expect(response).toBeTruthy();
    
    await expect(response).toMatchSchema(PayloadSchema);
    
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
    const response = this.sharedSteps.activeAPI.getResponse();
    expect(response).toBeTruthy();
    
    await expect(response).toMatchSchema(PayloadSchema);
    
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

  @Then("the response should match the payload schema")
  public async thenResponseShouldMatchPayloadSchema(): Promise<void> {
    const response = this.sharedSteps.activeAPI.getResponse();
    expect(response).toBeTruthy();
    await expect(response).toMatchSchema(PayloadSchema);
  }

  @Then("the response should match the payloads array schema")
  public async thenResponseShouldMatchPayloadsArraySchema(): Promise<void> {
    const response = this.sharedSteps.activeAPI.getResponse();
    expect(response).toBeTruthy();
    await expect(response).toMatchSchema(PayloadArraySchema);
  }

  @Then("the response should match the paginated payloads schema")
  public async thenResponseShouldMatchPaginatedPayloadsSchema(): Promise<void> {
    const response = this.sharedSteps.activeAPI.getResponse();
    expect(response).toBeTruthy();
    await expect(response).toMatchSchema(PayloadPaginatedResponseSchema);
  }

  @Then("each payload should have valid customer and nationality information")
  public async thenEachPayloadShouldHaveValidCustomerAndNationality(): Promise<void> {
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    
    let payloads;
    if (body.docs) {
      payloads = body.docs;
    } else {
      payloads = Array.isArray(body) ? body : [body];
    }

    for (const payload of payloads) {
      expect(payload.customers).toBeDefined();
      expect(Array.isArray(payload.customers)).toBeTruthy();
      
      if (payload.customers.length > 0) {
        for (const customer of payload.customers) {
          expect(typeof customer).toBe("string");
          expect(customer.length).toBeGreaterThan(0);
        }
      }

      if (payload.nationalities && payload.nationalities.length > 0) {
        for (const nationality of payload.nationalities) {
          expect(typeof nationality).toBe("string");
          expect(nationality.length).toBeGreaterThan(0);
        }
      }

      if (payload.manufacturers && payload.manufacturers.length > 0) {
        for (const manufacturer of payload.manufacturers) {
          expect(typeof manufacturer).toBe("string");
          expect(manufacturer.length).toBeGreaterThan(0);
        }
      }
    }
  }

  @Then("each payload should have valid orbit parameters")
  public async thenEachPayloadShouldHaveValidOrbitParameters(): Promise<void> {
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    
    let payloads;
    if (body.docs) {
      payloads = body.docs;
    } else {
      payloads = Array.isArray(body) ? body : [body];
    }

    for (const payload of payloads) {
      if (payload.orbit) {
        expect(typeof payload.orbit).toBe("string");
        expect(payload.orbit.length).toBeGreaterThan(0);
      }

      if (payload.reference_system) {
        expect(typeof payload.reference_system).toBe("string");
        expect(payload.reference_system.length).toBeGreaterThan(0);
      }

      if (payload.regime) {
        expect(typeof payload.regime).toBe("string");
        expect(payload.regime.length).toBeGreaterThan(0);
      }

      if (payload.longitude !== null && payload.longitude !== undefined) {
        expect(typeof payload.longitude).toBe("number");
      }

      if (payload.lifespan_years !== null && payload.lifespan_years !== undefined) {
        expect(typeof payload.lifespan_years).toBe("number");
        expect(payload.lifespan_years).toBeGreaterThanOrEqual(0);
      }
    }
  }

  @Then("each payload should have valid dragon capsule data")
  public async thenEachPayloadShouldHaveValidDragonCapsuleData(): Promise<void> {
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    
    let payloads;
    if (body.docs) {
      payloads = body.docs;
    } else {
      payloads = Array.isArray(body) ? body : [body];
    }

    for (const payload of payloads) {
      if (payload.dragon) {
        const dragonValidation = DragonSchema.safeParse(payload.dragon);
        expect(dragonValidation.success, `Dragon capsule validation failed for payload ${payload.id}: ${!dragonValidation.success ? JSON.stringify(dragonValidation.error.issues) : ''}`).toBeTruthy();
        
        expect(payload.dragon).toHaveProperty("capsule");
        expect(payload.dragon).toHaveProperty("mass_returned_kg");
        expect(payload.dragon).toHaveProperty("mass_returned_lbs");
        expect(payload.dragon).toHaveProperty("flight_time_sec");
        expect(payload.dragon).toHaveProperty("manifest");
        expect(payload.dragon).toHaveProperty("water_landing");
        expect(payload.dragon).toHaveProperty("land_landing");
      }
    }
  }

  @Then("each payload should have valid launch and reuse information")
  public async thenEachPayloadShouldHaveValidLaunchAndReuseInformation(): Promise<void> {
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    
    let payloads;
    if (body.docs) {
      payloads = body.docs;
    } else {
      payloads = Array.isArray(body) ? body : [body];
    }

    for (const payload of payloads) {
      expect(payload).toHaveProperty("launch");
      expect(typeof payload.launch).toBe("string");
      expect(payload.launch.length).toBeGreaterThan(0);
      expect(payload.launch).toMatch(/^[a-f0-9]{24}$/);

      expect(payload).toHaveProperty("type");
      expect(typeof payload.type).toBe("string");
      expect(payload.type.length).toBeGreaterThan(0);

      if (payload.reused !== null && payload.reused !== undefined) {
        expect(typeof payload.reused).toBe("boolean");
      }

      if (payload.landing_attempt !== null && payload.landing_attempt !== undefined) {
        expect(typeof payload.landing_attempt).toBe("boolean");
      }

      if (payload.landing_success !== null && payload.landing_success !== undefined) {
        expect(typeof payload.landing_success).toBe("boolean");
      }
    }
  }

  @Then("each payload should have valid mass and dimension data")
  public async thenEachPayloadShouldHaveValidMassAndDimensionData(): Promise<void> {
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    
    let payloads;
    if (body.docs) {
      payloads = body.docs;
    } else {
      payloads = Array.isArray(body) ? body : [body];
    }

    for (const payload of payloads) {
      if (payload.mass_kg !== null) {
        expect(payload.mass_kg).toBeGreaterThanOrEqual(0);
      }

      if (payload.mass_lbs !== null) {
        expect(payload.mass_lbs).toBeGreaterThanOrEqual(0);
      }

      if (payload.payload_mass_kg !== null) {
        expect(payload.payload_mass_kg).toBeGreaterThanOrEqual(0);
      }

      if (payload.payload_mass_lbs !== null) {
        expect(payload.payload_mass_lbs).toBeGreaterThanOrEqual(0);
      }
    }
  }
}