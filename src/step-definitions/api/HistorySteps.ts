import { expect } from "@playwright/test";
import { When, Then, Fixture } from "playwright-bdd/decorators";
import { HistoryAPI } from "../../services/api/HistoryAPI";
import { APISharedSteps } from "./APISharedSteps";
import { APIBase } from "../../services/base/APIBase";
import { HistoryPaginatedResponseSchema, HistoryArraySchema, HistoryEventSchema } from "../../services/schemas/HistorySchemas";
import { LinksSchema } from "../../services/schemas/LaunchesSchemas";

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
    const response = this.sharedSteps.activeAPI.getResponse();
    expect(response).toBeTruthy();
    
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    if (body.docs) {
      await expect(response).toMatchSchema(HistoryPaginatedResponseSchema);
    } else {
      await expect(response).toMatchSchema(HistoryArraySchema);
    }

    const events = body.docs || body;

    expect(Array.isArray(events), "Response is not a list or a query result (missing docs array).").toBeTruthy();

    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();

    for (const event of events) {
      const validationResult = HistoryEventSchema.safeParse(event);
      expect(validationResult.success, `History event validation failed: ${!validationResult.success ? JSON.stringify(validationResult.error.issues) : ''}`).toBeTruthy();
      
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
    const response = this.sharedSteps.activeAPI.getResponse();
    expect(response).toBeTruthy();
    
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    if (body.docs) {
      await expect(response).toMatchSchema(HistoryPaginatedResponseSchema);
    } else {
      await expect(response).toMatchSchema(HistoryArraySchema);
    }

    const events = body.docs || body;

    expect(Array.isArray(events), "Response is not a list or a query result (missing docs array).").toBeTruthy();
    
    const sortMultiplier = order.toLowerCase() === 'desc' ? -1 : 1;

    for (let i = 0; i < events.length - 1; i++) {
        const validationResult1 = HistoryEventSchema.safeParse(events[i]);
        expect(validationResult1.success, `History event validation failed at index ${i}: ${!validationResult1.success ? JSON.stringify(validationResult1.error.issues) : ''}`).toBeTruthy();
        
        const validationResult2 = HistoryEventSchema.safeParse(events[i + 1]);
        expect(validationResult2.success, `History event validation failed at index ${i + 1}: ${!validationResult2.success ? JSON.stringify(validationResult2.error.issues) : ''}`).toBeTruthy();
        
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
    const response = this.sharedSteps.activeAPI.getResponse();
    expect(response).toBeTruthy();
    
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    if (body.docs) {
      await expect(response).toMatchSchema(HistoryPaginatedResponseSchema);
    } else {
      await expect(response).toMatchSchema(HistoryArraySchema);
    }

    const properties = ["id", "title", "event_date_utc"];
    const items = body.docs || body;

    expect(
      Array.isArray(items),
      "Response is not a JSON array or a query object with a docs array."
    ).toBeTruthy();

    for (const item of items) {
      const validationResult = HistoryEventSchema.safeParse(item);
      expect(validationResult.success, `History event validation failed: ${!validationResult.success ? JSON.stringify(validationResult.error.issues) : ''}`).toBeTruthy();
      
      for (const prop of properties) {
        expect(item).toHaveProperty(
          prop,
          `History event is missing property: ${prop}`
        );
      }
    }
  }

  @Then("for each event, the launch field should be present or the links object should be present")
  public async thenLaunchOrLinksShouldBePresent(): Promise<void> {
    const response = this.sharedSteps.activeAPI.getResponse();
    expect(response).toBeTruthy();
    
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    if (body.docs) {
      await expect(response).toMatchSchema(HistoryPaginatedResponseSchema);
    } else {
      await expect(response).toMatchSchema(HistoryArraySchema);
    }

    const events = body.docs || body;

    expect(
        Array.isArray(events), 
        "Response is not a list or a query result (missing docs array)."
    ).toBeTruthy();
    
    expect(events.length, "No events found to validate.").toBeGreaterThan(0);

    for (const event of events) {
      const validationResult = HistoryEventSchema.safeParse(event);
      expect(validationResult.success, `History event validation failed: ${!validationResult.success ? JSON.stringify(validationResult.error.issues) : ''}`).toBeTruthy();
      
      const hasLaunch = event.hasOwnProperty('launch') && event.launch !== null && event.launch !== undefined;
      const hasLinks = event.hasOwnProperty('links') && event.links !== null && event.links !== undefined;

      expect(
        hasLaunch || hasLinks,
        `Event ID: ${event.id} is missing both 'launch' and 'links' properties. At least one must be present.`
      ).toBeTruthy();
    }
  }

  @Then("the response should match the history event schema")
  public async thenResponseShouldMatchHistoryEventSchema(): Promise<void> {
    const response = this.sharedSteps.activeAPI.getResponse();
    expect(response).toBeTruthy();
    await expect(response).toMatchSchema(HistoryEventSchema);
  }

  @Then("the response should match the history array schema")
  public async thenResponseShouldMatchHistoryArraySchema(): Promise<void> {
    const response = this.sharedSteps.activeAPI.getResponse();
    expect(response).toBeTruthy();
    await expect(response).toMatchSchema(HistoryArraySchema);
  }

  @Then("the response should match the paginated history schema")
  public async thenResponseShouldMatchPaginatedHistorySchema(): Promise<void> {
    const response = this.sharedSteps.activeAPI.getResponse();
    expect(response).toBeTruthy();
    await expect(response).toMatchSchema(HistoryPaginatedResponseSchema);
  }

  @Then("each event should have valid date information")
  public async thenEachEventShouldHaveValidDateInformation(): Promise<void> {
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    
    let events;
    if (body.docs) {
      events = body.docs;
    } else {
      events = Array.isArray(body) ? body : [body];
    }

    for (const event of events) {
      expect(event.event_date_utc).toBeDefined();
      expect(typeof event.event_date_utc).toBe("string");
      
      const eventDate = new Date(event.event_date_utc);
      expect(!isNaN(eventDate.getTime()), `Invalid event_date_utc: ${event.event_date_utc}`).toBeTruthy();

      if (event.event_date_unix) {
        expect(typeof event.event_date_unix).toBe("number");
        expect(event.event_date_unix).toBeGreaterThan(0);
      }

      const now = new Date();
      expect(eventDate.getTime(), `Event date ${event.event_date_utc} should be in the past`).toBeLessThanOrEqual(now.getTime());
    }
  }

  @Then("each event should have valid content and details")
  public async thenEachEventShouldHaveValidContentAndDetails(): Promise<void> {
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    
    let events;
    if (body.docs) {
      events = body.docs;
    } else {
      events = Array.isArray(body) ? body : [body];
    }

    for (const event of events) {
      expect(event.title).toBeDefined();
      expect(typeof event.title).toBe("string");
      expect(event.title.length).toBeGreaterThan(0);

      expect(event.details).toBeDefined();
      expect(typeof event.details).toBe("string");
      expect(event.details.length).toBeGreaterThan(0);

      expect(event.id).toBeDefined();
      expect(typeof event.id).toBe("string");
      expect(event.id.length).toBeGreaterThan(0);
    }
  }

  @Then("each event should have valid links when present")
  public async thenEachEventShouldHaveValidLinksWhenPresent(): Promise<void> {
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    
    let events;
    if (body.docs) {
      events = body.docs;
    } else {
      events = Array.isArray(body) ? body : [body];
    }

    for (const event of events) {
      if (event.links) {
        const linksValidation = LinksSchema.safeParse(event.links);
        expect(linksValidation.success, `Links validation failed for event ${event.id}: ${!linksValidation.success ? JSON.stringify(linksValidation.error.issues) : ''}`).toBeTruthy();

        if (event.links.article) {
          expect(typeof event.links.article).toBe("string");
          expect(event.links.article.length).toBeGreaterThan(0);
          expect(event.links.article).toMatch(/^https?:\/\//);
        }

        if (event.links.wikipedia) {
          expect(typeof event.links.wikipedia).toBe("string");
          expect(event.links.wikipedia.length).toBeGreaterThan(0);
          expect(event.links.wikipedia).toMatch(/^https?:\/\//);
        }

        if (event.links.reddit) {
          expect(typeof event.links.reddit).toBe("string");
          expect(event.links.reddit.length).toBeGreaterThan(0);
          expect(event.links.reddit).toMatch(/^https?:\/\//);
        }
      }
    }
  }

  @Then("each event should have valid launch reference when present")
  public async thenEachEventShouldHaveValidLaunchReferenceWhenPresent(): Promise<void> {
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    
    let events;
    if (body.docs) {
      events = body.docs;
    } else {
      events = Array.isArray(body) ? body : [body];
    }

    for (const event of events) {
      if (event.launch) {
        expect(typeof event.launch).toBe("string");
        expect(event.launch.length).toBeGreaterThan(0);
        expect(event.launch).toMatch(/^[a-f0-9]{24}$/);
      }
    }
  }

  @Then("each event should have valid flight number when present")
  public async thenEachEventShouldHaveValidFlightNumberWhenPresent(): Promise<void> {
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    
    let events;
    if (body.docs) {
      events = body.docs;
    } else {
      events = Array.isArray(body) ? body : [body];
    }

    for (const event of events) {
      if (event.flight_number !== null && event.flight_number !== undefined) {
        expect(typeof event.flight_number).toBe("number");
        expect(event.flight_number).toBeGreaterThan(0);
      }
    }
  }
}