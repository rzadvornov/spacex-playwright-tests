import { expect } from "@playwright/test";
import { When, Then, Fixture } from "playwright-bdd/decorators";
import { HumanSpaceflightPage } from "../../../../pages/ui/HumanSpaceflightPage";

@Fixture("responsiveNavigationSteps")
export class ResponsiveNavigationSteps {
  constructor(
    private humanSpaceflightPage: HumanSpaceflightPage,
  ) {}

  @Then("the header navigation should collapse")
  async checkNavigationCollapse() {
    const isCollapsed =
      await this.humanSpaceflightPage.responsiveDesign.isNavigationCollapsed();
    expect(
      isCollapsed,
      "Navigation should be collapsed on mobile"
    ).toBeTruthy();
  }

  @Then("a hamburger menu button should be visible")
  async checkHamburgerVisible() {
    const isVisible =
      await this.humanSpaceflightPage.responsiveDesign.isHamburgerMenuVisible();
    expect(isVisible, "Hamburger menu button should be visible").toBeTruthy();
  }

  @Then("the navigation links should not be displayed in the header")
  async checkNavigationLinksHidden() {
    const linksVisible =
      await this.humanSpaceflightPage.responsiveDesign.areNavigationLinksVisible();
    expect(
      linksVisible,
      "Navigation links should be hidden in header"
    ).toBeFalsy();
  }

  @Then("the hamburger menu should be clickable")
  async checkHamburgerClickable() {
    const button = this.humanSpaceflightPage.responsiveDesign.hamburgerButton;
    expect(
      await button.isEnabled(),
      "Hamburger menu should be clickable"
    ).toBeTruthy();
  }

  @When("I click the hamburger menu button")
  async clickHamburgerMenu() {
    await this.humanSpaceflightPage.responsiveDesign.clickHamburgerMenu();
  }

  @Then("the navigation menu should expand")
  async checkMenuExpanded() {
    const isExpanded =
      await this.humanSpaceflightPage.responsiveDesign.isNavigationMenuExpanded();
    expect(isExpanded, "Navigation menu should be expanded").toBeTruthy();
  }

  @Then("all navigation links should be visible")
  async checkAllLinksVisible() {
    const linksVisible =
      await this.humanSpaceflightPage.responsiveDesign.areNavigationLinksVisible();
    expect(linksVisible, "All navigation links should be visible").toBeTruthy();
  }

  @Then("the menu should overlay the page content")
  async checkMenuOverlay() {
    const menu = this.humanSpaceflightPage.responsiveDesign.navigationMenu;
    const isOverlay = await menu.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return style.position === "fixed" || style.position === "absolute";
    });
    expect(isOverlay, "Menu should overlay the page content").toBeTruthy();
  }

  @When("I click the close button or a navigation link")
  async closeMenu() {
    await this.humanSpaceflightPage.responsiveDesign.closeNavigationMenu();
  }

  @Then("the menu should collapse")
  async checkMenuCollapsed() {
    const isCollapsed =
      await this.humanSpaceflightPage.responsiveDesign.isMenuCollapsed();
    expect(isCollapsed, "Menu should be collapsed").toBeTruthy();
  }
}
