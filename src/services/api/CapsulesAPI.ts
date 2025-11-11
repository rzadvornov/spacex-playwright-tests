import { APIRequestContext } from "@playwright/test";
import { APIBase } from "../base/APIBase";

/**
 * @class
 * @classdesc API methods for the SpaceX Capsules endpoint (/v4/capsules).
 */
export class CapsulesAPI extends APIBase {

  constructor(request: APIRequestContext) {
    super(request);
  }

  /**
   * Retrieves the list of all capsules.
   */
  public async getAllCapsules(): Promise<void> {
    this.response = await this.request.get(`/capsules`, {
      headers: this.getDefaultHeaders(),
    });
  }

  /**
   * Retrieves a single capsule by ID.
   * @param capsuleId The ID of the capsule to retrieve.
   */
  public async getCapsuleById(capsuleId: string): Promise<void> {
    this.response = await this.request.get(`/capsules/${capsuleId}`, {
      headers: this.getDefaultHeaders(),
    });
  }

  /**
   * Executes a POST query to filter capsules based on a query body.
   * @param jsonBody The query body (string or object) containing filters, options, etc.
   */
  public async queryCapsules(jsonBody: string | object): Promise<void> {
    const body =
      typeof jsonBody === "string" ? jsonBody : JSON.stringify(jsonBody);

    this.response = await this.request.post(`/capsules/query`, {
      headers: this.getDefaultHeaders(),
      data: body,
    });
  }

  /**
   * Implements the abstract makeGetRequest from APIBase.
   * Handles both list (id === undefined) and detail (id is a string) GET requests.
   * @param id The resource ID for a detail request, or undefined for a list request.
   */
  public async makeGetRequest(id: string | undefined): Promise<void> {
    if (id === undefined) {
      await this.getAllCapsules();
    } else {
      await this.getCapsuleById(id);
    }
  }

  /**
   * Implements the abstract makePostRequest from APIBase.
   * Handles POST requests for querying capsules.
   * @param _endpoint The specific path within the service (ignored, as we use the query method).
   * @param body The JSON payload for the request.
   */
  public async makePostRequest(
    _endpoint: string,
    body: string | object
  ): Promise<void> {
    await this.queryCapsules(body);
  }

  /**
   * Implements the abstract makeDeleteRequest from APIBase.
   * Handles DELETE requests for querying capsules.
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
      method: 'OPTIONS',
      headers: this.getDefaultHeaders(),
    });
  }
}
