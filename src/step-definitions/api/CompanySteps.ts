import { expect } from "@playwright/test";
import { Then, Fixture } from "playwright-bdd/decorators";
import { APISharedSteps } from "./APISharedSteps";
import { CompanyAPI } from "../../services/api/CompanyAPI";

@Fixture("companySteps")
export class CompanySteps {
  private companyAPI!: CompanyAPI;

  constructor(private sharedSteps: APISharedSteps) {}

  @Then("the response should contain core fields: {string}")
  public async thenResponseShouldContainCoreFields(
    propertyList: string
  ): Promise<void> {
    const body = await this.sharedSteps.activeAPI.getResponseBody();

    const properties = propertyList.split(",").map((p) => p.trim());

    for (const prop of properties) {
      expect(
        body,
        `Company object is missing the core field: ${prop}`
      ).toHaveProperty(prop);
    }
  }

  @Then("the response should contain field {string}")
  public async thenResponseShouldContainField(field: string): Promise<void> {
    const body = await this.sharedSteps.activeAPI.getResponseBody();

    expect(
      body,
      `Company object is missing the core field: ${field}`
    ).toHaveProperty(field);
  }

  @Then("the response should have {string} field containing {string}")
  public async thenResponseShouldHaveFieldContainingString(
    field: string,
    expectedValue: string
  ): Promise<void> {
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
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    const actualValue = body[field];

    expect(
      actualValue,
      `Response is missing the field: ${field}`
    ).toBeDefined();
    expect(
      typeof actualValue,
      `Field '${field}' is not a number. Found type: ${typeof actualValue}`
    ).toBe("number");
    expect(
      actualValue,
      `Expected ${field} to be a positive integer (>= 0), but got ${actualValue}`
    ).toBeGreaterThanOrEqual(0);
  }

  @Then("the headquarters {string} should be {string}")
  public async thenHeadquartersFieldShouldBe(
    field: string,
    expectedValue: string
  ): Promise<void> {
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

  @Then("the response should contain links to {string}")
  public async thenResponseShouldContainLinksTo(
    linkList: string
  ): Promise<void> {
    const properties = linkList.split(",").map((p) => p.trim());
    const body = await this.sharedSteps.activeAPI.getResponseBody();
    const links = body.links;

    expect(links, "Response is missing the 'links' object.").toBeDefined();

    for (const prop of properties) {
      expect(links, `Links object is missing property: ${prop}`).toHaveProperty(
        prop
      );
      expect(
        typeof links[prop],
        `Expected link '${prop}' to be a string, but got ${typeof links[prop]}`
      ).toBe("string");
      expect(links[prop].length).toBeGreaterThan(0);
    }
  }

  @Then("the response should have a valid URL in the {string} field")
  public async thenResponseShouldHaveValidUrlInField(
    field: string
  ): Promise<void> {
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
}
