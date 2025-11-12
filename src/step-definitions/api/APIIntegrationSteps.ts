import { expect } from "@playwright/test";
import { Given, When, Then, Fixture } from "playwright-bdd/decorators";
import { APISharedSteps } from "./APISharedSteps";
import { CoreSchema } from "../../services/api/schemas/CoresSchemas";
import { LaunchpadSchema } from "../../services/api/schemas/LaunchpadsSchemas";
import { RocketSchema } from "../../services/api/schemas/RocketSchemas";
import { formatZodError } from "../../utils/ZodErrorFormatter";

@Fixture("apiIntegrationSteps")
export class APIIntegrationSteps {
  private launchData: any;
  private rocketData: any;
  private coreIDs: string[] = [];
  private coresData: any[] = [];
  private launchpadData: any;
  private originalLaunchID: string | undefined;

  constructor(private sharedSteps: APISharedSteps) {}

  private async setActiveAPI(resourceName: string): Promise<void> {
    await this.sharedSteps.givenApiIsAvailable(resourceName);
  }

  @Given("a valid launch with multiple cores is available")
  public async givenValidLaunchWithMultipleCoresIsAvailable(): Promise<void> {
    const fhId = "5cd9b1b0b6d9188e00003b25";
    this.sharedSteps.setResourceId(fhId);
    this.originalLaunchID = fhId;
  }

  @Given("a valid launch with a launchpad is available")
  public async givenValidLaunchWithLaunchpadIsAvailable(): Promise<void> {
    const id = "5eb87cd9ffd86e000604b32a";
    this.sharedSteps.setResourceId(id);
    this.originalLaunchID = id;
  }

  @Given("a reused core ID is available")
  public async givenReusedCoreIdIsAvailable(): Promise<void> {
    const id = "5e9e289bf3a61c0006f7b172";
    this.sharedSteps.setResourceId(id);
  }

  @Given("a launch ID with full mission data is available")
  public async givenLaunchIdWithFullMissionDataIsAvailable(): Promise<void> {
    const idWithFullData = "5eb87d46ffd86e000604b388";
    this.sharedSteps.setResourceId(idWithFullData);
    this.originalLaunchID = idWithFullData;
  }

  @When("I retrieve the launch data")
  public async whenIRetrieveTheLaunchData(): Promise<void> {
    await this.setActiveAPI("Launches");
    await this.sharedSteps.whenMakeGetRequestWithResourceId();
    this.launchData = await this.sharedSteps.activeAPI.getResponseBody();
    this.originalLaunchID = this.launchData.id;
  }

  @When("I retrieve the rocket data using the extracted rocket ID")
  public async whenIRetrieveTheRocketDataUsingTheExtractedRocketId(): Promise<void> {
    const rocketId = this.launchData?.rocket;
    expect(rocketId, "Launch data missing 'rocket' ID.").toBeDefined();

    await this.setActiveAPI("Rockets");
    await this.sharedSteps.activeAPI.makeGetRequest(rocketId);
    this.rocketData = await this.sharedSteps.activeAPI.getResponseBody();
  }

  @When("I retrieve each core using the extracted core IDs")
  public async whenIRetrieveEachCoreUsingTheExtractedCoreIds(): Promise<void> {
    const cores = this.launchData?.cores;
    expect(cores, "Launch data missing 'cores' array.").toBeDefined();

    this.coreIDs = cores
      .map((core: any) => core.core)
      .filter((id: string) => id !== null);

    expect(
      this.coreIDs.length,
      "No valid core IDs found in launch data."
    ).toBeGreaterThan(0);

    await this.setActiveAPI("Cores");
    this.coresData = [];

    for (const coreId of this.coreIDs) {
      await this.sharedSteps.activeAPI.makeGetRequest(coreId);
      const coreData = await this.sharedSteps.activeAPI.getResponseBody();
      this.coresData.push(coreData);
    }
  }

  @When("I retrieve the launchpad data using the extracted launchpad ID")
  public async whenIRetrieveTheLaunchpadDataUsingTheExtractedLaunchpadId(): Promise<void> {
    const launchpadId = this.launchData?.launchpad;
    expect(launchpadId, "Launch data missing 'launchpad' ID.").toBeDefined();

    await this.setActiveAPI("Launchpads");
    await this.sharedSteps.activeAPI.makeGetRequest(launchpadId);
    this.launchpadData = await this.sharedSteps.activeAPI.getResponseBody();
  }

  @When("I retrieve the core data")
  public async whenIRetrieveTheCoreData(): Promise<void> {
    await this.setActiveAPI("Cores");
    await this.sharedSteps.whenMakeGetRequestWithResourceId();
    const coreData = await this.sharedSteps.activeAPI.getResponseBody();
    this.coresData = [coreData];
    this.coreIDs = [coreData.id];
  }

  @When("I retrieve all launches referenced by the core ID")
  public async whenIRetrieveAllLaunchesReferencedByTheCoreId(): Promise<void> {
    const coreData = this.coresData[0];
    expect(coreData, "Core data is not available.").toBeDefined();
    expect(coreData).toHaveProperty("launches");

    const launchIds = coreData.launches;
    expect(
      Array.isArray(launchIds),
      `Expected 'launches' to be an array.`
    ).toBeTruthy();

    await this.setActiveAPI("Launches");
    this.launchData = [];

    for (const launchId of launchIds.slice(0, 3)) {
      await this.sharedSteps.activeAPI.makeGetRequest(launchId);
      const launch = await this.sharedSteps.activeAPI.getResponseBody();
      this.launchData.push(launch);
    }
  }

