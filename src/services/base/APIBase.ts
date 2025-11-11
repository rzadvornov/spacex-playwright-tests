import { APIRequestContext, APIResponse } from "@playwright/test";

/**
 * @typedef {Object.<string, string>} Headers
 * @description Type definition for HTTP headers object.
 */

/**
 * @class
 * @classdesc Base class for API interaction using Playwright's APIRequestContext.
 * Provides common methods for managing response, status, and body.
 */
export abstract class APIBase {
  /**
   * @protected
   * @type {APIResponse | null}
   * @description The last received API response, or null if no request has been made.
   */
  protected response: APIResponse | null = null;

  /**
   * @protected
   * @type {APIRequestContext}
   * @description Playwright's APIRequestContext instance for making HTTP requests.
   */
  protected request: APIRequestContext;

  /**
   * @constructor
   * @param {APIRequestContext} request - The Playwright APIRequestContext instance.
   * @description Initializes the API base class. The request object is already configured
   * with the correct baseURL from playwright.config.ts.
   */
  constructor(request: APIRequestContext) {
    this.request = request;

    console.log(
      `ApiBase initialized. Relying on 'request' fixture for base URL.`
    );
  }

  /**
   * @public
   * @returns {APIResponse | null}
   * @description Gets the last received API response object.
   */
  public getResponse(): APIResponse | null {
    return this.response;
  }

  /**
   * @public
   * @async
   * @returns {Promise<number>} The HTTP status code of the last received API response.
   */
  public async getStatusCode(): Promise<number> {
    if (!this.response) {
      throw new Error("No response available");
    }
    return this.response.status();
  }

  /**
   * @public
   * @async
   * @returns {Promise<any>} The JSON body of the last response.
   * @throws {Error} If no response is available.
   * @description Parses and returns the JSON body of the last received API response.
   */
  public async getResponseBody(): Promise<any> {
    if (!this.response) {
      throw new Error("No response available");
    }
    return await this.response.json();
  }

  /**
   * @public
   * @async
   * @returns {Promise<string>} The text body of the last response.
   * @throws {Error} If no response is available.
   * @description Returns the raw text body of the last received API response.
   */
  public async getResponseText(): Promise<string> {
    if (!this.response) {
      throw new Error("No response available");
    }
    return await this.response.text();
  }

  /**
   * @protected
   * @returns {Headers} A record of default headers.
   * @description Provides a set of default headers for typical JSON API requests.
   */
  protected getDefaultHeaders(): Record<string, string> {
    return {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
  }

  /**
   * Handles both list (id === undefined) and detail (id is a string) GET requests.
   * @param id The resource ID for a detail request, or undefined for a list request.
   */
  public abstract makeGetRequest(id: string | undefined): Promise<void>;

  /**
   * Handles POST requests, typically for creating a resource or querying with a body.
   * @param endpoint The specific path within the service (e.g., 'query' or 'create').
   * @param body The JSON payload for the request.
   */
  public abstract makePostRequest(endpoint: string, body: any): Promise<void>;

  /**
   * Handles DELETE requests.
   * @param endpoint The specific path within the service (e.g., '/launches/123').
   */
    public abstract makeDeleteRequest(endpoint: string): Promise<void>;
    
  /**
   * Handles OPTIONS requests.
   * @param endpoint The specific path within the service (e.g., '/launches/123').
   */
  public abstract makeOptionsRequest(endpoint: string): Promise<void>;  
}
