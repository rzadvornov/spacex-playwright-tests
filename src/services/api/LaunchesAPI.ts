import { APIRequestContext } from "@playwright/test";
import { APIBase } from "../base/APIBase";
import HTTPMethod from "http-method-enum";

/**
 * @class
 * @classdesc API methods for the SpaceX Launches endpoint (/v4/launches).
 * Extends {@link APIBase} to utilize common API interaction methods.
 */
export class LaunchesAPI extends APIBase {
  constructor(request: APIRequestContext) {
    super(request);
  }

  /**
   * Retrieves the list of all launches.
   */
  public async getAllLaunches(): Promise<void> {
    this.response = await this.request.get(`/launches`, {
      headers: this.getDefaultHeaders(),
    });
  }

  /**
   * Retrieves a single launch by ID.
   * @param launchId The ID of the launch to retrieve.
   */
  public async getLaunchById(launchId: string): Promise<void> {
    this.response = await this.request.get(`/launches/${launchId}`, {
      headers: this.getDefaultHeaders(),
    });
  }

  /**
   * Executes a POST query to filter and/or sort launches based on a query body.
   * @param jsonBody The query body (string or object) containing filters, options (sort, limit), etc.
   */
  public async queryLaunches(jsonBody: string | object): Promise<void> {
    const body =
      typeof jsonBody === "string" ? jsonBody : JSON.stringify(jsonBody);

    this.response = await this.request.post(`/launches/query`, {
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
      await this.getAllLaunches();
    } else {
      await this.getLaunchById(id);
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
    await this.queryLaunches(body);
  }

  /**
   * Implements the abstract makeDeleteRequest from APIBase.
   * Handles DELETE requests for querying launches.
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