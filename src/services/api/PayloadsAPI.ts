import { APIRequestContext } from "@playwright/test";
import { APIBase } from "../base/APIBase";

/**
 * @class
 * @classdesc API methods for the SpaceX Payloads endpoint (/v4/payloads).
 * Extends {@link APIBase} to utilize common API interaction methods.
 */
export class PayloadsAPI extends APIBase {
  constructor(request: APIRequestContext) {
    super(request);
  }

  /**
   * Retrieves the list of all payloads.
   */
  public async getAllPayloads(): Promise<void> {
    this.response = await this.request.get(`/payloads`, {
      headers: this.getDefaultHeaders(),
    });
  }

  /**
   * Retrieves a single payload by ID.
   * @param payloadId The ID of the payload to retrieve.
   */
  public async getPayloadById(payloadId: string): Promise<void> {
    this.response = await this.request.get(`/payloads/${payloadId}`, {
      headers: this.getDefaultHeaders(),
    });
  }

  /**
   * Executes a POST query to filter payloads based on a query body.
   * @param jsonBody The query body (string or object) containing filters, options, etc.
   */
  public async queryPayloads(jsonBody: string | object): Promise<void> {
    const body =
      typeof jsonBody === "string" ? jsonBody : JSON.stringify(jsonBody);

    this.response = await this.request.post(`/payloads/query`, {
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
      await this.getAllPayloads();
    } else {
      await this.getPayloadById(id);
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
    await this.queryPayloads(body);
  }

  /**
   * Implements the abstract makeDeleteRequest from APIBase.
   * Handles DELETE requests for querying payloads.
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
