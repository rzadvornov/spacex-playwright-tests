import { APIRequestContext, expect } from "@playwright/test";
import { Given, When, Then, Fixture } from "playwright-bdd/decorators";
import { APIBase } from "../../services/base/APIBase";
import { StarlinkAPI } from "../../services/api/StarlinkAPI";
import { ShipsAPI } from "../../services/api/ShipsAPI";
import { RocketsAPI } from "../../services/api/RocketsAPI";
import { RoadsterAPI } from "../../services/api/RoadsterAPI";
import { PayloadsAPI } from "../../services/api/PayloadsAPI";
import { LaunchpadsAPI } from "../../services/api/LaunchpadsAPI";
import { LaunchesAPI } from "../../services/api/LaunchesAPI";
import { LandpadsAPI } from "../../services/api/LandpadsAPI";
import { HistoryAPI } from "../../services/api/HistoryAPI";
import { DragonsAPI } from "../../services/api/DragonsAPI";
import { CrewAPI } from "../../services/api/CrewAPI";
import { CoresAPI } from "../../services/api/CoresAPI";
import { CompanyAPI } from "../../services/api/CompanyAPI";

type ApiMap = {
  [key: string]: new (request: APIRequestContext) => APIBase;
};

const apiServiceMap: ApiMap = {
  Starlink: StarlinkAPI,
  Ships: ShipsAPI,
  Rockets: RocketsAPI,
  Roadster: RoadsterAPI,
  Payloads: PayloadsAPI,
  Launchpads: LaunchpadsAPI,
  Launches: LaunchesAPI,
  Landpads: LandpadsAPI,
  History: HistoryAPI,
  Dragons: DragonsAPI,
  Crew: CrewAPI,
  Cores: CoresAPI,
  Company: CompanyAPI,
};

@Fixture("apiSharedSteps")
export class APISharedSteps {
  public activeAPI!: APIBase;
  public queryBody: any = {};
  private resourceId: string = "";
  public queryEndpoint: string = "";

  constructor(private request: APIRequestContext) {}

  public setResourceId(id: string): void {
    this.resourceId = id;
  }

  @Given("the SpaceX {string} API is available")
  public async givenApiIsAvailable(apiName: string): Promise<void> {
    const ApiClass = apiServiceMap[apiName];

    if (!ApiClass) {
      throw new Error(`API service not found for name: ${apiName}`);
    }
    this.activeAPI = new ApiClass(this.request);
  }

  @Given("a POST request to {string} is prepared")
  public async givenPostRequestIsPrepared(endpoint: string): Promise<void> {
    this.queryEndpoint = endpoint;
  }

  @When("I make a GET request to {string}")
  public async whenMakeGetRequest(endpoint: string): Promise<void> {
    expect(
      this.activeAPI,
      "Active API not initialized. Did you call the Given step?"
    ).toBeInstanceOf(APIBase);

    const parts = endpoint.split("/").filter((p) => p.length > 0);
    const isListRequest = parts.length === 1;

    let idToUse: string | undefined = undefined;

    if (!isListRequest) {
      idToUse = parts.length === 2 ? parts[1] : this.resourceId;

      if (parts.length === 2) {
        this.resourceId = idToUse;
      }
    }
    await this.activeAPI.makeGetRequest(idToUse);
  }

  @Then("the response status code should be {int}")
  public async thenResponseStatusCodeShouldBe(
    statusCode: number
  ): Promise<void> {
    expect(
      this.activeAPI,
      "Active API not initialized. Did you call the Given step?"
    ).toBeInstanceOf(APIBase);
    const actualStatus = await this.activeAPI.getStatusCode();
    expect(actualStatus).toBe(statusCode);
  }

  @Then("the response should be a valid JSON array")
  public async thenResponseShouldBeValidJsonArray(): Promise<void> {
    expect(this.activeAPI, "Active API not initialized.").toBeInstanceOf(
      APIBase
    );
    const body = await this.activeAPI.getResponseBody();
    const data = (Array.isArray(body) ? body : body.docs) || [];
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThanOrEqual(0);
  }

  @Then("the response ID should match the requested ID")
  public async thenResponseIdShouldMatchRequestedId(): Promise<void> {
    expect(this.activeAPI, "Active API not initialized.").toBeInstanceOf(
      APIBase
    );
    expect(
      this.resourceId,
      "Resource ID was not set by a Given step."
    ).not.toEqual("");

    const body = await this.activeAPI.getResponseBody();
    expect(body.id).toEqual(this.resourceId);
  }

  @Then("each response item should have the following properties: {string}")
  public async thenEachResponseItemShouldHaveProperties(
    propertyList: string
  ): Promise<void> {
    expect(this.activeAPI, "Active API not initialized.").toBeInstanceOf(
      APIBase
    );
    const body = await this.activeAPI.getResponseBody();
    const data = (Array.isArray(body) ? body : body.docs) || [];

    expect(
      data.length,
      "Response data array (or docs) should not be empty for property check."
    ).toBeGreaterThan(0);

    const properties = propertyList.split(",").map((p) => p.trim());

    for (const item of data) {
      for (const prop of properties) {
        expect(item, `Item is missing property: ${prop}`).toHaveProperty(prop);
      }
    }
  }

  @When("I make a POST request to {string} with body:")
  public async whenMakePostRequestWithBody(
    endpoint: string,
    docString: string
  ): Promise<void> {
    expect(this.activeAPI, "Active API not initialized.").toBeInstanceOf(
      APIBase
    );

    this.queryBody = JSON.parse(docString);

    await this.activeAPI.makePostRequest(endpoint, this.queryBody);
  }

  @Then("the response should be a valid JSON object")
  public async thenResponseShouldBeAValidJsonObject(): Promise<void> {
    expect(this.activeAPI, "Active API not initialized.").toBeInstanceOf(
      APIBase
    );
    const body = await this.activeAPI.getResponseBody();

    expect(body, "Response body is null or undefined.").toBeDefined();

    expect(
      typeof body,
      `Expected response body to be an object, but got type: ${typeof body}`
    ).toBe("object");

    expect(
      Array.isArray(body),
      "Expected a single JSON object, but got a JSON array."
    ).toBeFalsy();
  }
}
