import { APIRequestContext } from "@playwright/test";
import { APIBase } from "./APIBase";

/**
 * @class
 * @classdesc A concrete implementation of APIBase, used only for dependency injection
 * of the generic 'apiBase' fixture. It fulfills the contract of APIBase
 * without performing any meaningful resource-specific logic.
 */
export class APIBaseFixture extends APIBase {
  constructor(request: APIRequestContext) {
    super(request);
  }

  public async makeGetRequest(_id: string | undefined): Promise<void> {
    console.error(
      "APIBaseFixture.makeGetRequest should not be called. Use resource-specific APIs."
    );
    throw new Error("Cannot make a generic GET request on APIBaseFixture.");
  }

  public async makePostRequest(_endpoint: string, _body: any): Promise<void> {
    console.error(
      "APIBaseFixture.makePostRequest should not be called. Use resource-specific APIs."
    );
    throw new Error("Cannot make a generic POST request on APIBaseFixture.");
  }

  public async makeDeleteRequest(endpoint: string): Promise<void> {
    console.error(
      "APIBaseFixture.makeDeleteRequest should not be called. Use resource-specific APIs."
    );
    throw new Error("Cannot make a generic DELETE request on APIBaseFixture.");
  }
}
