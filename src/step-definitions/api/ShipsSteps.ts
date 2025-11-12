import { expect } from "@playwright/test";
import { Given, When, Then, Fixture } from "playwright-bdd/decorators";
import { ShipsAPI } from "../../services/api/ShipsAPI";
import { APISharedSteps } from "./APISharedSteps";
import { ShipPaginatedResponseSchema, ShipArraySchema, ShipSchema } from "../../services/api/schemas/ShipSchemas";

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
    const response = this.sharedSteps.activeAPI.getResponse();
    expect(response).toBeTruthy();
    
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    if (body.docs) {
      await expect(response).toMatchSchema(ShipPaginatedResponseSchema);
    } else {
      await expect(response).toMatchSchema(ShipArraySchema);
    }

    const ships = body.docs || body;

    const value =
      expectedValue.toLowerCase() === "true"
        ? true
        : expectedValue.toLowerCase() === "false"
        ? false
        : expectedValue;

    for (const ship of ships) {
      const validationResult = ShipSchema.safeParse(ship);
      expect(validationResult.success, `Ship validation failed: ${!validationResult.success ? JSON.stringify(validationResult.error.issues) : ''}`).toBeTruthy();
      
      expect(ship[field]).toEqual(value);
    }
  }

  @Then("the mass_kg field should be a non-negative number or null")
  public async thenMassKgShouldBeValid(): Promise<void> {
    const response = this.sharedSteps.activeAPI.getResponse();
    expect(response).toBeTruthy();
    
    await expect(response).toMatchSchema(ShipSchema);
    
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    const mass = body.mass_kg;
    if (mass !== null) {
      expect(mass).toEqual(expect.any(Number));
      expect(mass).toBeGreaterThanOrEqual(0);
    }
  }

  @Then("the year_built field should be a four-digit year or null")
  public async thenYearBuiltShouldBeValid(): Promise<void> {
    const response = this.sharedSteps.activeAPI.getResponse();
    expect(response).toBeTruthy();
    
    await expect(response).toMatchSchema(ShipSchema);
    
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
    const response = this.sharedSteps.activeAPI.getResponse();
    expect(response).toBeTruthy();
    
    await expect(response).toMatchSchema(ShipSchema);
    
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    expect(body.home_port).toEqual(expect.any(String));
    expect(body.home_port.length).toBeGreaterThan(0);
  }

  @When("I retrieve the ship data")
  public async whenRetrieveShipData(): Promise<void> {
    // Nothing to do here - ship data retrieval is handled by shared steps
  }

  @Then("the response should contain a launches array")
  public async thenResponseShouldContainLaunchesArray(): Promise<void> {
    const response = this.sharedSteps.activeAPI.getResponse();
    expect(response).toBeTruthy();
    
    await expect(response).toMatchSchema(ShipSchema);
    
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    expect(body).toHaveProperty("launches");
    expect(Array.isArray(body.launches)).toBeTruthy();
  }

  @Then("all launch IDs in the array should be valid and linkable")
  public async thenAllLaunchIdsShouldBeValid(): Promise<void> {
    const response = this.sharedSteps.activeAPI.getResponse();
    expect(response).toBeTruthy();
    
    await expect(response).toMatchSchema(ShipSchema);
    
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
    const response = this.sharedSteps.activeAPI.getResponse();
    expect(response).toBeTruthy();
    
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    
    let items;
    if (body.docs) {
      await expect(response).toMatchSchema(ShipPaginatedResponseSchema);
      items = body.docs;
    } else {
      await expect(response).toMatchSchema(ShipArraySchema);
      items = Array.isArray(body) ? body : [body];
    }

    expect(
      Array.isArray(items),
      "Response is not a JSON array or a query object with a docs array."
    ).toBeTruthy();

    for (const item of items) {
      const validationResult = ShipSchema.safeParse(item);
      expect(validationResult.success, `Ship item validation failed: ${!validationResult.success ? JSON.stringify(validationResult.error.issues) : ''}`).toBeTruthy();
      
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
    const response = this.sharedSteps.activeAPI.getResponse();
    expect(response).toBeTruthy();
    
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    if (body.docs) {
      await expect(response).toMatchSchema(ShipPaginatedResponseSchema);
    } else {
      await expect(response).toMatchSchema(ShipArraySchema);
    }

    const ships = body.docs || body;

    expect(
      Array.isArray(ships),
      "Response is not a list or a query result."
    ).toBeTruthy();

    for (const ship of ships) {
      const validationResult = ShipSchema.safeParse(ship);
      expect(validationResult.success, `Ship validation failed: ${!validationResult.success ? JSON.stringify(validationResult.error.issues) : ''}`).toBe(true);
      
      expect(ship).toHaveProperty(field, `Ship is missing the field: ${field}`);
      expect(
        ship[field],
        `Expected ship ${field} to be ${expectedValue} but found ${ship[field]}`
      ).toBe(expectedValue);
    }
  }

  @Then("the response should match the ship schema")
  public async thenResponseShouldMatchShipSchema(): Promise<void> {
    const response = this.sharedSteps.activeAPI.getResponse();
    expect(response).toBeTruthy();
    await expect(response).toMatchSchema(ShipSchema);
  }

  @Then("the response should match the ships array schema")
  public async thenResponseShouldMatchShipsArraySchema(): Promise<void> {
    const response = this.sharedSteps.activeAPI.getResponse();
    expect(response).toBeTruthy();
    await expect(response).toMatchSchema(ShipArraySchema);
  }

  @Then("the response should match the paginated ships schema")
  public async thenResponseShouldMatchPaginatedShipsSchema(): Promise<void> {
    const response = this.sharedSteps.activeAPI.getResponse();
    expect(response).toBeTruthy();
    await expect(response).toMatchSchema(ShipPaginatedResponseSchema);
  }

  @Then("each ship should have valid roles array")
  public async thenEachShipShouldHaveValidRolesArray(): Promise<void> {
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    
    let ships;
    if (body.docs) {
      ships = body.docs;
    } else {
      ships = Array.isArray(body) ? body : [body];
    }

    for (const ship of ships) {
      expect(ship).toHaveProperty("roles");
      expect(Array.isArray(ship.roles)).toBeTruthy();
      
      if (ship.roles.length > 0) {
        for (const role of ship.roles) {
          expect(typeof role).toBe("string");
          expect(role.length).toBeGreaterThan(0);
        }
      }
    }
  }

  @Then("each ship should have valid identification numbers")
  public async thenEachShipShouldHaveValidIdentificationNumbers(): Promise<void> {
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    
    let ships;
    if (body.docs) {
      ships = body.docs;
    } else {
      ships = Array.isArray(body) ? body : [body];
    }

    for (const ship of ships) {
      if (ship.imo !== null) {
        expect(typeof ship.imo).toBe("number");
        expect(ship.imo).toBeGreaterThan(0);
      }

      if (ship.mmsi !== null) {
        expect(typeof ship.mmsi).toBe("number");
        expect(ship.mmsi).toBeGreaterThan(0);
      }

      if (ship.legacy_id) {
        expect(typeof ship.legacy_id).toBe("string");
        expect(ship.legacy_id.length).toBeGreaterThan(0);
      }
    }
  }

  @Then("the ship should have valid location data")
  public async thenShipShouldHaveValidLocationData(): Promise<void> {
    const response = this.sharedSteps.activeAPI.getResponse();
    expect(response).toBeTruthy();
    
    await expect(response).toMatchSchema(ShipSchema);
    
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    
    if (body.latitude !== null) {
      expect(typeof body.latitude).toBe("number");
      expect(body.latitude).toBeGreaterThanOrEqual(-90);
      expect(body.latitude).toBeLessThanOrEqual(90);
    }

    if (body.longitude !== null) {
      expect(typeof body.longitude).toBe("number");
      expect(body.longitude).toBeGreaterThanOrEqual(-180);
      expect(body.longitude).toBeLessThanOrEqual(180);
    }

    if (body.speed_kn !== null) {
      expect(typeof body.speed_kn).toBe("number");
      expect(body.speed_kn).toBeGreaterThanOrEqual(0);
    }

    if (body.course_deg !== null) {
      expect(typeof body.course_deg).toBe("number");
      expect(body.course_deg).toBeGreaterThanOrEqual(0);
      expect(body.course_deg).toBeLessThanOrEqual(360);
    }
  }
}