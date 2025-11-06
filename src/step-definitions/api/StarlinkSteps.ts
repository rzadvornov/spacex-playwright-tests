import { APIRequestContext, expect } from "@playwright/test";
import { Given, When, Then, Fixture } from "playwright-bdd/decorators";
import { StarlinkApi } from "../../services/api/StarlinkApi";

@Fixture("starlinkSteps")
export class StarlinkSteps {
  private starlinkApi!: StarlinkApi;
  private satelliteId: string = "";
  private queryBody: any = {};

  constructor(private request: APIRequestContext) {}

  @Given("the SpaceX Starlink API is available")
  public async givenBaseUrl(): Promise<void> {
    this.starlinkApi = new StarlinkApi(this.request);
  }

  @Given("a valid Starlink satellite ID {string} is available")
  public async givenValidSatelliteId(satelliteId: string): Promise<void> {
    this.satelliteId = satelliteId;
  }

  @When("I make a GET request to {string}")
  public async whenMakeGetRequest(endpoint: string): Promise<void> {
    if (endpoint === "/starlink") {
      await this.starlinkApi.getAllStarlinkSatellites();
    } else if (endpoint.includes("/starlink/")) {
      const id = endpoint.split("/").pop() || this.satelliteId;
      await this.starlinkApi.getStarlinkSatelliteById(id);
    }
  }

  @When("I make a POST request to {string} with a range filter:")
  public async whenMakePostRequestWithFilter(
    endpoint: string,
    docString: string
  ): Promise<void> {
    this.queryBody = JSON.parse(docString);
    await this.starlinkApi.queryStarlinkSatellites(this.queryBody);
  }

  @When("I make a POST request to {string} with pagination:")
  public async whenMakePostRequestWithPagination(
    endpoint: string,
    docString: string
  ): Promise<void> {
    this.queryBody = JSON.parse(docString);
    await this.starlinkApi.queryWithPagination(this.queryBody);
  }

  @Then("the response status code should be {int}")
  public async thenStatusCodeShouldBe(
    expectedStatusCode: number
  ): Promise<void> {
    const statusCode = await this.starlinkApi.getStatusCode();
    expect(statusCode).toBe(expectedStatusCode);
  }

  @Then("the response should be a valid JSON array")
  public async thenResponseShouldBeValidJsonArray(): Promise<void> {
    const body = await this.starlinkApi.getResponseBody();
    expect(Array.isArray(body)).toBeTruthy();
  }

  @Then("each satellite should have: id, version, launch, velocity_kms")
  public async thenEachSatelliteShouldHaveRequiredFields(): Promise<void> {
    const body = await this.starlinkApi.getResponseBody();
    expect(body.length).toBeGreaterThan(0);

    body.forEach((satellite: any) => {
      expect(satellite).toHaveProperty("id");
      expect(satellite).toHaveProperty("version");
      expect(satellite).toHaveProperty("launch");
      expect(satellite).toHaveProperty("velocity_kms");
    });
  }

  @Then("the satellite ID should match the requested ID")
  public async thenSatelliteIdShouldMatch(): Promise<void> {
    const body = await this.starlinkApi.getResponseBody();
    expect(body.id).toBe(this.satelliteId);
  }

  @Then("the response should contain spacetrack information")
  public async thenResponseShouldContainSpacetrack(): Promise<void> {
    const body = await this.starlinkApi.getResponseBody();
    expect(body).toHaveProperty("spaceTrack");
    expect(body.spaceTrack).toBeDefined();
  }

  @Then(
    "all results should satisfy the filter condition {string} as per the query"
  )
  public async thenResultsShouldSatisfyFilter(field: string): Promise<void> {
    const body = await this.starlinkApi.getResponseBody();
    const queryCondition = this.queryBody.query[field];

    if (body.docs && Array.isArray(body.docs)) {
      body.docs.forEach((item: any) => {
        if (typeof queryCondition === "string") {
          expect(item[field]).toBe(queryCondition);
        } else if (typeof queryCondition === "object") {
          if (queryCondition.$gte !== undefined) {
            expect(item[field]).toBeGreaterThanOrEqual(queryCondition.$gte);
          }
          if (queryCondition.$lte !== undefined) {
            expect(item[field]).toBeLessThanOrEqual(queryCondition.$lte);
          }
        }
      });
    }
  }

  @Then("the response should have docs array with maximum {int} items")
  public async thenResponseShouldHaveDocsArray(
    maxItems: number
  ): Promise<void> {
    const body = await this.starlinkApi.getResponseBody();
    expect(body).toHaveProperty("docs");
    expect(Array.isArray(body.docs)).toBeTruthy();
    expect(body.docs.length).toBeLessThanOrEqual(maxItems);
  }

