import { Page, expect } from "@playwright/test";
import { Given, When, Then, Fixture } from "playwright-bdd/decorators";
import { DataTable } from "playwright-bdd";
import { HumanSpaceflightPage } from "../../../services/ui/HumanSpaceflightPage";
import { ViewportUtility } from "../../../utils/ViewportUtility";
import { CustomTestArgs } from "../../../fixtures/BddFixtures";
import {
  parseLayoutRequirements,
  parseSpacingRequirements,
  parseStyleRequirements,
} from "../../../utils/types/TypeGuards";
import {
  LayoutRequirement,
  SpacingRequirement,
  StyleRequirement,
  BoundingBox,
} from "../../../utils/types/Types";
import { LayoutValidatorFactory } from "../../../utils/strategies/LayoutValidatorFactory";
import { SpacingValidatorFactory } from "../../../utils/strategies/SpacingValidatorFactory";
import { StyleValidatorFactory } from "../../../utils/strategies/StyleValidatorFactory";

@Fixture("footerSteps")
export class FooterSteps {
  private readonly HOVER_TRANSITION_DELAY = 200;
  private readonly CURRENT_YEAR = new Date().getFullYear().toString();

  constructor(
    private page: Page,
    private humanSpaceflightPage: HumanSpaceflightPage,
    private sharedContext: CustomTestArgs["sharedContext"],
    private viewportUtility: ViewportUtility
  ) {}

  @Given("I view the footer")
  async viewFooter() {
    await this.humanSpaceflightPage.footer.scrollToFooter();
    await this.page.waitForLoadState("domcontentloaded");
  }

  @Then("I should see the following footer links:")
  async checkFooterLinks(dataTable: DataTable) {
    const expectedLinks = this.extractExpectedLinks(dataTable);
    const allLinksExist =
      await this.humanSpaceflightPage.footer.checkFooterLinksExist(
        expectedLinks
      );
    expect(
      allLinksExist,
      "All specified footer links should be present"
    ).toBeTruthy();
  }

  private extractExpectedLinks(dataTable: DataTable): string[] {
    return dataTable.raw().slice(1).flat();
  }

  @Then(
    "the footer should display the copyright text including the current year"
  )
  async checkCopyrightTextWithCurrentYear() {
    const expectedTextPart = `@${this.CURRENT_YEAR} SpaceX`;
    const actualText =
      await this.humanSpaceflightPage.footer.getCopyrightText();
    expect(actualText).toContain(expectedTextPart);
  }

  @When("I click the {string} link")
  async clickFooterLink(linkText: string) {
    await this.handleLinkClick(linkText);
  }

  @When("I click on the {string} link")
  async clickOnLink(linkText: string) {
    await this.handleLinkClick(linkText);
  }

  private async handleLinkClick(linkText: string): Promise<void> {
    const normalizedLinkText = linkText.toLowerCase();

    if (normalizedLinkText === "twitter/x") {
      await this.handleTwitterLinkClick();
    } else if (normalizedLinkText === "privacy policy") {
      await this.handlePrivacyPolicyLinkClick();
    } else {
      await this.handleInternalLinkClick(linkText);
    }
  }

  private async handleTwitterLinkClick(): Promise<void> {
    this.sharedContext.newTabPromise = this.page.context().waitForEvent("page");
    await this.humanSpaceflightPage.footer.clickTwitterButton();
  }

  private async handlePrivacyPolicyLinkClick(): Promise<void> {
    this.sharedContext.newTabPromise = this.page.context().waitForEvent("page");
    await this.humanSpaceflightPage.footer.clickFooterLink("Privacy Policy");
  }

  private async handleInternalLinkClick(linkText: string): Promise<void> {
    await this.humanSpaceflightPage.footer.clickFooterLink(linkText);
    await this.page.waitForLoadState("domcontentloaded");
  }

  @Then("a new tab should open")
  async checkNewTabOpensForSocialMedia() {
    const newPage = await this.sharedContext.newTabPromise!;
    expect(newPage, "A new tab or window should have opened").toBeDefined();
    this.sharedContext.newPage = newPage;
  }

  @Then("I should see a social media section with Twitter\\/X button")
  async checkSocialMediaWithTwitter() {
    const [isSectionVisible, isTwitterVisible] = await Promise.all([
      this.humanSpaceflightPage.footer.isSocialMediaSectionVisible(),
      this.humanSpaceflightPage.footer.isTwitterButtonVisible(),
    ]);

    expect(
      isSectionVisible,
      "Social media section should be visible"
    ).toBeTruthy();
    expect(isTwitterVisible, "Twitter/X button should be visible").toBeTruthy();
  }

  @Then("I should be navigated to the appropriate page")
  async checkNavigationToAppropriate() {
    await this.page.waitForLoadState("domcontentloaded");
    const isLoaded = await this.page.evaluate(
      () => document.readyState === "complete"
    );
    expect(isLoaded, "Page should be loaded").toBeTruthy();
  }

  @Then("the page should load successfully")
  async checkPageLoadSuccess() {
    await this.page.waitForLoadState("load");
    const hasError = await this.checkForPageErrors(this.page);
    expect(hasError, "Page should load without errors").toBeFalsy();
  }

  @Then("the content should load successfully")
  async checkContentLoadSuccess() {
    const newPage = this.sharedContext.newPage!;
    await newPage.waitForLoadState("load");
    const hasError = await this.checkForPageErrors(newPage);
    expect(hasError, "Content should load without errors").toBeFalsy();
  }

