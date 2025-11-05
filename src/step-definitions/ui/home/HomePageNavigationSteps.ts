import { expect, Page } from "@playwright/test";
import { Then, When, Fixture } from "playwright-bdd/decorators";
import { DataTable } from "playwright-bdd";
import { HomePage } from "../../../pages/ui/HomePage";
import { parseNavigationLinks } from "../../../utils/types/TypeGuards";
import { NavigationLink, RedirectionTable } from "../../../utils/types/Types";

@Fixture("homePageNavigationSteps")
export class HomePageNavigationSteps {
  constructor(private page: Page, private homePage: HomePage) {}

  @Then("the navigation menu should contain:")
  async checkNavigationMenu(dataTable: DataTable): Promise<void> {
    const links = parseNavigationLinks(dataTable.hashes());
    await this.validateNavigationLinks(links);
  }

  private async validateNavigationLinks(
    links: NavigationLink[]
  ): Promise<void> {
    for (const link of links) {
      await this.validateNavigationLink(link);
    }
  }

  private async validateNavigationLink(link: NavigationLink): Promise<void> {
    const isPrimaryLinkVisible = await this.homePage.header.isNavLinkVisible(
      link["Primary Links"]
    );
    expect(
      isPrimaryLinkVisible,
      `Primary link "${link["Primary Links"]}" should be visible`
    ).toBeTruthy();

    if (link["Secondary Elements"] === "SpaceX Logo") {
      await this.validateSpaceXLogoVisibility();
    }
  }

  private async validateSpaceXLogoVisibility(): Promise<void> {
    const isLogoVisible = await this.homePage.header.isLogoVisible();
    expect(isLogoVisible, "SpaceX Logo should be visible").toBeTruthy();
  }

  @Then("the SpaceX logo should be present and clickable")
  async checkLogoPresentAndClickable(): Promise<void> {
    const [isLogoVisible, isLogoClickable] = await Promise.all([
      this.homePage.header.isLogoVisible(),
      this.homePage.header.isLogoClickable(),
    ]);

    expect(isLogoVisible, "SpaceX logo should be present").toBeTruthy();
    expect(isLogoClickable, "SpaceX logo should be clickable").toBeTruthy();
  }

  @Then("the header should minimize in height")
  async checkHeaderMinimize(): Promise<void> {
    const [initialHeight, currentHeight] = await Promise.all([
      this.homePage.header.getInitialHeaderHeight(),
      this.homePage.header.getCurrentHeaderHeight(),
    ]);

    expect(
      currentHeight,
      "Header height should be smaller after scroll"
    ).toBeLessThan(initialHeight);
  }

  @Then("and the logo size should adjust")
  async checkLogoSizeAdjust(): Promise<void> {
    const [initialSize, currentSize] = await Promise.all([
      this.homePage.header.getInitialLogoSize(),
      this.homePage.header.getCurrentLogoSize(),
    ]);

    expect(
      currentSize,
      "Logo size should be smaller after scroll"
    ).toBeLessThan(initialSize);
  }

  @When("I click on the {string} navigation item")
  async clickNavigationItem(itemName: string): Promise<void> {
    await this.homePage.clickNavigationItem(itemName);
  }

  @Then("I should be redirected to the corresponding page:")
  async checkRedirectionToCorrespondingPage(
    dataTable: DataTable
  ): Promise<void> {
    const links = dataTable.hashes() as RedirectionTable;
    const expectedPath = links[0]["Expected Path"];
    await this.validateRedirection(expectedPath);
  }

  private async validateRedirection(expectedPath: string): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(expectedPath));
  }
}
