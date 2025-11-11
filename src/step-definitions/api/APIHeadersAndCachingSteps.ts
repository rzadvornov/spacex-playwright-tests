import { expect } from "@playwright/test";
import { Then, When, Fixture } from "playwright-bdd/decorators";
import { APISharedSteps } from "./APISharedSteps";
import { APIBase } from "../../services/base/APIBase";

@Fixture("apiHeadersAndCachingSteps")
export class APIHeadersAndCachingSteps {
  private previousResponseData: any = null;
  private previousResponseStatusCode: number | null = null;

  constructor(private sharedSteps: APISharedSteps) {}

  @When("I make an OPTIONS request to {string}")
  public async whenMakeOptionsRequest(endpoint: string): Promise<void> {
    expect(
      this.sharedSteps.activeAPI,
      "Active API not initialized."
    ).toBeInstanceOf(APIBase);

    await this.sharedSteps.activeAPI.makeOptionsRequest(endpoint);
  }

  @When("I make the same GET request to {string} again")
  public async whenMakeSameGetRequestAgain(endpoint: string): Promise<void> {
    expect(
      this.sharedSteps.activeAPI,
      "Active API not initialized."
    ).toBeInstanceOf(APIBase);

    const firstResponse = this.sharedSteps.activeAPI.getResponse();

    this.previousResponseData = await firstResponse!.json();
    this.previousResponseStatusCode = firstResponse!.status();

    await this.sharedSteps.activeAPI.makeGetRequest(endpoint);
  }

  @Then("responses should have identical data")
  public async thenResponsesShouldHaveIdenticalData(): Promise<void> {
    expect(
      this.sharedSteps.activeAPI,
      "Active API not initialized."
    ).toBeInstanceOf(APIBase);

    const currentResponseData =
      await this.sharedSteps.activeAPI.getResponseBody();

    expect(
      this.previousResponseData,
      "The data from the previous request was not stored or is null."
    ).not.toBeNull();

    expect(
      currentResponseData,
      "The data from the current request is null."
    ).not.toBeNull();

    expect(
      currentResponseData,
      "Responses are not identical, suggesting data inconsistency or lack of proper caching."
    ).toEqual(this.previousResponseData);
  }

  @Then("the response header should contain {string}")
  public async thenResponseHeaderShouldContain(
    headerName: string
  ): Promise<void> {
    const response = this.sharedSteps.activeAPI.getResponse();
    expect(response, "No API response found.").not.toBeNull();

    const headers = response!.headers();
    const headerKey = Object.keys(headers).find(
      (key) => key.toLowerCase() === headerName.toLowerCase()
    );

    expect(
      headerKey,
      `Expected header '${headerName}' not found in response headers: ${Object.keys(
        headers
      ).join(", ")}`
    ).toBeDefined();
  }

  @Then("the {string} header value should be {string}")
  public async thenHeaderValueShouldBe(
    headerName: string,
    expectedValue: string
  ): Promise<void> {
    const response = this.sharedSteps.activeAPI.getResponse();
    expect(response, "No API response found.").not.toBeNull();

    const actualValue = response!.headers()[headerName.toLowerCase()];

    expect(
      actualValue,
      `Header '${headerName}' is missing or has a value of: ${actualValue}`
    ).toBeDefined();

    expect(
      actualValue,
      `Expected header '${headerName}' value to be '${expectedValue}', but got '${actualValue}'`
    ).toEqual(expectedValue);
  }

  @Then("the response should include CORS headers")
  public async thenResponseShouldIncludeCORSHeaders(): Promise<void> {
    const response = this.sharedSteps.activeAPI.getResponse();
    expect(response, "No API response found.").not.toBeNull();
    const headers = response!.headers();

    const requiredCORSHeaders = [
      "access-control-allow-origin",
      "access-control-allow-methods",
      "access-control-allow-headers",
    ];

    let missingHeaders: string[] = [];
    requiredCORSHeaders.forEach((h) => {
      if (!headers.hasOwnProperty(h)) {
        missingHeaders.push(h);
      }
    });

    expect(
      missingHeaders.length,
      `Missing required CORS headers: ${missingHeaders.join(", ")}`
    ).toEqual(0);
  }

  @Then("the {string} header should include {string} and {string}")
  public async thenHeaderShouldIncludeValues(
    headerName: string,
    value1: string,
    value2: string
  ): Promise<void> {
    const response = this.sharedSteps.activeAPI.getResponse();
    expect(response, "No API response found.").not.toBeNull();

    const actualValue = response!.headers()[headerName.toLowerCase()];

    expect(actualValue, `Header '${headerName}' is missing.`).toBeDefined();

    const isIncluded =
      actualValue!.includes(value1) && actualValue!.includes(value2);

    expect(
      isIncluded,
      `Expected header '${headerName}' value ('${actualValue}') to include both '${value1}' and '${value2}', but it did not.`
    ).toBeTruthy();
  }

  @Then("the {string} header should be present")
  public async thenHeaderShouldBePresent(headerName: string): Promise<void> {
    await this.thenResponseHeaderShouldContain(headerName);
  }

  @Then("the response may include {string} header")
  public async thenResponseMayIncludeHeader(headerName: string): Promise<void> {
    const response = this.sharedSteps.activeAPI.getResponse();
    expect(response, "No API response found.").not.toBeNull();

    const headers = response!.headers();
    const headerKey = Object.keys(headers).find(
      (key) => key.toLowerCase() === headerName.toLowerCase()
    );

    if (headerKey) {
      const actualValue = headers[headerKey];
      expect(
        actualValue,
        `If present, header '${headerName}' must have a value.`
      ).toBeDefined();
    }
  }

  @Then("the {string} header should include GET and POST")
  public async thenHeaderShouldIncludeGetAndPost(
    headerName: string
  ): Promise<void> {
    await this.thenHeaderShouldIncludeValues(headerName, "GET", "POST");
  }

  @Then("both responses should have status code {int}")
  public async thenBothResponsesShouldHaveStatusCode(
    expectedStatus: number
  ): Promise<void> {
    expect(
      this.previousResponseStatusCode,
      "Status code from the first request was not stored (previousResponseStatusCode is null)."
    ).not.toBeNull();

    expect(
      this.previousResponseStatusCode,
      `Expected first response status code to be ${expectedStatus}, but got ${this.previousResponseStatusCode}`
    ).toEqual(expectedStatus);

    const currentResponse = this.sharedSteps.activeAPI.getResponse();
    expect(
      currentResponse,
      "Second request response object is missing."
    ).not.toBeNull();

    const currentStatus = currentResponse!.status();

    expect(
      currentStatus,
      `Expected second response status code to be ${expectedStatus}, but got ${currentStatus}`
    ).toEqual(expectedStatus);
  }
}
