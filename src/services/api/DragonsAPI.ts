import { APIRequestContext } from "@playwright/test";
import { APIBase } from "../base/APIBase";

/**
 * @class
 * @classdesc API methods for the SpaceX Dragons endpoint (/v4/dragons).
 */
export class DragonsAPI extends APIBase {
  constructor(request: APIRequestContext) {
    super(request);
  }

  /**
   * Retrieves the list of all Dragon spacecraft.
   */
  public async getAllDragons(): Promise<void> {
    this.response = await this.request.get(`/dragons`, {
      headers: this.getDefaultHeaders(),
    });
  }

  /**
   * Retrieves a single Dragon spacecraft by ID.
   * @param dragonId The ID of the Dragon spacecraft to retrieve.
   */
  public async getDragonById(dragonId: string): Promise<void> {
    this.response = await this.request.get(`/dragons/${dragonId}`, {
      headers: this.getDefaultHeaders(),
    });
  }

  /**
   * Executes a POST query to filter Dragon spacecraft based on a query body.
   * @param jsonBody The query body (string or object) containing filters, options, etc.
   */
  public async queryDragons(jsonBody: string | object): Promise<void> {
    const body =
      typeof jsonBody === "string" ? jsonBody : JSON.stringify(jsonBody);

    this.response = await this.request.post(`/dragons/query`, {
      headers: this.getDefaultHeaders(),
      data: body,
    });
  }

  /**
   * Implements the abstract method for generic GET requests.
   */
  public async makeGetRequest(id: string | undefined): Promise<void> {
    if (id === undefined) {
      await this.getAllDragons();
    } else {
      await this.getDragonById(id);
    }
  }

  /**
   * Implements the abstract method for generic POST requests.
   */
  public async makePostRequest(
    _endpoint: string,
    body: string | object
  ): Promise<void> {
    await this.queryDragons(body);
  }
}