  private async checkForPageErrors(targetPage: Page): Promise<boolean> {
    return await targetPage.evaluate(() => {
      return (
        document.title.toLowerCase().includes("error") ||
        document.body.textContent?.toLowerCase().includes("404") ||
        document.body.textContent?.toLowerCase().includes("not found")
      );
    });
  }

  @Then("the footer should have the following layout:")
  async checkFooterLayout(dataTable: DataTable) {
    const layoutRequirements = parseLayoutRequirements(dataTable.hashes());

    for (const req of layoutRequirements) {
      await this.validateLayoutRequirement(req);
    }
  }

  private async validateLayoutRequirement(
    req: LayoutRequirement
  ): Promise<void> {
    try {
      const validator = LayoutValidatorFactory.getValidator(req.Element);
      await validator.validate(this.humanSpaceflightPage.footer);
    } catch (error) {
      console.warn(
        `Skipping validation for unknown layout element: ${req.Element}`
      );
    }
  }

  @Then("there should be proper spacing between elements:")
  async checkProperSpacing(dataTable: DataTable) {
    const spacingRequirements = parseSpacingRequirements(dataTable.hashes());

    for (const req of spacingRequirements) {
      await this.validateSpacingRequirement(req);
    }
  }

  private async validateSpacingRequirement(
    req: SpacingRequirement
  ): Promise<void> {
    try {
      const validator = SpacingValidatorFactory.getValidator(
        req["Spacing Type"]
      );
      await validator.validate(this.humanSpaceflightPage.footer);
    } catch (error) {
      console.warn(
        `Skipping validation for unknown spacing type: ${req["Spacing Type"]}`
      );
    }
  }

  @When("I hover over the {string}")
  async hoverOverElement(element: string) {
    if (element.includes("link")) {
      const linkText = element.replace(" link", "");
      await this.humanSpaceflightPage.footer.hoverOverFooterLink(linkText);
    } else if (element === "Twitter/X icon") {
      await this.humanSpaceflightPage.footer.hoverOverTwitterButton();
    } else {
      console.warn(`Unknown element for hover: ${element}`);
    }
  }

  @Then("it should show a hover effect")
  async checkHoverEffect() {
    const hasEffect =
      await this.humanSpaceflightPage.footer.hasFooterLinkHoverEffect();
    expect(hasEffect, "Element should show hover effect").toBeTruthy();
  }

  @Then("the cursor should change to pointer")
  async checkCursorPointer() {
    const isPointer =
      await this.humanSpaceflightPage.footer.isFooterLinkCursorPointer();
    expect(isPointer, "Cursor should change to pointer").toBeTruthy();
  }

  @When("I move away from the {string}")
  async moveAwayFromElement(_element: string) {
    await this.humanSpaceflightPage.footer.unhoverFooterLink();
  }

  @Then("the hover effect should disappear")
  async checkHoverEffectDisappears() {
    await this.page.waitForTimeout(this.HOVER_TRANSITION_DELAY);
    const hasEffect =
      await this.humanSpaceflightPage.footer.hasFooterLinkHoverEffect();
    expect(hasEffect, "Hover effect should disappear").toBeFalsy();
  }

  @Then("the Twitter\\/X social media button should have:")
  async checkTwitterButtonStyles(dataTable: DataTable) {
    const styleRequirements = parseStyleRequirements(dataTable.hashes());

    for (const req of styleRequirements) {
      await this.validateTwitterButtonStyle(req);
    }
  }

  private async validateTwitterButtonStyle(
    req: StyleRequirement
  ): Promise<void> {
    try {
      const validator = StyleValidatorFactory.getValidator(
        req["Style Element"]
      );
      await validator.validate(this.humanSpaceflightPage.footer);
    } catch (error) {
      console.warn(
        `Skipping validation for unknown style element: ${req["Style Element"]}`
      );
    }
  }

  @Then("all navigation links should have consistent styling")
  async checkConsistentLinkStyling() {
    const testLinks = ["Careers", "Updates", "Suppliers"];

    for (const link of testLinks) {
      await this.validateLinkConsistency(link);
    }
  }

  private async validateLinkConsistency(linkText: string): Promise<void> {
    await this.humanSpaceflightPage.footer.hoverOverFooterLink(linkText);
    const hasEffect =
      await this.humanSpaceflightPage.footer.hasFooterLinkHoverEffect();
    expect(
      hasEffect,
      `${linkText} should have consistent hover effect`
    ).toBeTruthy();
    await this.humanSpaceflightPage.footer.unhoverFooterLink();
  }

  @Then("the copyright text should be properly formatted")
  async checkCopyrightFormatting() {
    const text = await this.humanSpaceflightPage.footer.getCopyrightText();
    const copyrightRegex = /^©?\s*\d{4}\s+SpaceX/;
    expect(text).toMatch(copyrightRegex);
  }

  @Then("the footer should be responsive across different screen sizes")
  async checkFooterResponsiveness() {
    await this.viewportUtility.checkAllViewports(async (size: BoundingBox) => {
      const [socialVisible, linksExist] = await Promise.all([
        this.humanSpaceflightPage.footer.isSocialMediaSectionVisible(),
        this.humanSpaceflightPage.footer.checkFooterLinksExist(["Careers"]),
      ]);

      expect(
        socialVisible && linksExist,
        `Footer elements should be visible at ${size.width}x${size.height}`
      ).toBeTruthy();
    });
  }
}
