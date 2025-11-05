import { Page, expect } from "@playwright/test";
import { When, Then, Fixture } from "playwright-bdd/decorators";
import { HumanSpaceflightPage } from "../../../../pages/ui/HumanSpaceflightPage";

@Fixture("responsiveViewportSteps")
export class ResponsiveViewportSteps {
  private readonly RESPONSIVE_CONSTANTS = {
    TRANSITION_DELAY: 500,
  } as const;

  constructor(
    private page: Page,
    private humanSpaceflightPage: HumanSpaceflightPage,
  ) {}

  @When("I view the {string} on a mobile device with width {string}px")
  async viewSectionOnMobile(section: string, width: string) {
    await this.setViewportSize(parseInt(width));
    await this.humanSpaceflightPage.responsiveDesign.scrollToSection(section);
  }

  @When("I view the {string} on a mobile device with width {string}")
  async viewSectionOnMobileWithWidth(section: string, width: string) {
    await this.viewSectionOnMobile(section, width);
  }

  @When("I view the page on a mobile device with {int}px width")
  async setMobileViewport(width: number) {
    await this.setViewportSize(width);
  }

  @When("I view the page on a tablet device with {int}px width")
  async setTabletViewport(width: number) {
    await this.setViewportSize(width);
  }

  @When("I view the page on a desktop browser with {int}px width")
  async setDesktopViewport(width: number) {
    await this.setViewportSize(width);
  }

  @When("I view the page on mobile, tablet, and desktop")
  async checkAllViewports() {
    const viewports = [375, 768, 1920];

    for (const width of viewports) {
      await this.setViewportSize(width);
      await this.page.waitForTimeout(
        this.RESPONSIVE_CONSTANTS.TRANSITION_DELAY
      );
    }
  }

  @When("viewing content on {string} with width {string}")
  async setViewportForContent(_device: string, width: string) {
    const viewportWidth = parseInt(width);
    await this.setViewportSize(viewportWidth);
  }

  private async setViewportSize(width: number, height?: number): Promise<void> {
    await this.humanSpaceflightPage.responsiveDesign.setViewportSize(
      width,
      height
    );
  }

  @When("the viewport width changes from {string} to {string} pixels")
  async changeViewportWidth(startWidth: string, endWidth: string) {
    await this.setViewportSize(parseInt(startWidth));
    await this.page.waitForTimeout(this.RESPONSIVE_CONSTANTS.TRANSITION_DELAY);
    await this.setViewportSize(parseInt(endWidth));
  }

  @When("I resize the browser window from mobile to desktop")
  async resizeWindow() {
    await this.setViewportSize(375);
    await this.page.waitForTimeout(this.RESPONSIVE_CONSTANTS.TRANSITION_DELAY);
    await this.setViewportSize(1920);
  }

  @Then("the viewport meta tag should be present in the HTML head")
  async checkViewportMetaTag() {
    const hasViewportMeta = await this.page.evaluate(() => {
      const viewportMeta = document.querySelector('meta[name="viewport"]');
      return !!viewportMeta;
    });
    expect(hasViewportMeta, "Viewport meta tag should be present").toBeTruthy();
  }

  @Then("the viewport should be set to width=device-width")
  async checkViewportWidth() {
    const hasCorrectWidth = await this.page.evaluate(() => {
      const viewportMeta = document.querySelector('meta[name="viewport"]');
      return viewportMeta
        ?.getAttribute("content")
        ?.includes("width=device-width");
    });
    expect(
      hasCorrectWidth,
      "Viewport width should be set to device-width"
    ).toBeTruthy();
  }

  @Then("the initial-scale should be set to 1.0")
  async checkInitialScale() {
    const hasCorrectScale = await this.page.evaluate(() => {
      const viewportMeta = document.querySelector('meta[name="viewport"]');
      return viewportMeta?.getAttribute("content")?.includes("initial-scale=1");
    });
    expect(hasCorrectScale, "Initial scale should be set to 1.0").toBeTruthy();
  }
}