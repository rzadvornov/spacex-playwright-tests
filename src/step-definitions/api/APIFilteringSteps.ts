import { expect } from "@playwright/test";
import { When, Then, Fixture } from "playwright-bdd/decorators";
import { APISharedSteps } from "./APISharedSteps";
import { CapsuleSchema } from "../../services/api/schemas/CapsulesSchemas";
import { CoreSchema } from "../../services/api/schemas/CoresSchemas";
import { CrewMemberSchema } from "../../services/api/schemas/CrewSchemas";
import { LaunchSchema } from "../../services/api/schemas/LaunchesSchemas";
import { formatZodError } from "../../utils/ZodErrorFormatter";

@Fixture("apiFilteringSteps")
export class APIFilteringSteps {
  constructor(private sharedSteps: APISharedSteps) {}

  private async getResultsArray(): Promise<any[]> {
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    return (Array.isArray(body) ? body : body.docs) || [];
  }

  private parseExpectedValue(valueString: string): any {
    const lowerCaseString = valueString.toLowerCase();

    if (valueString.startsWith('"') && valueString.endsWith('"')) {
      return valueString.slice(1, -1);
    }

    if (lowerCaseString === "true") {
      return true;
    }

    if (lowerCaseString === "false") {
      return false;
    }

    if (lowerCaseString === "null") {
      return null;
    }

    const numericValue = parseFloat(valueString);
    if (!isNaN(numericValue) && isFinite(numericValue)) {
      return numericValue;
    }

    return valueString;
  }

  private async setActiveAPIByEndpoint(endpoint: string): Promise<void> {
    const endpointMap: { [key: string]: string } = {
      "/launches": "Launches",
      "/cores": "Cores",
      "/payloads": "Payloads",
      "/capsules": "Capsules",
      "/crew": "Crew",
    };

    let resourceName: string | undefined;

    for (const pathSegment in endpointMap) {
      if (endpoint.includes(pathSegment)) {
        resourceName = endpointMap[pathSegment];
        break;
      }
    }

    if (!resourceName) {
      throw new Error(`Unsupported API resource for query endpoint: ${endpoint}. 
        Must contain one of the supported segments (e.g., /launches, /cores, etc.).`);
    }

    await this.sharedSteps.givenApiIsAvailable(resourceName);
  }

  private checkCondition(
    actual: any,
    operator: string,
    expected: any
  ): boolean {
    const operatorMap: { [key: string]: (a: any, e: any) => boolean } = {
      "": (a, e) => a === e,
      $gt: (a, e) => a > e,
      $gte: (a, e) => a >= e,
      $lt: (a, e) => a < e,
      $lte: (a, e) => a <= e,
      $ne: (a, e) => {
        if (e === null) {
          return a !== null && a !== undefined;
        }
        return a !== e;
      },
    };

    const conditionFunction = operatorMap[operator];

    if (conditionFunction) {
      return conditionFunction(actual, expected);
    } else {
      throw new Error(
        `Unsupported query operator in step: ${operator}. Supported operators are: ${Object.keys(
          operatorMap
        ).join(", ")}.`
      );
    }
  }

  @When("I make a POST request to {string} with following query:")
  public async whenMakePostRequestToQuery(
    endpoint: string,
    docString: string
  ): Promise<void> {
    await this.setActiveAPIByEndpoint(endpoint);

    const queryBody = JSON.parse(docString);
    this.sharedSteps.queryBody = queryBody;

    await this.sharedSteps.activeAPI.makePostRequest(endpoint, queryBody);
  }

  @Then(
    "all results should satisfy the filter condition {string} {string} {string}"
  )
  public async thenAllResultsShouldSatisfyFilterCondition(
    field: string,
    operator: string,
    expectedValueString: string
  ): Promise<void> {
    const results = await this.getResultsArray();

    expect(
      results.length,
      `Filter check failed: 0 results returned for filter on ${field}.`
    ).toBeGreaterThan(0);

    const expectedValue = this.parseExpectedValue(expectedValueString);

    results.forEach((item, index) => {
      expect(
        item,
        `Item [${index}] is missing the field: ${field}`
      ).toHaveProperty(field);

      const actualValue = item[field];
      const conditionMet = this.checkCondition(
        actualValue,
        operator,
        expectedValue
      );

      expect(
        conditionMet,
        `Expected item [${index}] field '${field}' with value (${actualValue}) ` +
          `to satisfy condition ${operator} ${expectedValueString}, but it did not.`
      ).toBeTruthy();
    });
  }

