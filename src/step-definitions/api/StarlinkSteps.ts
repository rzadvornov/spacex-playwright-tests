import { expect } from "@playwright/test";
import { Given, When, Then, Fixture } from "playwright-bdd/decorators";
import { APISharedSteps } from "./APISharedSteps";
import { StarlinkAPI } from "../../services/api/StarlinkAPI";

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
    const satellites = body.docs || body;
    const query = this.queryBody.query[field];

    for (const satellite of satellites) {
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
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    expect(Array.isArray(body.docs)).toBeTruthy();
    expect(body.docs.length).toBeLessThanOrEqual(limit);
  }

  @Then("the response should contain accurate pagination metadata")
  public async thenResponseShouldContainAccuratePaginationMetadata(): Promise<void> {
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    expect(body).toHaveProperty("totalDocs");
    expect(body).toHaveProperty("limit");
    expect(typeof body.totalDocs).toBe("number");
  }

  @Then("the version field should be a non-empty string or null")
  public async thenVersionFieldShouldBeValid(): Promise<void> {
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    const satellite = body.docs ? body.docs[0] : body;
    const version = satellite.version;

    if (version !== null) {
      expect(version).toEqual(expect.any(String));
      expect(version.length).toBeGreaterThan(0);
    }
  }

  @Then("the spaceTrack object should contain TLE data")
  public async thenSpaceTrackShouldContainTLEData(): Promise<void> {
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    const satellite = body.docs ? body.docs[0] : body;

    expect(satellite).toHaveProperty("spaceTrack");
    expect(typeof satellite.spaceTrack).toBe("object");
    expect(satellite.spaceTrack).toHaveProperty("TLE_LINE0");
    expect(satellite.spaceTrack).toHaveProperty("TLE_LINE1");
    expect(satellite.spaceTrack).toHaveProperty("TLE_LINE2");
  }

  @Then(
    "each response item should have the following properties: id, version, launch, velocity_kms"
  )
  public async thenEachSatelliteShouldHaveStandardProperties(): Promise<void> {
    const properties = ["id", "version", "launch", "velocity_kms"];
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    const items = body.docs || body;
    const itemsArray = Array.isArray(items) ? items : [items];

    expect(
      itemsArray.length,
      "Response array is empty or response is not a single item."
    ).toBeGreaterThan(0);

    for (const item of itemsArray) {
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
    const body = await this.sharedSteps.activeAPI.getResponseBody();

    expect(body).toHaveProperty(
      "spaceTrack",
      'Response does not contain the required "spaceTrack" property.'
    );
    expect(
      typeof body.spaceTrack,
      '"spaceTrack" property is not an object.'
    ).toBe("object");
    expect(body.spaceTrack, '"spaceTrack" property is null.').not.toBeNull();
    expect(body.spaceTrack).toHaveProperty("CCSDS_OMM_VERS");
    expect(body.spaceTrack).toHaveProperty("OBJECT_NAME");
  }
}
