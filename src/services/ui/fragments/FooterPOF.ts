import { Locator, Page } from "@playwright/test";
import { BoundingBox } from "../../../utils/types/Types";

export class FooterPOF {
  readonly footer: Locator;
  readonly footerLinksSection: Locator;
  readonly socialMediaSection: Locator;
  readonly twitterButton: Locator;
  readonly twitterIcon: Locator;
  readonly copyrightText: Locator;

  private hoveredElement: Locator | null = null;

  constructor(page: Page) {
    this.footer = page
      .getByRole("contentinfo")
      .or(page.locator("footer"))
      .first();
    this.footerLinksSection = this.footer
      .getByRole("navigation")
      .or(this.footer.locator(".footer-links"))
      .first();
    this.socialMediaSection = this.footer
      .locator(".social-media-links, .social-links")
      .first();
    this.twitterButton = this.socialMediaSection
      .getByRole("link", { name: /twitter|x/i })
      .first();
    this.twitterIcon = this.twitterButton.locator("svg, img").first();
    this.copyrightText = this.footer
      .locator(".copyright-text, .copyright")
      .first();
  }

  private async waitForHoverTransition(): Promise<void> {
    await this.footer.page().waitForTimeout(100);
  }

  private async getStyleValue(
    element: Locator,
    property: string
  ): Promise<string> {
    return await element.evaluate(
      (el: Element, prop) => {
        return window.getComputedStyle(el)[prop as any]; 
      },
      property
    );
  }

  private async getNumericStyleValue(
    element: Locator,
    property: string
  ): Promise<number> {
    const value = await this.getStyleValue(element, property);
    return parseFloat(value) || 0;
  }

  private async getBoundingBox(element: Locator): Promise<BoundingBox | null> {
    return await element.boundingBox();
  }

  private getFooterLink(linkText: string): Locator {
    return this.footer
      .getByRole("link", { name: linkText, exact: true })
      .first();
  }
  
  async scrollToFooter(): Promise<void> {
    await this.footer.scrollIntoViewIfNeeded();
    await this.footer.waitFor({ state: "visible" });
  }

  async clickFooterLink(linkText: string): Promise<void> {
    const link = this.getFooterLink(linkText);
    await link.click();
  }

  async clickTwitterButton(): Promise<void> {
    await this.twitterButton.click();
  }

  async hoverOverFooterLink(linkText: string): Promise<void> {
    this.hoveredElement = this.getFooterLink(linkText);
    await this.hoveredElement.hover();
    await this.waitForHoverTransition();
  }

  async unhoverFooterLink(): Promise<void> {
    if (this.hoveredElement) {
      await this.footer.hover({ position: { x: 0, y: 0 } });
      this.hoveredElement = null;
    }
    await this.waitForHoverTransition();
  }

  async hoverOverTwitterButton(): Promise<void> {
    await this.twitterButton.hover();
    this.hoveredElement = this.twitterButton;
    await this.waitForHoverTransition();
  }

  async unhoverTwitterButton(): Promise<void> {
    await this.footer.hover();
    this.hoveredElement = null;
    await this.waitForHoverTransition();
  }

  async checkFooterLinksExist(links: string[]): Promise<boolean> {
    if (links.length === 0) {
      return true;
    }
    
    const visibilityChecks = links.map((linkText) =>
      this.getFooterLink(linkText).isVisible()
    );

    return (await Promise.all(visibilityChecks)).every((v) => v);
  }

  async isSocialMediaSectionVisible(): Promise<boolean> {
    return await this.socialMediaSection.isVisible();
  }

  async isTwitterButtonVisible(): Promise<boolean> {
    return await this.twitterButton.isVisible();
  }

  async getCopyrightText(): Promise<string> {
    const text = await this.copyrightText.textContent();
    return text?.trim() ?? "";
  }

  async isTwitterButtonClickable(): Promise<boolean> {
    return await this.twitterButton.isEnabled();
  }

  async isTwitterButtonRounded(): Promise<boolean> {
    const borderRadius = await this.getStyleValue(
      this.twitterButton,
      "borderRadius"
    );

    const borderRadiusValue = parseFloat(borderRadius) || 0;
    return borderRadius.includes("50%") || borderRadiusValue > 10;
  }

  async isTwitterIconVisible(): Promise<boolean> {
    return await this.twitterIcon.isVisible();
  }

  async hasTwitterButtonConsistentStyle(): Promise<boolean> {
    const [buttonBg, iconColor] = await Promise.all([
      this.getStyleValue(this.twitterButton, "backgroundColor"),
      this.getStyleValue(this.twitterIcon, "color"),
    ]);

    const hasBackground = buttonBg !== "rgba(0, 0, 0, 0)";
    const hasIconColor = iconColor !== "rgba(0, 0, 0, 0)";

    return hasBackground && hasIconColor;
  }

  async isCopyrightTextOnRight(): Promise<boolean> {
    const [socialBox, copyrightBox] = await Promise.all([
      this.getBoundingBox(this.socialMediaSection),
      this.getBoundingBox(this.copyrightText),
    ]);

    if (!socialBox || !copyrightBox) {
      return false;
    }

    return copyrightBox.x > socialBox.x;
  }

  async hasProperHorizontalSpacing(): Promise<boolean> {
    const [gap, paddingLeft] = await Promise.all([
      this.getNumericStyleValue(this.footer, "gap"),
      this.getNumericStyleValue(this.footer, "paddingLeft"),
    ]);

    return gap > 20 || paddingLeft > 20;
  }

  async hasProperVerticalPadding(): Promise<boolean> {
    const paddingTop = await this.getNumericStyleValue(
        this.footer,
        "paddingTop"
    );

    return paddingTop > 15;
  }

  async isFooterNotCramped(): Promise<boolean> {
    const boundingBox = await this.getBoundingBox(this.footer);
    return !!(boundingBox && boundingBox.height > 60);
  }

  async hasFooterLinkHoverEffect(): Promise<boolean> {
    const element = this.hoveredElement;
    if (!element) return false;
    
    await this.unhoverFooterLink();
    const defaultColor = await this.getStyleValue(element, "color");

    await element.hover();
    await this.waitForHoverTransition();
    const hoverColor = await this.getStyleValue(element, "color");

    await this.unhoverFooterLink();
    
    return defaultColor !== hoverColor;
  }

  async isFooterLinkCursorPointer(): Promise<boolean> {
    if (!this.hoveredElement) {
      return false;
    }

    const cursor = await this.getStyleValue(this.hoveredElement, "cursor");

    return cursor === "pointer";
  }

  async getFooterLinkCount(): Promise<number> {
    return await this.footerLinksSection.getByRole("link").count();
  }

  async getSocialMediaLinksCount(): Promise<number> {
    return await this.socialMediaSection.getByRole("link").count();
  }

  async isFooterSticky(): Promise<boolean> {
    const position = await this.getStyleValue(this.footer, "position");

    return position === "fixed" || position === "sticky";
  }

  async getFooterBackgroundColor(): Promise<string> {
    return await this.getStyleValue(this.footer, "backgroundColor");
  }

  async areFooterLinksAccessible(): Promise<boolean> {
    const links = await this.footerLinksSection.getByRole("link").all();
    
    if (links.length === 0) return false;

    const checks = links.map(async (link) => {
      const [isVisible, isEnabled, textContent] = await Promise.all([
        link.isVisible(),
        link.isEnabled(),
        link.textContent(),
      ]);
      const hasText = !!textContent?.trim();

      return isVisible && isEnabled && hasText;
    });

    return (await Promise.all(checks)).every((result) => result);
  }
}