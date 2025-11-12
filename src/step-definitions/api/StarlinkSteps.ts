import { expect } from "@playwright/test";
import { Given, When, Then, Fixture } from "playwright-bdd/decorators";
import { APISharedSteps } from "./APISharedSteps";
import { StarlinkAPI } from "../../services/api/StarlinkAPI";
import { StarlinkPaginatedResponseSchema, StarlinkArraySchema, StarlinkSatelliteSchema, SpaceTrackSchema } from "../../services/api/schemas/StarlinkSchemas";

@Fixture("starlinkSteps")
export class StarlinkSteps {
  private starlinkAPI!: StarlinkAPI;
  private queryBody: any = {};

  constructor(private sharedSteps: APISharedSteps) {}

  @Given("a valid Starlink satellite ID {string} is available")
  public async givenValidSatelliteId(satelliteId: string): Promise<void> {
    this.sharedSteps.setResourceId(satelliteId);
  }

  @When("I make a POST request to {string} with a range filter:")
  public async whenMakePostRequestWithFilter(
    _endpoint: string,
    docString: string
  ): Promise<void> {
    this.queryBody = JSON.parse(docString);
    this.sharedSteps.queryBody = this.queryBody;

    this.starlinkAPI = this.sharedSteps.activeAPI as StarlinkAPI;
    await this.starlinkAPI.queryStarlinkSatellites(this.queryBody);
  }

  @When("I make a POST request to {string} with pagination:")
  public async whenMakePostRequestWithPagination(
    _endpoint: string,
    docString: string
  ): Promise<void> {
    this.queryBody = JSON.parse(docString);
    this.sharedSteps.queryBody = this.queryBody;
    this.starlinkAPI = this.sharedSteps.activeAPI as StarlinkAPI;
    await this.starlinkAPI.queryWithPagination(this.queryBody);
  }

  @Then(
    "all results should satisfy the filter condition {string} as per the query"
  )
  public async thenAllResultsShouldSatisfyFilter(field: string): Promise<void> {
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    
    if (body.docs) {
      await expect(this.sharedSteps.activeAPI.getResponse()).toMatchSchema(StarlinkPaginatedResponseSchema);
    } else {
      await expect(this.sharedSteps.activeAPI.getResponse()).toMatchSchema(StarlinkArraySchema);
    }

    const satellites = body.docs || body;
    const query = this.queryBody.query[field];

    for (const satellite of satellites) {
      const validationResult = StarlinkSatelliteSchema.safeParse(satellite);
      expect(validationResult.success, `Satellite validation failed: ${!validationResult.success ? JSON.stringify(validationResult.error.issues) : ''}`).toBe(true);

      const value = satellite[field];

      if (field === "launch") {
        expect(value).toEqual(query);
      } else if (field === "height_km" || field === "velocity_kms") {
        if (query.$gte !== undefined) {
          expect(value).toBeGreaterThanOrEqual(query.$gte);
        }
        if (query.$lte !== undefined) {
          expect(value).toBeLessThanOrEqual(query.$lte);
        }
      }
    }
  }

  @Then("the response should have docs array with maximum {int} items")
  public async thenResponseShouldHaveMaxItems(limit: number): Promise<void> {
    const response = this.sharedSteps.activeAPI.getResponse();
    expect(response).toBeTruthy();
    
    await expect(response).toMatchSchema(StarlinkPaginatedResponseSchema);
    
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    expect(Array.isArray(body.docs)).toBeTruthy();
    expect(body.docs.length).toBeLessThanOrEqual(limit);
  }

  @Then("the response should contain accurate pagination metadata")
  public async thenResponseShouldContainAccuratePaginationMetadata(): Promise<void> {
    const response = this.sharedSteps.activeAPI.getResponse();
    expect(response).toBeTruthy();
    
    await expect(response).toMatchSchema(StarlinkPaginatedResponseSchema);
    
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    expect(body).toHaveProperty("totalDocs");
    expect(body).toHaveProperty("limit");
    expect(typeof body.totalDocs).toBe("number");
    
    const validationResult = StarlinkPaginatedResponseSchema.safeParse(body);
    expect(validationResult.success, `Pagination metadata validation failed: ${!validationResult.success ? JSON.stringify(validationResult.error.issues) : ''}`).toBeTruthy();
  }

