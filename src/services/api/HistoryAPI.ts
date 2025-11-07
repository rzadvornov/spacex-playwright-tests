import { APIRequestContext } from "@playwright/test";
import { APIBase } from "../base/APIBase";

/**
 * @class
 * @classdesc API methods for the SpaceX Historical Events endpoint (/v4/history).
 */
export class HistoryAPI extends APIBase {
  constructor(request: APIRequestContext) {
    super(request);
  }

  /**
   * Retrieves the list of all historical events.
   */
  public async getAllHistoryEvents(): Promise<void> {
    this.response = await this.request.get(`/history`, {
      headers: this.getDefaultHeaders(),
    });
  }

  /**
   * Retrieves a single historical event by ID.
   * @param eventId The ID of the event to retrieve.
   */
  public async getHistoryEventById(eventId: string): Promise<void> {
    this.response = await this.request.get(`/history/${eventId}`, {
      headers: this.getDefaultHeaders(),
    });
  }

  /**
   * Executes a POST query to filter, sort, or paginate history events.
   * @param jsonBody The query body (string or object) containing filters, options, etc.
   */
  public async queryHistory(jsonBody: string | object): Promise<void> {
    const body =
      typeof jsonBody === "string" ? jsonBody : JSON.stringify(jsonBody);

    this.response = await this.request.post(`/history/query`, {
      headers: this.getDefaultHeaders(),
      data: body,
    });
  }

  /**
   * Handles both list (id === undefined) and detail (id is a string) GET requests.
   */
  public async makeGetRequest(id: string | undefined): Promise<void> {
    if (id === undefined) {
      await this.getAllHistoryEvents();
    } else {
      await this.getHistoryEventById(id);
    }
  }

  /**
   * Handles POST requests, specifically for querying history.
   */
  public async makePostRequest(
    _endpoint: string,
    body: string | object
  ): Promise<void> {
    await this.queryHistory(body);
  }
}