  @When(
    "I retrieve all linked resources \\(rocket, cores, payloads, launchpad, crew)"
  )
  public async whenIRetrieveAllLinkedResources(): Promise<void> {
    await this.whenIRetrieveTheLaunchData();
    await this.whenIRetrieveTheRocketDataUsingTheExtractedRocketId();
    await this.whenIRetrieveEachCoreUsingTheExtractedCoreIds();
    await this.whenIRetrieveTheLaunchpadDataUsingTheExtractedLaunchpadId();
  }

  @Then("the rocket data should be valid")
  public async thenTheRocketDataShouldBeValid(): Promise<void> {
    expect(this.rocketData, "Rocket data is null or undefined.").toBeDefined();

    const result = RocketSchema.safeParse(this.rocketData);
    expect(
      result.success,
      `Rocket data is invalid: ${
        result.success ? "" : formatZodError(result.error)
      }`
    ).toBeTruthy();
  }

  @Then("the rocket ID in the launch and the retrieved rocket ID should match")
  public async thenTheRocketIdInTheLaunchAndTheRetrievedRocketIdShouldMatch(): Promise<void> {
    const expectedRocketId = this.launchData.rocket;
    const actualRocketId = this.rocketData.id;

    expect(
      actualRocketId,
      "Retrieved rocket data is missing an ID."
    ).toBeDefined();
    expect(
      actualRocketId,
      `Cross-reference failed: Launch rocket ID (${expectedRocketId}) does not match retrieved rocket ID (${actualRocketId}).`
    ).toEqual(expectedRocketId);
  }

  @Then("all retrieved core data should be valid")
  public async thenAllRetrievedCoreDataShouldBeValid(): Promise<void> {
    expect(
      this.coresData.length,
      "No core data was retrieved."
    ).toBeGreaterThan(0);

    for (const [index, core] of this.coresData.entries()) {
      const result = CoreSchema.safeParse(core);
      expect(
        result.success,
        `Core at index ${index} is invalid: ${
          result.success ? "" : formatZodError(result.error)
        }`
      ).toBeTruthy();
    }
  }

  @Then("cores should reference the launch ID")
  public async thenCoresShouldReferenceTheLaunchId(): Promise<void> {
    const expectedLaunchId = this.originalLaunchID;
    expect(expectedLaunchId, "Original launch ID is missing.").toBeDefined();

    for (const core of this.coresData) {
      expect(core).toHaveProperty("launches");
      const actualLaunchIds = core.launches;

      expect(
        actualLaunchIds,
        `Core ${core.id} launches list does not contain the original launch ID (${expectedLaunchId}).`
      ).toContain(expectedLaunchId);
    }
  }

  @Then("the launchpad data should be valid")
  public async thenTheLaunchpadDataShouldBeValid(): Promise<void> {
    expect(
      this.launchpadData,
      "Launchpad data is null or undefined."
    ).toBeDefined();

    const result = LaunchpadSchema.safeParse(this.launchpadData);
    expect(
      result.success,
      `Launchpad data is invalid: ${
        result.success ? "" : formatZodError(result.error)
      }`
    ).toBeTruthy();
  }

  @Then("the launchpad should list the launch ID")
  public async thenTheLaunchpadShouldListTheLaunchId(): Promise<void> {
    const expectedLaunchId = this.originalLaunchID;
    expect(expectedLaunchId, "Original launch ID is missing.").toBeDefined();

    expect(this.launchpadData).toHaveProperty("launches");
    const actualLaunchIds = this.launchpadData.launches;

    expect(
      actualLaunchIds,
      `Launchpad ${this.launchpadData.id} launches list does not contain the original launch ID (${expectedLaunchId}).`
    ).toContain(expectedLaunchId);
  }

  @Then("all launches should be valid and reference the core ID")
  public async thenAllLaunchesShouldBeValidAndReferenceTheCoreId(): Promise<void> {
    const expectedCoreId = this.coreIDs[0];
    expect(expectedCoreId, "Original core ID is missing.").toBeDefined();

    expect(
      this.launchData.length,
      "No launch data was retrieved."
    ).toBeGreaterThan(0);

    for (const launch of this.launchData) {
      expect(launch, "Launch data is null or undefined.").toBeDefined();
      expect(launch).toHaveProperty("id");
      expect(launch).toHaveProperty("cores");

      const coreIdsInLaunch = launch.cores.map((core: any) => core.core);

      expect(
        coreIdsInLaunch,
        `Launch ${launch.id} core list does not contain the core ID (${expectedCoreId}).`
      ).toContain(expectedCoreId);
    }

    this.launchData = undefined;
  }

  @Then("all retrieved data should form a complete, valid mission profile")
  public async thenAllRetrievedDataShouldFormACompleteValidMissionProfile(): Promise<void> {
    await this.thenTheRocketDataShouldBeValid();
    await this.thenAllRetrievedCoreDataShouldBeValid();
    await this.thenTheLaunchpadDataShouldBeValid();

    expect(this.launchData).toHaveProperty("payloads");
    expect(Array.isArray(this.launchData.payloads)).toBe(true);
    if (this.launchData.crew && this.launchData.crew.length > 0) {
      expect(this.launchData.crew[0].crew).toBeDefined();
    }
  }

  @Then("all cross-references between the resources should be valid")
  public async thenAllCrossReferencesBetweenTheResourcesShouldBeValid(): Promise<void> {
    await this.thenTheRocketIdInTheLaunchAndTheRetrievedRocketIdShouldMatch();
    await this.thenCoresShouldReferenceTheLaunchId();
    await this.thenTheLaunchpadShouldListTheLaunchId();
  }
}
