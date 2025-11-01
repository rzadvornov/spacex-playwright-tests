import { Page, Locator } from "@playwright/test";
import { HeroPOF } from "../fragments/HeroPOF";
import { SpaceXPage } from "../base/SpaceXPage";

export class Falcon9Page extends SpaceXPage {
  readonly hero: HeroPOF;

  static readonly SPECIFICATIONS_SECTION_SELECTOR =
    '[data-section="specifications"], #technical-specs';
  static readonly ENGINE_SPEC_SELECTOR =
    '[data-section="engine-specs"], #engines';

  readonly mainHeadline: Locator;
  readonly reusabilityDescription: Locator;
  readonly costBenefitHighlight: Locator;
  readonly specificationsSection: Locator;
  readonly enginesSection: Locator;
  readonly specsTable: Locator;
  readonly engineSpecsTable: Locator;
  readonly videoSection: Locator;
  readonly marketPositioningSection: Locator;
  readonly documentationLink: Locator;
  readonly launchHistorySection: Locator;
  readonly reuseCountHighlight: Locator;
  readonly merlinVacuumSpecsSection: Locator;
  readonly firstStageRecoveryText: Locator;

  constructor(page: Page) {
    super(page);
    this.hero = new HeroPOF(page);

    this.mainHeadline = this.page
      .getByRole("heading", {
        name: "First Orbital Class Rocket Capable of Reflight",
        level: 1,
      })
      .or(this.page.locator(".headline"))
      .first();
    this.reusabilityDescription = this.page
      .locator('p:has-text("fully reusable two-stage rocket")')
      .first();
    this.costBenefitHighlight = this.page
      .locator('p:has-text("cost and reliability benefits of reusability")')
      .first();

    this.specificationsSection = this.page
      .locator(Falcon9Page.SPECIFICATIONS_SECTION_SELECTOR)
      .first();
    this.specsTable = this.specificationsSection.getByRole("table").first();

    this.enginesSection = this.page
      .locator(Falcon9Page.ENGINE_SPEC_SELECTOR)
      .first();
    this.engineSpecsTable = this.enginesSection.getByRole("table").first();

    this.videoSection = this.page
      .locator(
        '.featured-video-section, [aria-label="Falcon 9 Operations Video"]'
      )
      .first();
    this.documentationLink = this.page
      .getByRole("link", {
        name: /technical documentation|download spec sheet/i,
      })
      .or(this.page.locator('a[href*=".pdf"]'))
      .first();

    this.marketPositioningSection = this.page
      .locator('p:has-text("reusability advantage over expendable rockets")')
      .first();
    this.launchHistorySection = this.page
      .locator('[data-section="history"], #launch-history')
      .first();
    this.reuseCountHighlight = this.launchHistorySection
      .locator('p:has-text("booster reuse count")')
      .first();

    this.merlinVacuumSpecsSection = this.engineSpecsTable
      .locator("table, dl, div")
      .locator("text=/Merlin Vacuum/i");
    this.firstStageRecoveryText = this.page
      .locator('iframe[title*="video player"], .video-modal, .media-player')
      .locator("text=/first-stage recovery/i");
  }

  readonly engineSpecRow: (section: Locator, fieldName: string) => Locator = (
    section,
    fieldName
  ) =>
    section.locator("tr, div", {
      has: this.page.locator(`text=/^${fieldName}:/i`),
    });

  async navigate(urlPath: string = "/falcon9"): Promise<void> {
    this.setupErrorListeners();
    await this.open(urlPath);
    await this.waitForAppContentLoad();
  }

  async scrollToSpecificationsSection(): Promise<void> {
    await this.specificationsSection.scrollIntoViewIfNeeded();
  }

  async isSpecValueDisplayed(
    attribute: string,
    value: string
  ): Promise<boolean> {
    const rowLocator = this.specsTable.locator("tr", {
      has: this.page.locator(`td:has-text("${attribute}")`),
    });
    return await rowLocator.locator(`td:has-text("${value}")`).isVisible();
  }

  async isEngineSpecDisplayed(
    attribute: string,
    detail: string
  ): Promise<boolean> {
    const rowLocator = this.engineSpecsTable.locator("tr", {
      has: this.page.locator(`td:has-text("${attribute}")`),
    });
    return await rowLocator.locator(`td:has-text("${detail}")`).isVisible();
  }

  async clickFeaturedVideo(): Promise<void> {
    await this.videoSection.click();
  }

  async isVideoPlayerLoaded(): Promise<boolean> {
    const videoPlayer = this.page
      .locator('iframe[title*="video player"], .video-modal, .media-player')
      .first();
    return await videoPlayer.isVisible();
  }

  async hasAccessibleSoundControls(): Promise<boolean> {
    const soundControl = this.page
      .locator('[aria-label*="Volume"], [aria-label*="Sound"]')
      .first();
    return await soundControl.isVisible();
  }

  async isMerlinEngineFamilyDisplayed(): Promise<boolean> {
    return await this.enginesSection
      .locator("text=/Merlin Engine Family/i")
      .isVisible();
  }

  async isMerlinMainEngineSpecDisplayed(
    fieldName: string,
    detail: string
  ): Promise<boolean> {
    const rowLocator = this.engineSpecRow(this.engineSpecsTable, fieldName);
    return await rowLocator.locator(`text=/${detail}/i`).isVisible();
  }

  async isMerlinVacuumSpecDisplayed(
    fieldName: string,
    detail: string
  ): Promise<boolean> {
    const rowLocator = this.engineSpecRow(
      this.merlinVacuumSpecsSection,
      fieldName
    );
    return await rowLocator.locator(`text=/${detail}/i`).isVisible();
  }

  async isFirstStageRecoveryVisuallyDemonstrated(): Promise<boolean> {
    return (
      (await this.isVideoPlayerLoaded()) &&
      (await this.firstStageRecoveryText.isVisible())
    );
  }

  async isDocumentationContentAccurate(): Promise<boolean> {
    const text = await this.documentationLink.textContent();
    return (
      (await this.documentationLink.isVisible()) &&
      (text || "").match(/performance metrics|schematics/i) !== null
    );
  }

  async isLaunchHistorySectionDisplayed(): Promise<boolean> {
    const isVisible = await this.launchHistorySection.isVisible();
    const hasHistoryContent = await this.launchHistorySection
      .locator("text=/Launch History|Statistics/i")
      .isVisible();
    return isVisible && hasHistoryContent;
  }
}
