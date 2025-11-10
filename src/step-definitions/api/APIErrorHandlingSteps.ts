import { expect } from "@playwright/test";
import { When, Then, Fixture } from "playwright-bdd/decorators";
import { APISharedSteps } from "./APISharedSteps";
import { APIBase } from "../../services/base/APIBase";

@Fixture("apiErrorHandlingSteps")
export class APIErrorHandlingSteps {
  constructor(private sharedSteps: APISharedSteps) {}

  @When("I make a POST request to {string} with malformed JSON body")
  public async whenMakePostRequestWithMalformedJsonBody(endpoint: string): Promise<void> {
    expect(this.sharedSteps.activeAPI, "Active API not initialized.").toBeInstanceOf(APIBase);
    
    const malformedBody = '{"query": {"field": "value",}'; 
    await this.sharedSteps.activeAPI.makePostRequest(endpoint, malformedBody);
  }

  @When("I make a POST request to {string} with empty body")
  public async whenMakePostRequestWithEmptyBody(endpoint: string): Promise<void> {
    expect(this.sharedSteps.activeAPI, "Active API not initialized.").toBeInstanceOf(APIBase);

    await this.sharedSteps.activeAPI.makePostRequest(endpoint, "");
  }
  
}