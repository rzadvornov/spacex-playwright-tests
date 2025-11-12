import { expect } from "@playwright/test";
import { Given, When, Then, Fixture } from "playwright-bdd/decorators";
import { RocketsAPI } from "../../services/api/RocketsAPI";
import { APISharedSteps } from "./APISharedSteps";
import { APIBase } from "../../services/base/APIBase";
import { MassSchema } from "../../services/api/schemas/DragonsSchemas";
import { RocketPaginatedResponseSchema, RocketArraySchema, RocketSchema, HeightSchema, DiameterSchema, FirstStageSchema, SecondStageSchema, EnginesSchema, PayloadWeightSchema, LandingLegsSchema } from "../../services/api/schemas/RocketSchemas";

@Fixture("rocketsSteps")
export class RocketsSteps {
  private rocketsAPI!: RocketsAPI;

  constructor(private sharedSteps: APISharedSteps) {}

  @Given("a valid rocket ID {string} is available")
  public async givenValidRocketId(rocketId: string): Promise<void> {
    this.sharedSteps.setResourceId(rocketId);
  }

  @When("I query the Rockets API using POST with filter:")
  public async whenQueryRocketsAPIWithFilter(docString: string): Promise<void> {
    const queryBody = JSON.parse(docString);
    this.sharedSteps.queryBody = queryBody;

    expect(
      this.sharedSteps.activeAPI,
      "Active API not initialized or not RocketsAPI"
    ).toBeInstanceOf(APIBase);
    this.rocketsAPI = this.sharedSteps.activeAPI as RocketsAPI;

    await this.rocketsAPI.queryRockets(queryBody);
  }

