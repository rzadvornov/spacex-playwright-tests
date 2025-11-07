import { expect } from "@playwright/test";
import { Given, When, Then, Fixture } from "playwright-bdd/decorators";
import { CrewAPI } from "../../services/api/CrewAPI";
import { APISharedSteps } from "./APISharedSteps";
import { APIBase } from "../../services/base/APIBase";

const mongoIdRegex = /^[0-9a-fA-F]{24}$/;

@Fixture("crewSteps")
export class CrewSteps {
  private crewAPI!: CrewAPI;
  

  constructor(private sharedSteps: APISharedSteps) {}

  @Given("a valid crew ID {string} is available")
  public async givenValidCrewId(crewId: string): Promise<void> {
    this.sharedSteps.setResourceId(crewId);
  }

  @When("I make a POST request to {string} with filter:")
  public async whenMakePostRequestToQueryWithFilter(
    _endpoint: string,
    docString: string
  ): Promise<void> {
    const queryBody = JSON.parse(docString);
    this.sharedSteps.queryBody = queryBody;

    expect(
      this.sharedSteps.activeAPI,
      "Active API not initialized or not CrewAPI"
    ).toBeInstanceOf(APIBase);
    this.crewAPI = this.sharedSteps.activeAPI as CrewAPI;

    await this.crewAPI.queryCrew(queryBody);
  }

  @When("I query the Crew API using POST with filter:")
  public async whenQueryCrewAPIWithFilter(docString: string): Promise<void> {
    const queryBody = JSON.parse(docString);
    this.sharedSteps.queryBody = queryBody;

    expect(
      this.sharedSteps.activeAPI,
      "Active API not initialized or not CrewAPI"
    ).toBeInstanceOf(APIBase);
    this.crewAPI = this.sharedSteps.activeAPI as CrewAPI;

    await this.crewAPI.queryCrew(queryBody);
  }

  @Then("the field {string} should be a non-empty array")
  public async thenFieldShouldBeNonEmptyArray(field: string): Promise<void> {
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    const array = body[field];

    expect(
      Array.isArray(array),
      `Field '${field}' is not an array. Found type: ${typeof array}`
    ).toBeTruthy();

    expect(
      array.length,
      `Field '${field}' is an empty array. Expected non-empty.`
    ).toBeGreaterThan(0);
  }

  @Then("each item in {string} should be a valid MongoDB ID")
  public async thenEachItemShouldBeValidMongoId(field: string): Promise<void> {
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    const array = body[field];

    expect(
      Array.isArray(array),
      `Field '${field}' is not an array. Found type: ${typeof array}`
    ).toBeTruthy();
    
    for (const item of array) {
      expect(
        item,
        `Item in array '${field}' is not a string. Found type: ${typeof item}`
      ).toBe('string');

      expect(
        item,
        `Item '${item}' in array '${field}' is not a valid MongoDB ID.`
      ).toMatch(mongoIdRegex);
    }
  }

  @Then("each crew member should have: id, name, agency, status")
  public async thenEachCrewMemberShouldHaveStandardProperties(): Promise<void> {
    const properties = ["id", "name", "agency", "status"];
    await this.sharedSteps.thenEachResponseItemShouldHaveProperties(
      properties.join(", ")
    );
  }

  @Then("the crew member ID should match the requested ID")
  public async thenCrewMemberIdShouldMatchRequestedId(): Promise<void> {
    await this.sharedSteps.thenResponseIdShouldMatchRequestedId();
  }

  @Then("the response should contain a Wikipedia link")
  public async thenResponseShouldContainWikipediaLink(): Promise<void> {
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    
    expect(body, "Response body is null or undefined").toBeDefined();
    expect(body).toHaveProperty("wikipedia", "Crew member is missing 'wikipedia' link.");
    
    const wikiUrl: string = body.wikipedia;
    expect(
      typeof wikiUrl,
      `Expected 'wikipedia' to be a string, but got ${typeof wikiUrl}`
    ).toBe("string");
    expect(wikiUrl.length).toBeGreaterThan(0);
    expect(
      () => new URL(wikiUrl), 
      `'${wikiUrl}' is not a valid URL.`
    ).not.toThrow();
  }
  
  @Then("all crew results should have {string} equal to {string}")
  public async thenAllResultsShouldMatchFilterString(
    field: string,
    expectedValue: string
  ): Promise<void> {
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    const crewMembers = body.docs || body;

    const valueToMatch = expectedValue.replace(/\"/g, "");

    expect(
      Array.isArray(crewMembers),
      "Response is not a list or a query result (missing docs array)."
    ).toBeTruthy();

    for (const member of crewMembers) {
      expect(
        member,
        `Crew member is missing the field: ${field}`
      ).toHaveProperty(field);
      expect(
        member[field],
        `Expected crew member ${field} to be '${valueToMatch}', but got '${member[field]}'`
      ).toEqual(valueToMatch);
    }
  }

  @Then("the response should contain a list of associated launches")
  public async thenResponseShouldContainListOfAssociatedLaunches(): Promise<void> {
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    
    expect(body).toHaveProperty("launches");
    const launches = body.launches;
    
    expect(
      Array.isArray(launches),
      `Expected 'launches' to be an array, but got ${typeof launches}`
    ).toBeTruthy();
    
    const mongoIdRegex = /^[0-9a-fA-F]{24}$/;
    for (const launchId of launches) {
      expect(
        typeof launchId,
        `Expected launch ID to be a string, but got ${typeof launchId}`
      ).toBe("string");
      expect(
        launchId,
        `Launch ID '${launchId}' does not match expected MongoDB ID format.`
      ).toMatch(mongoIdRegex);
    }
  }
}