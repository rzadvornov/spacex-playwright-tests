import { Locator, Page } from "@playwright/test";

export class HeaderPOF {
  private readonly navigation: Locator;
  private readonly menuButton: Locator;
  private readonly mobileMenu: Locator;
  private readonly logoLink: Locator;
  private readonly mobileMenuCloseButton: Locator;
  private initialHeaderHeight: number | null = null;
  private initialLogoSize: number | null = null;

  constructor(page: Page) {
    this.navigation = page.getByRole("navigation").first();
    this.menuButton = page
      .getByRole("button", { name: /menu|toggle/i })
      .first();
    this.mobileMenu = page
      .getByRole("dialog", { name: "Menu" })
      .or(page.locator("nav.black-overlay"))
      .first();
    this.logoLink = page
      .getByRole("banner")
      .getByRole("link", { name: /spacex/i })
      .first();
    this.mobileMenuCloseButton = page
      .getByRole("button", { name: /close menu|close navigation/i })
      .first();
  }

  async isHeaderVisible(): Promise<boolean> {
    return this.isNavigationVisible(); 
  }

  async isLogoVisible(): Promise<boolean> {
    try {
      await this.logoLink.waitFor({ state: "visible", timeout: 5000 });
      return await this.logoLink.isVisible();
    } catch {
      return false;
    }
  }
  
  async isLogoClickable(): Promise<boolean> {
    return await this.logoLink.isVisible() && await this.logoLink.isEnabled(); 
  }

  async openNavigationMenu() {
    if (await this.menuButton.isVisible()) {
      await this.menuButton.click();
      await this.menuButton.page().waitForTimeout(500);
    }
  }

  async clickMobileMenuButton() {
    await this.menuButton.waitFor({ state: "visible" });
    await this.menuButton.click();
    await this.menuButton.page().waitForTimeout(500);
  }

  async clickMobileMenuCloseButton() {
    await this.mobileMenuCloseButton.click();
    await this.mobileMenuCloseButton.page().waitForTimeout(500);
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

  async isMenuCollapsed(): Promise<boolean> {
    const isButtonVisible = await this.isMobileMenuButtonVisible();
    const isMenuNotExpanded = await this.mobileMenu.isHidden();
    return isButtonVisible && isMenuNotExpanded; 
  }

  async isMobileMenuExpanded(): Promise<boolean> {
    try {
      await this.mobileMenu.waitFor({ state: "visible", timeout: 4000 });
      return await this.mobileMenu.isVisible();
    } catch {
      return false;
    }
  }

  async isNavLinkVisible(linkText: string): Promise<boolean> {
    const link = this.navigation
      .getByRole("link", { name: linkText, exact: true })
      .first();
    return await link.isVisible();
  }

  async checkNavigationLinksExist(links: string[]): Promise<boolean> {
    for (const linkText of links) {
      const link = this.navigation
        .getByRole("link", { name: linkText, exact: true })
        .first();
      const exists = (await link.count()) > 0;

      if (!exists) {
        console.log(`Navigation link "${linkText}" not found`);
        return false;
      }
    }
    return true;
  }

  async clickNavigationLink(linkText: string): Promise<void> {
    const link = this.navigation
      .getByRole("link", { name: linkText, exact: true })
      .first();
    await link.click();
  }

  async clickLogo(): Promise<void> {
    await this.logoLink.click();
  }
  
  async getInitialHeaderHeight(): Promise<number> {
    if (this.initialHeaderHeight === null) {
      await this.navigation.waitFor({ state: 'visible' }); 
      const box = await this.navigation.boundingBox();
      this.initialHeaderHeight = box ? box.height : 0;
    }
    return this.initialHeaderHeight!;
  }

  async getCurrentHeaderHeight(): Promise<number> {
    const box = await this.navigation.boundingBox();
    return box ? box.height : 0;
  }

  async getInitialLogoSize(): Promise<number> {
    if (this.initialLogoSize === null) {
      await this.logoLink.waitFor({ state: 'visible' }); 
      const box = await this.logoLink.boundingBox();
      this.initialLogoSize = box ? box.width : 0;
    }
    return this.initialLogoSize!;
  }

  async getCurrentLogoSize(): Promise<number> {
    const box = await this.logoLink.boundingBox();
    return box ? box.width : 0;
  }
}