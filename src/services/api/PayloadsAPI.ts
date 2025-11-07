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

  public async makeGetRequest(id: string | undefined): Promise<void> {
    if (id === undefined) {
      await this.getAllPayloads();
    } else {
      await this.getPayloadById(id);
    }
  }

  public async makePostRequest(_endpoint: string, body: string | object): Promise<void> {
    await this.queryPayloads(body);
  }
}