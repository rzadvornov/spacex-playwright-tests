import { expect } from "@playwright/test";
import { Then, Fixture, When } from "playwright-bdd/decorators";
import { APISharedSteps } from "./APISharedSteps";
import { APIBase } from "../../services/base/APIBase";

@Fixture("apiPerformanceSteps")
export class APIPerformanceSteps {
  private startTime: number | undefined;

  constructor(private sharedSteps: APISharedSteps) {}

  @When("I make a GET request to {string} and start timing")
  public async whenMakeGetRequestAndStartTiming(
    endpoint: string
  ): Promise<void> {
    this.startTime = Date.now();
    await this.sharedSteps.whenMakeGetRequest(endpoint);
  }

  @When(
    "I make a GET request to {string} and start timing with the resource ID"
  )
  public async whenMakeGetRequestWithResourceIdAndStartTiming(
    endpoint: string
  ): Promise<void> {
    this.startTime = Date.now();

    await this.sharedSteps.givenApiIsAvailable("Launches");

    const id = this.sharedSteps.getResourceId();
    const fullEndpoint = `${endpoint}/${id}`;

    await this.sharedSteps.whenMakeGetRequest(fullEndpoint);
  }

  @When("I make a POST request to {string} with options:")
  public async whenMakePostRequestWithLaunchOptions(
    endpoint: string,
    docString: string
  ): Promise<void> {
    this.startTime = Date.now();
    const optionsBody = JSON.parse(docString);

    const queryBody = { options: optionsBody };

    expect(
      this.sharedSteps.activeAPI,
      "Active API not initialized or not LaunchesAPI"
    ).toBeInstanceOf(APIBase);

    await this.sharedSteps.activeAPI.makePostRequest(endpoint, queryBody);
  }

  @When("I make a POST request to {string} with a complex query body")
  public async whenMakePostRequestWithComplexQueryBody(
    endpoint: string
  ): Promise<void> {
    this.startTime = Date.now();

    const complexQueryBody = {
      query: {
        success: true,
        date_utc: { $gte: "2018-01-01T00:00:00.000Z" },
      },
      options: {
        sort: { date_utc: "desc" },
        limit: 50,
        select: "name flight_number date_utc core.serial",
      },
    };

    await this.sharedSteps.activeAPI.makePostRequest(
      endpoint,
      complexQueryBody
    );
  }

  @Then("the response time should be less than {int} seconds")
  public async thenResponseTimeShouldBeLessThanSeconds(
    expectedMaxSeconds: number
  ): Promise<void> {
    expect(
      this.startTime,
      "Request timing was not started. Ensure a '...and start timing' step was used."
    ).toBeDefined();

    const endTime = Date.now();
    const durationMs = endTime - (this.startTime || 0);
    const durationSeconds = durationMs / 1000;
    const expectedMaxMs = expectedMaxSeconds * 1000;

    expect(
      durationMs,
      `Performance test failed: Response time was ${durationSeconds.toFixed(
        3
      )}s, which is not less than the required ${expectedMaxSeconds}s (${expectedMaxMs}ms).`
    ).toBeLessThan(expectedMaxMs);

    this.startTime = undefined;
  }
}
