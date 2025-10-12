import { Locator, Page } from "@playwright/test";

export class FooterPOF {
  readonly footer: Locator;
  readonly footerLinksSection: Locator;
  readonly socialMediaSection: Locator;
  readonly twitterButton: Locator;
  readonly twitterIcon: Locator;
  readonly copyrightText: Locator;
  private hoveredFooterLink: Locator | null = null;

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

  async scrollToFooter(): Promise<void> {
    await this.footer.scrollIntoViewIfNeeded();
    await this.footer.page().waitForTimeout(1000);
  }

  async checkFooterLinksExist(links: string[]): Promise<boolean> {
    const allLinks: Locator[] = [];
    for (const linkText of links) {
      const link = this.footerLinksSection
        .getByRole("link", { name: linkText, exact: true })
        .first();
      allLinks.push(link);
    }

    for (const link of allLinks) {
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
    return (await this.copyrightText.textContent())?.trim() || "";
  }

  async clickFooterLink(linkText: string): Promise<void> {
    const link = this.footer
      .getByRole("link", { name: linkText, exact: true })
      .first();
    await link.click();
  }

  async clickTwitterButton(): Promise<void> {
    await this.twitterButton.click();
  }

  async hoverOverFooterLink(linkText: string): Promise<void> {
    this.hoveredFooterLink = this.footer
      .getByRole("link", { name: linkText, exact: true })
      .first();
    await this.hoveredFooterLink.hover();
    await this.footer.page().waitForTimeout(200);
  }

  async unhoverFooterLink(): Promise<void> {
    if (this.hoveredFooterLink) {
      await this.footer.hover({ position: { x: 0, y: 0 } });
      this.hoveredFooterLink = null;
    }
    await this.footer.page().waitForTimeout(200);
  }

  async isTwitterButtonClickable(): Promise<boolean> {
    return await this.twitterButton.isEnabled();
  }

  async isTwitterButtonRounded(): Promise<boolean> {
    const borderRadius = await this.twitterButton.evaluate(
      (el) => window.getComputedStyle(el).borderRadius
    );
    return borderRadius.includes("50%") || parseFloat(borderRadius) > 10;
  }

  async isTwitterIconVisible(): Promise<boolean> {
    return await this.twitterIcon.isVisible();
  }

  async hasTwitterButtonConsistentStyle(): Promise<boolean> {
    const bgColor = await this.twitterButton.evaluate(
      (el) => window.getComputedStyle(el).backgroundColor
    );
    const color = await this.twitterIcon.evaluate(
      (el) => window.getComputedStyle(el).color
    );

    return bgColor !== "rgba(0, 0, 0, 0)" && color !== "rgba(0, 0, 0, 0)";
  }

  async isCopyrightTextOnRight(): Promise<boolean> {
    const socialBox = await this.socialMediaSection.boundingBox();
    const copyrightBox = await this.copyrightText.boundingBox();

    return !!(socialBox && copyrightBox && copyrightBox.x > socialBox.x);
  }

  async hasProperHorizontalSpacing(): Promise<boolean> {
    const footerStyle = await this.footer.evaluate(
      (el) =>
        window.getComputedStyle(el).gap ||
        window.getComputedStyle(el).paddingLeft
    );
    return parseFloat(footerStyle) > 20;
  }

  async hasProperVerticalPadding(): Promise<boolean> {
    const padding = await this.footer.evaluate(
      (el) => window.getComputedStyle(el).paddingTop
    );
    return parseFloat(padding) > 15;
  }

  async isFooterNotCramped(): Promise<boolean> {
    const boundingBox = await this.footer.boundingBox();
    return !!(boundingBox && boundingBox.height > 60);
  }

  async hasFooterLinkHoverEffect(): Promise<boolean> {
    if (!this.hoveredFooterLink) return false;
    const colorBefore = await this.hoveredFooterLink.evaluate(
      (el) => window.getComputedStyle(el).color
    );

    await this.hoveredFooterLink.hover();
    const colorAfter = await this.hoveredFooterLink.evaluate(
      (el) => window.getComputedStyle(el).color
    );

    return colorBefore !== colorAfter;
  }

  async isFooterLinkCursorPointer(): Promise<boolean> {
    if (!this.hoveredFooterLink) return false;
    const cursor = await this.hoveredFooterLink.evaluate(
      (el) => window.getComputedStyle(el).cursor
    );
    return cursor === "pointer";
  }

  async hoverOverTwitterButton(): Promise<void> {
    await this.twitterButton.hover();
    this.hoveredFooterLink = this.twitterButton;
  }

  async unhoverTwitterButton(): Promise<void> {
    await this.footer.hover();
    this.hoveredFooterLink = null;
  }
}