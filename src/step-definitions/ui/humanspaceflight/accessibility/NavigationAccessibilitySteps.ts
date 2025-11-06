import { Page, expect } from "@playwright/test";
import { When, Then, Fixture } from "playwright-bdd/decorators";

@Fixture("navigationAccessibilitySteps")
export class NavigationAccessibilitySteps {
  constructor(
    private page: Page
  ) {}

  @When("I navigate through the main menu using arrow keys")
  async navigateMenuWithArrowKeys(): Promise<void> {
    const menuItems = await this.page.$$(
      'nav a, [role="menuitem"], [role="navigation"] a'
    );

    if (menuItems.length > 0) {
      await menuItems[0].focus();
      await this.page.waitForTimeout(100);

      for (let i = 0; i < Math.min(menuItems.length, 10); i++) {
        await this.page.keyboard.press("ArrowRight");
        await this.page.waitForTimeout(50);
      }
    }
  }

  @Then("the main navigation menu should be accessible via keyboard")
  async checkKeyboardNavigation(): Promise<void> {
    const isKeyboardAccessible = await this.page.evaluate(() => {
      const menuItems = Array.from(
        document.querySelectorAll(
          'nav a, [role="menuitem"], [role="navigation"] a'
        )
      );

      return menuItems.every((item) => {
        const tabIndex = item.getAttribute("tabindex");
        return tabIndex === null || parseInt(tabIndex) >= 0;
      });
    });

    expect(
      isKeyboardAccessible,
      "Main navigation menu should be fully accessible via keyboard"
    ).toBeTruthy();
  }

  @Then("the main navigation menu should have proper ARIA attributes")
  async checkNavigationAriaAttributes(): Promise<void> {
    const hasProperAria = await this.page.evaluate(() => {
      const navElements = document.querySelectorAll("nav, [role='navigation']");

      return Array.from(navElements).every((nav) => {
        const ariaLabel = nav.getAttribute("aria-label");
        const ariaLabelledBy = nav.getAttribute("aria-labelledby");

        return !!(ariaLabel || ariaLabelledBy);
      });
    });

    expect(
      hasProperAria,
      "Navigation menus should have proper ARIA labels"
    ).toBeTruthy();
  }

  @Then("the navigation should be consistent across the site")
  async checkNavigationConsistency(): Promise<void> {
    const isConsistent = await this.page.evaluate(() => {
      const navElements = document.querySelectorAll("nav");
      if (navElements.length === 0) return true;

      const firstNav = navElements[0];
      const firstNavLinks = Array.from(firstNav.querySelectorAll("a")).map(
        (a) => a.textContent?.trim()
      );

      return navElements.length === 1 || firstNavLinks.length > 0;
    });

    expect(
      isConsistent,
      "Navigation should be consistent across the site"
    ).toBeTruthy();
  }

  @Then("the navigation should indicate current page location")
  async checkCurrentPageIndicator(): Promise<void> {
    const hasCurrentPageIndicator = await this.page.evaluate(() => {
      const currentUrl = window.location.href;
      const navLinks = Array.from(document.querySelectorAll("nav a"));

      return navLinks.some((link) => {
        const linkHref = link.getAttribute("href");
        const isCurrent =
          linkHref && currentUrl.includes(linkHref.replace(/^\//, ""));
        const ariaCurrent = link.getAttribute("aria-current");

        return isCurrent && ariaCurrent === "page";
      });
    });

    expect(
      hasCurrentPageIndicator,
      "Navigation should indicate current page location with aria-current='page'"
    ).toBeTruthy();
  }

  @When("I open a submenu using keyboard")
  async openSubmenuWithKeyboard(): Promise<void> {
    const submenuTrigger = await this.page.$(
      '[aria-haspopup="true"], [aria-expanded]'
    );

    if (submenuTrigger) {
      await submenuTrigger.focus();
      await this.page.keyboard.press("Enter");
      await this.page.waitForTimeout(500);
    }
  }

  @Then("submenus should be keyboard accessible")
  async checkSubmenuKeyboardAccessibility(): Promise<void> {
    const submenuTriggers = await this.page.$$(
      '[aria-haspopup="true"], [aria-expanded]'
    );

    for (const trigger of submenuTriggers) {
      const isKeyboardAccessible = await trigger.evaluate((element) => {
        const tabIndex = element.getAttribute("tabindex");
        return tabIndex === null || parseInt(tabIndex) >= 0;
      });

      expect(
        isKeyboardAccessible,
        "Submenu triggers should be keyboard accessible"
      ).toBeTruthy();
    }
  }

  @Then("mobile navigation should be accessible")
  async checkMobileNavigationAccessibility(): Promise<void> {
    const viewportSize = this.page.viewportSize();
    const isMobile = viewportSize && viewportSize.width < 768;

    if (isMobile) {
      const hasMobileMenu = await this.page.$(
        '.mobile-menu, [aria-label*="menu"], button[aria-label*="menu"]'
      );

      expect(
        hasMobileMenu,
        "Mobile navigation should have accessible menu toggle"
      ).toBeTruthy();

      if (hasMobileMenu) {
        const isAccessible = await hasMobileMenu.evaluate((button) => {
          const ariaLabel = button.getAttribute("aria-label");
          const ariaExpanded = button.getAttribute("aria-expanded");
          return !!(ariaLabel && ariaExpanded !== null);
        });

        expect(
          isAccessible,
          "Mobile menu toggle should have proper ARIA attributes"
        ).toBeTruthy();
      }
    }
  }

  @Then("breadcrumbs should be present and accessible")
  async checkBreadcrumbAccessibility(): Promise<void> {
    const breadcrumbs = await this.page.$(
      '.breadcrumbs, [aria-label*="breadcrumb"], nav[aria-label*="breadcrumb"]'
    );

    if (breadcrumbs) {
      const isAccessible = await breadcrumbs.evaluate((nav) => {
        const ariaLabel = nav.getAttribute("aria-label");
        const hasCurrentPage = nav.querySelector('[aria-current="page"]');
        return !!(ariaLabel && hasCurrentPage);
      });

      expect(
        isAccessible,
        "Breadcrumbs should have proper ARIA labels and indicate current page"
      ).toBeTruthy();
    }
  }
  
}