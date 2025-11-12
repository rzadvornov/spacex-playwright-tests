import { expect } from "@playwright/test";
import { Given, When, Then, Fixture } from "playwright-bdd/decorators";
import { DragonsAPI } from "../../services/api/DragonsAPI";
import { APISharedSteps } from "./APISharedSteps";
import { APIBase } from "../../services/base/APIBase";
import { DragonPaginatedResponseSchema, DragonArraySchema, HeatShieldSchema, ThrusterSchema, PressurizedCapsuleSchema, TrunkSchema, CargoSchema } from "../../services/schemas/DragonsSchemas";
import { DragonSchema } from "../../services/schemas/PayloadsSchemas";
import { ThrustSchema } from "../../services/schemas/RocketSchemas";

@Fixture("dragonsSteps")
export class DragonsSteps {
  private dragonsAPI!: DragonsAPI;

  constructor(private sharedSteps: APISharedSteps) {}

  @Given("a valid dragon ID {string} is available")
  public async givenValidDragonId(dragonId: string): Promise<void> {
    this.sharedSteps.setResourceId(dragonId);
  }

  @When("I query the Dragons API using POST with filter:")
  public async whenQueryDragonsAPIWithFilter(docString: string): Promise<void> {
    const queryBody = JSON.parse(docString);
    this.sharedSteps.queryBody = queryBody;

    expect(
      this.sharedSteps.activeAPI,
      "Active API not initialized or not DragonsAPI"
    ).toBeInstanceOf(APIBase);
    this.dragonsAPI = this.sharedSteps.activeAPI as DragonsAPI;

    await this.dragonsAPI.queryDragons(queryBody);
  }

  @Then("all results should have active status as {boolean}")
  public async thenAllResultsShouldHaveActiveStatus(
    expectedStatus: boolean
  ): Promise<void> {
    const response = this.sharedSteps.activeAPI.getResponse();
    expect(response).toBeTruthy();
    
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    if (body.docs) {
      await expect(response).toMatchSchema(DragonPaginatedResponseSchema);
    } else {
      await expect(response).toMatchSchema(DragonArraySchema);
    }

    const dragons = body.docs || body;

    expect(
      Array.isArray(dragons),
      "Response is not a list or a query result (missing docs array)."
    ).toBeTruthy();

    for (const dragon of dragons) {
      const validationResult = DragonSchema.safeParse(dragon);
      expect(validationResult.success, `Dragon validation failed: ${!validationResult.success ? JSON.stringify(validationResult.error.issues) : ''}`).toBeTruthy();
      
      expect(
        dragon,
        `Dragon item is missing the 'active' field.`
      ).toHaveProperty("active");

      expect(
        dragon.active,
        `Expected dragon 'active' status to be ${expectedStatus}, but got ${dragon.active}`
      ).toEqual(expectedStatus);
    }
  }

  private getNestedPropertyValue(obj: any, path: string): any {
    return path
      .split(".")
      .reduce((prev, curr) => (prev ? prev[curr] : undefined), obj);
  }

  @Then("the nested field {string} in {string} should be a positive number")
  public async thenNestedFieldInShouldBeAPositiveNumber(
    nestedField: string,
    parentField: string
  ): Promise<void> {
    const response = this.sharedSteps.activeAPI.getResponse();
    expect(response).toBeTruthy();
    
    await expect(response).toMatchSchema(DragonSchema);
    
    const fullPath = `${parentField}.${nestedField}`;
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    const value = this.getNestedPropertyValue(body, fullPath);

    expect(
      value,
      `Nested field '${fullPath}' is missing, null, or undefined in the response.`
    ).toBeDefined();

    expect(
      typeof value,
      `Nested field '${fullPath}' is not a number. Found type: ${typeof value}`
    ).toBe("number");

    expect(
      value,
      `Nested field '${fullPath}' with value ${value} is not a positive number (must be > 0).`
    ).toBeGreaterThan(0);
  }

  @Then("the field {string} should be a non-negative integer")
  public async thenFieldShouldBeANonNegativeInteger(
    field: string
  ): Promise<void> {
    const response = this.sharedSteps.activeAPI.getResponse();
    expect(response).toBeTruthy();
    
    await expect(response).toMatchSchema(DragonSchema);
    
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
      Number.isInteger(value),
      `Field '${field}' with value ${value} is not an integer.`
    ).toBeTruthy();

