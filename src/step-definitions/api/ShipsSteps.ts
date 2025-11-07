import { expect } from "@playwright/test";
import { Given, When, Then, Fixture } from "playwright-bdd/decorators";
import { ShipsAPI } from "../../services/api/ShipsAPI";
import { APISharedSteps } from "./APISharedSteps";

@Fixture("shipsSteps")
export class ShipsSteps {
  private shipsAPI!: ShipsAPI;
  private queryBody: any = {};

  constructor(private sharedSteps: APISharedSteps) {}

  @Given("a valid ship ID {string} is available")
  public async givenValidShipId(shipId: string): Promise<void> {
    this.sharedSteps.setResourceId(shipId);
  }

  @When("I query the Ships API using POST with filter:")
  public async whenQueryShipsAPIWithFilter(
    docString: string
  ): Promise<void> {
    this.queryBody = JSON.parse(docString);
    this.sharedSteps.queryBody = this.queryBody;
    this.shipsAPI = this.sharedSteps.activeAPI as ShipsAPI;
    await this.shipsAPI.queryShips(this.queryBody);
  }

  @Then("the results should contain ships matching {string} equals {string}")
  public async thenResultsShouldContainShipsMatching(
    field: string,
    expectedValue: string
  ): Promise<void> {
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    const ships = body.docs || body;

    const value =
      expectedValue.toLowerCase() === "true"
        ? true
        : expectedValue.toLowerCase() === "false"
        ? false
        : expectedValue;

    for (const ship of ships) {
      expect(ship[field]).toEqual(value);
    }
  }

  @Then("the mass_kg field should be a non-negative number or null")
  public async thenMassKgShouldBeValid(): Promise<void> {
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    const mass = body.mass_kg;
    if (mass !== null) {
      expect(mass).toEqual(expect.any(Number));
      expect(mass).toBeGreaterThanOrEqual(0);
    }
  }

  @Then("the year_built field should be a four-digit year or null")
  public async thenYearBuiltShouldBeValid(): Promise<void> {
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    const year = body.year_built;
    const currentDate = new Date();
    const maxYear = currentDate.getFullYear() + 100;
    if (year !== null) {
      expect(year).toEqual(expect.any(Number));
      expect(year).toBeGreaterThanOrEqual(1900);
      expect(year).toBeLessThanOrEqual(maxYear);
    }
  }

  @Then("the home_port should be a non-empty string")
  public async thenHomePortShouldBeNonEmpty(): Promise<void> {
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    expect(body.home_port).toEqual(expect.any(String));
    expect(body.home_port.length).toBeGreaterThan(0);
  }

  @When("I retrieve the ship data")
  public async whenRetrieveShipData(): Promise<void> {
    // Nothing to do here
  }

  @Then("the response should contain a launches array")
  public async thenResponseShouldContainLaunchesArray(): Promise<void> {
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    expect(body).toHaveProperty("launches");
    expect(Array.isArray(body.launches)).toBeTruthy();
  }

  @Then("all launch IDs in the array should be valid and linkable")
  public async thenAllLaunchIdsShouldBeValid(): Promise<void> {
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    const launches = body.launches;

    const mongoIdRegex = /^[0-9a-fA-F]{24}$/;

    for (const launchId of launches) {
      expect(typeof launchId).toBe("string");
      expect(launchId).toMatch(mongoIdRegex);
    }
  }

  @Then(
    "each response item should have the following properties: id, name, type, active, home_port"
  )
  public async thenEachShipShouldHaveStandardProperties(): Promise<void> {
    const properties = ["id", "name", "type", "active", "home_port"];
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    const items = body.docs || body;

    expect(
      Array.isArray(items),
      "Response is not a JSON array or a query object with a docs array."
    ).toBeTruthy();

    for (const item of items) {
      for (const prop of properties) {
        expect(item).toHaveProperty(
          prop,
          `Ship item is missing property: ${prop}`
        );
      }
    }
  }

  @Then("the results should contain ships matching {string} equals {boolean}")
  public async thenResultsShouldContainShipsMatchingBoolean(
    field: string,
    expectedValue: boolean
  ): Promise<void> {
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    const ships = body.docs || body;

    expect(
      Array.isArray(ships),
      "Response is not a list or a query result."
    ).toBeTruthy();

    for (const ship of ships) {
      expect(ship).toHaveProperty(field, `Ship is missing the field: ${field}`);
      expect(
        ship[field],
        `Expected ship ${field} to be ${expectedValue} but found ${ship[field]}`
      ).toBe(expectedValue);
    }
  }
}
