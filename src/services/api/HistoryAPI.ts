import { APIRequestContext } from "@playwright/test";
import { APIBase } from "../base/APIBase";
import HTTPMethod from "http-method-enum";

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
   * Implements the abstract method for generic GET requests.
   * @param id The resource ID for a detail request, or undefined for a list request.
   */
  public async makeGetRequest(id: string | undefined): Promise<void> {
    if (id === undefined) {
      await this.getAllHistoryEvents();
    } else {
      await this.getHistoryEventById(id);
    }
  }

  /**
   * Implements the abstract method for generic POST requests.
   * @param _endpoint The specific path (should be 'query' for filtering).
   * @param body The JSON payload for the query.
   */
  public async makePostRequest(
    _endpoint: string,
    body: string | object
  ): Promise<void> {
    await this.queryHistory(body);
  }

  /**
   * Implements the abstract makeDeleteRequest from APIBase.
   * Handles DELETE requests for querying history.
   * @param _endpoint The specific path within the service (ignored, as we use the query method).
   */
  public makeDeleteRequest(_endpoint: string): Promise<void> {
    throw new Error("Method not implemented.");
  }

  /**
   * Implements the abstract method for generic OPTIONS requests.
   * @param endpoint The specific path within the service (e.g., '/cores').
   */
  public async makeOptionsRequest(endpoint: string): Promise<void> {
    this.response = await this.request.fetch(endpoint, {
      method: HTTPMethod.OPTIONS,
      headers: this.getDefaultHeaders(),
    });
  }
}
