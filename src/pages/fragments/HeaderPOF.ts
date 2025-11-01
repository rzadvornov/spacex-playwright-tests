import { Locator, Page } from "@playwright/test";

export class HeaderPOF {
  readonly navigation: Locator;
  readonly menuButton: Locator;
  readonly mobileMenu: Locator;
  readonly logoLink: Locator;
  readonly mobileMenuCloseButton: Locator;
  
  private cachedHeaderHeight: number | null = null;
  private cachedLogoSize: number | null = null;

  constructor(page: Page) {
    this.navigation = page.getByRole("navigation").first();
    this.menuButton = page.getByRole("button", { name: /menu|toggle/i }).first();
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

  private getPage(): Page {
    return this.navigation.page();
  }

  private async waitForAnimation(): Promise<void> {
    await this.getPage().waitForTimeout(300);
  }

  private async waitForElementVisible(element: Locator, timeout: number = 5000): Promise<boolean> {
    try {
      await element.waitFor({ state: "visible", timeout });
      return true;
    } catch {
      return false;
    }
  }

  private async getElementBoundingBox(element: Locator): Promise<{ width: number; height: number } | null> {
    const box = await element.boundingBox();
    return box ? { width: box.width, height: box.height } : null;
  }

  private getNavigationLink(linkText: string): Locator {
    return this.navigation.getByRole("link", { name: linkText, exact: true }).first();
  }

  async isHeaderVisible(): Promise<boolean> {
    return await this.isNavigationVisible();
  }

  async isLogoVisible(): Promise<boolean> {
    return await this.waitForElementVisible(this.logoLink, 5000);
  }
  
  async isLogoClickable(): Promise<boolean> {
    const [isVisible, isEnabled] = await Promise.all([
      this.logoLink.isVisible(),
      this.logoLink.isEnabled()
    ]);
    return isVisible && isEnabled;
  }

  async openNavigationMenu(): Promise<void> {
    if (await this.menuButton.isVisible()) {
      await this.menuButton.click();
      await this.waitForAnimation();
    }
  }

  async clickMobileMenuButton(): Promise<void> {
    await this.menuButton.waitFor({ state: "visible" });
    await this.menuButton.click();
    await this.waitForAnimation();
  }

  async clickMobileMenuCloseButton(): Promise<void> {
    await this.mobileMenuCloseButton.click();
    await this.waitForAnimation();
  }

  async isNavigationVisible(): Promise<boolean> {
    return await this.waitForElementVisible(this.navigation, 10000);
  }

  async isMobileMenuButtonVisible(): Promise<boolean> {
    return await this.waitForElementVisible(this.menuButton, 10000);
  }

  async isMenuCollapsed(): Promise<boolean> {
    const [isButtonVisible, isMenuHidden] = await Promise.all([
      this.isMobileMenuButtonVisible(),
      this.mobileMenu.isHidden()
    ]);
    
    return isButtonVisible && isMenuHidden;
  }

  async isMobileMenuExpanded(): Promise<boolean> {
    return await this.waitForElementVisible(this.mobileMenu, 4000);
  }

  async isNavLinkVisible(linkText: string): Promise<boolean> {
    const link = this.getNavigationLink(linkText);
    return await link.isVisible();
  }

  async checkNavigationLinksExist(links: string[]): Promise<boolean> {
    for (const linkText of links) {
      const link = this.getNavigationLink(linkText);
      const exists = await link.count().then(count => count > 0);

      if (!exists) {
        return false;
      }
    }
    return true;
  }

  async clickNavigationLink(linkText: string): Promise<void> {
    const link = this.getNavigationLink(linkText);
    await link.click();
  }

  async clickLogo(): Promise<void> {
    await this.logoLink.click();
  }
  
  async getInitialHeaderHeight(): Promise<number> {
    if (this.cachedHeaderHeight === null) {
      await this.navigation.waitFor({ state: 'visible' }); 
      const box = await this.getElementBoundingBox(this.navigation);
      this.cachedHeaderHeight = box ? box.height : 0;
    }
    return this.cachedHeaderHeight;
  }

  async getCurrentHeaderHeight(): Promise<number> {
    const box = await this.getElementBoundingBox(this.navigation);
    return box ? box.height : 0;
  }

  async getInitialLogoSize(): Promise<number> {
    if (this.cachedLogoSize === null) {
      await this.logoLink.waitFor({ state: 'visible' }); 
      const box = await this.getElementBoundingBox(this.logoLink);
      this.cachedLogoSize = box ? box.width : 0;
    }
    return this.cachedLogoSize;
  }

  async getCurrentLogoSize(): Promise<number> {
    const box = await this.getElementBoundingBox(this.logoLink);
    return box ? box.width : 0;
  }

  async getNavigationLinkCount(): Promise<number> {
    return await this.navigation.getByRole("link").count();
  }

  async isMobileMenuAccessible(): Promise<boolean> {
    const [isButtonVisible, isButtonEnabled] = await Promise.all([
      this.menuButton.isVisible(),
      this.menuButton.isEnabled()
    ]);
    
    return isButtonVisible && isButtonEnabled;
  }

  async getMobileMenuState(): Promise<'expanded' | 'collapsed'> {
    const isExpanded = await this.isMobileMenuExpanded();
    return isExpanded ? 'expanded' : 'collapsed';
  }
}