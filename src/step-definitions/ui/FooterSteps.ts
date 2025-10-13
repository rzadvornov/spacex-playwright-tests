import { Page, expect } from "@playwright/test";
import { Given, When, Then, Fixture } from "playwright-bdd/decorators";
import { DataTable } from "playwright-bdd";
import { HumanSpaceflightPage } from "../../pages/ui/HumanSpaceflightPage";
import { CustomTestArgs } from "../../fixtures/BddFixtures";
import {
  parseLayoutRequirements,
  parseSpacingRequirements,
  parseStyleRequirements,
} from "../../pages/types/TypeGuards";
import {
  BoundingBox,
  LayoutRequirement,
  SpacingRequirement,
  StyleRequirement,
} from "../../pages/types/Types";

@Fixture("footerSteps")
export class FooterSteps {
  private readonly HOVER_TRANSITION_DELAY = 200;
  private readonly CURRENT_YEAR = new Date().getFullYear().toString();

  constructor(
    private page: Page,
    private humanSpaceflightPage: HumanSpaceflightPage,
    private sharedContext: CustomTestArgs["sharedContext"]
  ) {}

  @Given("I view the footer")
  async viewFooter() {
    await this.humanSpaceflightPage.footer.scrollToFooter();
    await this.page.waitForLoadState("domcontentloaded");
  }

  @Then("I should see the following footer links:")
  async checkFooterLinks(dataTable: DataTable) {
    const expectedLinks = dataTable.raw().slice(1).flat();
    const allLinksExist =
      await this.humanSpaceflightPage.footer.checkFooterLinksExist(
        expectedLinks
      );
    expect(allLinksExist, "All specified footer links should be present").toBe(
      true
    );
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
    const normalizedLinkText = linkText.toLowerCase();

    if (normalizedLinkText === "twitter/x") {
      await this.handleTwitterLinkClick();
    } else {
      await this.handleInternalLinkClick(linkText);
    }
  }

