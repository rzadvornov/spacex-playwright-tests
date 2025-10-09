import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

export class HomePage extends BasePage {
  private readonly navigation: Locator;
  private readonly menuButton: Locator;
  private readonly mobileMenu: Locator;
  private readonly footer: Locator;
  private readonly socialLinks: Locator;

  private consoleErrors: string[] = [];

  constructor(page: Page) {
    super(page);
    this.navigation = page.locator("nav").first();
    this.menuButton = page
      .locator('.header-button, button[aria-label*="menu"]')
      .first();
    this.mobileMenu = page.locator("nav.black-overlay").first();
    this.footer = page.locator("footer").first();
    this.socialLinks = page.locator('a[aria-label*="X"], a[href*="x.com"]');
  }

  async open() {
    this.consoleErrors = [];

    this.page.on("console", (msg) => {
      if (
        msg.type() === "error" &&
        !msg.text().includes("ERR_NETWORK_CHANGED")
      ) {
        this.consoleErrors.push(msg.text());
        console.error(`Console Error: ${msg.text()}`);
      }
    });

    this.page.on("pageerror", (error) => {
      this.consoleErrors.push(error.message);
      console.error(`Page Error: ${error.message}`);
    });

    await this.goto(this.baseURL, { waitUntil: "domcontentloaded" });
  }

  async openWithMobileViewport(width: number = 375, height: number = 812) {
    await this.page.setViewportSize({ width, height });
    await this.open();
  }

  getConsoleErrors(): string[] {
    return this.consoleErrors;
  }

  async openNavigationMenu() {
    if (await this.menuButton.isVisible()) {
      await this.menuButton.click();
      await this.page.waitForTimeout(500);
    }
  }

  async clickMobileMenuButton() {
    await this.menuButton.waitFor({ state: "visible" });
    await this.menuButton.click();
    await this.page.waitForTimeout(500);
  }

  async isNavigationVisible(): Promise<boolean> {
    try {
      await this.navigation.waitFor({ state: "visible", timeout: 10000 });
      return true;
    } catch {
      return false;
    }
  }

  async isMobileMenuButtonVisible(): Promise<boolean> {
    try {
      await this.menuButton.waitFor({ state: "visible", timeout: 10000 });
      return await this.menuButton.isVisible();
    } catch {
      return false;
    }
  }

  async areMainNavigationLinksHidden(): Promise<boolean> {
    const navLinks = this.page.locator(".nav-links").first();
    try {
      const isVisible = await navLinks.isVisible();
      return !isVisible;
    } catch {
      return true; // If element not found, consider it hidden
    }
  }

  async areMobileNavigationLinksDisplayed(): Promise<boolean> {
    const navLinks = this.page.locator(".nav-links").first();
    console.log("Navlinks" + await navLinks.innerHTML());
    try {
      await navLinks.waitFor({ state: "visible", timeout: 4000 });
      return await navLinks.isVisible();
    } catch {
      return false;
    }
  }

  async checkNavigationLinksExist(links: string[]): Promise<boolean> {
    for (const linkText of links) {
      const link = this.page
        .locator(`nav a, nav span`)
        .filter({ hasText: linkText })
        .first();
      const exists = (await link.count()) > 0;

      if (!exists) {
        console.log(`Navigation link "${linkText}" not found`);
        return false;
      }
    }
    return true;
  }

  async checkMenuItemsExist(items: string[]): Promise<boolean> {
    for (const item of items) {
      const menuItem = this.page.getByText(item, { exact: false }).first();
      const isVisible = await menuItem.isVisible().catch(() => false);
      const exists = isVisible || (await menuItem.count()) > 0;

      if (!exists) {
        console.log(`Menu item "${item}" not found`);
        return false;
      }
    }
    return true;
  }

  async testNavigationLinks(): Promise<boolean> {
    const links = await this.page.locator("nav a[href]").all();

    if (links.length === 0) {
      console.log("No navigation links found.");
      return false;
    }

    const originalUrl = this.page.url();
    let allLinksPassed = true;

    for (const link of links) {
      const href = await link.getAttribute("href");

      if (!href || href === "#") {
        console.log(`Skipping link with href: ${href}`);
        continue;
      }

      console.log(`Testing link with href: ${href}`);

      try {
        await link.click();
        await this.page.waitForLoadState("domcontentloaded");
      } catch (error) {
        console.error(
          `Navigation test failed for link with href ${href}: ${error}`
        );
        allLinksPassed = false;
      } finally {
        try {
          await this.page.goto(originalUrl, { waitUntil: "domcontentloaded" });
        } catch (e) {
          console.error(
            `Failed to navigate back to original URL ${originalUrl}. Stopping tests.`
          );
          return false;
        }
      }
    }

    return allLinksPassed;
  }

  async isViewportMetaConfigured(): Promise<boolean> {
    const viewportMeta = this.page.locator('meta[name="viewport"]');
    const content = await viewportMeta.getAttribute("content");

    return !!(content && content.includes("width=device-width"));
  }

  async getMetaDescription(): Promise<string> {
    const descriptionMeta = this.page.locator('meta[name="description"]');
    return (await descriptionMeta.getAttribute("content")) || "";
  }

  async getOGTitle(): Promise<string> {
    const ogTitleMeta = this.page.locator('meta[property="og:title"]');
    return (await ogTitleMeta.getAttribute("content")) || "";
  }

  async checkOGImageLoads(): Promise<boolean> {
    const ogImageMeta = this.page.locator('meta[property="og:image"]');
    const imageUrl = await ogImageMeta.getAttribute("content");
    if (!imageUrl) return false;

    try {
      const response = await this.page.request.get(imageUrl);
      return (
        response.ok() && response.headers()["content-type"]?.includes("image")
      );
    } catch (error) {
      console.error(`OG image check failed: ${error}`);
      return false;
    }
  }

  async isFooterTextVisible(text: string): Promise<boolean> {
    const footerText = this.footer.getByText(text, { exact: true });
    try {
      await footerText.scrollIntoViewIfNeeded();
      return await footerText.isVisible();
    } catch {
      return false;
    }
  }

  async areSocialLinksPresent(): Promise<boolean> {
    await this.footer.scrollIntoViewIfNeeded();
    const socialLinkCount = await this.socialLinks.count();

    if (socialLinkCount === 0) return false;

    // Check if at least one social link has a valid href
    const firstLink = this.socialLinks.first();
    const href = await firstLink.getAttribute("href");

    return !!(href && href.length > 0);
  }

  async isFooterSectionVisible(sectionName: string): Promise<boolean> {
    await this.footer.scrollIntoViewIfNeeded();

    const section = this.footer
      .locator(
        `.${sectionName.toLowerCase()}, [class*="${sectionName.toLowerCase()}"]`
      )
      .first();

    try {
      return await section.isVisible();
    } catch {
      return false;
    }
  }

  async isMobileFriendly(): Promise<boolean> {
    const viewport = this.page.viewportSize();
    if (!viewport || viewport.width > 768) {
      return false;
    }

    const body = await this.page.locator("body").boundingBox();
    return !!(body && body.width <= viewport.width);
  }
}
