import { Page, expect } from "@playwright/test";
import { Then, Fixture } from "playwright-bdd/decorators";

@Fixture("sharedPageSteps")
export class SharedPageSteps {
  constructor(private page: Page) {}

  @Then("the page should match the snapshot {string}")
  async checkPageSnapshot(snapshotName: string) {
    await this.verifyPageScreenshot(snapshotName);
  }

  @Then("the URL should contain {string}")
  async checkURLContains(path: string) {
    await this.verifyURLContains(path);
  }

  private async verifyPageScreenshot(snapshotName: string): Promise<void> {
    const screenshotConfig = this.getScreenshotConfig();

    await expect(
      this.page,
      this.getScreenshotMismatchMessage(snapshotName)
    ).toHaveScreenshot(snapshotName, screenshotConfig);
  }

  private getScreenshotConfig() {
    return {
      mask: [this.page.locator("upcoming-launch-widget")],
      maxDiffPixelRatio: 0.01,
      animations: "disabled" as const,
      fullPage: true,
    };
  }

  private getScreenshotMismatchMessage(snapshotName: string): string {
    return `Screenshots should match for the snapshot ${snapshotName}`;
  }

  private async verifyURLContains(path: string): Promise<void> {
    const urlPattern = new RegExp(path);
    await expect(this.page).toHaveURL(urlPattern);
  }
}
