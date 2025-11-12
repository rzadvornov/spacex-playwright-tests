import { expect } from "@playwright/test";
import { Then, Fixture } from "playwright-bdd/decorators";
import { APISharedSteps } from "./APISharedSteps";
import { CompanyAPI } from "../../services/api/CompanyAPI";
import { APIBase } from "../../services/base/APIBase";
import z from "zod";
import { CompanyInfoSchema, HeadquartersSchema } from "../../services/schemas/CompanySchemas";
import { LinksSchema } from "../../services/schemas/LaunchesSchemas";
import { formatZodError } from "../../utils/ZodErrorFormatter";

@Fixture("companySteps")
export class CompanySteps {
  private companyAPI!: CompanyAPI;

  constructor(private sharedSteps: APISharedSteps) {}

  private ensureCompanyAPI(): void {
    if (!this.companyAPI) {
      expect(
        this.sharedSteps.activeAPI,
        "Active API not initialized or not CompanyAPI"
      ).toBeInstanceOf(APIBase);
      this.companyAPI = this.sharedSteps.activeAPI as CompanyAPI;
    }
  }

  @Then("the response should match the company info schema")
  public async thenResponseShouldMatchCompanyInfoSchema(): Promise<void> {
    this.ensureCompanyAPI();
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    
    const result = CompanyInfoSchema.safeParse(body);
    expect(
      result.success,
      `Response does not match company info schema: ${result.success ? '' : formatZodError(result.error)}`
    ).toBeTruthy();
  }

  @Then("the response should contain core fields: {string}")
  public async thenResponseShouldContainCoreFields(
    propertyList: string
  ): Promise<void> {
    this.ensureCompanyAPI();
    const body = await this.sharedSteps.activeAPI.getResponseBody();

    const properties = propertyList.split(",").map((p) => p.trim());
    
    const partialSchema = CompanyInfoSchema.pick(
      properties.reduce((acc, prop) => {
        acc[prop] = true;
        return acc;
      }, {} as Record<string, true>)
    );
    
    const result = partialSchema.safeParse(body);
    expect(
      result.success,
      `Company object missing required fields: ${result.success ? '' : formatZodError(result.error)}`
    ).toBeTruthy();
  }

  @Then("the response should contain field {string}")
  public async thenResponseShouldContainField(field: string): Promise<void> {
    this.ensureCompanyAPI();
    const body = await this.sharedSteps.activeAPI.getResponseBody();

    const fieldSchema = CompanyInfoSchema.pick({ [field]: true });
    const result = fieldSchema.safeParse(body);
    
    expect(
      result.success,
      `Company object is missing the field '${field}' or has invalid type: ${result.success ? '' : formatZodError(result.error)}`
    ).toBeTruthy();
  }

  @Then("the response should have {string} field containing {string}")
  public async thenResponseShouldHaveFieldContainingString(
    field: string,
    expectedValue: string
  ): Promise<void> {
    this.ensureCompanyAPI();
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    const actualValue = body[field];

    expect(
      actualValue,
      `Response is missing the field: ${field}`
    ).toBeDefined();
    expect(
      typeof actualValue,
      `Field '${field}' is not a string. Found type: ${typeof actualValue}`
    ).toBe("string");
    expect(
      actualValue,
      `Expected ${field} to contain '${expectedValue}', but got '${actualValue}'`
    ).toContain(expectedValue);
  }

  @Then("the {string} field should be {string}")
  public async thenFieldShouldBeString(
    field: string,
    expectedValue: string
  ): Promise<void> {
    this.ensureCompanyAPI();
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    const actualValue = body[field];

    expect(
      actualValue,
      `Response is missing the field: ${field}`
    ).toBeDefined();
    expect(
      actualValue,
      `Expected ${field} to be '${expectedValue}', but got '${actualValue}'`
    ).toEqual(expectedValue);
  }

