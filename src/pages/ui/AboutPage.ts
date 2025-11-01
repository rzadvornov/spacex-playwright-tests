import { Locator, Page } from "@playwright/test";
import { SpaceXPage } from "../base/SpaceXPage";

export class AboutPage extends SpaceXPage {
  readonly missionSection: Locator;
  readonly historySection: Locator;
  readonly leadershipSection: Locator;
  readonly achievementsSection: Locator;
  readonly facilitiesSection: Locator;
  readonly sustainabilitySection: Locator;
  readonly partnershipsSection: Locator;
  readonly structureSection: Locator;
  readonly resourcesSection: Locator;

  readonly missionStatementText: Locator;
  readonly humanityMultiplanetaryText: Locator;
  readonly reusabilityEmphasisText: Locator;
  readonly leaderPhotosAndBios: Locator;

  constructor(page: Page) {
    super(page);

    this.missionSection = this.page.locator(
      '#mission-section, main:has-text("Mission Statement")'
    );
    this.historySection = this.page.locator(
      '#history-section, main:has-text("Key Milestones")'
    );
    this.leadershipSection = this.page.locator(
      '#leadership-section, main:has-text("Leadership Team")'
    );
    this.achievementsSection = this.page.locator(
      '#achievements-section, main:has-text("Major Achievements")'
    );
    this.facilitiesSection = this.page.locator(
      '#facilities-section, main:has-text("Operational Locations")'
    );
    this.sustainabilitySection = this.page.locator(
      '#sustainability-section, main:has-text("Sustainability Initiatives")'
    );
    this.partnershipsSection = this.page.locator(
      '#partnerships-section, main:has-text("Partnerships and Contracts")'
    );
    this.structureSection = this.page.locator(
      '#structure-section, main:has-text("Organizational Structure")'
    );
    this.resourcesSection = this.page.locator(
      '#resources-section, main:has-text("Company Resources")'
    );

    this.missionStatementText = this.missionSection
      .locator(
        'p:has-text("ultimate goal of enabling people to live on other planets")'
      )
      .first();
    this.humanityMultiplanetaryText = this.missionSection.locator(
      "text=/humanity multiplanetary/i"
    );
    this.reusabilityEmphasisText = this.historySection.locator(
      "text=/approach to reusability/i"
    );
    this.leaderPhotosAndBios = this.leadershipSection.locator(
      ".leader-card img, .leader-card p:not(:empty)"
    );
  }

  readonly keyExecutiveRole: (role: string) => Locator = (role) =>
    this.leadershipSection.locator(`text=/^${role}\\s*$/i`);

  readonly milestoneDetail: (detail: string) => Locator = (detail) =>
    this.historySection.locator(`text=/${detail}/i`);

  readonly achievementMetric: (metric: string) => Locator = (metric) =>
    this.achievementsSection.locator(`text=/${metric}/i`);

  readonly facilityLocation: (facility: string) => Locator = (facility) =>
    this.facilitiesSection.locator(`text=/${facility}/i`);

  readonly sustainabilityDetail: (detail: string) => Locator = (detail) =>
    this.sustainabilitySection.locator(`text=/${detail}/i`);

  readonly partnerDetail: (detail: string) => Locator = (detail) =>
    this.partnershipsSection.locator(`text=/${detail}/i`);

  readonly divisionFocus: (division: string) => Locator = (division) =>
    this.structureSection.locator(`text=/${division}/i`);

  readonly resourceLink: (resourceName: string) => Locator = (resourceName) =>
    this.resourcesSection.locator(`a:has-text("${resourceName}")`);

  async navigate(urlPath: string = "/about"): Promise<void> {
    this.setupErrorListeners();
    await this.open(urlPath);
    await this.waitForAppContentLoad();
  }

  async isPageLoadedSuccessfully(): Promise<boolean> {
    return this.verifyPageTitle("SpaceX");
  }

  async checkMissionStatement(): Promise<boolean> {
    const isSectionVisible = await this.missionSection.isVisible();
    const isMissionTextVisible = await this.missionStatementText.isVisible();
    return isSectionVisible && isMissionTextVisible;
  }

  async isTextProminentlyFeatured(text: string): Promise<boolean> {
    if (text.toLowerCase().includes("multiplanetary")) {
      return await this.humanityMultiplanetaryText.isVisible();
    }

    const locator = this.missionSection.locator(`text=/${text}/i`);
    const isVisible = await locator.isVisible();

    if (isVisible) {
      const fontSize = await locator.evaluate((el: HTMLElement) => {
        return window.getComputedStyle(el).fontSize;
      });
      // Assuming font size larger than standard body text (1rem or 16px)
      return parseFloat(fontSize) > 16;
    }
    return false;
  }

  async isPageContentVisible(): Promise<boolean> {
    return await this.missionSection.isVisible();
  }

  async isMilestoneDetailDisplayed(detail: string): Promise<boolean> {
    return await this.milestoneDetail(detail).isVisible();
  }

  async isReusabilityEmphasized(): Promise<boolean> {
    return await this.reusabilityEmphasisText.isVisible();
  }

  async isKeyExecutiveRoleListed(role: string): Promise<boolean> {
    return await this.keyExecutiveRole(role).isVisible();
  }

  async checkLeaderPhotosAndBiographies(): Promise<boolean> {
    const count = await this.leaderPhotosAndBios.count();
    return count >= 4;
  }

  async isAchievementMetricDisplayed(metric: string): Promise<boolean> {
    return await this.achievementMetric(metric).isVisible();
  }

  async isFacilityInfoDisplayed(facility: string): Promise<boolean> {
    return await this.facilityLocation(facility).isVisible();
  }

  async isSustainabilityDetailDescribed(detail: string): Promise<boolean> {
    return await this.sustainabilityDetail(detail).isVisible();
  }

  async isPartnerDetailListed(detail: string): Promise<boolean> {
    return await this.partnerDetail(detail).isVisible();
  }

  async isDivisionFocusDescribed(divisionFocus: string): Promise<boolean> {
    return await this.divisionFocus(divisionFocus).isVisible();
  }

  async isResourceLinked(resourceName: string): Promise<boolean> {
    const locator = this.resourceLink(resourceName);
    const isVisible = await locator.isVisible();
    const hasHref = (await locator.getAttribute("href")) !== null;
    return isVisible && hasHref;
  }
}
