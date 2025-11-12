import { expect } from "@playwright/test";
import { Given, When, Then, Fixture } from "playwright-bdd/decorators";
import { LaunchesAPI } from "../../services/api/LaunchesAPI";
import { APISharedSteps } from "./APISharedSteps";
import { APIBase } from "../../services/base/APIBase";
import { LinksSchema } from "../../services/api/schemas/CompanySchemas";
import { CoreSchema } from "../../services/api/schemas/CoresSchemas";
import { LaunchSchema, LaunchPaginatedResponseSchema, LaunchArraySchema, FailureSchema, FairingsSchema } from "../../services/api/schemas/LaunchesSchemas";

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
    const response = this.sharedSteps.activeAPI.getResponse();
    expect(response).toBeTruthy();
    
    await expect(response).toMatchSchema(LaunchSchema);
    
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
    const response = this.sharedSteps.activeAPI.getResponse();
    expect(response).toBeTruthy();
    
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    if (body.docs) {
      await expect(response).toMatchSchema(LaunchPaginatedResponseSchema);
    } else {
      await expect(response).toMatchSchema(LaunchArraySchema);
    }

    const launches = body.docs || body;

    expect(
      Array.isArray(launches),
      "Response is not a list or a query result (missing docs array)."
    ).toBeTruthy();

    for (const launch of launches) {
      const validationResult = LaunchSchema.safeParse(launch);
      expect(validationResult.success, `Launch validation failed: ${!validationResult.success ? JSON.stringify(validationResult.error.issues) : ''}`).toBeTruthy();
      
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
    const response = this.sharedSteps.activeAPI.getResponse();
    expect(response).toBeTruthy();
    
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    if (body.docs) {
      await expect(response).toMatchSchema(LaunchPaginatedResponseSchema);
    } else {
      await expect(response).toMatchSchema(LaunchArraySchema);
    }

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

  @Then("all capsule results should have {string} equal to {boolean}")
  public async thenAllLaunchResultsShouldHaveFieldEqualToBoolean(
    field: string,
    expectedValueString: string
  ): Promise<void> {
    const response = this.sharedSteps.activeAPI.getResponse();
    expect(response).toBeTruthy();
    
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    if (body.docs) {
      await expect(response).toMatchSchema(LaunchPaginatedResponseSchema);
    } else {
      await expect(response).toMatchSchema(LaunchArraySchema);
    }

    const results = (Array.isArray(body) ? body : body.docs) || [];

    expect(
      Array.isArray(results),
      "Response is not a list or a query result (missing docs array)."
    ).toBeTruthy();

    const expectedValue = expectedValueString.toLowerCase() === 'true';

    for (const item of results) {
      const validationResult = LaunchSchema.safeParse(item);
      expect(validationResult.success, `Launch item validation failed: ${!validationResult.success ? JSON.stringify(validationResult.error.issues) : ''}`).toBeTruthy();
      
      expect(
        item,
        `Result item is missing the boolean field: ${field}`
      ).toHaveProperty(field);
      
      const actualValue = item[field];
      
      expect(
        typeof actualValue,
        `Field '${field}' is not a boolean. Found type: ${typeof actualValue}`
      ).toBe("boolean");
      
      expect(
        actualValue,
        `Expected item ${field} to be ${expectedValue}, but got ${actualValue}`
      ).toEqual(expectedValue);
    }
  }

  @Then("the response should match the launch schema")
  public async thenResponseShouldMatchLaunchSchema(): Promise<void> {
    const response = this.sharedSteps.activeAPI.getResponse();
    expect(response).toBeTruthy();
    await expect(response).toMatchSchema(LaunchSchema);
  }

  @Then("the response should match the launches array schema")
  public async thenResponseShouldMatchLaunchesArraySchema(): Promise<void> {
    const response = this.sharedSteps.activeAPI.getResponse();
    expect(response).toBeTruthy();
    await expect(response).toMatchSchema(LaunchArraySchema);
  }

  @Then("the response should match the paginated launches schema")
  public async thenResponseShouldMatchPaginatedLaunchesSchema(): Promise<void> {
    const response = this.sharedSteps.activeAPI.getResponse();
    expect(response).toBeTruthy();
    await expect(response).toMatchSchema(LaunchPaginatedResponseSchema);
  }

  @Then("each launch should have valid core information")
  public async thenEachLaunchShouldHaveValidCoreInformation(): Promise<void> {
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    
    let launches;
    if (body.docs) {
      launches = body.docs;
    } else {
      launches = Array.isArray(body) ? body : [body];
    }

    for (const launch of launches) {
      expect(launch.cores).toBeDefined();
      expect(Array.isArray(launch.cores)).toBeTruthy();
      
      for (const core of launch.cores) {
        const coreValidation = CoreSchema.safeParse(core);
        expect(coreValidation.success, `Core validation failed for launch ${launch.name}: ${!coreValidation.success ? JSON.stringify(coreValidation.error.issues) : ''}`).toBeTruthy();
        
        if (core.core) {
          expect(typeof core.core).toBe("string");
          expect(core.core.length).toBeGreaterThan(0);
        }
        
        if (core.flight !== null && core.flight !== undefined) {
          expect(typeof core.flight).toBe("number");
          expect(core.flight).toBeGreaterThanOrEqual(0);
        }
      }
    }
  }

  @Then("each launch should have valid links and media")
  public async thenEachLaunchShouldHaveValidLinksAndMedia(): Promise<void> {
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    
    let launches;
    if (body.docs) {
      launches = body.docs;
    } else {
      launches = Array.isArray(body) ? body : [body];
    }

    for (const launch of launches) {
      const linksValidation = LinksSchema.safeParse(launch.links);
      expect(linksValidation.success, `Links validation failed for launch ${launch.name}: ${!linksValidation.success ? JSON.stringify(linksValidation.error.issues) : ''}`).toBeTruthy();

      if (launch.links.patch?.small || launch.links.patch?.large) {
        expect(launch.links.patch.small).toMatch(/^https?:\/\//);
        expect(launch.links.patch.large).toMatch(/^https?:\/\//);
      }

      if (launch.links.reddit) {
        if (launch.links.reddit.campaign) {
          expect(launch.links.reddit.campaign).toMatch(/^https?:\/\//);
        }
        if (launch.links.reddit.launch) {
          expect(launch.links.reddit.launch).toMatch(/^https?:\/\//);
        }
      }

      if (launch.links.presskit) {
        expect(launch.links.presskit).toMatch(/^https?:\/\//);
      }
      if (launch.links.article) {
        expect(launch.links.article).toMatch(/^https?:\/\//);
      }
      if (launch.links.wikipedia) {
        expect(launch.links.wikipedia).toMatch(/^https?:\/\//);
      }
    }
  }

  @Then("each launch should have valid failure information when applicable")
  public async thenEachLaunchShouldHaveValidFailureInformation(): Promise<void> {
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    
    let launches;
    if (body.docs) {
      launches = body.docs;
    } else {
      launches = Array.isArray(body) ? body : [body];
    }

    for (const launch of launches) {
      if (!launch.success && launch.failures && launch.failures.length > 0) {
        for (const failure of launch.failures) {
          const failureValidation = FailureSchema.safeParse(failure);
          expect(failureValidation.success, `Failure validation failed for launch ${launch.name}: ${!failureValidation.success ? JSON.stringify(failureValidation.error.issues) : ''}`).toBeTruthy();
          
          expect(failure.time).toBeGreaterThanOrEqual(0);
          expect(failure.altitude).toBeGreaterThanOrEqual(0);
          expect(failure.reason.length).toBeGreaterThan(0);
        }
      }
    }
  }

  @Then("each launch should have valid fairings information")
  public async thenEachLaunchShouldHaveValidFairingsInformation(): Promise<void> {
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    
    let launches;
    if (body.docs) {
      launches = body.docs;
    } else {
      launches = Array.isArray(body) ? body : [body];
    }

    for (const launch of launches) {
      if (launch.fairings) {
        const fairingsValidation = FairingsSchema.safeParse(launch.fairings);
        expect(fairingsValidation.success, `Fairings validation failed for launch ${launch.name}: ${!fairingsValidation.success ? JSON.stringify(fairingsValidation.error.issues) : ''}`).toBe(true);

        if (launch.fairings.recovery_attempt !== null) {
          expect(typeof launch.fairings.recovery_attempt).toBe("boolean");
        }
        if (launch.fairings.recovered !== null) {
          expect(typeof launch.fairings.recovered).toBe("boolean");
        }
        if (launch.fairings.ships) {
          expect(Array.isArray(launch.fairings.ships)).toBeTruthy();
          for (const ship of launch.fairings.ships) {
            expect(typeof ship).toBe("string");
            expect(ship.length).toBeGreaterThan(0);
          }
        }
      }
    }
  }

  @Then("each launch should have valid payload information")
  public async thenEachLaunchShouldHaveValidPayloadInformation(): Promise<void> {
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    
    let launches;
    if (body.docs) {
      launches = body.docs;
    } else {
      launches = Array.isArray(body) ? body : [body];
    }

    for (const launch of launches) {
      expect(launch.payloads).toBeDefined();
      expect(Array.isArray(launch.payloads)).toBeTruthy();
      
      if (launch.payloads.length > 0) {
        for (const payload of launch.payloads) {
          expect(typeof payload).toBe("string");
          expect(payload.length).toBeGreaterThan(0);
          expect(payload).toMatch(/^[a-f0-9]{24}$/);
        }
      }
    }
  }

  @Then("each launch should have valid rocket and launchpad information")
  public async thenEachLaunchShouldHaveValidRocketAndLaunchpadInformation(): Promise<void> {
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    
    let launches;
    if (body.docs) {
      launches = body.docs;
    } else {
      launches = Array.isArray(body) ? body : [body];
    }

    for (const launch of launches) {
      expect(launch.rocket).toBeDefined();
      expect(typeof launch.rocket).toBe("string");
      expect(launch.rocket.length).toBeGreaterThan(0);
      expect(launch.rocket).toMatch(/^[a-f0-9]{24}$/);

      expect(launch.launchpad).toBeDefined();
      expect(typeof launch.launchpad).toBe("string");
      expect(launch.launchpad.length).toBeGreaterThan(0);
      expect(launch.launchpad).toMatch(/^[a-f0-9]{24}$/);

      expect(launch.flight_number).toBeDefined();
      expect(typeof launch.flight_number).toBe("number");
      expect(launch.flight_number).toBeGreaterThan(0);
    }
  }
}