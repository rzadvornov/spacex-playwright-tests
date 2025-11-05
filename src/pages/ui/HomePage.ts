import { Locator, Page } from "@playwright/test";
import { HeroPOF } from "../fragments/HeroPOF";
import { SpaceXPage } from "../base/SpaceXPage";

export class HomePage extends SpaceXPage {
  readonly hero: HeroPOF;
  public readonly page: Page;

  readonly navLink: (itemName: string) => Locator;
  readonly ctaButton: (buttonText: string) => Locator;
  readonly mobileMenuButton: Locator;
  readonly mobileMenuPanel: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.hero = new HeroPOF(page);

    this.navLink = (itemName: string) =>
      this.page
        .getByRole("navigation")
        .locator('a:has-text("' + itemName + '")')
        .first();

    this.ctaButton = (buttonText: string) =>
      this.page
        .locator(`button:has-text("${buttonText}")`)
        .or(this.page.locator(`a:has-text("${buttonText}")`))
        .first();

    this.mobileMenuButton = this.page
      .getByRole("button", { name: /menu|toggle/i })
      .first();
    this.mobileMenuPanel = this.page
      .getByRole("dialog", { name: "Menu" })
      .or(
        this.page.locator("#mobile-nav, .mobile-menu-panel, nav.black-overlay")
      )
      .first();
  }

  async navigate(urlPath: string = "/"): Promise<void> {
    this.setupErrorListeners();
    await this.open(urlPath);
    await this.waitForAppContentLoad();
  }

  async clickNavigationItem(itemName: string): Promise<void> {
    await this.navLink(itemName).click();
    await this.waitForAppContentLoad(); // Wait for the new page content to load
  }

  async interactWithButton(buttonText: string): Promise<void> {
    await this.ctaButton(buttonText).click();
  }

  async setViewportSize(width: number): Promise<void> {
    await this.page.setViewportSize({ width: width, height: 812 });
  }

  async checkMobileMenuBehavior(command: string): Promise<boolean> {
    switch (command.toLowerCase()) {
      case "is visible":
        return await this.mobileMenuButton.isVisible();
      case "opens navigation on click":
        await this.mobileMenuButton.click();
        const isPanelVisible = await this.mobileMenuPanel.isVisible();
        if (isPanelVisible) await this.mobileMenuButton.click();
        return isPanelVisible;
      case "menu items are accessible":
        return await this.mobileMenuPanel
          .locator('a[href*="falcon9"]')
          .isVisible();
      default:
        throw new Error(`Unknown mobile menu command: ${command}`);
    }
  }

  async getPerformanceMetric(metricName: string): Promise<number | string> {
    switch (metricName.toLowerCase()) {
      case "tti":
        return await this.page.evaluate(() => {
          const navigationEntry = performance.getEntriesByType(
            "navigation"
          )[0] as PerformanceNavigationTiming;
          if (navigationEntry && navigationEntry.domInteractive > 0) {
            return navigationEntry.domInteractive - navigationEntry.fetchStart;
          }
          return -1;
        });
      case "fcp":
        return await this.page.evaluate(() => {
          const fcp = performance.getEntriesByName("first-contentful-paint")[0];
          return fcp ? fcp.startTime : -1;
        });
      case "lcp":
        return await this.page.evaluate(() => {
          const lcp = performance.getEntriesByType(
            "largest-contentful-paint"
          )[0] as PerformanceEntry & { renderTime: number };
          return lcp ? lcp.startTime : -1;
        });
      default:
        throw new Error(`Unknown performance metric: ${metricName}`);
    }
  }

  async getMetaTagContent(
    tagName: string,
    attribute: string = "name"
  ): Promise<string | null> {
    const selector = `meta[${attribute}="${tagName}"]`;
    const metaTag = this.page.locator(selector).first();
    const content = await metaTag.getAttribute("content");
    return content;
  }

  async getPageProperty(
    propertyName: string,
    attribute: string = "property"
  ): Promise<string | null> {
    const selector = `meta[${attribute}="${propertyName}"]`;
    const metaTag = this.page.locator(selector).first();
    const content = await metaTag.getAttribute("content");
    return content;
  }
}