  @Then("the response should contain accurate pagination metadata")
  public async thenResponseShouldContainPaginationMetadata(): Promise<void> {
    const body = await this.starlinkApi.getResponseBody();
    expect(body).toHaveProperty("totalDocs");
    expect(body).toHaveProperty("limit");
    expect(body).toHaveProperty("page");
    expect(body).toHaveProperty("totalPages");
    expect(body).toHaveProperty("hasNextPage");
    expect(body).toHaveProperty("hasPrevPage");
  }

  @Then("the version field should be a non-empty string or null")
  public async thenVersionFieldShouldBeValid(): Promise<void> {
    const body = await this.starlinkApi.getResponseBody();
    const version = body.version;

    if (version !== null) {
      expect(typeof version).toBe("string");
      expect(version.length).toBeGreaterThan(0);
    }
  }

  @Then("the spaceTrack object should contain: CCSDS_ID, EPOCH, MEAN_MOTION")
  public async thenSpaceTrackShouldContainRequiredFields(): Promise<void> {
    const body = await this.starlinkApi.getResponseBody();
    expect(body.spaceTrack).toHaveProperty("CCSDS_OMM_VERS");
    expect(body.spaceTrack).toHaveProperty("COMMENT");
    expect(body.spaceTrack).toHaveProperty("CREATION_DATE");
    expect(body.spaceTrack).toHaveProperty("ORIGINATOR");
    expect(body.spaceTrack).toHaveProperty("OBJECT_NAME");
    expect(body.spaceTrack).toHaveProperty("OBJECT_ID");
    expect(body.spaceTrack).toHaveProperty("CENTER_NAME");
    expect(body.spaceTrack).toHaveProperty("REF_FRAME");
    expect(body.spaceTrack).toHaveProperty("TIME_SYSTEM");
    expect(body.spaceTrack).toHaveProperty("MEAN_ELEMENT_THEORY");
    expect(body.spaceTrack).toHaveProperty("EPOCH");
    expect(body.spaceTrack).toHaveProperty("MEAN_MOTION");
    expect(body.spaceTrack).toHaveProperty("ECCENTRICITY");
    expect(body.spaceTrack).toHaveProperty("INCLINATION");
    expect(body.spaceTrack).toHaveProperty("RA_OF_ASC_NODE");
    expect(body.spaceTrack).toHaveProperty("ARG_OF_PERICENTER");
    expect(body.spaceTrack).toHaveProperty("MEAN_ANOMALY");
    expect(body.spaceTrack).toHaveProperty("EPHEMERIS_TYPE");
    expect(body.spaceTrack).toHaveProperty("CLASSIFICATION_TYPE");
    expect(body.spaceTrack).toHaveProperty("NORAD_CAT_ID");
    expect(body.spaceTrack).toHaveProperty("ELEMENT_SET_NO");
    expect(body.spaceTrack).toHaveProperty("REV_AT_EPOCH");
    expect(body.spaceTrack).toHaveProperty("BSTAR");
    expect(body.spaceTrack).toHaveProperty("MEAN_MOTION_DOT");
    expect(body.spaceTrack).toHaveProperty("MEAN_MOTION_DDOT");
    expect(body.spaceTrack).toHaveProperty("SEMIMAJOR_AXIS");
    expect(body.spaceTrack).toHaveProperty("PERIOD");
    expect(body.spaceTrack).toHaveProperty("APOAPSIS");
    expect(body.spaceTrack).toHaveProperty("PERIAPSIS");
    expect(body.spaceTrack).toHaveProperty("OBJECT_TYPE");
    expect(body.spaceTrack).toHaveProperty("RCS_SIZE");
    expect(body.spaceTrack).toHaveProperty("COUNTRY_CODE");
    expect(body.spaceTrack).toHaveProperty("LAUNCH_DATE");
    expect(body.spaceTrack).toHaveProperty("SITE");
    expect(body.spaceTrack).toHaveProperty("DECAY_DATE");
    expect(body.spaceTrack).toHaveProperty("FILE");
    expect(body.spaceTrack).toHaveProperty("GP_ID");
    expect(body.spaceTrack).toHaveProperty("TLE_LINE0");
    expect(body.spaceTrack).toHaveProperty("TLE_LINE1");
    expect(body.spaceTrack).toHaveProperty("TLE_LINE2");
  }
}
