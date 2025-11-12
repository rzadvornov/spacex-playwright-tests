import { Page, Locator } from "@playwright/test";
import { SpaceXPage } from "../base/SpaceXPage";
import { HeroPOF } from "./fragments/HeroPOF";

export class FalconHeavyPage extends SpaceXPage {
  readonly hero: HeroPOF;

  static readonly SPECIFICATIONS_SECTION_SELECTOR =
    '[data-section="specifications"], #technical-specs';
  static readonly ENGINE_SPEC_SELECTOR =
    '[data-section="engine-specs"], #engines';

  readonly mainHeadline: Locator;
  readonly threeCoresDescription: Locator;
  readonly totalThrustHighlight: Locator;
  readonly overviewSection: Locator;
  readonly comparisonSection: Locator;
  readonly planeComparisonText: Locator;
  readonly payloadCapacityText: Locator;
  readonly specificationsSection: Locator;
  readonly specsTable: Locator;
  readonly enginesSection: Locator;
  readonly merlin1DSection: Locator;
  readonly merlinVacuumSection: Locator;
  readonly engineSpecsTable: Locator;
  readonly videoSection: Locator;
  readonly launchSequenceText: Locator;
  readonly simultaneousLandingText: Locator;
  readonly marketPositioningSection: Locator;
  readonly capableRocketText: Locator;
  readonly heavyPayloadsText: Locator;
  readonly deepSpaceText: Locator;
  readonly vehicleDescription: Locator;
  readonly totalEngineCountText: Locator;
  readonly reusabilityBenefitsText: Locator;

  constructor(page: Page) {
    super(page);
    this.hero = new HeroPOF(page);

    this.mainHeadline = this.page
      .getByRole("heading", { name: "Over 5 Million Lbs of Thrust", level: 1 })
      .first();
    this.overviewSection = this.page
      .locator('#overview, main:has-text("5 Million Lbs of Thrust")')
      .first();
    this.threeCoresDescription = this.overviewSection
      .locator("text=/composed of three Falcon 9 cores/i")
      .first();
    this.totalThrustHighlight = this.overviewSection
      .locator("text=/5 million pounds|22,800 kN/i")
      .first();

    this.comparisonSection = this.page
      .locator('#thrust-comparison, main:has-text("Thrust Comparison")')
      .first();
    this.planeComparisonText = this.comparisonSection
      .locator("text=/eighteen 747 aircraft/i")
      .first();
    this.payloadCapacityText = this.comparisonSection
      .locator("text=/(64 metric tons|141,000 lbs)/i")
      .first();

    this.specificationsSection = this.page
      .locator(FalconHeavyPage.SPECIFICATIONS_SECTION_SELECTOR)
      .first();
    this.specsTable = this.specificationsSection.locator("table, dl");

    this.enginesSection = this.page
      .locator(FalconHeavyPage.ENGINE_SPEC_SELECTOR)
      .first();
    this.engineSpecsTable = this.enginesSection.locator("table, dl");
    this.merlin1DSection = this.engineSpecsTable.locator(
      'div:has-text("Merlin 1D Engine Details"), table:has-text("Sea Level Thrust")'
    );
    this.merlinVacuumSection = this.engineSpecsTable.locator(
      'div:has-text("Merlin Vacuum Engine Details"), table:has-text("Thrust Output")'
    );

    this.videoSection = this.page
      .locator("#video-section, .media-player")
      .first();
    this.launchSequenceText = this.page
      .locator("text=/Falcon Heavy launch sequence/i")
      .or(this.videoSection.locator("text=/launch sequence/i"));
    this.simultaneousLandingText = this.page
      .locator("text=/simultaneous booster landing/i")
      .or(this.videoSection.locator("text=/booster landing sequences/i"));

    this.marketPositioningSection = this.page
      .locator("#market-positioning, main:has-text('Market Position')")
      .first();
    this.capableRocketText = this.marketPositioningSection
      .locator("text=/most capable operational rockets/i")
      .first();
    this.heavyPayloadsText = this.marketPositioningSection
      .locator("text=/ideal choice for heavy payloads/i")
      .first();
    this.deepSpaceText = this.marketPositioningSection
      .locator("text=/deep space missions|large satellites/i")
      .first();

    this.vehicleDescription = this.overviewSection.or(
      this.page.locator("#vehicle-description, .vehicle-description-block")
    );

    this.totalEngineCountText = this.vehicleDescription.locator(
      "text=/27 Merlin engines \\(9 per core\\)/i"
    );

    this.reusabilityBenefitsText = this.vehicleDescription.locator(
      "text=/reusability benefits|reusable boosters/i"
    );
  }

