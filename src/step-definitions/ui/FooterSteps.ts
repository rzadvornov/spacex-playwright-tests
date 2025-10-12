import { Page, expect } from "@playwright/test";
import { Given, When, Then, Fixture } from "playwright-bdd/decorators";
import { DataTable } from "playwright-bdd";
import { HumanSpaceflightPage } from "../../pages/ui/HumanSpaceflightPage";
import { CustomTestArgs } from "../../fixtures/BddFixtures";

@Fixture("footerSteps")
export class FooterSteps {
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
    const currentYear = new Date().getFullYear().toString();
    const expectedTextPart = `@${currentYear} SpaceX`;
    const actualText =
      await this.humanSpaceflightPage.footer.getCopyrightText();
    expect(actualText).toContain(expectedTextPart);
  }

  @When("I click the {string} link")
  async clickFooterLink(linkText: string) {
    if (linkText.toLowerCase() === "twitter/x") {
      // Logic to handle external link opening in a new tab
      this.sharedContext.newTabPromise = this.page
        .context()
        .waitForEvent("page");
      await this.humanSpaceflightPage.footer.clickTwitterButton();
    } else {
      // Logic for internal link clicks
      await this.humanSpaceflightPage.footer.clickFooterLink(linkText);
      await this.page.waitForLoadState("domcontentloaded");
    }
  }

  @Then("a new tab should open")
  async checkNewTabOpensForSocialMedia() {
    const newPage = await this.sharedContext.newTabPromise!;
    expect(newPage, "A new tab or window should have opened").toBeDefined();
    this.sharedContext.newPage = newPage;
  }

  @Then("I should see a social media section with Twitter/X button")
  async checkSocialMediaWithTwitter() {
    const isSectionVisible =
      await this.humanSpaceflightPage.footer.isSocialMediaSectionVisible();
    expect(isSectionVisible, "Social media section should be visible").toBe(
      true
    );

    const isTwitterVisible =
      await this.humanSpaceflightPage.footer.isTwitterButtonVisible();
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
    const hasError = await this.page.evaluate(() => {
      return (
        document.title.toLowerCase().includes("error") ||
        document.body.textContent?.toLowerCase().includes("404")
      );
    });
    expect(hasError, "Page should load without errors").toBe(false);
  }

  @Then("the content should load successfully")
  async checkContentLoadSuccess() {
    const newPage = this.sharedContext.newPage!;
    await newPage.waitForLoadState("load");
    const hasError = await newPage.evaluate(() => {
      return (
        document.title.toLowerCase().includes("error") ||
        document.body.textContent?.toLowerCase().includes("404")
      );
    });
    expect(hasError, "Content should load without errors").toBe(false);
  }

  @Then("the footer should have the following layout:")
  async checkFooterLayout(dataTable: DataTable) {
    const layoutRequirements = dataTable.hashes();

    for (const req of layoutRequirements) {
      switch (req.Element) {
        case "Social Media":
          const isSocialLeft =
            await this.humanSpaceflightPage.isSocialMediaOnLeft();
          expect(isSocialLeft, "Social media should be on the left").toBe(
            req.Position === "Left"
          );
          break;

        case "Navigation Links":
          const isNavCenter =
            await this.humanSpaceflightPage.isFooterLinksInCenter();
          expect(isNavCenter, "Navigation links should be in the center").toBe(
            req.Position === "Center"
          );
          break;

        case "Copyright Text":
          const isCopyrightRight =
            await this.humanSpaceflightPage.footer.isCopyrightTextOnRight();
          expect(
            isCopyrightRight,
            "Copyright text should be on the right"
          ).toBe(req.Position === "Right");
          break;
      }
    }
  }

  @Then("there should be proper spacing between elements:")
  async checkProperSpacing(dataTable: DataTable) {
    const spacingRequirements = dataTable.hashes();

    for (const req of spacingRequirements) {
      switch (req["Spacing Type"]) {
        case "Horizontal":
          const hasHorizontalSpacing =
            await this.humanSpaceflightPage.footer.hasProperHorizontalSpacing();
          expect(
            hasHorizontalSpacing,
            "Should have proper horizontal spacing"
          ).toBe(true);
          break;

        case "Vertical":
          const hasVerticalPadding =
            await this.humanSpaceflightPage.footer.hasProperVerticalPadding();
          expect(
            hasVerticalPadding,
            "Should have proper vertical padding"
          ).toBe(true);
          break;

        case "Overall":
          const isNotCramped =
            await this.humanSpaceflightPage.footer.isFooterNotCramped();
          expect(isNotCramped, "Layout should not appear cramped").toBe(true);
          break;
      }
    }
  }

  @When("I hover over the {string}")
  async hoverOverElement(element: string) {
    if (element.includes("link")) {
      const linkText = element.replace(" link", "");
      await this.humanSpaceflightPage.footer.hoverOverFooterLink(linkText);
    } else if (element === "Twitter/X icon") {
      // Hover over the button locator as the link hover is only for links
      await this.humanSpaceflightPage.footer.hoverOverTwitterButton();
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
  async moveAwayFromElement(element: string) {
    await this.humanSpaceflightPage.footer.unhoverFooterLink();
  }

  @Then("the hover effect should disappear")
  async checkHoverEffectDisappears() {
    // Wait a moment for transition
    await this.page.waitForTimeout(200);
    const hasEffect =
      await this.humanSpaceflightPage.footer.hasFooterLinkHoverEffect();
    expect(hasEffect, "Hover effect should disappear").toBe(false);
  }

  @Then("the Twitter/X social media button should have:")
  async checkTwitterButtonStyles(dataTable: DataTable) {
    const styleRequirements = dataTable.hashes();

    for (const req of styleRequirements) {
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
          expect(
            hasConsistentStyle,
            "Button should have consistent design"
          ).toBe(true);
          break;
      }
    }
  }

  @Then("all navigation links should have consistent styling")
  async checkConsistentLinkStyling() {
    const dataTable = new DataTable([
      ["Link Text", "Expected URL Pattern"],
      ["Careers", "/careers"],
      ["Updates", "/updates"],
      ["Suppliers", "/supplier"],
    ]);

    const links = dataTable
      .raw()
      .slice(1)
      .map((row) => row[0]);
    for (const link of links) {
      await this.humanSpaceflightPage.footer.hoverOverFooterLink(link);
      const hasEffect =
        await this.humanSpaceflightPage.footer.hasFooterLinkHoverEffect();
      expect(hasEffect, `${link} should have consistent hover effect`).toBe(
        true
      );
      await this.humanSpaceflightPage.footer.unhoverFooterLink();
    }
  }

  @Then("the copyright text should be properly formatted")
  async checkCopyrightFormatting() {
    const text = await this.humanSpaceflightPage.footer.getCopyrightText();
    expect(text).toMatch(/^©?\s*\d{4}\s+SpaceX/); // Checks for proper copyright symbol and year format
  }
}
