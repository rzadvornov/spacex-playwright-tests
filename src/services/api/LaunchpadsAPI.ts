import { APIRequestContext } from "@playwright/test";
import { APIBase } from "../base/APIBase";
import HTTPMethod from "http-method-enum";

/**
 * @class
 * @classdesc API methods for the SpaceX Launchpads endpoint (/v4/launchpads).
 * Extends {@link APIBase} to utilize common API interaction methods.
 */
export class LaunchpadsAPI extends APIBase {
  constructor(request: APIRequestContext) {
    super(request);
  }

  /**
   * Retrieves the list of all launchpads.
   */
  public async getAllLaunchpads(): Promise<void> {
    this.response = await this.request.get(`/launchpads`, {
      headers: this.getDefaultHeaders(),
    });
  }

  /**
   * Retrieves a single launchpad by ID.
   * @param launchpadId The ID of the launchpad to retrieve.
   */
  public async getLaunchpadById(launchpadId: string): Promise<void> {
    this.response = await this.request.get(`/launchpads/${launchpadId}`, {
      headers: this.getDefaultHeaders(),
    });
  }

  /**
   * Executes a POST query to filter launchpads based on a query body.
   * @param jsonBody The query body (string or object) containing filters, options, etc.
   */
  public async queryLaunchpads(jsonBody: string | object): Promise<void> {
    const body =
      typeof jsonBody === "string" ? jsonBody : JSON.stringify(jsonBody);

    this.response = await this.request.post(`/launchpads/query`, {
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
      await this.getAllLaunchpads();
    } else {
      await this.getLaunchpadById(id);
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
    await this.queryLaunchpads(body);
  }

  /**
   * Implements the abstract makeDeleteRequest from APIBase.
   * Handles DELETE requests for querying launchpads.
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