  async navigate(urlPath: string = "/falcon-heavy"): Promise<void> {
    this.setupErrorListeners();
    await this.open(urlPath);
    await this.waitForAppContentLoad();
  }

  async scrollToElement(locator: Locator): Promise<void> {
    await locator.scrollIntoViewIfNeeded();
  }

  async isTechnicalSpecValueDisplayed(
    attribute: string,
    metric: string,
    imperial: string
  ): Promise<boolean> {
    const rowLocator = this.specsTable.locator("tr, div", {
      has: this.page.locator(`text=/${attribute}/i`),
    });
    return (
      (await rowLocator.locator(`text=/${metric}/i`).isVisible()) &&
      (await rowLocator.locator(`text=/${imperial}/i`).isVisible())
    );
  }

  async isMerlin1DEngineSpecDisplayed(
    attribute: string,
    detail: string
  ): Promise<boolean> {
    const rowLocator = this.merlin1DSection.locator("tr, div", {
      has: this.page.locator(`text=/${attribute}/i`),
    });
    return await rowLocator.locator(`text=/${detail}/i`).isVisible();
  }

  async isMerlinVacuumSpecDisplayed(
    attribute: string,
    detail: string
  ): Promise<boolean> {
    const rowLocator = this.merlinVacuumSection.locator("tr, div", {
      has: this.page.locator(`text=/${attribute}/i`),
    });
    return await rowLocator.locator(`text=/${detail}/i`).isVisible();
  }

  async isVideoPlayerLoaded(): Promise<boolean> {
    const videoPlayer = this.page
      .locator('iframe[title*="video player"], .video-modal, .media-player')
      .first();
    return await videoPlayer.isVisible();
  }

  async isLaunchSequenceShowcased(): Promise<boolean> {
    return (
      (await this.isVideoPlayerLoaded()) &&
      (await this.launchSequenceText.isVisible())
    );
  }

  async isSimultaneousLandingDemonstrated(): Promise<boolean> {
    return (
      (await this.isVideoPlayerLoaded()) &&
      (await this.simultaneousLandingText.isVisible())
    );
  }

  async isMostCapableRocketDescribed(): Promise<boolean> {
    return await this.capableRocketText.isVisible();
  }

  async isHeavyPayloadsChoiceHighlighted(): Promise<boolean> {
    return await this.heavyPayloadsText.isVisible();
  }

  async isDeepSpaceMissionSuitabilityHighlighted(): Promise<boolean> {
    return await this.deepSpaceText.isVisible();
  }

  async isThreeFalconCoresClarified(falconVersion: number): Promise<boolean> {
    return await this.vehicleDescription
      .locator(`text=/three Falcon ${falconVersion} first-stage cores/i`)
      .isVisible();
  }

  async isEngineCountAndPerCoreExplained(
    totalEngines: number,
    perCore: number
  ): Promise<boolean> {
    return await this.vehicleDescription
      .locator(`text=/${totalEngines} Merlin engines.*${perCore} per core/i`)
      .isVisible();
  }

  async isBoosterReusabilityHighlighted(): Promise<boolean> {
    return await this.reusabilityBenefitsText.isVisible();
  }

  async isMerlinEngineSpecsDisplayed(): Promise<boolean> {
    return await this.engineSpecsTable.isVisible();
  }
}
