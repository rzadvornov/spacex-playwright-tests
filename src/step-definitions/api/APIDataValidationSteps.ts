import { expect } from "@playwright/test";
import { Then, Fixture } from "playwright-bdd/decorators";
import { APISharedSteps } from "./APISharedSteps";
import { APIBase } from "../../services/base/APIBase";
import { CapsuleSchema } from "../../services/api/schemas/CapsulesSchemas";
import { CoreSchema } from "../../services/api/schemas/CoresSchemas";
import { CrewMemberSchema } from "../../services/api/schemas/CrewSchemas";
import { LaunchSchema } from "../../services/api/schemas/LaunchesSchemas";
import { PayloadSchema } from "../../services/api/schemas/PayloadsSchemas";
import { RocketSchema } from "../../services/api/schemas/RocketSchemas";
import { formatZodError } from "../../utils/ZodErrorFormatter";

@Fixture("apiDataValidationSteps")
export class APIDataValidationSteps {
  constructor(private sharedSteps: APISharedSteps) {}

  private async getResultsArray(): Promise<any[]> {
    expect(
      this.sharedSteps.activeAPI,
      "Active API not initialized."
    ).toBeInstanceOf(APIBase);
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    return (Array.isArray(body) ? body : body.docs) || [];
  }

  private isValidISO8601(dateString: string): boolean {
    if (!dateString || typeof dateString !== "string") return false;

    const date = new Date(dateString);
    const isValid = !isNaN(date.getTime());
    const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

    return isValid && isoRegex.test(dateString);
  }

  @Then("all {string} fields should be valid ISO 8601 timestamps")
  public async thenAllFieldsShouldBeValidISO8601Timestamps(
    field: string
  ): Promise<void> {
    const results = await this.getResultsArray();
    expect(
      results.length,
      `Date validation failed: 0 results returned for validation on ${field}.`
    ).toBeGreaterThan(0);

    results.forEach((item, index) => {
      expect(
        item,
        `Item [${index}] is missing date field: ${field}`
      ).toHaveProperty(field);

      const dateString = item[field];
      expect(
        this.isValidISO8601(dateString),
        `Expected item [${index}] field '${field}' to be a valid ISO 8601 timestamp, but got: ${dateString}`
      ).toBeTruthy();
    });
  }

  @Then("each item should have a non-null {string} field")
  public async thenEachItemShouldHaveNonNullField(
    field: string
  ): Promise<void> {
    const results = await this.getResultsArray();
    expect(
      results.length,
      `Null check failed: 0 results returned for validation on ${field}.`
    ).toBeGreaterThan(0);

    results.forEach((item, index) => {
      expect(
        item,
        `Item [${index}] is missing required field: ${field}`
      ).toHaveProperty(field);

      const actualValue = item[field];
      expect(
        actualValue,
        `Expected field '${field}' to be non-null/non-undefined for item [${index}], but got: ${actualValue}`
      ).not.toBeNull();
      expect(
        actualValue,
        `Expected field '${field}' to be non-null/non-undefined for item [${index}], but got: ${actualValue}`
      ).toBeDefined();
    });
  }

  @Then("for each item, the field {string} should be a {string}")
  public async thenFieldShouldBeARequirement(
    field: string,
    requirement: string
  ): Promise<void> {
    const results = await this.getResultsArray();
    expect(
      results.length,
      `Numeric validation failed: 0 results returned.`
    ).toBeGreaterThan(0);

    results.forEach((item, index) => {
      expect(item, `Item [${index}] is missing field: ${field}`).toHaveProperty(
        field
      );
      const actualValue = item[field];
      let conditionMet = false;

      switch (requirement.toLowerCase().trim()) {
        case "positive number":
          conditionMet = typeof actualValue === "number" && actualValue > 0;
          break;
        case "positive integer":
          conditionMet = Number.isInteger(actualValue) && actualValue > 0;
          break;
        case "non-negative integer":
          conditionMet = Number.isInteger(actualValue) && actualValue >= 0;
          break;
        case "non-negative or null":
          conditionMet =
            actualValue === null ||
            (typeof actualValue === "number" && actualValue >= 0);
          break;
        default:
          throw new Error(`Unsupported numeric requirement: ${requirement}`);
      }

      expect(
        conditionMet,
        `Expected item [${index}] field '${field}' with value (${actualValue}) to be a '${requirement}', but it did not satisfy the condition.`
      ).toBeTruthy();
    });
  }

