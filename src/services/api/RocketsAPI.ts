import { APIRequestContext } from "@playwright/test";
import { APIBase } from "../base/APIBase";

/**
 * @class
 * @classdesc API methods for the SpaceX Rockets endpoint (/v4/rockets).
 * Extends {@link APIBase} to utilize common API interaction methods.
 */
export class RocketsAPI extends APIBase {
  constructor(request: APIRequestContext) {
    super(request);
  }

  /**
   * Retrieves the list of all rockets.
   */
  public async getAllRockets(): Promise<void> {
    this.response = await this.request.get(`/rockets`, {
      headers: this.getDefaultHeaders(),
    });
  }

  /**
   * Retrieves a single rocket by ID.
   * @param rocketId The ID of the rocket to retrieve.
   */
  public async getRocketById(rocketId: string): Promise<void> {
    this.response = await this.request.get(`/rockets/${rocketId}`, {
      headers: this.getDefaultHeaders(),
    });
  }

  /**
   * Executes a POST query to filter rockets based on a query body.
   * @param jsonBody The query body (string or object) containing filters, options, etc.
   */
  public async queryRockets(jsonBody: string | object): Promise<void> {
    const body = typeof jsonBody === "string" ? JSON.parse(jsonBody) : jsonBody;

    this.response = await this.request.post(`/rockets/query`, {
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
      await this.getAllRockets();
    } else {
      await this.getRocketById(id);
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
    await this.queryRockets(body);
  }
}
