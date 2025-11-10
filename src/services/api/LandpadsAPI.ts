import { APIRequestContext } from "@playwright/test";
import { APIBase } from "../base/APIBase";

/**
 * @class
 * @classdesc API methods for the SpaceX Landpads endpoint (/v4/landpads).
 * Extends {@link APIBase} to utilize common API interaction methods.
 */
export class LandpadsAPI extends APIBase {
  constructor(request: APIRequestContext) {
    super(request);
  }

  /**
   * Retrieves the list of all landing pads.
   */
  public async getAllLandpads(): Promise<void> {
    this.response = await this.request.get(`/landpads`, {
      headers: this.getDefaultHeaders(),
    });
  }

  /**
   * Retrieves a single landing pad by ID.
   * @param landpadId The ID of the landing pad to retrieve.
   */
  public async getLandpadById(landpadId: string): Promise<void> {
    this.response = await this.request.get(`/landpads/${landpadId}`, {
      headers: this.getDefaultHeaders(),
    });
  }

  /**
   * Executes a POST query to filter landpads based on a query body.
   * @param jsonBody The query body (string or object) containing filters, options, etc.
   */
  public async queryLandpads(jsonBody: string | object): Promise<void> {
    const body =
      typeof jsonBody === "string" ? jsonBody : JSON.stringify(jsonBody);

    this.response = await this.request.post(`/landpads/query`, {
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
      await this.getAllLandpads();
    } else {
      await this.getLandpadById(id);
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
    await this.queryLandpads(body);
  }

  /**
   * Implements the abstract makeDeleteRequest from APIBase.
   * Handles DELETE requests for querying landpads.
   * @param _endpoint The specific path within the service (ignored, as we use the query method).
   */
  public makeDeleteRequest(_endpoint: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
}