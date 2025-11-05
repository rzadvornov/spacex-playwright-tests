import { Page, expect } from "@playwright/test";
import { When, Then, Fixture } from "playwright-bdd/decorators";
import { DataTable } from "playwright-bdd";
import { HumanSpaceflightPage } from "../../../../pages/ui/HumanSpaceflightPage";
import { ResponsiveRequirements } from "../../../../utils/types/Types";

@Fixture("responsiveInteractionSteps")
export class ResponsiveInteractionSteps {
  private readonly RESPONSIVE_CONSTANTS = {
    MAX_RESPONSE_TIME: 100,
  } as const;

  constructor(
    private page: Page,
    private humanSpaceflightPage: HumanSpaceflightPage,
  ) {}

  @When("I interact with {string} on {string} with width {string}px")
  async interactWithElement(element: string, device: string, width: string) {
    await this.interactWithElementOnDevice(element, device, parseInt(width));
  }

  @When("I interact with {string} on {string} with width {string}")
  async interactWithElementOnDeviceWithWidth(
    element: string,
    device: string,
    width: string
  ) {
    await this.interactWithElementOnDevice(element, device, parseInt(width));
  }

  private async interactWithElementOnDevice(
    element: string,
    device: string,
    width: number
  ): Promise<void> {
    await this.setViewportSize(width);

    const interactionMethod = this.getInteractionMethod(device);

    if (interactionMethod === "tap" || interactionMethod === "click") {
      await this.humanSpaceflightPage.responsiveDesign.interactWithElement(element);
    } else if (interactionMethod === "hover-click") {
      await this.hoverAndClickElement(element);
    } else if (interactionMethod === "focus-type") {
      await this.focusAndTypeInElement(element);
    } else {
      await this.humanSpaceflightPage.responsiveDesign.interactWithElement(element);
    }
  }

  private getInteractionMethod(device: string): string {
    const deviceType = device.toLowerCase();
    const interactionMap: Record<string, string> = {
      mobile: "tap",
      tablet: "tap",
      desktop: "hover-click",
    };
    return interactionMap[deviceType] || "click";
  }

  private async hoverAndClickElement(element: string): Promise<void> {
    const elementLocator = this.getElementLocator(element);
    await elementLocator.hover();
    await elementLocator.click();
  }

  private async focusAndTypeInElement(element: string): Promise<void> {
    const elementLocator = this.getElementLocator(element);
    await elementLocator.focus();
    
    const tagName = await elementLocator.evaluate(el => el.tagName.toLowerCase());
    if (tagName === 'input' || tagName === 'textarea') {
      await elementLocator.fill("test input");
    } else {
      await elementLocator.click();
    }
  }

  private getElementLocator(element: string) {
    const elementType = element.toLowerCase();
    
    switch (elementType) {
      case "menu":
        return this.humanSpaceflightPage.responsiveDesign.hamburgerButton;
      case "carousel":
        return this.page.locator(".carousel").first();
      case "button":
        return this.page.locator("button:not(.hamburger-menu):not(.close-menu)").first();
      case "form":
        return this.page.locator("form").first();
      case "input":
        return this.page.locator("input").first();
      case "link":
        return this.page.locator("a").first();
      default:
        return this.page.locator(`[data-test="${element}"], ${element}`).first();
    }
  }

  @Then("the interaction should follow device patterns:")
  async checkDevicePatterns(dataTable: DataTable) {
    const requirements = dataTable.rowsHash() as ResponsiveRequirements;
    const patterns = await this.humanSpaceflightPage.responsiveDesign.checkInteractionPatterns();

    expect(patterns.inputMethod).toBe(requirements["Input Method"]);
    expect(patterns.feedback).toBe(requirements["Feedback Type"]);
    expect(patterns.responseTime, "Response time should be fast").toBeLessThan(
      this.RESPONSIVE_CONSTANTS.MAX_RESPONSE_TIME
    );
    expect(patterns.visualCues, "Visual cues should be present").toBeTruthy();
    expect(patterns.errorHandling).toBe(requirements["Error Feedback"]);
  }

  @Then("the {string} should be easily {string} on {string}")
  async checkElementInteraction(element: string, interaction: string, device: string) {
    const elementLocator = this.getElementLocator(element);
    
    switch (interaction.toLowerCase()) {
      case "tappable":
        await this.verifyTappable(elementLocator, device);
        break;
      case "clickable":
        await this.verifyClickable(elementLocator, device);
        break;
      case "typeable":
        await this.verifyTypeable(elementLocator, device);
        break;
      case "focusable":
        await this.verifyFocusable(elementLocator, device);
        break;
      default:
        throw new Error(`Unknown interaction type: ${interaction}`);
    }
  }

  private async verifyTappable(elementLocator: any, device: string): Promise<void> {
    const isVisible = await elementLocator.isVisible();
    const isEnabled = await elementLocator.isEnabled();
    
    expect(isVisible, `${device}: Element should be visible for tapping`).toBeTruthy();
    expect(isEnabled, `${device}: Element should be enabled for tapping`).toBeTruthy();

    if (device.toLowerCase() === 'mobile' || device.toLowerCase() === 'tablet') {
      const size = await elementLocator.boundingBox();
      if (size) {
        expect(
          size.width >= 44 && size.height >= 44,
          `${device}: Touch target should be at least 44px`
        ).toBeTruthy();
      }
    }
  }

  private async verifyClickable(elementLocator: any, device: string): Promise<void> {
    const isVisible = await elementLocator.isVisible();
    const isEnabled = await elementLocator.isEnabled();
    
    expect(isVisible, `${device}: Element should be visible for clicking`).toBeTruthy();
    expect(isEnabled, `${device}: Element should be enabled for clicking`).toBeTruthy();
  }

  private async verifyTypeable(elementLocator: any, device: string): Promise<void> {
    const isVisible = await elementLocator.isVisible();
    const isEnabled = await elementLocator.isEnabled();
    const isEditable = await elementLocator.isEditable();
    
    expect(isVisible, `${device}: Input should be visible for typing`).toBeTruthy();
    expect(isEnabled, `${device}: Input should be enabled for typing`).toBeTruthy();
    expect(isEditable, `${device}: Input should be editable`).toBeTruthy();
  }

  private async verifyFocusable(elementLocator: any, device: string): Promise<void> {
    const isVisible = await elementLocator.isVisible();
    const isEnabled = await elementLocator.isEnabled();
    
    expect(isVisible, `${device}: Element should be visible for focusing`).toBeTruthy();
    expect(isEnabled, `${device}: Element should be enabled for focusing`).toBeTruthy();

    await elementLocator.focus();
    const isFocused = await elementLocator.evaluate((el: Element | null) => document.activeElement === el);
    expect(isFocused, `${device}: Element should be focusable`).toBeTruthy();
  }

  @Then("interaction feedback should be appropriate for {string}")
  async checkInteractionFeedback(device: string) {
    const viewport = this.page.viewportSize();
    if (!viewport) return;

    const hasVisualFeedback = await this.page.evaluate(() => {
      const interactiveElements = document.querySelectorAll('button, a, input, [role="button"]');
      return Array.from(interactiveElements).some(el => {
        const style = window.getComputedStyle(el);
        return (
          style.cursor === 'pointer' ||
          style.transition !== 'none' ||
          style.transform !== 'none'
        );
      });
    });

    expect(hasVisualFeedback, `${device}: Should have visual feedback for interactions`).toBeTruthy();
  }

  private async setViewportSize(width: number, height?: number): Promise<void> {
    await this.humanSpaceflightPage.responsiveDesign.setViewportSize(
      width,
      height || 812
    );
  }
}