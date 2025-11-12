import { APIRequestContext } from "@playwright/test";
import { APIBase } from "../base/APIBase";
import HTTPMethod from "http-method-enum";

/**
 * @class
 * @classdesc API methods for the SpaceX Ships endpoint (/v4/ships).
 */
export class ShipsAPI extends APIBase {
  constructor(request: APIRequestContext) {
    super(request);
  }

  /**
   * Retrieves the list of all ships.
   */
  public async getAllShips(): Promise<void> {
    this.response = await this.request.get(`/ships`, {
      headers: this.getDefaultHeaders(),
    });
  }

  /**
   * Retrieves a single ship by ID.
   * @param shipId The ID of the ship to retrieve.
   */
  public async getShipById(shipId: string): Promise<void> {
    this.response = await this.request.get(`/ships/${shipId}`, {
      headers: this.getDefaultHeaders(),
    });
  }

  /**
   * Executes a POST query to filter ships based on a query body.
   * @param jsonBody The query body (string or object) containing filters, options, etc.
   */
  public async queryShips(jsonBody: string | object): Promise<void> {
    const body =
      typeof jsonBody === "string" ? jsonBody : JSON.stringify(jsonBody);

    this.response = await this.request.post(`/ships/query`, {
      headers: this.getDefaultHeaders(),
      data: body,
    });
  }

  /**
   * Executes a GET request to the Ships API.
   * * * If `id` is `undefined`, it fetches a list of all available ships (list request).
   * * If a string `id` is provided, it fetches the details for that specific ship (detail request).
   * * @param {string | undefined} id The unique identifier of the ship to fetch,
   * or `undefined` to fetch the complete list of ships.
   * @returns {Promise<void>} A Promise that resolves when the API call is complete
   * and the ship data has been processed (e.g., stored in context).
   */
  public async makeGetRequest(id: string | undefined): Promise<void> {
    if (id === undefined) {
      await this.getAllShips();
    } else {
      await this.getShipById(id);
    }
  }

  /**
   * Executes a POST request to the Ships API, specifically for querying.
   *
   * @param {string} _endpoint The endpoint path, currently ignored as this implementation focuses solely on querying ships.
   * @param {string | object} body The request body, typically a JSON object or string, containing the query parameters (e.g., filters, limits).
   * @returns {Promise<void>} A Promise that resolves when the ship query API call is complete
   * and the resulting data (e.g., list of ships) has been processed.
   */
  public async makePostRequest(
    _endpoint: string,
    body: string | object
  ): Promise<void> {
    await this.queryShips(body);
  }

  /**
   * Implements the abstract makeDeleteRequest from APIBase.
   * Handles DELETE requests for querying ships.
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
