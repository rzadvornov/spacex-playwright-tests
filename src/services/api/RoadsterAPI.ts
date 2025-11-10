import { APIRequestContext } from "@playwright/test";
import { APIBase } from "../base/APIBase";

/**
 * @class
 * @classdesc API methods for the SpaceX Roadster endpoint (/v4/roadster).
 * Extends {@link APIBase} to utilize common API interaction methods.
 */
export class RoadsterAPI extends APIBase {
  constructor(request: APIRequestContext) {
    super(request);
  }

  /**
   * Retrieves the current information about the Roadster.
   */
  public async getRoadsterInfo(): Promise<void> {
    this.response = await this.request.get(`/roadster`, {
      headers: this.getDefaultHeaders(),
    });
  }

  /**
   * Implements the abstract method for generic GET requests.
   * For Roadster, this always retrieves the single resource.
   * @param _id The resource ID (ignored as Roadster is a single resource).
   */
  public async makeGetRequest(_id: string | undefined): Promise<void> {
    await this.getRoadsterInfo();
  }

  /**
   * Implements the abstract method for generic POST requests.
   * @param _endpoint The specific path (should be 'query' for filtering).
   * @param body The JSON payload for the query.
   */
  public async makePostRequest(
    _endpoint: string,
    _body: string | object
  ): Promise<void> {
    throw new Error("POST requests are not supported for the Roadster API.");
  }

  /**
   * Implements the abstract makeDeleteRequest from APIBase.
   * Handles DELETE requests for querying roadsters.
   * @param _endpoint The specific path within the service (ignored, as we use the query method).
   */
  public makeDeleteRequest(_endpoint: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
