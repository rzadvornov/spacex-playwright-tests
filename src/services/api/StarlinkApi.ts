import { APIRequestContext } from "@playwright/test";
import { APIBase } from "../base/APIBase";

/**
 * @class
 * @classdesc API Service class for interacting with the SpaceX Starlink endpoints.
 * Extends {@link APIBase} to utilize common API interaction methods (e.g., getting status, parsing response body).
 */
export class StarlinkAPI extends APIBase {
  /**
   * @constructor
   * @param {APIRequestContext} request - The Playwright APIRequestContext instance, pre-configured with the base URL and headers from playwright.config.ts.
   */
  constructor(request: APIRequestContext) {
    super(request);
  }

  /**
   * @public
   * @async
   * @returns {Promise<void>} Sets the response property after making a GET request to the `/starlink` endpoint.
   * @description Retrieves the list of all Starlink satellites.
   */
  public async getAllStarlinkSatellites(): Promise<void> {
    this.response = await this.request.get(`/starlink`, {
      headers: this.getDefaultHeaders(),
    });
  }

  /**
   * @public
   * @async
   * @param {string} satelliteId - The unique ID of the Starlink satellite to retrieve.
   * @returns {Promise<void>} Sets the response property after making a GET request to the `/starlink/{id}` endpoint.
   * @description Retrieves a single Starlink satellite by its ID.
   */
  public async getStarlinkSatelliteById(satelliteId: string): Promise<void> {
    this.response = await this.request.get(`/starlink/${satelliteId}`, {
      headers: this.getDefaultHeaders(),
    });
  }

  /**
   * @public
   * @async
   * @param {string | object} jsonBody - The request body containing query, options (like pagination), and filters.
   * @returns {Promise<void>} Sets the response property after making a POST request to the `/starlink/query` endpoint.
   * @description Executes a POST query to filter, sort, or paginate the Starlink satellite list.
   */
  public async queryStarlinkSatellites(
    jsonBody: string | object
  ): Promise<void> {
    const body =
      typeof jsonBody === "string" ? jsonBody : JSON.stringify(jsonBody);

    this.response = await this.request.post(`/starlink/query`, {
      headers: this.getDefaultHeaders(),
      data: body,
    });
  }

  /**
   * @public
   * @async
   * @param {string | object} jsonBody - The request body for filtering and pagination.
   * @returns {Promise<void>} Calls {@link StarlinkAPI#queryStarlinkSatellites} with the provided body.
   * @description Alias method for querying Starlink satellites, often used specifically for pagination scenarios.
   */
  public async queryWithPagination(jsonBody: string | object): Promise<void> {
    await this.queryStarlinkSatellites(jsonBody);
  }

  /**
   * Executes a GET request to the Starlink API.
   * * If no ID is provided, it fetches a list of all Starlink satellites (list request).
   * If an ID is provided, it fetches the details for that specific satellite (detail request).
   * * @param {string | undefined} id The unique identifier of the Starlink satellite to fetch,
   * or `undefined` to fetch the list of all satellites.
   * @returns {Promise<void>} A Promise that resolves when the API call is complete.
   */
  public async makeGetRequest(id: string | undefined): Promise<void> {
    if (id === undefined) {
      await this.getAllStarlinkSatellites();
    } else {
      await this.getStarlinkSatelliteById(id);
    }
  }

  /**
   * Executes a POST request to the Starlink API, specifically for querying satellites.
   *
   * @param {string} _endpoint The endpoint path, currently ignored as this implementation focuses solely on querying satellites.
   * @param {any} body The request body, typically an object or string, containing the query parameters (e.g., filters, limits) for the Starlink satellite data.
   * @returns {Promise<void>} A Promise that resolves when the Starlink satellite query API call is complete
   * and the resulting data (e.g., list of satellites) has been processed.
   */
  public async makePostRequest(_endpoint: string, body: any): Promise<void> {
    await this.queryStarlinkSatellites(body);
  }
}