    expect(
      value,
      `Field '${field}' with value ${value} is not a non-negative number (must be >= 0).`
    ).toBeGreaterThanOrEqual(0);
  }

  @Then("the nested field {string} in {string} should be a non-negative number")
  public async thenNestedFieldInShouldBeANonNegativeNumber(
    nestedField: string,
    parentField: string
  ): Promise<void> {
    const response = this.sharedSteps.activeAPI.getResponse();
    expect(response).toBeTruthy();
    
    await expect(response).toMatchSchema(DragonSchema);
    
    const fullPath = `${parentField}.${nestedField}`;
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    const value = this.getNestedPropertyValue(body, fullPath);

    if (value === null || value === undefined) {
      console.log(
        `Nested field '${fullPath}' is null or undefined, skipping non-negative check.`
      );
      return;
    }

    expect(
      typeof value,
      `Nested field '${fullPath}' is not a number. Found type: ${typeof value}`
    ).toBe("number");

    expect(
      value,
      `Nested field '${fullPath}' with value ${value} is not a non-negative number (must be >= 0).`
    ).toBeGreaterThanOrEqual(0);
  }

  @Then("the response should match the dragon schema")
  public async thenResponseShouldMatchDragonSchema(): Promise<void> {
    const response = this.sharedSteps.activeAPI.getResponse();
    expect(response).toBeTruthy();
    await expect(response).toMatchSchema(DragonSchema);
  }

  @Then("the response should match the dragons array schema")
  public async thenResponseShouldMatchDragonsArraySchema(): Promise<void> {
    const response = this.sharedSteps.activeAPI.getResponse();
    expect(response).toBeTruthy();
    await expect(response).toMatchSchema(DragonArraySchema);
  }

  @Then("the response should match the paginated dragons schema")
  public async thenResponseShouldMatchPaginatedDragonsSchema(): Promise<void> {
    const response = this.sharedSteps.activeAPI.getResponse();
    expect(response).toBeTruthy();
    await expect(response).toMatchSchema(DragonPaginatedResponseSchema);
  }

  @Then("each dragon should have valid heat shield information")
  public async thenEachDragonShouldHaveValidHeatShieldInformation(): Promise<void> {
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    
    let dragons;
    if (body.docs) {
      dragons = body.docs;
    } else {
      dragons = Array.isArray(body) ? body : [body];
    }

    for (const dragon of dragons) {
      const heatShieldValidation = HeatShieldSchema.safeParse(dragon.heat_shield);
      expect(heatShieldValidation.success, `Heat shield validation failed for dragon ${dragon.name}: ${!heatShieldValidation.success ? JSON.stringify(heatShieldValidation.error.issues) : ''}`).toBeTruthy();

      expect(dragon.heat_shield.material).toBeDefined();
      expect(typeof dragon.heat_shield.material).toBe("string");
      expect(dragon.heat_shield.material.length).toBeGreaterThan(0);

      expect(dragon.heat_shield.size_meters).toBeGreaterThan(0);
      expect(dragon.heat_shield.temp_degrees).toBeGreaterThan(0);
      expect(dragon.heat_shield.dev_partner?.length).toBeGreaterThan(0);
    }
  }

  @Then("each dragon should have valid thruster information")
  public async thenEachDragonShouldHaveValidThrusterInformation(): Promise<void> {
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    
    let dragons;
    if (body.docs) {
      dragons = body.docs;
    } else {
      dragons = Array.isArray(body) ? body : [body];
    }

    for (const dragon of dragons) {
      expect(dragon.thrusters).toBeDefined();
      expect(Array.isArray(dragon.thrusters)).toBeTruthy();
      
      for (const thruster of dragon.thrusters) {
        const thrusterValidation = ThrusterSchema.safeParse(thruster);
        expect(thrusterValidation.success, `Thruster validation failed for dragon ${dragon.name}: ${!thrusterValidation.success ? JSON.stringify(thrusterValidation.error.issues) : ''}`).toBeTruthy();

        const thrustValidation = ThrustSchema.safeParse(thruster.thrust);
        expect(thrustValidation.success, `Thrust validation failed for dragon ${dragon.name}: ${!thrustValidation.success ? JSON.stringify(thrustValidation.error.issues) : ''}`).toBeTruthy();

        expect(thruster.type).toBeDefined();
        expect(typeof thruster.type).toBe("string");
        expect(thruster.type.length).toBeGreaterThan(0);

        expect(thruster.amount).toBeGreaterThan(0);
        expect(thruster.pods).toBeGreaterThan(0);
        expect(thruster.fuel_1).toBeDefined();
        expect(thruster.fuel_2).toBeDefined();
      }
    }
  }

  @Then("each dragon should have valid pressurized capsule information")
  public async thenEachDragonShouldHaveValidPressurizedCapsuleInformation(): Promise<void> {
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    
    let dragons;
    if (body.docs) {
      dragons = body.docs;
    } else {
      dragons = Array.isArray(body) ? body : [body];
    }

    for (const dragon of dragons) {
      const capsuleValidation = PressurizedCapsuleSchema.safeParse(dragon.pressurized_capsule);
      expect(capsuleValidation.success, `Pressurized capsule validation failed for dragon ${dragon.name}: ${!capsuleValidation.success ? JSON.stringify(capsuleValidation.error.issues) : ''}`).toBeTruthy();

      expect(dragon.pressurized_capsule.payload_volume.cubic_meters).toBeGreaterThan(0);
      expect(dragon.pressurized_capsule.payload_volume.cubic_feet).toBeGreaterThan(0);
    }
  }

  @Then("each dragon should have valid trunk information")
  public async thenEachDragonShouldHaveValidTrunkInformation(): Promise<void> {
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    
    let dragons;
    if (body.docs) {
      dragons = body.docs;
    } else {
      dragons = Array.isArray(body) ? body : [body];
    }

    for (const dragon of dragons) {
      const trunkValidation = TrunkSchema.safeParse(dragon.trunk);
      expect(trunkValidation.success, `Trunk validation failed for dragon ${dragon.name}: ${!trunkValidation.success ? JSON.stringify(trunkValidation.error.issues) : ''}`).toBeTruthy();

      expect(dragon.trunk.trunk_volume.cubic_meters).toBeGreaterThan(0);
      expect(dragon.trunk.trunk_volume.cubic_feet).toBeGreaterThan(0);

      if (dragon.trunk.cargo) {
        const cargoValidation = CargoSchema.safeParse(dragon.trunk.cargo);
        expect(cargoValidation.success, `Cargo validation failed for dragon ${dragon.name}: ${!cargoValidation.success ? JSON.stringify(cargoValidation.error.issues) : ''}`).toBeTruthy();

        expect(dragon.trunk.cargo.solar_array).toBeGreaterThanOrEqual(0);
        expect(dragon.trunk.cargo.unpressurized_cargo).toBeDefined();
      }
    }
  }

  @Then("each dragon should have valid mass and dimension data")
  public async thenEachDragonShouldHaveValidMassAndDimensionData(): Promise<void> {
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    
    let dragons;
    if (body.docs) {
      dragons = body.docs;
    } else {
      dragons = Array.isArray(body) ? body : [body];
    }

    for (const dragon of dragons) {
      expect(dragon.dry_mass_kg).toBeGreaterThan(0);
      expect(dragon.dry_mass_lb).toBeGreaterThan(0);

      if (dragon.launch_payload_mass) {
        expect(dragon.launch_payload_mass.kg).toBeGreaterThan(0);
        expect(dragon.launch_payload_mass.lb).toBeGreaterThan(0);
      }

      if (dragon.return_payload_mass) {
        expect(dragon.return_payload_mass.kg).toBeGreaterThan(0);
        expect(dragon.return_payload_mass.lb).toBeGreaterThan(0);
      }

      expect(dragon.height_w_trunk.meters).toBeGreaterThan(0);
      expect(dragon.height_w_trunk.feet).toBeGreaterThan(0);
      expect(dragon.diameter.meters).toBeGreaterThan(0);
      expect(dragon.diameter.feet).toBeGreaterThan(0);
    }
  }

  @Then("each dragon should have valid orbit and lifespan information")
  public async thenEachDragonShouldHaveValidOrbitAndLifespanInformation(): Promise<void> {
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    
    let dragons;
    if (body.docs) {
      dragons = body.docs;
    } else {
      dragons = Array.isArray(body) ? body : [body];
    }

    for (const dragon of dragons) {
      if (dragon.orbit_duration_yr) {
        expect(typeof dragon.orbit_duration_yr).toBe("number");
        expect(dragon.orbit_duration_yr).toBeGreaterThan(0);
      }

      if (dragon.sidewall_angle_deg) {
        expect(typeof dragon.sidewall_angle_deg).toBe("number");
        expect(dragon.sidewall_angle_deg).toBeGreaterThan(0);
      }

      expect(dragon.first_flight).toBeDefined();
      expect(typeof dragon.first_flight).toBe("string");
      expect(dragon.first_flight.length).toBeGreaterThan(0);

      const firstFlightDate = new Date(dragon.first_flight);
      expect(!isNaN(firstFlightDate.getTime()), `Invalid first flight date: ${dragon.first_flight}`).toBeTruthy();
    }
  }
}