  @Then("the {string} field should be {int}")
  public async thenFieldShouldBeInt(
    field: string,
    expectedValue: number
  ): Promise<void> {
    this.ensureCompanyAPI();
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    const actualValue = body[field];

    expect(
      actualValue,
      `Response is missing the field: ${field}`
    ).toBeDefined();
    expect(
      actualValue,
      `Expected ${field} to be ${expectedValue}, but got ${actualValue}`
    ).toEqual(expectedValue);
  }

  @Then("the {string} value should be a positive integer")
  public async thenFieldValueShouldBePositiveInteger(
    field: string
  ): Promise<void> {
    this.ensureCompanyAPI();
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    
    const positiveIntSchema = z.object({
      [field]: z.number().int().positive()
    });
    
    const result = positiveIntSchema.safeParse(body);
    expect(
      result.success,
      `Field '${field}' is not a positive integer: ${result.success ? '' : formatZodError(result.error)}`
    ).toBeTruthy();
  }

  @Then("the headquarters {string} should be {string}")
  public async thenHeadquartersFieldShouldBe(
    field: string,
    expectedValue: string
  ): Promise<void> {
    this.ensureCompanyAPI();
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    const headquarters = body.headquarters;

    expect(
      headquarters,
      "Response is missing the 'headquarters' object."
    ).toBeDefined();
    expect(
      headquarters,
      `Headquarters object is missing the field: ${field}`
    ).toHaveProperty(field);
    expect(
      headquarters[field],
      `Expected headquarters ${field} to be '${expectedValue}', but got '${headquarters[field]}'`
    ).toEqual(expectedValue);
  }

  @Then("the headquarters should match the headquarters schema")
  public async thenHeadquartersShouldMatchSchema(): Promise<void> {
    this.ensureCompanyAPI();
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    const headquarters = body.headquarters;

    const result = HeadquartersSchema.safeParse(headquarters);
    expect(
      result.success,
      `Headquarters does not match schema: ${result.success ? '' : formatZodError(result.error)}`
    ).toBeTruthy();
  }

  @Then("the response should contain links to {string}")
  public async thenResponseShouldContainLinksTo(
    linkList: string
  ): Promise<void> {
    this.ensureCompanyAPI();
    const properties = linkList.split(",").map((p) => p.trim());
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    const links = body.links;

    expect(links, "Response is missing the 'links' object.").toBeDefined();

    const linksPartialSchema = LinksSchema.pick(
      properties.reduce((acc, prop) => {
        acc[prop] = true;
        return acc;
      }, {} as Record<string, true>)
    );
    
    const result = linksPartialSchema.safeParse(links);
    expect(
      result.success,
      `Links object missing required properties or invalid URLs: ${result.success ? '' : formatZodError(result.error)}`
    ).toBeTruthy();
  }

  @Then("the links should match the links schema")
  public async thenLinksShouldMatchSchema(): Promise<void> {
    this.ensureCompanyAPI();
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    const links = body.links;

    const result = LinksSchema.safeParse(links);
    expect(
      result.success,
      `Links do not match schema: ${result.success ? '' : formatZodError(result.error)}`
    ).toBeTruthy();
  }

  @Then("the response should have a valid URL in the {string} field")
  public async thenResponseShouldHaveValidUrlInField(
    field: string
  ): Promise<void> {
    this.ensureCompanyAPI();
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    const links = body.links;
    const url: string = links[field];

    expect(
      typeof url,
      `Expected '${field}' to be a string, but got ${typeof url}`
    ).toBe("string");
    expect(url.length).toBeGreaterThan(0);
    expect(() => new URL(url), `'${url}' is not a valid URL.`).not.toThrow();
  }

  @Then("all numeric fields should be valid")
  public async thenAllNumericFieldsShouldBeValid(): Promise<void> {
    this.ensureCompanyAPI();
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    
    const numericSchema = CompanyInfoSchema.pick({
      founded: true,
      employees: true,
      vehicles: true,
      launch_sites: true,
      test_sites: true,
      valuation: true
    });
    
    const result = numericSchema.safeParse(body);
    expect(
      result.success,
      `Numeric fields are invalid: ${result.success ? '' : formatZodError(result.error)}`
    ).toBeTruthy();
  }
}