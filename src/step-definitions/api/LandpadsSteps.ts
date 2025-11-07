import { expect } from "@playwright/test";
import { Given, When, Then, Fixture } from "playwright-bdd/decorators";
import { LandpadsAPI } from "../../services/api/LandpadsAPI";
import { APISharedSteps } from "./APISharedSteps";
import { APIBase } from "../../services/base/APIBase";

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
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    const landpads = body.docs || body;

    expect(
      Array.isArray(landpads),
      "Response is not a list or a query result (missing docs array)."
    ).toBeTruthy();

    for (const landpad of landpads) {
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
}