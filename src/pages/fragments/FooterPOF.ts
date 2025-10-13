import { Locator, Page } from "@playwright/test";
import { BoundingBox } from "../types/Types";

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

  private getPage(): Page {
    return this.footer.page();
  }

  private async waitForHoverTransition(): Promise<void> {
    await this.getPage().waitForTimeout(100);
  }

  private async getElementStyles(
    element: Locator
  ): Promise<CSSStyleDeclaration> {
    return await element.evaluate((el: Element) => window.getComputedStyle(el));
  }

  private async getBoundingBox(element: Locator): Promise<BoundingBox | null> {
    return await element.boundingBox();
  }

  private parseStyleValue(value: string): number {
    return parseFloat(value) || 0;
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

  async checkFooterLinksExist(links: string[]): Promise<boolean> {
    if (links.length === 0) {
      return true;
    }

    for (const linkText of links) {
      const link = this.getFooterLink(linkText);
      if (!(await link.isVisible())) {
        return false;
      }
    }

    return true;
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

  async isTwitterButtonClickable(): Promise<boolean> {
    return await this.twitterButton.isEnabled();
  }

  async isTwitterButtonRounded(): Promise<boolean> {
    const borderRadius = await this.twitterButton.evaluate((el: Element) => {
      const style = window.getComputedStyle(el);
      return style.borderRadius;
    });

    const borderRadiusValue = this.parseStyleValue(borderRadius);
    return borderRadius.includes("50%") || borderRadiusValue > 10;
  }

  async isTwitterIconVisible(): Promise<boolean> {
    return await this.twitterIcon.isVisible();
  }

  async hasTwitterButtonConsistentStyle(): Promise<boolean> {
    const [buttonStyle, iconStyle] = await Promise.all([
      this.getElementStyles(this.twitterButton),
      this.getElementStyles(this.twitterIcon),
    ]);

    const hasBackground = buttonStyle.backgroundColor !== "rgba(0, 0, 0, 0)";
    const hasIconColor = iconStyle.color !== "rgba(0, 0, 0, 0)";

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
    const footerStyle = await this.getElementStyles(this.footer);
    const gap = this.parseStyleValue(footerStyle.gap);
    const paddingLeft = this.parseStyleValue(footerStyle.paddingLeft);

    return gap > 20 || paddingLeft > 20;
  }

  async hasProperVerticalPadding(): Promise<boolean> {
    const paddingTop = await this.footer.evaluate((el: Element) => {
      return parseFloat(window.getComputedStyle(el).paddingTop);
    });

    return paddingTop > 15;
  }

  async isFooterNotCramped(): Promise<boolean> {
    const boundingBox = await this.getBoundingBox(this.footer);
    return !!(boundingBox && boundingBox.height > 60);
  }

  async hasFooterLinkHoverEffect(): Promise<boolean> {
    if (!this.hoveredElement) {
      return false;
    }

    const styleBefore = await this.getElementStyles(this.hoveredElement);
    await this.hoveredElement.hover();
    const styleAfter = await this.getElementStyles(this.hoveredElement);

    return styleBefore.color !== styleAfter.color;
  }

  async isFooterLinkCursorPointer(): Promise<boolean> {
    if (!this.hoveredElement) {
      return false;
    }

    const cursor = await this.hoveredElement.evaluate((el: Element) => {
      return window.getComputedStyle(el).cursor;
    });

    return cursor === "pointer";
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

  async getFooterLinkCount(): Promise<number> {
    return await this.footerLinksSection.getByRole("link").count();
  }

  async getSocialMediaLinksCount(): Promise<number> {
    return await this.socialMediaSection.getByRole("link").count();
  }

  async isFooterSticky(): Promise<boolean> {
    const position = await this.footer.evaluate((el: Element) => {
      return window.getComputedStyle(el).position;
    });

    return position === "fixed" || position === "sticky";
  }

  async getFooterBackgroundColor(): Promise<string> {
    return await this.footer.evaluate((el: Element) => {
      return window.getComputedStyle(el).backgroundColor;
    });
  }

  async areFooterLinksAccessible(): Promise<boolean> {
    const links = await this.footerLinksSection.getByRole("link").all();

    for (const link of links) {
      const isVisible = await link.isVisible();
      const isEnabled = await link.isEnabled();
      const hasText = !!(await link.textContent())?.trim();

      if (!isVisible || !isEnabled || !hasText) {
        return false;
      }
    }

    return links.length > 0;
  }
}
