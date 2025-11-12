import { expect } from "@playwright/test";
import { Given, When, Then, Fixture } from "playwright-bdd/decorators";
import { LaunchpadsAPI } from "../../services/api/LaunchpadsAPI";
import { APISharedSteps } from "./APISharedSteps";
import { APIBase } from "../../services/base/APIBase";
import { LaunchpadPaginatedResponseSchema, LaunchpadArraySchema, LaunchpadSchema, LocationSchema, StatusSchema } from "../../services/schemas/LaunchpadsSchemas";

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
    const response = this.sharedSteps.activeAPI.getResponse();
    expect(response).toBeTruthy();
    
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    if (body.docs) {
      await expect(response).toMatchSchema(LaunchpadPaginatedResponseSchema);
    } else {
      await expect(response).toMatchSchema(LaunchpadArraySchema);
    }

    const items = body.docs || body;
    const value = expectedValue.replace(/\"/g, "");

    expect(
      Array.isArray(items),
      "Response is not a list or a query result (missing docs array)."
    ).toBeTruthy();

    for (const item of items) {
      const validationResult = LaunchpadSchema.safeParse(item);
      expect(validationResult.success, `Launchpad validation failed: ${!validationResult.success ? JSON.stringify(validationResult.error.issues) : ''}`).toBeTruthy();
      
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

  @Then("the launchpad latitude should be between -90 and 90")
  public async thenLatitudeShouldBeValid(): Promise<void> {
    const response = this.sharedSteps.activeAPI.getResponse();
    expect(response).toBeTruthy();
    
    await expect(response).toMatchSchema(LaunchpadSchema);
    
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

  @Then("the launchpad longitude should be between -180 and 180")
  public async thenLongitudeShouldBeValid(): Promise<void> {
    const response = this.sharedSteps.activeAPI.getResponse();
    expect(response).toBeTruthy();
    
    await expect(response).toMatchSchema(LaunchpadSchema);
    
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
    const response = this.sharedSteps.activeAPI.getResponse();
    expect(response).toBeTruthy();
    
    await expect(response).toMatchSchema(LaunchpadSchema);
    
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

  @Then("the response should match the launchpad schema")
  public async thenResponseShouldMatchLaunchpadSchema(): Promise<void> {
    const response = this.sharedSteps.activeAPI.getResponse();
    expect(response).toBeTruthy();
    await expect(response).toMatchSchema(LaunchpadSchema);
  }

  @Then("the response should match the launchpads array schema")
  public async thenResponseShouldMatchLaunchpadsArraySchema(): Promise<void> {
    const response = this.sharedSteps.activeAPI.getResponse();
    expect(response).toBeTruthy();
    await expect(response).toMatchSchema(LaunchpadArraySchema);
  }

  @Then("the response should match the paginated launchpads schema")
  public async thenResponseShouldMatchPaginatedLaunchpadsSchema(): Promise<void> {
    const response = this.sharedSteps.activeAPI.getResponse();
    expect(response).toBeTruthy();
    await expect(response).toMatchSchema(LaunchpadPaginatedResponseSchema);
  }

  @Then("each launchpad should have valid location data")
  public async thenEachLaunchpadShouldHaveValidLocationData(): Promise<void> {
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    
    let launchpads;
    if (body.docs) {
      launchpads = body.docs;
    } else {
      launchpads = Array.isArray(body) ? body : [body];
    }

    for (const launchpad of launchpads) {
      const locationValidation = LocationSchema.safeParse(launchpad);
      expect(locationValidation.success, `Location validation failed for launchpad ${launchpad.name}: ${!locationValidation.success ? JSON.stringify(locationValidation.error.issues) : ''}`).toBeTruthy();

      expect(launchpad).toHaveProperty("name");
      expect(typeof launchpad.name).toBe("string");
      expect(launchpad.name.length).toBeGreaterThan(0);

      expect(launchpad).toHaveProperty("full_name");
      expect(typeof launchpad.full_name).toBe("string");
      expect(launchpad.full_name.length).toBeGreaterThan(0);

      expect(launchpad).toHaveProperty("locality");
      expect(typeof launchpad.locality).toBe("string");
      expect(launchpad.locality.length).toBeGreaterThan(0);

      expect(launchpad).toHaveProperty("region");
      expect(typeof launchpad.region).toBe("string");
      expect(launchpad.region.length).toBeGreaterThan(0);

      expect(launchpad).toHaveProperty("timezone");
      expect(typeof launchpad.timezone).toBe("string");
      expect(launchpad.timezone.length).toBeGreaterThan(0);
    }
  }

  @Then("each launchpad should have valid status information")
  public async thenEachLaunchpadShouldHaveValidStatusInformation(): Promise<void> {
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    
    let launchpads;
    if (body.docs) {
      launchpads = body.docs;
    } else {
      launchpads = Array.isArray(body) ? body : [body];
    }

    for (const launchpad of launchpads) {
      const statusValidation = StatusSchema.safeParse(launchpad);
      expect(statusValidation.success, `Status validation failed for launchpad ${launchpad.name}: ${!statusValidation.success ? JSON.stringify(statusValidation.error.issues) : ''}`).toBeTruthy();

      expect(launchpad).toHaveProperty("status");
      expect(typeof launchpad.status).toBe("string");
      expect(launchpad.status.length).toBeGreaterThan(0);

      const validStatuses = ["active", "inactive", "retired", "under construction", "lost"];
      expect(validStatuses).toContain(launchpad.status);

      expect(launchpad).toHaveProperty("launch_attempts");
      expect(typeof launchpad.launch_attempts).toBe("number");
      expect(launchpad.launch_attempts).toBeGreaterThanOrEqual(0);

      expect(launchpad).toHaveProperty("launch_successes");
      expect(typeof launchpad.launch_successes).toBe("number");
      expect(launchpad.launch_successes).toBeGreaterThanOrEqual(0);
      expect(launchpad.launch_successes).toBeLessThanOrEqual(launchpad.launch_attempts);
    }
  }

  @Then("each launchpad should have valid rocket and launch information")
  public async thenEachLaunchpadShouldHaveValidRocketAndLaunchInformation(): Promise<void> {
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    
    let launchpads;
    if (body.docs) {
      launchpads = body.docs;
    } else {
      launchpads = Array.isArray(body) ? body : [body];
    }

    for (const launchpad of launchpads) {
      expect(launchpad).toHaveProperty("rockets");
      expect(Array.isArray(launchpad.rockets)).toBeTruthy();
      
      if (launchpad.rockets.length > 0) {
        for (const rocket of launchpad.rockets) {
          expect(typeof rocket).toBe("string");
          expect(rocket.length).toBeGreaterThan(0);
        }
      }

      expect(launchpad).toHaveProperty("launches");
      expect(Array.isArray(launchpad.launches)).toBeTruthy();
      
      if (launchpad.launches.length > 0) {
        for (const launch of launchpad.launches) {
          expect(typeof launch).toBe("string");
          expect(launch.length).toBeGreaterThan(0);
          expect(launch).toMatch(/^[a-f0-9]{24}$/);
        }
      }
    }
  }

  @Then("each launchpad should have valid details and images")
  public async thenEachLaunchpadShouldHaveValidDetailsAndImages(): Promise<void> {
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    
    let launchpads;
    if (body.docs) {
      launchpads = body.docs;
    } else {
      launchpads = Array.isArray(body) ? body : [body];
    }

    for (const launchpad of launchpads) {
      expect(launchpad).toHaveProperty("details");
      expect(typeof launchpad.details).toBe("string");
      if (launchpad.details) {
        expect(launchpad.details.length).toBeGreaterThan(0);
      }

      expect(launchpad).toHaveProperty("images");
      expect(typeof launchpad.images).toBe("object");

      if (launchpad.images.large && launchpad.images.large.length > 0) {
        for (const imageUrl of launchpad.images.large) {
          expect(typeof imageUrl).toBe("string");
          expect(imageUrl.length).toBeGreaterThan(0);
          expect(imageUrl).toMatch(/^https?:\/\//);
        }
      }
    }
  }

  @Then("the launchpad should have valid coordinate relationships")
  public async thenLaunchpadShouldHaveValidCoordinateRelationships(): Promise<void> {
    const response = this.sharedSteps.activeAPI.getResponse();
    expect(response).toBeTruthy();
    
    await expect(response).toMatchSchema(LaunchpadSchema);
    
    const body = await this.sharedSteps.activeAPI.getResponseBody();

    if (body.latitude !== null && body.latitude !== undefined) {
      expect(body.longitude).toBeDefined();
      expect(typeof body.longitude).toBe("number");
    }

    if (body.longitude !== null && body.longitude !== undefined) {
      expect(body.latitude).toBeDefined();
      expect(typeof body.latitude).toBe("number");
    }

    expect(body.launch_successes).toBeLessThanOrEqual(body.launch_attempts);

    if (body.launches.length > 0) {
      expect(body.rockets.length).toBeGreaterThan(0);
    }
  }
}