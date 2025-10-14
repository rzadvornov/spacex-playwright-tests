import { Page, Locator } from "@playwright/test";
import { HeroPOF } from "../fragments/HeroPOF";
import { SpaceXPage } from "../base/SpaceXPage";

export class DragonPage extends SpaceXPage {
  readonly hero: HeroPOF;

  static readonly TECHNICAL_SPEC_SELECTOR = '[data-section="specifications"]';
  static readonly PARACHUTE_DETAILS_SELECTOR =
    '[data-section="landing-system"]';

  readonly mainHeadline: Locator;
  readonly passengerCapacityText: Locator;
  readonly cargoReturnHighlight: Locator;
  readonly specificationsSection: Locator;
  readonly imperialMetricToggle: Locator;
  readonly inFlightAbortDetails: Locator;
  readonly landingSystemSection: Locator;
  readonly videoSection: Locator;
  readonly commercialApplicationsSection: Locator;
  readonly specsTable: Locator;

  constructor(page: Page) {
    super(page);
    this.hero = new HeroPOF(page);

    this.mainHeadline = this.page
      .getByRole("heading", {
        name: "Sending Humans and Cargo Into Space",
        level: 1,
      })
      .or(this.page.locator(".headline"))
      .first();
    this.passengerCapacityText = this.page
      .locator('p:has-text("carry up to 7 passengers")')
      .first();
    this.cargoReturnHighlight = this.page
      .locator('p:has-text("cargo return")')
      .first();

    this.specificationsSection = this.page
      .locator(DragonPage.TECHNICAL_SPEC_SELECTOR)
      .or(this.page.locator("#specifications"))
      .first();
    this.specsTable = this.specificationsSection.getByRole("table").first();
    this.imperialMetricToggle = this.specificationsSection
      .locator('[aria-label*="Imperial/Metric Toggle"]')
      .first();

    this.inFlightAbortDetails = this.page
      .locator(
        'p:has-text("escape performance is approximately half a mile in less than 8 seconds")'
      )
      .first();

    this.landingSystemSection = this.page
      .locator(DragonPage.PARACHUTE_DETAILS_SELECTOR)
      .or(this.page.locator("#recovery"))
      .first();

    this.videoSection = this.page
      .locator(
        '.featured-video-section, [aria-label="Dragon Operations Video"]'
      )
      .first();
    this.commercialApplicationsSection = this.page
      .locator(
        'p:has-text("serve commercial astronauts and private customers")'
      )
      .first();
  }

  async open(urlPath: string = "/dragon"): Promise<void> {
    this.setupErrorListeners();
    await this.goto(this.baseURL + urlPath, { waitUntil: "domcontentloaded" });
    await this.waitForAppContentLoad();
  }

  async scrollToSpecificationsSection(): Promise<void> {
    await this.specificationsSection.scrollIntoViewIfNeeded();
  }

  async isSpecDetailDisplayed(
    fieldName: string,
    detail: string
  ): Promise<boolean> {
    const rowLocator = this.specsTable.locator("tr", {
      has: this.page.locator(`td:has-text("${fieldName}")`),
    });
    return await rowLocator.locator(`td:has-text("${detail}")`).isVisible();
  }

  async isParachuteDetailListed(
    type: string,
    quantity: string
  ): Promise<boolean> {
    const rowLocator = this.landingSystemSection.locator("tr", {
      has: this.page.locator(`td:has-text("${type}")`),
    });
    return await rowLocator.locator(`td:has-text("${quantity}")`).isVisible();
  }

  async clickFeaturedVideo(): Promise<void> {
    await this.videoSection.click();
    await this.page.waitForSelector(
      'iframe[title*="video player"], .video-modal',
      { state: "visible" }
    );
  }

  async isVideoPlayerLoaded(): Promise<boolean> {
    const videoPlayer = this.page
      .locator('iframe[title*="video player"], .video-modal')
      .first();
    return await videoPlayer.isVisible();
  }
}
