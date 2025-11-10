import { expect } from "@playwright/test";
import { Then, Fixture, When } from "playwright-bdd/decorators";
import { APISharedSteps } from "./APISharedSteps";
import { APIBase } from "../../services/base/APIBase";

@Fixture("apiPaginationSteps")
export class APIPaginationSteps {
  constructor(private sharedSteps: APISharedSteps) {}
  
  @When("I make a POST request to {string} with query and options:")
  public async whenMakePostRequestWithQueryAndOptions(
    endpoint: string,
    docString: string
  ): Promise<void> {
    const queryBody = JSON.parse(docString);
    this.sharedSteps.queryBody = queryBody;

    expect(
      this.sharedSteps.activeAPI,
      "Active API not initialized."
    ).toBeInstanceOf(APIBase);

    await this.sharedSteps.activeAPI.makePostRequest(endpoint, queryBody);
  }

  @Then("the response should have {string}, {string}, {string}, and {string} fields")
  public async thenResponseShouldHaveBasicPaginationFields(
    field1: string,
    field2: string,
    field3: string,
    field4: string
  ): Promise<void> {
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    
    expect(body, "Response body is not a query object.").toBeDefined();
    
    const fields = [field1, field2, field3, field4];
    
    for (const field of fields) {
      expect(body, `Response object is missing the field: ${field}`).toHaveProperty(field);
    }
  }

  @Then("the response should have maximum {int} items in {string}")
  public async thenResponseShouldHaveMaximumItemsInDocs(
    expectedLimit: number,
    docsField: string
  ): Promise<void> {
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    const docs = body[docsField];
    
    expect(
      Array.isArray(docs),
      `Expected field '${docsField}' to be an array, but it was not.`
    ).toBeTruthy();
    
    expect(
      docs.length,
      `Expected docs array length to be less than or equal to the limit (${expectedLimit}), but got ${docs.length}`
    ).toBeLessThanOrEqual(expectedLimit);
    
    expect(
        body.limit,
        `Expected metadata limit to be ${expectedLimit}, but got ${body.limit}`
    ).toEqual(expectedLimit);
  }

  @Then("the response should indicate page {int}")
  public async thenResponseShouldIndicatePage(expectedPage: number): Promise<void> {
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    
    expect(
      body,
      "Response body is not a query object (missing pagination metadata)."
    ).toHaveProperty("page");
    
    expect(
      body.page,
      `Expected page to be ${expectedPage}, but got ${body.page}`
    ).toEqual(expectedPage);
  }

  @Then("the first result should correspond to the overall record at position {int}")
  public async thenFirstResultShouldCorrespondToRecordPosition(
    expectedRecordPosition: number
  ): Promise<void> {
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    
    expect(
      body,
      "Response body is missing pagination metadata (e.g., offset)."
    ).toHaveProperty("offset");
    
    const actualOffset = body.offset;
    const actualRecordPosition = actualOffset + 1;
    
    expect(
        actualRecordPosition,
        `Expected first record to be at position ${expectedRecordPosition} (offset ${expectedRecordPosition - 1}), but found it at position ${actualRecordPosition} (offset ${actualOffset}).`
    ).toEqual(expectedRecordPosition);
  }
  
  @Then('"{}" should equal ceiling of "{}" divided by "{}"')
  public async thenTotalPagesShouldEqualCalculation(
    totalPagesField: string,
    totalDocsField: string,
    limitField: string
  ): Promise<void> {
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    
    expect(body, "Response missing totalDocs field.").toHaveProperty(totalDocsField);
    expect(body, "Response missing limit field.").toHaveProperty(limitField);
    expect(body, "Response missing totalPages field.").toHaveProperty(totalPagesField);
    
    const totalDocs = body[totalDocsField];
    const limit = body[limitField];
    const actualTotalPages = body[totalPagesField];
    
    const expectedTotalPages = Math.ceil(totalDocs / limit);
    
    expect(
      actualTotalPages,
      `Expected ${totalPagesField} to be ${expectedTotalPages} (ceil(${totalDocs}/${limit})), but got ${actualTotalPages}.`
    ).toEqual(expectedTotalPages);
  }

  @Then('"{}" should be {} if current page is less than "{}"')
  public async thenHasNextPageCheck(
    hasNextPageField: string,
    _expectedValueString: string,
    totalPagesField: string
  ): Promise<void> {
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    
    expect(body, "Response missing required pagination field.").toHaveProperty(hasNextPageField);
    
    const actualHasNextPage = body[hasNextPageField];
    const totalPages = body[totalPagesField];
    const page = body.page;

    const expectedHasNextPage = page < totalPages;
    
    expect(
      actualHasNextPage,
      `Expected ${hasNextPageField} to be ${expectedHasNextPage} (page ${page} < totalPages ${totalPages}), but got ${actualHasNextPage}.`
    ).toBe(expectedHasNextPage);
  }
  
  @Then('"{}" should be {} for page {int}')
  public async thenHasPrevPageCheck(
    hasPrevPageField: string,
    expectedValueString: string,
    expectedPage: number
  ): Promise<void> {
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    
    expect(body, "Response missing required pagination field.").toHaveProperty(hasPrevPageField);
    
    const actualHasPrevPage = body[hasPrevPageField];
    const expectedValue = expectedValueString === 'false';
    const page = body.page;
    
    if (page === expectedPage) {
      expect(
        actualHasPrevPage,
        `Expected ${hasPrevPageField} to be ${expectedValue} for page ${expectedPage}, but got ${actualHasPrevPage}.`
      ).toBe(expectedValue);
    } else {
        expect(
            actualHasPrevPage,
            `Expected ${hasPrevPageField} to be ${!expectedValue} for a page > 1, but got ${actualHasPrevPage}.`
        ).toBeTruthy();
    }
  }
}