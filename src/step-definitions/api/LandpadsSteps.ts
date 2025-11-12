import { expect } from "@playwright/test";
import { Given, When, Then, Fixture } from "playwright-bdd/decorators";
import { LandpadsAPI } from "../../services/api/LandpadsAPI";
import { APISharedSteps } from "./APISharedSteps";
import { APIBase } from "../../services/base/APIBase";
import { LandpadPaginatedResponseSchema, LandpadArraySchema, LandpadSchema } from "../../services/schemas/LandpadsSchemas";
import { LocationSchema, StatusSchema } from "../../services/schemas/LaunchpadsSchemas";

@Fixture("landpadsSteps")
export class LandpadsSteps {
  private landpadsAPI!: LandpadsAPI;

  constructor(private sharedSteps: APISharedSteps) {}

  @Given("a valid landing pad ID {string} is available")
  public async givenValidLandpadId(landpadId: string): Promise<void> {
    this.sharedSteps.setResourceId(landpadId);
  }

  @When("I query the Landpads API using POST with filter:")
  public async whenQueryLandpadsAPIWithFilter(docString: string): Promise<void> {
    const queryBody = JSON.parse(docString);
    this.sharedSteps.queryBody = queryBody;

    expect(
      this.sharedSteps.activeAPI,
      "Active API not initialized or not LandpadsAPI"
    ).toBeInstanceOf(APIBase);
    this.landpadsAPI = this.sharedSteps.activeAPI as LandpadsAPI;

    await this.landpadsAPI.queryLandpads(queryBody);
  }

