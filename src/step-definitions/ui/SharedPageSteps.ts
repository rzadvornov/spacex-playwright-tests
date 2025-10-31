import { Page, expect } from "@playwright/test";
import { Then, Fixture } from "playwright-bdd/decorators";

@Fixture("sharedPageSteps")
export class SharedPageSteps {
  constructor(private page: Page) {}

  @Then("the page should match the snapshot {string}")
  async checkPageSnapshot(snapshotName: string) {
    await expect(
      this.page,
      `Screenshots should match for the snapshot ${snapshotName}`
    ).toHaveScreenshot(snapshotName, {
      mask: [this.page.locator("upcoming-launch-widget")],
      maxDiffPixelRatio: 0.01,
      animations: "disabled",
      fullPage: true,
    });
  }

  @Then("the URL should contain {string}")
  async checkURLContains(path: string) {
    await expect(this.page).toHaveURL(new RegExp(path));
  }
}