  @Then("all results should have {string} between {string} and {string}")
  public async thenAllResultsShouldHaveDateBetween(
    field: string,
    startDateString: string,
    endDateString: string
  ): Promise<void> {
    const results = await this.getResultsArray();
    expect(
      results.length,
      "Date range check failed: 0 results returned."
    ).toBeGreaterThan(0);

    const startDate = new Date(startDateString);
    const endDate = new Date(endDateString);

    endDate.setHours(23, 59, 59, 999);

    for (const item of results) {
      expect(item, `Item is missing the date field: ${field}`).toHaveProperty(
        field
      );
      const actualDateString = item[field];
      const actualDate = new Date(actualDateString);

      const isAfterStart = actualDate.getTime() >= startDate.getTime();
      const isBeforeEnd = actualDate.getTime() <= endDate.getTime();
      const conditionMet = isAfterStart && isBeforeEnd;

      expect(
        conditionMet,
        `Expected item date ${actualDateString} to be between ${startDateString} and ${endDateString}, but it was not.`
      ).toBeTruthy();
    }
  }

  @Then("all results should be successful and not upcoming")
  public async thenAllResultsShouldBeSuccessfulAndNotUpcoming(): Promise<void> {
    const results = await this.getResultsArray();
    expect(
      results.length,
      "Compound filter check failed: 0 results returned."
    ).toBeGreaterThan(0);

    for (const item of results) {
      expect(item, "Item is missing the 'success' field").toHaveProperty(
        "success"
      );
      expect(item, "Item is missing the 'upcoming' field").toHaveProperty(
        "upcoming"
      );

      const isSuccessful = item.success === true;
      const isNotUpcoming = item.upcoming === false;

      expect(
        isSuccessful,
        `Expected launch to be successful (success: true), but got ${item.success}`
      ).toBeTruthy();

      expect(
        isNotUpcoming,
        `Expected launch to be not upcoming (upcoming: false), but got ${item.upcoming}`
      ).toBeTruthy();
    }
  }

  @Then("results should be sorted by {string} descending")
  public async thenResultsShouldBeSortedByDescending(
    field: string
  ): Promise<void> {
    const results = await this.getResultsArray();

    expect(
      results.length,
      `Sort check failed: 0 results returned for sorting by ${field}.`
    ).toBeGreaterThan(1);

    let previousValue: any = null;
    for (let i = 0; i < results.length; i++) {
      const currentItem = results[i];

      expect(
        currentItem,
        `Item [${i}] is missing the field: ${field}`
      ).toHaveProperty(field);

      const currentValue = currentItem[field];
      if (i === 0) {
        previousValue = currentValue;
        continue;
      }

      const isDescending = currentValue <= previousValue;
      expect(
        isDescending,
        `Sort order failed at index ${i}. Expected '${field}' to be descending. ` +
          `Current value (${currentValue}) is greater than previous value (${previousValue}).`
      ).toBeTruthy();

      previousValue = currentValue;
    }
  }

  @Then("all filtered results should match the {string} schema")
public async thenAllFilteredResultsShouldMatchSchema(schemaName: string): Promise<void> {
  const results = await this.getResultsArray();
  
  const schemaMap: { [key: string]: any } = {
    'launch': LaunchSchema,
    'core': CoreSchema,
    'capsule': CapsuleSchema,
    'crew': CrewMemberSchema
  };
  
  const schema = schemaMap[schemaName.toLowerCase()];
  
  for (const [index, item] of results.entries()) {
    const result = schema.safeParse(item);
    expect(
      result.success,
      `Filtered item at index ${index} does not match ${schemaName} schema: ${result.success ? '' : formatZodError(result.error)}`
    ).toBeTruthy();
  }
}
}
