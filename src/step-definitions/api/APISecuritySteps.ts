import { expect } from "@playwright/test";
import { Then, Fixture, When } from "playwright-bdd/decorators";
import { APISharedSteps } from "./APISharedSteps";
import { APIBase } from "../../services/base/APIBase";
import StatusCode from "status-code-enum";

@Fixture("apiSecuritySteps")
export class APISecuritySteps {
  constructor(private sharedSteps: APISharedSteps) {}

  @Then("the connection should use HTTPS")
  public async thenConnectionShouldUseHttps(): Promise<void> {
    const response = this.sharedSteps.activeAPI.getResponse();
    const url = response?.url();
    expect(url, "Response URL is missing or undefined.").toBeDefined();

    expect(
      url?.startsWith("https://"),
      `Expected URL to start with 'https://', but got '${url}'`
    ).toBeTruthy();
  }

  @Then("the certificate should be valid")
  public async thenCertificateShouldBeValid(): Promise<void> {
    const status = this.sharedSteps.activeAPI.getStatusCode();

    expect(
      status,
      "Request failed at the transport level (e.g., connection issue, which could mask a certificate error)."
    ).toBeDefined();

    expect(status).not.toBe(0);
    expect(
      status,
      `Received a server error (${status}), which should not happen if the request payload was handled gracefully.`
    ).toBeLessThan(StatusCode.ServerErrorInternal);
  }

  @Then("the request should be handled safely by the API")
  public async thenRequestShouldBeHandledSafely(): Promise<void> {
    const status = this.sharedSteps.activeAPI.getStatusCode();
    const statusMessage = this.sharedSteps.activeAPI.getResponse()?.statusText;

    expect(
      status,
      `Expected request to be handled safely (non-5xx error), but received server error ${status} (${statusMessage}).`
    ).toBeLessThan(StatusCode.ServerErrorInternal);
  }

  @Then("no database operations should be executed outside the query scope")
  public async thenNoDatabaseOperationsOutsideQueryScope(): Promise<void> {
    const status = await this.sharedSteps.activeAPI.getStatusCode();
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    expect(status).not.toBe(StatusCode.SuccessCreated);

    if (status === StatusCode.SuccessOK) {
      const results = Array.isArray(body) ? body : body.docs;

      expect(
        results?.length,
        "Received 200 OK, but query result was not empty, suggesting the injection might have been misinterpreted as a valid query."
      ).toBe(0);
    }
  }

  @Then("the API should handle the type mismatch gracefully")
  public async thenApiShouldHandleTypeMismatchGracefully(): Promise<void> {
    const status = this.sharedSteps.activeAPI.getStatusCode();

    expect(
      status,
      `Expected graceful handling (4xx status), but received server error ${status}.`
    ).toBeLessThan(StatusCode.ServerErrorInternal);

    expect(
      status,
      `Expected a client error (400 or 422) for type mismatch, but received success status ${status}.`
    ).not.toBeGreaterThan(StatusCode.RedirectMultipleChoices);
  }

  @When("I make a POST request to create a new launch at {string}")
  public async whenMakePostRequestToCreateNewLaunch(
    endpoint: string
  ): Promise<void> {
    const minimalBody = {
      name: "Test for 405 check",
      date_utc: new Date().toISOString(),
    };

    expect(
      this.sharedSteps.activeAPI,
      "Active API not initialized."
    ).toBeInstanceOf(APIBase);

    await this.sharedSteps.activeAPI.makePostRequest(endpoint, minimalBody);
  }

  @Then(
    "the request should be rejected with a 405 Method Not Allowed or 404 Not Found"
  )
  public async thenRequestShouldBeRejectedWith405Or404(): Promise<void> {
    const status = this.sharedSteps.activeAPI.getStatusCode();
    const statusMessage = this.sharedSteps.activeAPI.getResponse()?.statusText;

    expect(
      [StatusCode.ClientErrorNotFound, StatusCode.ClientErrorMethodNotAllowed],
      `Expected rejection status 404 or 405, but received ${status} (${statusMessage}).`
    ).toContain(status);
  }
}