  @Then("the version field should be a non-empty string or null")
  public async thenVersionFieldShouldBeValid(): Promise<void> {
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    
    let satellites;
    if (body.docs) {
      await expect(this.sharedSteps.activeAPI.getResponse()).toMatchSchema(StarlinkPaginatedResponseSchema);
      satellites = body.docs;
    } else {
      await expect(this.sharedSteps.activeAPI.getResponse()).toMatchSchema(StarlinkArraySchema);
      satellites = Array.isArray(body) ? body : [body];
    }

    for (const satellite of satellites) {
      const validationResult = StarlinkSatelliteSchema.safeParse(satellite);
      expect(validationResult.success, `Satellite validation failed: ${!validationResult.success ? JSON.stringify(validationResult.error.issues) : ''}`).toBe(true);
      
      const version = satellite.version;
      if (version !== null) {
        expect(version).toEqual(expect.any(String));
        expect(version.length).toBeGreaterThan(0);
      }
    }
  }

  @Then("the spaceTrack object should contain TLE data")
  public async thenSpaceTrackShouldContainTLEData(): Promise<void> {
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    
    let satellite;
    if (body.docs) {
      await expect(this.sharedSteps.activeAPI.getResponse()).toMatchSchema(StarlinkPaginatedResponseSchema);
      satellite = body.docs[0];
    } else if (Array.isArray(body)) {
      await expect(this.sharedSteps.activeAPI.getResponse()).toMatchSchema(StarlinkArraySchema);
      satellite = body[0];
    } else {
      await expect(this.sharedSteps.activeAPI.getResponse()).toMatchSchema(StarlinkSatelliteSchema);
      satellite = body;
    }

    const spaceTrackValidation = SpaceTrackSchema.safeParse(satellite.spaceTrack);
    expect(spaceTrackValidation.success, `SpaceTrack validation failed: ${!spaceTrackValidation.success ? JSON.stringify(spaceTrackValidation.error.issues) : ''}`).toBe(true);

    expect(satellite).toHaveProperty("spaceTrack");
    expect(typeof satellite.spaceTrack).toBe("object");
    expect(satellite.spaceTrack).toHaveProperty("TLE_LINE0");
    expect(satellite.spaceTrack).toHaveProperty("TLE_LINE1");
    expect(satellite.spaceTrack).toHaveProperty("TLE_LINE2");
    
    if (satellite.spaceTrack.TLE_LINE0) {
      expect(satellite.spaceTrack.TLE_LINE0).toContain("STARLINK");
    }
    if (satellite.spaceTrack.TLE_LINE1 && satellite.spaceTrack.TLE_LINE2) {
      expect(satellite.spaceTrack.TLE_LINE1.length).toBeGreaterThan(0);
      expect(satellite.spaceTrack.TLE_LINE2.length).toBeGreaterThan(0);
    }
  }

  @Then(
    "each response item should have the following properties: id, version, launch, velocity_kms"
  )
  public async thenEachSatelliteShouldHaveStandardProperties(): Promise<void> {
    const properties = ["id", "version", "launch", "velocity_kms"];
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    
    let items;
    if (body.docs) {
      await expect(this.sharedSteps.activeAPI.getResponse()).toMatchSchema(StarlinkPaginatedResponseSchema);
      items = body.docs;
    } else {
      await expect(this.sharedSteps.activeAPI.getResponse()).toMatchSchema(StarlinkArraySchema);
      items = Array.isArray(body) ? body : [body];
    }

    expect(
      items.length,
      "Response array is empty or response is not a single item."
    ).toBeGreaterThan(0);

    for (const item of items) {
      const validationResult = StarlinkSatelliteSchema.safeParse(item);
      expect(validationResult.success, `Satellite item validation failed: ${!validationResult.success ? JSON.stringify(validationResult.error.issues) : ''}`).toBe(true);
      
      for (const prop of properties) {
        expect(item).toHaveProperty(
          prop,
          `Satellite item is missing property: ${prop}`
        );
      }
    }
  }