  @Then("the results should contain landpads matching {string} equals {string}")
  public async thenResultsShouldContainLandpadsMatchingString(
    field: string,
    expectedValue: string
  ): Promise<void> {
    const valueToMatch = expectedValue.replace(/\"/g, "");
    
    await this.validateLandpadsMatch(field, valueToMatch);
  }
  
  private async validateLandpadsMatch(field: string, valueToMatch: any): Promise<void> {
    const response = this.sharedSteps.activeAPI.getResponse();
    expect(response).toBeTruthy();
    
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    if (body.docs) {
      await expect(response).toMatchSchema(LandpadPaginatedResponseSchema);
    } else {
      await expect(response).toMatchSchema(LandpadArraySchema);
    }

    const landpads = body.docs || body;

    expect(
      Array.isArray(landpads),
      "Response is not a list or a query result (missing docs array)."
    ).toBeTruthy();

    for (const landpad of landpads) {
      const validationResult = LandpadSchema.safeParse(landpad);
      expect(validationResult.success, `Landpad validation failed: ${!validationResult.success ? JSON.stringify(validationResult.error.issues) : ''}`).toBeTruthy();
      
      expect(
        landpad,
        `Landpad item is missing the field: ${field}`
      ).toHaveProperty(field);
      expect(
        landpad[field],
        `Expected landpad ${field} to be ${valueToMatch}, but got ${landpad[field]}`
      ).toEqual(valueToMatch);
    }
  }

  @Then("the landpad latitude should be between -90 and 90")
  public async thenLatitudeShouldBeBetween(): Promise<void> {
    const response = this.sharedSteps.activeAPI.getResponse();
    expect(response).toBeTruthy();
    
    await expect(response).toMatchSchema(LandpadSchema);
    
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    const latitude = body?.latitude;

    expect(
      typeof latitude,
      `Latitude field is missing or not a number. Found type: ${typeof latitude}`
    ).toBe("number");
    
    expect(latitude).toBeGreaterThanOrEqual(-90);
    expect(latitude).toBeLessThanOrEqual(90);
  }

  @Then("the landpad longitude should be between -180 and 180")
  public async thenLongitudeShouldBeBetween(): Promise<void> {
    const response = this.sharedSteps.activeAPI.getResponse();
    expect(response).toBeTruthy();
    
    await expect(response).toMatchSchema(LandpadSchema);
    
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    const longitude = body?.longitude;

    expect(
      typeof longitude,
      `Longitude field is missing or not a number. Found type: ${typeof longitude}`
    ).toBe("number");
    
    expect(longitude).toBeGreaterThanOrEqual(-180);
    expect(longitude).toBeLessThanOrEqual(180);
  }

  @Then("the successful_landings should not be greater than the landing_attempts")
  public async thenLandingsSuccessShouldNotBeGreaterThanAttempts(): Promise<void> {
    const response = this.sharedSteps.activeAPI.getResponse();
    expect(response).toBeTruthy();
    
    await expect(response).toMatchSchema(LandpadSchema);
    
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    
    expect(body).toHaveProperty("successful_landings");
    expect(body).toHaveProperty("landing_attempts");

    const successfulLandings = body.successful_landings;
    const landingAttempts = body.landing_attempts;

    expect(
      typeof successfulLandings,
      `successful_landings is not a number. Found type: ${typeof successfulLandings}`
    ).toBe("number");
    expect(
      typeof landingAttempts,
      `landing_attempts is not a number. Found type: ${typeof landingAttempts}`
    ).toBe("number");

    expect(
      successfulLandings,
      `Successful landings (${successfulLandings}) should not exceed landing attempts (${landingAttempts}).`
    ).toBeLessThanOrEqual(landingAttempts);
  }

  @Then("the response should match the landpad schema")
  public async thenResponseShouldMatchLandpadSchema(): Promise<void> {
    const response = this.sharedSteps.activeAPI.getResponse();
    expect(response).toBeTruthy();
    await expect(response).toMatchSchema(LandpadSchema);
  }

  @Then("the response should match the landpads array schema")
  public async thenResponseShouldMatchLandpadsArraySchema(): Promise<void> {
    const response = this.sharedSteps.activeAPI.getResponse();
    expect(response).toBeTruthy();
    await expect(response).toMatchSchema(LandpadArraySchema);
  }

  @Then("the response should match the paginated landpads schema")
  public async thenResponseShouldMatchPaginatedLandpadsSchema(): Promise<void> {
    const response = this.sharedSteps.activeAPI.getResponse();
    expect(response).toBeTruthy();
    await expect(response).toMatchSchema(LandpadPaginatedResponseSchema);
  }

  @Then("each landpad should have valid location data")
  public async thenEachLandpadShouldHaveValidLocationData(): Promise<void> {
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    
    let landpads;
    if (body.docs) {
      landpads = body.docs;
    } else {
      landpads = Array.isArray(body) ? body : [body];
    }

    for (const landpad of landpads) {
      const locationValidation = LocationSchema.safeParse(landpad);
      expect(locationValidation.success, `Location validation failed for landpad ${landpad.name}: ${!locationValidation.success ? JSON.stringify(locationValidation.error.issues) : ''}`).toBeTruthy();

      expect(landpad).toHaveProperty("name");
      expect(typeof landpad.name).toBe("string");
      expect(landpad.name.length).toBeGreaterThan(0);

      expect(landpad).toHaveProperty("full_name");
      expect(typeof landpad.full_name).toBe("string");
      expect(landpad.full_name.length).toBeGreaterThan(0);

      expect(landpad).toHaveProperty("locality");
      expect(typeof landpad.locality).toBe("string");
      expect(landpad.locality.length).toBeGreaterThan(0);

      expect(landpad).toHaveProperty("region");
      expect(typeof landpad.region).toBe("string");
      expect(landpad.region.length).toBeGreaterThan(0);

      if (landpad.latitude !== null && landpad.latitude !== undefined) {
        expect(landpad.longitude).toBeDefined();
        expect(typeof landpad.longitude).toBe("number");
      }
      if (landpad.longitude !== null && landpad.longitude !== undefined) {
        expect(landpad.latitude).toBeDefined();
        expect(typeof landpad.latitude).toBe("number");
      }
    }
  }

  @Then("each landpad should have valid status and operational data")
  public async thenEachLandpadShouldHaveValidStatusAndOperationalData(): Promise<void> {
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    
    let landpads;
    if (body.docs) {
      landpads = body.docs;
    } else {
      landpads = Array.isArray(body) ? body : [body];
    }

    for (const landpad of landpads) {
      const statusValidation = StatusSchema.safeParse(landpad);
      expect(statusValidation.success, `Status validation failed for landpad ${landpad.name}: ${!statusValidation.success ? JSON.stringify(statusValidation.error.issues) : ''}`).toBeTruthy();

      expect(landpad).toHaveProperty("status");
      expect(typeof landpad.status).toBe("string");
      expect(landpad.status.length).toBeGreaterThan(0);

      const validStatuses = ["active", "inactive", "retired", "under construction", "lost"];
      expect(validStatuses).toContain(landpad.status);

      expect(landpad).toHaveProperty("landing_attempts");
      expect(typeof landpad.landing_attempts).toBe("number");
      expect(landpad.landing_attempts).toBeGreaterThanOrEqual(0);

      expect(landpad).toHaveProperty("successful_landings");
      expect(typeof landpad.successful_landings).toBe("number");
      expect(landpad.successful_landings).toBeGreaterThanOrEqual(0);
      expect(landpad.successful_landings).toBeLessThanOrEqual(landpad.landing_attempts);

      expect(landpad).toHaveProperty("type");
      expect(typeof landpad.type).toBe("string");
      expect(landpad.type.length).toBeGreaterThan(0);
    }
  }

  @Then("each landpad should have valid launch and rocket information")
  public async thenEachLandpadShouldHaveValidLaunchAndRocketInformation(): Promise<void> {
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    
    let landpads;
    if (body.docs) {
      landpads = body.docs;
    } else {
      landpads = Array.isArray(body) ? body : [body];
    }

    for (const landpad of landpads) {
      expect(landpad).toHaveProperty("launches");
      expect(Array.isArray(landpad.launches)).toBeTruthy();
      
      if (landpad.launches.length > 0) {
        for (const launch of landpad.launches) {
          expect(typeof launch).toBe("string");
          expect(launch.length).toBeGreaterThan(0);
          expect(launch).toMatch(/^[a-f0-9]{24}$/);
        }
      }
    }
  }

  @Then("each landpad should have valid details and wikipedia link")
  public async thenEachLandpadShouldHaveValidDetailsAndWikipediaLink(): Promise<void> {
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    
    let landpads;
    if (body.docs) {
      landpads = body.docs;
    } else {
      landpads = Array.isArray(body) ? body : [body];
    }

    for (const landpad of landpads) {
      expect(landpad).toHaveProperty("details");
      expect(typeof landpad.details).toBe("string");
      if (landpad.details) {
        expect(landpad.details.length).toBeGreaterThan(0);
      }

      if (landpad.wikipedia) {
        expect(typeof landpad.wikipedia).toBe("string");
        expect(landpad.wikipedia.length).toBeGreaterThan(0);
        expect(landpad.wikipedia).toMatch(/^https?:\/\//);
      }
    }
  }

  @Then("the landpad should have valid identification data")
  public async thenLandpadShouldHaveValidIdentificationData(): Promise<void> {
    const response = this.sharedSteps.activeAPI.getResponse();
    expect(response).toBeTruthy();
    
    await expect(response).toMatchSchema(LandpadSchema);
    
    const body = await this.sharedSteps.activeAPI.getResponseBody();

    expect(body).toHaveProperty("id");
    expect(typeof body.id).toBe("string");
    expect(body.id.length).toBeGreaterThan(0);

    expect(body.name).toBeDefined();
    expect(body.full_name).toBeDefined();
    expect(body.full_name).toContain(body.name);

    if (body.launches.length > 0) {
      expect(body.landing_attempts).toBeGreaterThanOrEqual(1);
    }

    expect(body.successful_landings).toBeLessThanOrEqual(body.landing_attempts);
  }
}