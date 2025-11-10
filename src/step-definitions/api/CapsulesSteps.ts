import { expect } from "@playwright/test";
import { Given, When, Then, Fixture } from "playwright-bdd/decorators";
import { CapsulesAPI } from "../../services/api/CapsulesAPI";
import { APISharedSteps } from "./APISharedSteps";
import { APIBase } from "../../services/base/APIBase";

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
}