  @Then("the response should contain spacetrack information")
  public async thenResponseShouldContainSpacetrackInformation(): Promise<void> {
    const response = this.sharedSteps.activeAPI.getResponse();
    expect(response).toBeTruthy();
    
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    
    if (body.docs) {
      await expect(response).toMatchSchema(StarlinkPaginatedResponseSchema);
    } else if (Array.isArray(body)) {
      await expect(response).toMatchSchema(StarlinkArraySchema);
    } else {
      await expect(response).toMatchSchema(StarlinkSatelliteSchema);
    }

    const targetBody = body.docs ? body.docs[0] : (Array.isArray(body) ? body[0] : body);
    
    expect(targetBody).toHaveProperty(
      "spaceTrack",
      'Response does not contain the required "spaceTrack" property.'
    );
    expect(
      typeof targetBody.spaceTrack,
      '"spaceTrack" property is not an object.'
    ).toBe("object");
    expect(targetBody.spaceTrack, '"spaceTrack" property is null.').not.toBeNull();
    
    const spaceTrackValidation = SpaceTrackSchema.safeParse(targetBody.spaceTrack);
    expect(spaceTrackValidation.success, `SpaceTrack validation failed: ${!spaceTrackValidation.success ? JSON.stringify(spaceTrackValidation.error.issues) : ''}`).toBeTruthy();
    
    expect(targetBody.spaceTrack).toHaveProperty("CCSDS_OMM_VERS");
    expect(targetBody.spaceTrack).toHaveProperty("OBJECT_NAME");
  }

  @Then("the response should match the Starlink satellite schema")
  public async thenResponseShouldMatchSatelliteSchema(): Promise<void> {
    const response = this.sharedSteps.activeAPI.getResponse();
    expect(response).toBeTruthy();
    await expect(response).toMatchSchema(StarlinkSatelliteSchema);
  }

  @Then("the response should match the Starlink array schema")
  public async thenResponseShouldMatchArraySchema(): Promise<void> {
    const response = this.sharedSteps.activeAPI.getResponse();
    expect(response).toBeTruthy();
    await expect(response).toMatchSchema(StarlinkArraySchema);
  }

  @Then("the response should match the paginated Starlink schema")
  public async thenResponseShouldMatchPaginatedSchema(): Promise<void> {
    const response = this.sharedSteps.activeAPI.getResponse();
    expect(response).toBeTruthy();
    await expect(response).toMatchSchema(StarlinkPaginatedResponseSchema);
  }

  @Then("each satellite in the response should have valid spaceTrack data")
  public async thenEachSatelliteShouldHaveValidSpaceTrack(): Promise<void> {
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    
    let satellites;
    if (body.docs) {
      satellites = body.docs;
    } else {
      satellites = Array.isArray(body) ? body : [body];
    }

    for (const satellite of satellites) {
      const validationResult = SpaceTrackSchema.safeParse(satellite.spaceTrack);
      expect(validationResult.success, `SpaceTrack validation failed for satellite ${satellite.id}: ${!validationResult.success ? JSON.stringify(validationResult.error.issues) : ''}`).toBe(true);
    }
  }

  @Then("the response should have valid satellite IDs")
  public async thenResponseShouldHaveValidSatelliteIds(): Promise<void> {
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    
    let satellites;
    if (body.docs) {
      satellites = body.docs;
    } else {
      satellites = Array.isArray(body) ? body : [body];
    }

    for (const satellite of satellites) {
      expect(satellite.id).toBeDefined();
      expect(typeof satellite.id).toBe('string');
      expect(satellite.id.length).toBeGreaterThan(0);
      
      expect(satellite.id).toMatch(/^[a-f0-9]{24}$/);
    }
  }
}