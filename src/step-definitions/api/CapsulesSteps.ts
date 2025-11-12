import { expect } from "@playwright/test";
import { Given, When, Then, Fixture } from "playwright-bdd/decorators";
import { CapsulesAPI } from "../../services/api/CapsulesAPI";
import { APISharedSteps } from "./APISharedSteps";
import { APIBase } from "../../services/base/APIBase";
import { formatZodError } from "../../utils/ZodErrorFormatter";
import { CapsuleQueryResponseSchema, SingleCapsuleResponseSchema, CapsuleSchema } from "../../services/api/schemas/CapsulesSchemas";

@Fixture("capsulesSteps")
export class CapsulesSteps {
  private capsulesAPI!: CapsulesAPI;

  constructor(private sharedSteps: APISharedSteps) {}

  @Given("a valid capsule ID {string} is available")
  public async givenValidCapsuleId(capsuleId: string): Promise<void> {
    this.sharedSteps.setResourceId(capsuleId);
  }

  @When("I make a POST request to {string} with query:")
  public async whenMakePostRequestToQueryWithFilter(
    _endpoint: string,
    docString: string
  ): Promise<void> {
    const queryBody = JSON.parse(docString);
    this.sharedSteps.queryBody = queryBody;

    expect(
      this.sharedSteps.activeAPI,
      "Active API not initialized or not CapsulesAPI"
    ).toBeInstanceOf(APIBase);
    this.capsulesAPI = this.sharedSteps.activeAPI as CapsulesAPI;

    await this.capsulesAPI.queryCapsules(queryBody);
  }

  @Then("the response should match the capsule query schema")
  public async thenResponseShouldMatchCapsuleQuerySchema(): Promise<void> {
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    
    const result = CapsuleQueryResponseSchema.safeParse(body);
    expect(
      result.success,
      `Response does not match capsule query schema: ${result.success ? '' : formatZodError(result.error)}`
    ).toBeTruthy();
  }

  @Then("the response should match the single capsule schema")
  public async thenResponseShouldMatchSingleCapsuleSchema(): Promise<void> {
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    
    const result = SingleCapsuleResponseSchema.safeParse(body);
    expect(
      result.success,
      `Response does not match single capsule schema: ${result.success ? '' : formatZodError(result.error)}`
    ).toBeTruthy();
  }
  
  @Then("the capsule ID should match the requested ID")
  public async thenCapsuleIdShouldMatchRequestedId(): Promise<void> {
    const expectedId = this.sharedSteps.getResourceId();
    const body = await this.sharedSteps.activeAPI.getResponseBody();

    expect(
      body.id,
      `Expected capsule ID to be '${expectedId}', but got '${body.id}'`
    ).toEqual(expectedId);
  }
  
  @Then("all capsule results should have {string} equal to {string}")
  public async thenAllResultsShouldHaveFieldEqualToValue(
    field: string,
    expectedValue: string
  ): Promise<void> {
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    const capsules = body.docs || body; 
    const valueToMatch = expectedValue.replace(/\"/g, "");

    expect(
      Array.isArray(capsules),
      "Response is not a list or a query result (missing docs array)."
    ).toBeTruthy();

    for (const capsule of capsules) {
      expect(
        capsule,
        `Capsule item is missing the field: ${field}`
      ).toHaveProperty(field);
      expect(
        capsule[field],
        `Expected capsule ${field} to be '${valueToMatch}', but got '${capsule[field]}'`
      ).toEqual(valueToMatch);
    }
  }

  @Then("all capsule results should have {string} greater than {int}")
  public async thenAllCapsuleResultsShouldHaveFieldGreaterThan(
    field: string,
    expectedValue: number
  ): Promise<void> {
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    const capsules = body.docs || body;

    expect(
      Array.isArray(capsules),
      "Response is not a list or a query result (missing docs array)."
    ).toBeTruthy();

    for (const capsule of capsules) {
      expect(
        capsule,
        `Capsule item is missing the field: ${field}`
      ).toHaveProperty(field);
      const actualValue = capsule[field];

      expect(
        typeof actualValue,
        `Field '${field}' is not a number. Found type: ${typeof actualValue}`
      ).toBe("number");
      
      expect(
        actualValue,
        `Expected capsule ${field} (${actualValue}) to be greater than ${expectedValue}, but it was not.`
      ).toBeGreaterThan(expectedValue);
    }
  }

  @Then("each capsule should have valid schema")
  public async thenEachCapsuleShouldHaveValidSchema(): Promise<void> {
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    const capsules = body.docs || [body];

    for (const [index, capsule] of capsules.entries()) {
      const result = CapsuleSchema.safeParse(capsule);
      expect(
        result.success,
        `Capsule at index ${index} has invalid schema: ${result.success ? '' : formatZodError(result.error)}`
      ).toBeTruthy();
    }
  }

  @Then("each capsule should have required properties")
  public async thenEachCapsuleShouldHaveRequiredProperties(): Promise<void> {
    const requiredProperties = ["id", "serial", "status", "type", "reuse_count", "launches"];
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    const capsules = body.docs || [body];

    for (const [index, capsule] of capsules.entries()) {
      const result = CapsuleSchema.pick({
        id: true,
        serial: true,
        status: true,
        type: true,
        reuse_count: true,
        launches: true
      }).safeParse(capsule);
      
      expect(
        result.success,
        `Capsule at index ${index} missing required properties: ${result.success ? '' : formatZodError(result.error)}`
      ).toBeTruthy();
    }
  }

  @Then("all capsules should have valid landing counts")
  public async thenAllCapsulesShouldHaveValidLandingCounts(): Promise<void> {
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    const capsules = body.docs || [body];

    for (const [index, capsule] of capsules.entries()) {
      const landingSchema = CapsuleSchema.pick({
        water_landings: true,
        land_landings: true
      });
      
      const result = landingSchema.safeParse(capsule);
      expect(
        result.success,
        `Capsule at index ${index} has invalid landing counts: ${result.success ? '' : formatZodError(result.error)}`
      ).toBeTruthy();
    }
  }

  @Then("all capsules should have valid status")
  public async thenAllCapsulesShouldHaveValidStatus(): Promise<void> {
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    const capsules = body.docs || [body];

    for (const capsule of capsules) {
      const result = CapsuleSchema.pick({ status: true }).safeParse(capsule);
      expect(
        result.success,
        `Capsule has invalid status: ${result.success ? '' : formatZodError(result.error)}`
      ).toBeTruthy();
    }
  }

  @Then("all capsules should have valid type")
  public async thenAllCapsulesShouldHaveValidType(): Promise<void> {
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    const capsules = body.docs || [body];

    for (const capsule of capsules) {
      const result = CapsuleSchema.pick({ type: true }).safeParse(capsule);
      expect(
        result.success,
        `Capsule has invalid type: ${result.success ? '' : formatZodError(result.error)}`
      ).toBeTruthy();
    }
  }
}