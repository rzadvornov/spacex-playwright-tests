import { Page, expect } from "@playwright/test";
import { Then, Fixture, When, Given } from "playwright-bdd/decorators";
import { DataTable } from "playwright-bdd";
import { DestinationsPOF } from "../../pages/fragments/DestinationsPOF";
import { FooterPOF } from "../../pages/fragments/FooterPOF";
import { HeaderPOF } from "../../pages/fragments/HeaderPOF";
import { HeroPOF } from "../../pages/fragments/HeroPOF";
import { CustomTestArgs } from "../../fixtures/BddFixtures";

type CurrentPageInterface = {
  open(urlPath?: string): Promise<void>;
  getMetaDescription(): Promise<string>;
  getMetaKeywords(): Promise<string>;
  getOGTitle(): Promise<string>;
  getViewportMetaTagContent(): Promise<string>;
  areAllImagesLoaded(): Promise<boolean>;
  getConsoleErrors(): string[];
  scrollDown(): Promise<void>;
  getPerformanceMetrics(): Promise<{
    lcp?: number;
    fid?: number;
    cls?: number;
  }>;
};

@Fixture("sharedPageSteps")
export class SharedPageSteps {
  constructor(
    private page: Page,
  ) {}

  @Then("the page should match the snapshot {string}")
  async checkPageSnapshot(snapshotName: string) {
    await expect(
      this.page,
      `Screenshots should match for the snapshot ${snapshotName}`
    ).toHaveScreenshot(snapshotName, {
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