  private async handleTwitterLinkClick(): Promise<void> {
    this.sharedContext.newTabPromise = this.page.context().waitForEvent("page");
    await this.humanSpaceflightPage.footer.clickTwitterButton();
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

  @Then("I should see a social media section with Twitter/X button")
  async checkSocialMediaWithTwitter() {
    const [isSectionVisible, isTwitterVisible] = await Promise.all([
      this.humanSpaceflightPage.footer.isSocialMediaSectionVisible(),
      this.humanSpaceflightPage.footer.isTwitterButtonVisible(),
    ]);

    expect(isSectionVisible, "Social media section should be visible").toBe(
      true
    );
    expect(isTwitterVisible, "Twitter/X button should be visible").toBe(true);
  }

  @Then("I should be navigated to the appropriate page")
  async checkNavigationToAppropriate() {
    await this.page.waitForLoadState("domcontentloaded");
    const isLoaded = await this.page.evaluate(
      () => document.readyState === "complete"
    );
    expect(isLoaded, "Page should be loaded").toBe(true);
  }

  @Then("the page should load successfully")
  async checkPageLoadSuccess() {
    await this.page.waitForLoadState("load");
    const hasError = await this.checkForPageErrors(this.page);
    expect(hasError, "Page should load without errors").toBe(false);
  }

  @Then("the content should load successfully")
  async checkContentLoadSuccess() {
    const newPage = this.sharedContext.newPage!;
    await newPage.waitForLoadState("load");
    const hasError = await this.checkForPageErrors(newPage);
    expect(hasError, "Content should load without errors").toBe(false);
  }

  private async checkForPageErrors(targetPage: Page): Promise<boolean> {
    return await targetPage.evaluate(() => {
      return (
        document.title.toLowerCase().includes("error") ||
        document.body.textContent?.toLowerCase().includes("404")
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
    switch (req.Element) {
      case "Social Media":
        const socialMediaVisible =
          await this.humanSpaceflightPage.footer.isSocialMediaSectionVisible();
        expect(
          socialMediaVisible,
          "Social media section should be visible"
        ).toBe(true);
        break;

      case "Navigation Links":
        const linksExist =
          await this.humanSpaceflightPage.footer.checkFooterLinksExist([
            "Careers",
            "Updates",
            "Suppliers",
          ]);
        expect(linksExist, "Navigation links should exist").toBe(true);
        break;

      case "Copyright Text":
        const copyrightText =
          await this.humanSpaceflightPage.footer.getCopyrightText();
        expect(copyrightText, "Copyright text should be present").toBeTruthy();
        expect(
          copyrightText.length,
          "Copyright text should not be empty"
        ).toBeGreaterThan(0);
        break;

      default:
        console.warn(`Unknown layout element: ${req.Element}`);
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
    switch (req["Spacing Type"]) {
      case "Horizontal":
        const [socialVisible, linksExist] = await Promise.all([
          this.humanSpaceflightPage.footer.isSocialMediaSectionVisible(),
          this.humanSpaceflightPage.footer.checkFooterLinksExist(["Careers"]),
        ]);
        expect(
          socialVisible && linksExist,
          "Footer elements should have proper horizontal layout"
        ).toBe(true);
        break;

      case "Vertical":
        const elementsExist =
          await this.humanSpaceflightPage.footer.checkFooterLinksExist([
            "Careers",
            "Updates",
          ]);
        expect(elementsExist, "Footer should have proper vertical layout").toBe(
          true
        );
        break;

      case "Overall":
        const isNotCramped =
          await this.humanSpaceflightPage.footer.isFooterNotCramped();
        expect(isNotCramped, "Layout should not appear cramped").toBe(true);
        break;

      default:
        console.warn(`Unknown spacing type: ${req["Spacing Type"]}`);
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
    expect(hasEffect, "Element should show hover effect").toBe(true);
  }

  @Then("the cursor should change to pointer")
  async checkCursorPointer() {
    const isPointer =
      await this.humanSpaceflightPage.footer.isFooterLinkCursorPointer();
    expect(isPointer, "Cursor should change to pointer").toBe(true);
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
    expect(hasEffect, "Hover effect should disappear").toBe(false);
  }

  @Then("the Twitter/X social media button should have:")
  async checkTwitterButtonStyles(dataTable: DataTable) {
    const styleRequirements = parseStyleRequirements(dataTable.hashes());

    for (const req of styleRequirements) {
      await this.validateTwitterButtonStyle(req);
    }
  }

  private async validateTwitterButtonStyle(
    req: StyleRequirement
  ): Promise<void> {
    switch (req["Style Element"]) {
      case "Background":
        const isRounded =
          await this.humanSpaceflightPage.footer.isTwitterButtonRounded();
        expect(isRounded, "Twitter/X button should have rounded shape").toBe(
          true
        );
        break;

      case "Icon":
        const isIconVisible =
          await this.humanSpaceflightPage.footer.isTwitterIconVisible();
        expect(
          isIconVisible,
          "Twitter/X icon should be visible and centered"
        ).toBe(true);
        break;

      case "Design":
        const hasConsistentStyle =
          await this.humanSpaceflightPage.footer.hasTwitterButtonConsistentStyle();
        expect(hasConsistentStyle, "Button should have consistent design").toBe(
          true
        );
        break;

      default:
        console.warn(`Unknown style element: ${req["Style Element"]}`);
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
    expect(hasEffect, `${linkText} should have consistent hover effect`).toBe(
      true
    );
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
    const viewportSizes: BoundingBox[] = [
      { x: 0, y: 0, width: 375, height: 667 }, // Mobile
      { x: 0, y: 0, width: 768, height: 1024 }, // Tablet
      { x: 0, y: 0, width: 1920, height: 1080 }, // Desktop
    ];

    const originalViewport = this.page.viewportSize();

    try {
      for (const size of viewportSizes) {
        await this.page.setViewportSize({
          width: size.width,
          height: size.height,
        });
        await this.page.waitForTimeout(100);

        const [socialVisible, linksExist] = await Promise.all([
          this.humanSpaceflightPage.footer.isSocialMediaSectionVisible(),
          this.humanSpaceflightPage.footer.checkFooterLinksExist(["Careers"]),
        ]);

        expect(
          socialVisible && linksExist,
          `Footer elements should be visible at ${size.width}x${size.height}`
        ).toBe(true);
      }
    } finally {
      if (originalViewport) {
        await this.page.setViewportSize(originalViewport);
      }
    }
  }
}