  @Then("the results should contain rockets matching {string} equals {string}")
  public async thenResultsShouldContainItemsMatchingString(
    field: string,
    expectedValue: string
  ): Promise<void> {
    const response = this.sharedSteps.activeAPI.getResponse();
    expect(response).toBeTruthy();
    
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    if (body.docs) {
      await expect(response).toMatchSchema(RocketPaginatedResponseSchema);
    } else {
      await expect(response).toMatchSchema(RocketArraySchema);
    }

    const rockets = body.docs || body;
    const value = expectedValue.replace(/\"/g, "");

    expect(Array.isArray(rockets), "Response is not a list or a query result (missing docs array).").toBeTruthy();

    for (const rocket of rockets) {
      const validationResult = RocketSchema.safeParse(rocket);
      expect(validationResult.success, `Rocket validation failed: ${!validationResult.success ? JSON.stringify(validationResult.error.issues) : ''}`).toBeTruthy();
      
      expect(rocket, `Rocket item is missing the field: ${field}`).toHaveProperty(field);
      expect(
        rocket[field],
        `Expected rocket ${field} to be '${value}', but got '${rocket[field]}'`
      ).toEqual(value);
    }
  }

  @Then("the results should contain rockets matching {string} equals {boolean}")
  public async thenResultsShouldContainItemsMatchingBoolean(
    field: string,
    expectedBooleanValue: boolean
  ): Promise<void> {
    const response = this.sharedSteps.activeAPI.getResponse();
    expect(response).toBeTruthy();
    
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    if (body.docs) {
      await expect(response).toMatchSchema(RocketPaginatedResponseSchema);
    } else {
      await expect(response).toMatchSchema(RocketArraySchema);
    }

    const rockets = body.docs || body;

    expect(Array.isArray(rockets), "Response is not a list or a query result (missing docs array).").toBeTruthy();

    for (const rocket of rockets) {
      const validationResult = RocketSchema.safeParse(rocket);
      expect(validationResult.success, `Rocket validation failed: ${!validationResult.success ? JSON.stringify(validationResult.error.issues) : ''}`).toBeTruthy();
      
      expect(rocket, `Rocket item is missing the field: ${field}`).toHaveProperty(field);
      expect(
        rocket[field],
        `Expected rocket ${field} to be ${expectedBooleanValue}, but got ${rocket[field]}`
      ).toEqual(expectedBooleanValue);
    }
  }

  private getNestedPropertyValue(obj: any, path: string): any {
    return path
      .split(".")
      .reduce((prev, curr) => (prev ? prev[curr] : undefined), obj);
  }

  @Then("the field {string} should be a positive number")
  public async thenFieldShouldBeAPositiveNumber(field: string): Promise<void> {
    const response = this.sharedSteps.activeAPI.getResponse();
    expect(response).toBeTruthy();
    
    await expect(response).toMatchSchema(RocketSchema);
    
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    const value = this.getNestedPropertyValue(body, field);

    expect(
      value,
      `Field '${field}' is missing, null, or undefined in the response.`
    ).toBeDefined();

    expect(
      typeof value,
      `Field '${field}' is not a number. Found type: ${typeof value}`
    ).toBe("number");

    expect(
      value,
      `Field '${field}' with value ${value} is not a positive number.`
    ).toBeGreaterThan(0);
  }

  @Then("the response should match the rocket schema")
  public async thenResponseShouldMatchRocketSchema(): Promise<void> {
    const response = this.sharedSteps.activeAPI.getResponse();
    expect(response).toBeTruthy();
    await expect(response).toMatchSchema(RocketSchema);
  }

  @Then("the response should match the rockets array schema")
  public async thenResponseShouldMatchRocketsArraySchema(): Promise<void> {
    const response = this.sharedSteps.activeAPI.getResponse();
    expect(response).toBeTruthy();
    await expect(response).toMatchSchema(RocketArraySchema);
  }

  @Then("the response should match the paginated rockets schema")
  public async thenResponseShouldMatchPaginatedRocketsSchema(): Promise<void> {
    const response = this.sharedSteps.activeAPI.getResponse();
    expect(response).toBeTruthy();
    await expect(response).toMatchSchema(RocketPaginatedResponseSchema);
  }

  @Then("each rocket should have valid dimensions data")
  public async thenEachRocketShouldHaveValidDimensionsData(): Promise<void> {
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    
    let rockets;
    if (body.docs) {
      rockets = body.docs;
    } else {
      rockets = Array.isArray(body) ? body : [body];
    }

    for (const rocket of rockets) {
      const heightValidation = HeightSchema.safeParse(rocket.height);
      expect(heightValidation.success, `Height validation failed for rocket ${rocket.name}: ${!heightValidation.success ? JSON.stringify(heightValidation.error.issues) : ''}`).toBeTruthy();

      const diameterValidation = DiameterSchema.safeParse(rocket.diameter);
      expect(diameterValidation.success, `Diameter validation failed for rocket ${rocket.name}: ${!diameterValidation.success ? JSON.stringify(diameterValidation.error.issues) : ''}`).toBeTruthy();

      const massValidation = MassSchema.safeParse(rocket.mass);
      expect(massValidation.success, `Mass validation failed for rocket ${rocket.name}: ${!massValidation.success ? JSON.stringify(massValidation.error.issues) : ''}`).toBeTruthy();
    }
  }

  @Then("each rocket should have valid stage information")
  public async thenEachRocketShouldHaveValidStageInformation(): Promise<void> {
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    
    let rockets;
    if (body.docs) {
      rockets = body.docs;
    } else {
      rockets = Array.isArray(body) ? body : [body];
    }

    for (const rocket of rockets) {
      const firstStageValidation = FirstStageSchema.safeParse(rocket.first_stage);
      expect(firstStageValidation.success, `First stage validation failed for rocket ${rocket.name}: ${!firstStageValidation.success ? JSON.stringify(firstStageValidation.error.issues) : ''}`).toBeTruthy();

      const secondStageValidation = SecondStageSchema.safeParse(rocket.second_stage);
      expect(secondStageValidation.success, `Second stage validation failed for rocket ${rocket.name}: ${!secondStageValidation.success ? JSON.stringify(secondStageValidation.error.issues) : ''}`).toBeTruthy();
    }
  }

  @Then("each rocket should have valid engines configuration")
  public async thenEachRocketShouldHaveValidEnginesConfiguration(): Promise<void> {
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    
    let rockets;
    if (body.docs) {
      rockets = body.docs;
    } else {
      rockets = Array.isArray(body) ? body : [body];
    }

    for (const rocket of rockets) {
      const enginesValidation = EnginesSchema.safeParse(rocket.engines);
      expect(enginesValidation.success, `Engines validation failed for rocket ${rocket.name}: ${!enginesValidation.success ? JSON.stringify(enginesValidation.error.issues) : ''}`).toBeTruthy();

      if (rocket.engines) {
        expect(rocket.engines.number).toBeGreaterThan(0);
        expect(rocket.engines.type.length).toBeGreaterThan(0);
        expect(rocket.engines.version.length).toBeGreaterThan(0);
        expect(rocket.engines.layout?.length).toBeGreaterThan(0);
      }
    }
  }

  @Then("each rocket should have valid payload weights")
  public async thenEachRocketShouldHaveValidPayloadWeights(): Promise<void> {
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    
    let rockets;
    if (body.docs) {
      rockets = body.docs;
    } else {
      rockets = Array.isArray(body) ? body : [body];
    }

    for (const rocket of rockets) {
      expect(rocket.payload_weights).toBeDefined();
      expect(Array.isArray(rocket.payload_weights)).toBeTruthy();

      for (const payloadWeight of rocket.payload_weights) {
        const payloadValidation = PayloadWeightSchema.safeParse(payloadWeight);
        expect(payloadValidation.success, `Payload weight validation failed for rocket ${rocket.name}: ${!payloadValidation.success ? JSON.stringify(payloadValidation.error.issues) : ''}`).toBeTruthy();
        
        expect(payloadWeight.name.length).toBeGreaterThan(0);
        expect(payloadWeight.kg).toBeGreaterThan(0);
        expect(payloadWeight.lb).toBeGreaterThan(0);
      }
    }
  }

  @Then("the rocket should have valid landing legs configuration")
  public async thenRocketShouldHaveValidLandingLegsConfiguration(): Promise<void> {
    const response = this.sharedSteps.activeAPI.getResponse();
    expect(response).toBeTruthy();
    
    await expect(response).toMatchSchema(RocketSchema);
    
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    
    const landingLegsValidation = LandingLegsSchema.safeParse(body.landing_legs);
    expect(landingLegsValidation.success, `Landing legs validation failed: ${!landingLegsValidation.success ? JSON.stringify(landingLegsValidation.error.issues) : ''}`).toBeTruthy();

    if (body.landing_legs) {
      expect(body.landing_legs.number).toBeGreaterThanOrEqual(0);
      if (body.landing_legs.number > 0) {
        expect(body.landing_legs.material).toBeDefined();
        expect(body.landing_legs.material.length).toBeGreaterThan(0);
      }
    }
  }

  @Then("each rocket should have valid flickr images array")
  public async thenEachRocketShouldHaveValidFlickrImagesArray(): Promise<void> {
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    
    let rockets;
    if (body.docs) {
      rockets = body.docs;
    } else {
      rockets = Array.isArray(body) ? body : [body];
    }

    for (const rocket of rockets) {
      expect(rocket.flickr_images).toBeDefined();
      expect(Array.isArray(rocket.flickr_images)).toBeTruthy();
      
      if (rocket.flickr_images.length > 0) {
        for (const imageUrl of rocket.flickr_images) {
          expect(typeof imageUrl).toBe("string");
          expect(imageUrl.length).toBeGreaterThan(0);
          expect(imageUrl).toMatch(/^https?:\/\//);
        }
      }
    }
  }
}