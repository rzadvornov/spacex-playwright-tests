import { expect } from "@playwright/test";
import { When, Then, Fixture } from "playwright-bdd/decorators";
import { HistoryAPI } from "../../services/api/HistoryAPI";
import { APISharedSteps } from "./APISharedSteps";
import { APIBase } from "../../services/base/APIBase";

@Fixture("historySteps")
export class HistorySteps {
  constructor(private sharedSteps: APISharedSteps) {}

  @When("I make a POST request with date range query:")
  public async whenMakePostRequestWithDateRangeQuery(docString: string): Promise<void> {
    const queryBody = JSON.parse(docString);
    this.sharedSteps.queryBody = queryBody;

    expect(
      this.sharedSteps.activeAPI,
      "Active API not initialized or not HistoryAPI"
    ).toBeInstanceOf(APIBase);
    const historyAPI = this.sharedSteps.activeAPI as HistoryAPI;

    await historyAPI.queryHistory(queryBody);
  }

  @Then("all events should fall between date {string} and {string}")
  public async thenAllEventsShouldFallBetweenDate(startDate: string, endDate: string): Promise<void> {
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    const events = body.docs || body;

    expect(Array.isArray(events), "Response is not a list or a query result (missing docs array).").toBeTruthy();

    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();

    for (const event of events) {
      const eventDate = new Date(event.event_date_utc).getTime();
      expect(
        eventDate,
        `Event date ${event.event_date_utc} is not between ${startDate} (inclusive) and ${endDate} (exclusive)`
      ).toBeGreaterThanOrEqual(start);
      expect(
        eventDate,
        `Event date ${event.event_date_utc} is not between ${startDate} (inclusive) and ${endDate} (exclusive)`
      ).toBeLessThan(end);
    }
  }

  @When("I make a POST request with options for sorting:")
  public async whenMakePostRequestWithOptionsForSorting(docString: string): Promise<void> {
    const queryBody = JSON.parse(docString);
    this.sharedSteps.queryBody = queryBody;

    expect(
      this.sharedSteps.activeAPI,
      "Active API not initialized or not HistoryAPI"
    ).toBeInstanceOf(APIBase);
    const historyAPI = this.sharedSteps.activeAPI as HistoryAPI;

    await historyAPI.queryHistory(queryBody);
  }

  @Then("events should be sorted by date in {string} order")
  public async thenEventsShouldBeSortedByDate(order: string): Promise<void> {
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    const events = body.docs || body;

    expect(Array.isArray(events), "Response is not a list or a query result (missing docs array).").toBeTruthy();
    
    const sortMultiplier = order.toLowerCase() === 'desc' ? -1 : 1;

    for (let i = 0; i < events.length - 1; i++) {
        const date1 = new Date(events[i].event_date_utc).getTime();
        const date2 = new Date(events[i + 1].event_date_utc).getTime();

        if (sortMultiplier === 1) {
            expect(
                date1,
                `Events are not sorted in ascending order. ${events[i].event_date_utc} is after ${events[i + 1].event_date_utc}`
            ).toBeLessThanOrEqual(date2);
        } else {
            expect(
                date1,
                `Events are not sorted in descending order. ${events[i].event_date_utc} is before ${events[i + 1].event_date_utc}`
            ).toBeGreaterThanOrEqual(date2);
        }
    }
  }

  @Then("each event should have: id, title, event_date_utc")
  public async thenEachEventShouldHaveStandardProperties(): Promise<void> {
    await this.sharedSteps.thenEachResponseItemShouldHaveProperties(
      "id, title, event_date_utc"
    );
  }

  @Then("for each event, the launch field should be present or the links object should be present")
  public async thenLaunchOrLinksShouldBePresent(): Promise<void> {
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    const events = body.docs || body;

    expect(
        Array.isArray(events), 
        "Response is not a list or a query result (missing docs array)."
    ).toBeTruthy();
    
    expect(events.length, "No events found to validate.").toBeGreaterThan(0);

    for (const event of events) {
      const hasLaunch = event.hasOwnProperty('launch') && event.launch !== null && event.launch !== undefined;
      const hasLinks = event.hasOwnProperty('links') && event.links !== null && event.links !== undefined;

      expect(
        hasLaunch || hasLinks,
        `Event ID: ${event.id} is missing both 'launch' and 'links' properties. At least one must be present.`
      ).toBeTruthy();
    }
  }
}