  @Then("{string} should be greater than or equal to {string}")
  public async thenFieldAShouldBeGTEFieldB(
    fieldA: string,
    fieldB: string
  ): Promise<void> {
    const results = await this.getResultsArray();
    expect(
      results.length,
      `Logical validation failed: 0 results returned.`
    ).toBeGreaterThan(0);

    results.forEach((item, index) => {
      const valueA = item[fieldA] ?? 0;
      const valueB = item[fieldB] ?? 0;

      expect(
        typeof valueA,
        `Field '${fieldA}' for item [${index}] is not a number.`
      ).toBe("number");
      expect(
        typeof valueB,
        `Field '${fieldB}' for item [${index}] is not a number.`
      ).toBe("number");

      const conditionMet = valueA >= valueB;

      expect(
        conditionMet,
        `Expected item [${index}]: '${fieldA}' (${valueA}) to be >= '${fieldB}' (${valueB}), but it was not.`
      ).toBeTruthy();
    });
  }

  @Then("rtls_attempts should be greater than or equal to rtls_landings")
  public async thenRtlsAttemptsGteRtlsLandings(): Promise<void> {
    await this.thenFieldAShouldBeGTEFieldB("rtls_attempts", "rtls_landings");
  }

  @Then("asds_attempts should be greater than or equal to asds_landings")
  public async thenAsdsAttemptsGteAsdsLandings(): Promise<void> {
    await this.thenFieldAShouldBeGTEFieldB("asds_attempts", "asds_landings");
  }

  @Then("for each core:")
  public async thenForEachCore(): Promise<void> {
    const results = await this.getResultsArray();
    expect(
      results.length,
      `Expected core data list to be non-empty for 'for each core:' validation.`
    ).toBeGreaterThan(0);
  }

  @Then("each launch should have a non-null id field")
  public async thenLaunchShouldHaveNonNullId(): Promise<void> {
    await this.thenEachItemShouldHaveNonNullField("id");
  }

  @Then("each launch should have a non-null name field")
  public async thenLaunchShouldHaveNonNullName(): Promise<void> {
    await this.thenEachItemShouldHaveNonNullField("name");
  }

  @Then("each launch should have a non-null date_utc field")
  public async thenLaunchShouldHaveNonNullDateUtc(): Promise<void> {
    await this.thenEachItemShouldHaveNonNullField("date_utc");
  }

  @Then("the response should match the {string} schema")
  public async thenResponseShouldMatchSchema(
    schemaName: string
  ): Promise<void> {
    const body = await this.sharedSteps.activeAPI.getResponseBody();

    const schemaMap: { [key: string]: any } = {
      launch: LaunchSchema,
      core: CoreSchema,
      capsule: CapsuleSchema,
      crew: CrewMemberSchema,
      rocket: RocketSchema,
      payload: PayloadSchema,
    };

    const schema = schemaMap[schemaName.toLowerCase()];
    expect(schema, `Unknown schema: ${schemaName}`).toBeDefined();

    const result = schema.safeParse(body);
    expect(
      result.success,
      `Response does not match ${schemaName} schema: ${
        result.success ? "" : formatZodError(result.error)
      }`
    ).toBeTruthy();
  }

  @Then("all items should match the {string} schema")
  public async thenAllItemsShouldMatchSchema(
    schemaName: string
  ): Promise<void> {
    const results = await this.getResultsArray();

    const schemaMap: { [key: string]: any } = {
      launch: LaunchSchema,
      core: CoreSchema,
      capsule: CapsuleSchema,
      crew: CrewMemberSchema,
    };

    const schema = schemaMap[schemaName.toLowerCase()];
    expect(schema, `Unknown schema: ${schemaName}`).toBeDefined();

    for (const [index, item] of results.entries()) {
      const result = schema.safeParse(item);
      expect(
        result.success,
        `Item at index ${index} does not match ${schemaName} schema: ${
          result.success ? "" : formatZodError(result.error)
        }`
      ).toBeTruthy();
    }
  }
}
