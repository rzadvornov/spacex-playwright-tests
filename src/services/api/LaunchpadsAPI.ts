import { APIRequestContext } from "@playwright/test";
import { APIBase } from "../base/APIBase";

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

  public async makeGetRequest(id: string | undefined): Promise<void> {
    if (id === undefined) {
      await this.getAllLaunchpads();
    } else {
      await this.getLaunchpadById(id);
    }
  }

  public async makePostRequest(
    _endpoint: string,
    body: string | object
  ): Promise<void> {
    await this.queryLaunchpads(body);
  }
}