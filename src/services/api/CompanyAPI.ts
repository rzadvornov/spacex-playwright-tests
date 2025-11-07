import { APIRequestContext } from "@playwright/test";
import { APIBase } from "../base/APIBase";

/**
 * @class
 * @classdesc API methods for the SpaceX Company Information endpoint (/v4/company).
 */
export class CompanyAPI extends APIBase {
  constructor(request: APIRequestContext) {
    super(request);
  }

  /**
   * Retrieves the detailed company information.
   */
  public async getCompanyInfo(): Promise<void> {
    this.response = await this.request.get(`/company`, {
      headers: this.getDefaultHeaders(),
    });
  }

  /**
   * Implements the abstract makeGetRequest from APIBase.
   * Only supports the single company info GET request (id is ignored).
   * @param _id The resource ID (ignored for this singleton endpoint).
   */
  public async makeGetRequest(_id: string | undefined): Promise<void> {
    await this.getCompanyInfo();
  }

  /**
   * Implements the abstract makePostRequest from APIBase.
   * The Company endpoint does not support POST/query, so this is unimplemented.
   * @param _endpoint The specific path within the service (ignored).
   * @param _body The JSON payload for the request (ignored).
   */
  public async makePostRequest(
    _endpoint: string,
    _body: string | object
  ): Promise<void> {
    throw new Error("POST/Query not supported for the Company endpoint.");
  }
}
