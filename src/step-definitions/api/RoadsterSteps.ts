import { expect } from "@playwright/test";
import { Then, Fixture } from "playwright-bdd/decorators";
import { APISharedSteps } from "./APISharedSteps";
import { RoadsterAPI } from "../../services/api/RoadsterAPI";
import { RoadsterSchema } from "../../services/schemas/RoadsterSchemas";

@Fixture("roadsterSteps")
export class RoadsterSteps {
  private roadsterAPI!: RoadsterAPI;

  constructor(private sharedSteps: APISharedSteps) {
    this.roadsterAPI = this.sharedSteps.activeAPI as RoadsterAPI;
  }

  @Then("the name field should contain {string}")
  public async thenNameFieldShouldContain(expectedName: string): Promise<void> {
    const response = this.roadsterAPI.getResponse();
    expect(response).toBeTruthy();
    
    await expect(response).toMatchSchema(RoadsterSchema);
    
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
    const response = this.roadsterAPI.getResponse();
    expect(response).toBeTruthy();
    
    await expect(response).toMatchSchema(RoadsterSchema);
    
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
    const response = this.roadsterAPI.getResponse();
    expect(response).toBeTruthy();
    
    await expect(response).toMatchSchema(RoadsterSchema);
    
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
    const response = this.roadsterAPI.getResponse();
    expect(response).toBeTruthy();
    
    await expect(response).toMatchSchema(RoadsterSchema);
    
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
    const response = this.roadsterAPI.getResponse();
    expect(response).toBeTruthy();
    
    await expect(response).toMatchSchema(RoadsterSchema);
    
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

  @Then("the response should match the Roadster schema")
  public async thenResponseShouldMatchRoadsterSchema(): Promise<void> {
    const response = this.roadsterAPI.getResponse();
    expect(response).toBeTruthy();
    await expect(response).toMatchSchema(RoadsterSchema);
  }

  @Then("the Roadster should have valid orbital data")
  public async thenRoadsterShouldHaveValidOrbitalData(): Promise<void> {
    const response = this.roadsterAPI.getResponse();
    expect(response).toBeTruthy();
    
    await expect(response).toMatchSchema(RoadsterSchema);
    
    const body = await this.roadsterAPI.getResponseBody();

    expect(body).toHaveProperty("orbit_type");
    expect(typeof body.orbit_type).toBe("string");
    expect(body.orbit_type.length).toBeGreaterThan(0);

    expect(body).toHaveProperty("period_days");
    expect(typeof body.period_days).toBe("number");
    expect(body.period_days).toBeGreaterThan(0);

    expect(body).toHaveProperty("speed_kph");
    expect(typeof body.speed_kph).toBe("number");
    expect(body.speed_kph).toBeGreaterThan(0);

    expect(body).toHaveProperty("speed_mph");
    expect(typeof body.speed_mph).toBe("number");
    expect(body.speed_mph).toBeGreaterThan(0);
  }

  @Then("the Roadster should have valid distance data")
  public async thenRoadsterShouldHaveValidDistanceData(): Promise<void> {
    const response = this.roadsterAPI.getResponse();
    expect(response).toBeTruthy();
    
    await expect(response).toMatchSchema(RoadsterSchema);
    
    const body = await this.roadsterAPI.getResponseBody();

    expect(body).toHaveProperty("earth_distance_km");
    expect(typeof body.earth_distance_km).toBe("number");
    expect(body.earth_distance_km).toBeGreaterThan(0);

    expect(body).toHaveProperty("earth_distance_mi");
    expect(typeof body.earth_distance_mi).toBe("number");
    expect(body.earth_distance_mi).toBeGreaterThan(0);

    expect(body).toHaveProperty("mars_distance_km");
    expect(typeof body.mars_distance_km).toBe("number");
    expect(body.mars_distance_km).toBeGreaterThan(0);

    expect(body).toHaveProperty("mars_distance_mi");
    expect(typeof body.mars_distance_mi).toBe("number");
    expect(body.mars_distance_mi).toBeGreaterThan(0);
  }

  @Then("the Roadster should have valid timeline data")
  public async thenRoadsterShouldHaveValidTimelineData(): Promise<void> {
    const response = this.roadsterAPI.getResponse();
    expect(response).toBeTruthy();
    
    await expect(response).toMatchSchema(RoadsterSchema);
    
    const body = await this.roadsterAPI.getResponseBody();

    expect(body).toHaveProperty("launch_mass_kg");
    expect(typeof body.launch_mass_kg).toBe("number");
    expect(body.launch_mass_kg).toBeGreaterThan(0);

    expect(body).toHaveProperty("launch_mass_lbs");
    expect(typeof body.launch_mass_lbs).toBe("number");
    expect(body.launch_mass_lbs).toBeGreaterThan(0);

    expect(body).toHaveProperty("epoch_jd");
    expect(typeof body.epoch_jd).toBe("number");
    expect(body.epoch_jd).toBeGreaterThan(0);
  }

  @Then("the Roadster should have valid media links")
  public async thenRoadsterShouldHaveValidMediaLinks(): Promise<void> {
    const response = this.roadsterAPI.getResponse();
    expect(response).toBeTruthy();
    
    await expect(response).toMatchSchema(RoadsterSchema);
    
    const body = await this.roadsterAPI.getResponseBody();

    expect(body).toHaveProperty("wikipedia");
    expect(typeof body.wikipedia).toBe("string");
    expect(body.wikipedia.length).toBeGreaterThan(0);
    expect(body.wikipedia).toMatch(/^https?:\/\//);

    expect(body).toHaveProperty("video");
    expect(typeof body.video).toBe("string");
    expect(body.video.length).toBeGreaterThan(0);
    expect(body.video).toMatch(/^https?:\/\//);

    expect(body).toHaveProperty("details");
    expect(typeof body.details).toBe("string");
    expect(body.details.length).toBeGreaterThan(0);
  }

  @Then("the Roadster should have valid image data")
  public async thenRoadsterShouldHaveValidImageData(): Promise<void> {
    const response = this.roadsterAPI.getResponse();
    expect(response).toBeTruthy();
    
    await expect(response).toMatchSchema(RoadsterSchema);
    
    const body = await this.roadsterAPI.getResponseBody();

    expect(body).toHaveProperty("flickr_images");
    expect(Array.isArray(body.flickr_images)).toBeTruthy();
    
    if (body.flickr_images.length > 0) {
      for (const imageUrl of body.flickr_images) {
        expect(typeof imageUrl).toBe("string");
        expect(imageUrl.length).toBeGreaterThan(0);
        expect(imageUrl).toMatch(/^https?:\/\//);
      }
    }
  }

  @Then("the Roadster should have valid celestial position data")
  public async thenRoadsterShouldHaveValidCelestialPositionData(): Promise<void> {
    const response = this.roadsterAPI.getResponse();
    expect(response).toBeTruthy();
    
    await expect(response).toMatchSchema(RoadsterSchema);
    
    const body = await this.roadsterAPI.getResponseBody();

    expect(body).toHaveProperty("longitude");
    expect(typeof body.longitude).toBe("number");

    expect(body).toHaveProperty("latitude");
    expect(typeof body.latitude).toBe("number");

    expect(body).toHaveProperty("eccentricity");
    expect(typeof body.eccentricity).toBe("number");
    expect(body.eccentricity).toBeGreaterThanOrEqual(0);

    expect(body).toHaveProperty("inclination");
    expect(typeof body.inclination).toBe("number");
    expect(body.inclination).toBeGreaterThanOrEqual(0);
  }
}