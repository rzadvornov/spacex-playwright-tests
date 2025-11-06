import { expect } from "@playwright/test";
import { Then, Fixture } from "playwright-bdd/decorators";
import { DataTable } from "playwright-bdd";
import { HumanSpaceflightPage } from "../../../services/ui/HumanSpaceflightPage";
import { Element, HeaderElementStrategy } from "../../../utils/types/Types";
import { parseHeaderElements } from "../../../utils/types/TypeGuards";

@Fixture("humanSpaceflightHeaderSteps")
export class HumanSpaceflightHeaderSteps {
  constructor(private humanSpaceflightPage: HumanSpaceflightPage) {}

  @Then("the header navigation should contain:")
  async checkNavigationMenu(dataTable: DataTable) {
    const links = dataTable.hashes();
    await this.validateNavigationLinks(links);
  }

  private async validateNavigationLinks(links: any[]): Promise<void> {
    for (const link of links) {
      const isVisible = await this.humanSpaceflightPage.header.isNavLinkVisible(
        link["Link Text"]
      );
      expect(
        isVisible,
        `Navigation link "${link["Link Text"]}" should be visible`
      ).toBeTruthy();
    }
  }

  @Then("I should see the header with the following elements:")
  async checkHeaderElements(dataTable: DataTable) {
    const elements = parseHeaderElements(dataTable.hashes());
    await this.validateHeaderElements(elements);
  }

  private async validateHeaderElements(elements: Element[]): Promise<void> {
    for (const element of elements) {
      await this.validateHeaderElement(element);
    }
  }

  private async validateHeaderElement(element: Element): Promise<void> {
    const strategy = this.getHeaderElementStrategy(element.Element);
    if (strategy) {
      await strategy.validate(element);
    } else {
      console.warn(`Unknown header element: ${element.Element}`);
    }
  }

  private getHeaderElementStrategy(
    element: string
  ): HeaderElementStrategy | undefined {
    const strategies = new Map([
      ["Logo", { validate: this.validateLogoVisibility.bind(this) }],
      ["Hamburger", { validate: this.validateHamburgerVisibility.bind(this) }],
    ]);
    return strategies.get(element);
  }

  private async validateLogoVisibility(_element: Element): Promise<void> {
    const isLogoVisible =
      await this.humanSpaceflightPage.header.isLogoVisible();
    expect(isLogoVisible, "Logo should be visible").toBeTruthy();
  }

  private async validateHamburgerVisibility(_element: Element): Promise<void> {
    const isHamburgerVisible =
      await this.humanSpaceflightPage.header.isMobileMenuButtonVisible();
    expect(
      isHamburgerVisible,
      "Hamburger button should be visible"
    ).toBeTruthy();
  }

  @Then("the SpaceX logo should be visible and clickable")
  async checkSpaceXLogoVisibleAndClickable() {
    const [isLogoVisible, isLogoClickable] = await Promise.all([
      this.humanSpaceflightPage.header.isLogoVisible(),
      this.humanSpaceflightPage.header.isLogoClickable(),
    ]);

    expect(isLogoVisible, "SpaceX logo should be visible").toBeTruthy();
    expect(isLogoClickable, "SpaceX logo should be clickable").toBeTruthy();
  }
}
