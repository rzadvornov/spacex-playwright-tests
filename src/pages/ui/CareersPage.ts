import { Page, Locator } from "@playwright/test";
import { SpaceXPage } from "../base/SpaceXPage";

export class CareersPage extends SpaceXPage {
  readonly careersHeading: Locator;
  readonly jobFilterPanel: Locator;
  readonly firstJobListing: Locator;
  readonly searchInput: Locator;

  constructor(page: Page) {
    super(page);
    this.careersHeading = page.locator("h1:has-text('Careers')").first();
    this.jobFilterPanel = page.locator('aside[aria-label*="filters"]').first();
    this.firstJobListing = page.locator('a[href*="/jobs/"]').first();
    this.searchInput = page.locator('input[type="search"]').first();
  }

  async open(urlPath: string = "/careers"): Promise<void> {
    this.setupErrorListeners();
    await this.goto(this.baseURL + urlPath, { waitUntil: "domcontentloaded" });
    await this.waitForAppContentLoad();
  }

  async searchForJob(keyword: string): Promise<void> {
    await this.searchInput.fill(keyword);
    await this.searchInput.press("Enter");
  }

  async clickFirstJobListing(): Promise<void> {
    await this.firstJobListing.click();
  }
}