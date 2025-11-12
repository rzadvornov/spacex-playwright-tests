import { Page, Locator } from "@playwright/test";
import { SpaceXPage } from "../base/SpaceXPage";
import { HeroPOF } from "./fragments/HeroPOF";

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
  readonly capabilitiesSection: Locator;
  readonly propulsionSection: Locator;
  readonly superDracoSection: Locator;
  readonly crewLaunchRestoreText: Locator;
  readonly inspiration4Highlight: Locator;
  readonly dracoSpecsSection: Locator;
  readonly videoPlayerContent: Locator;
  readonly fullMissionDescription: Locator;
  readonly beyondLEOText: Locator;
  readonly issCapabilityText: Locator;

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
    this.capabilitiesSection = this.page.locator(
      '#capabilities, main:has-text("Dragon Capabilities")'
    );
    this.propulsionSection = this.page.locator(
      '#propulsion-system, main:has-text("Draco Thrusters")'
    );
    this.superDracoSection = this.page.locator(
      '#superdraco-system, main:has-text("SuperDraco")'
    );
    this.dracoSpecsSection = this.propulsionSection.locator(
      "table, dl, text=/Thrust.*Isp/i"
    );

    this.crewLaunchRestoreText = this.capabilitiesSection.locator(
      "text=/restored.*American ability to launch astronauts/i"
    );
    this.inspiration4Highlight = this.capabilitiesSection.locator(
      "text=/first private spaceflight/i"
    );

    this.videoPlayerContent = page.locator(
      'iframe[title*="video player"], .video-modal'
    );
    this.fullMissionDescription = page.locator(
      '#mission-description, main:has-text("Mission Capabilities")'
    );

    this.beyondLEOText = this.fullMissionDescription.locator(
      'text=/"missions beyond Low Earth Orbit"|/LEO and beyond/i'
    );
    this.issCapabilityText = this.fullMissionDescription.locator(
      "text=/Earth orbit missions, including the ISS/i"
    );
  }

  readonly parachuteExplanation: (text: string) => Locator = (text) =>
    this.landingSystemSection.locator(
      `p:has-text("${text}"), h3:has-text("${text}")`
    );

  readonly dracoSpecRow: (fieldName: string) => Locator = (fieldName) =>
    this.dracoSpecsSection.locator("tr, div", {
      has: this.page.locator(`text=/^${fieldName}:/i`),
    });

  readonly superDracoDetail: (detail: string) => Locator = (detail) =>
    this.superDracoSection.locator(`text=/${detail}/i`);

  async navigate(urlPath: string = "/dragon"): Promise<void> {
    this.setupErrorListeners();
    await this.open(urlPath);
    await this.waitForAppContentLoad();
  }

  async isFullCapabilitiesDisplayed(): Promise<boolean> {
    return (
      (await this.passengerCapacityText.isVisible()) &&
      (await this.cargoReturnHighlight.isVisible()) &&
      (await this.capabilitiesSection.isVisible())
    );
  }

  async isAmericanLaunchRestoredMentioned(
    year1: number,
    year2: number
  ): Promise<boolean> {
    const text = await this.crewLaunchRestoreText.textContent();
    return (
      (await this.crewLaunchRestoreText.isVisible()) &&
      (text || "").includes(year1.toString()) &&
      (text || "").includes(year2.toString())
    );
  }

  async isInspiration4Highlighted(): Promise<boolean> {
    return await this.inspiration4Highlight.isVisible();
  }

  async scrollToPropulsionSection(): Promise<void> {
    await this.propulsionSection.scrollIntoViewIfNeeded();
  }

  async isDracoSpecDetailDisplayed(
    fieldName: string,
    detail: string
  ): Promise<boolean> {
    const rowLocator = this.dracoSpecRow(fieldName);
    return await rowLocator.locator(`text=/${detail}/i`).isVisible();
  }

  async isSuperDracoLaunchEscapeDetailDisplayed(
    detail: string
  ): Promise<boolean> {
    return (
      (await this.superDracoSection.isVisible()) &&
      (await this.superDracoDetail(detail).isVisible())
    );
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

  async isMultiStageLandingMechanismExplained(): Promise<boolean> {
    return await this.parachuteExplanation(
      "multi-stage parachute landing mechanism"
    ).isVisible();
  }

  async isVideoContentShowcased(
    text1: string,
    text2: string
  ): Promise<boolean> {
    return (
      (await this.videoPlayerContent.isVisible()) &&
      (await this.videoPlayerContent
        .or(this.page.locator("#video-caption"))
        .locator(`text=/${text1}.*${text2}/i`)
        .isVisible())
    );
  }

  async isVideoContentHighlightingCrewOps(): Promise<boolean> {
    return await this.videoPlayerContent
      .or(this.page.locator("#video-caption"))
      .locator("text=/crew operations|inside the capsule/i")
      .isVisible();
  }

  async isISSCapabilityMentioned(): Promise<boolean> {
    return await this.issCapabilityText.isVisible();
  }

  async isBeyondLEOMissionDescribed(): Promise<boolean> {
    return await this.beyondLEOText.isVisible();
  }
}
