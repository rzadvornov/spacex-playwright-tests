import { Locator, Page } from "@playwright/test";
import { SpaceXPage } from "../base/SpaceXPage";

export class MissionsPage extends SpaceXPage {
  readonly missionList: Locator;
  readonly missionCard: Locator;
  readonly searchInput: Locator;
  readonly filterPanel: Locator;
  readonly vehicleFilterDropdown: Locator;
  readonly statusFilterDropdown: Locator;
  readonly missionCountDisplay: Locator;
  readonly noResultsMessage: Locator;
  readonly statisticsPanel: Locator;
  readonly sortDropdown: Locator;
  readonly missionDetailPage: Locator;
  readonly payloadDetail: Locator;
  readonly launchSiteDetail: Locator;
  readonly objectivesDetail: Locator;
  readonly multimediaContent: Locator;

  constructor(page: Page) {
    super(page);

    this.missionList = this.page
      .locator('[data-testid="mission-list"], .missions-grid, [role="feed"]')
      .first();
    this.missionCard = this.missionList.locator(
      '[data-testid="mission-card"], a.mission-card'
    );

    this.searchInput = this.page
      .locator(
        'input[placeholder*="Search missions"], [aria-label*="Search mission"]'
      )
      .first();
    this.filterPanel = this.page
      .locator('[role="search"], .filter-panel')
      .first();
    this.vehicleFilterDropdown = this.filterPanel.locator(
      'select[aria-label*="vehicle type"], button:has-text("Vehicle Filter")'
    );
    this.statusFilterDropdown = this.filterPanel.locator(
      'select[aria-label*="mission status"], button:has-text("Status Filter")'
    );

    this.missionCountDisplay = this.page
      .locator('[data-testid="mission-count-display"], .mission-count-text')
      .first();
    this.noResultsMessage = this.page
      .locator(
        'text=/No missions found matching your criteria/i, [role="alert"]'
      )
      .first();

    this.statisticsPanel = this.page
      .locator(
        '[data-testid="statistics-panel"], .statistics-panel, [role="status"]'
      )
      .first();
    this.sortDropdown = this.page.locator(
      'select[aria-label*="sort by"], button:has-text("Sort By")'
    );

    this.missionDetailPage = this.page.locator(
      '[data-testid="mission-detail-page"], .mission-detail-container'
    );
    this.payloadDetail = this.missionDetailPage
      .locator("text=/Payload|Cargo/i + [data-detail-value], .payload-detail")
      .first();
    this.launchSiteDetail = this.missionDetailPage
      .locator("text=/Launch Site/i + [data-detail-value], .launch-site-detail")
      .first();
    this.objectivesDetail = this.missionDetailPage
      .locator(
        "text=/Objectives|Goal/i + [data-detail-value], .objectives-detail"
      )
      .first();
    this.multimediaContent = this.missionDetailPage
      .locator('img[alt*="mission"], video, iframe[title*="video"]')
      .first();
  }

  async open(urlPath: string = "/missions"): Promise<void> {
    this.setupErrorListeners();
    await this.goto(this.baseURL + urlPath, { waitUntil: "domcontentloaded" });
    await this.waitForAppContentLoad();
  }

  missionLink(missionName: string): Locator {
    return this.missionCard
      .filter({ hasText: missionName })
      .locator('a[href*="/mission-details"]')
      .first();
  }

  async getLaunchDateFromCard(cardLocator: Locator): Promise<string> {
    const dateLocator = cardLocator.locator(
      '[data-field="launch-date"], .launch-date'
    );
    const dateText = await dateLocator.textContent();
    return dateText ? dateText.trim() : "";
  }

  async selectVehicleFilter(vehicleType: string): Promise<void> {
    const isSelect =
      (await this.vehicleFilterDropdown.evaluate((el) => el.tagName)) ===
      "SELECT";

    if (isSelect) {
      await this.vehicleFilterDropdown.selectOption({ label: vehicleType });
    } else {
      await this.vehicleFilterDropdown.click();
      await this.page
        .locator(`[role="option"]:has-text("${vehicleType}")`)
        .click();
    }
    await this.page.waitForLoadState("networkidle");
  }

  async searchForMission(searchTerm: string): Promise<void> {
    await this.searchInput.fill(searchTerm);
    await this.searchInput.press("Enter");
    await this.page.waitForLoadState("networkidle");
  }

  async getMetricValue(metricName: string): Promise<string> {
    const metricLocator = this.statisticsPanel.locator(
      `:scope:has-text("${metricName}")`
    );
    const valueLocator = metricLocator
      .locator("[data-metric-value], .metric-value, span")
      .last();
    const value = await valueLocator.textContent();
    return value ? value.trim() : "";
  }

  async selectSortOption(option: string): Promise<void> {
    const isSelect =
      (await this.sortDropdown.evaluate((el) => el.tagName)) === "SELECT";

    if (isSelect) {
      await this.sortDropdown.selectOption({ label: option });
    } else {
      await this.sortDropdown.click();
      await this.page
        .locator(`[role="menuitem"]:has-text("${option}")`)
        .click();
    }
    await this.page.waitForLoadState("networkidle");
  }

  async isActiveSortCriteria(option: string): Promise<boolean> {
    const activeIndicator = this.page
      .locator('[data-sort-active], .active-sort-label, [aria-checked="true"]')
      .filter({ hasText: option });
    return await activeIndicator.isVisible();
  }

  liveStreamLink(missionName: string): Locator {
    return this.missionCard
      .filter({ hasText: missionName })
      .locator('a:has-text("Live Stream"), button:has-text("Watch Live")');
  }

  countdownTimer(missionName: string): Locator {
    return this.missionCard
      .filter({ hasText: missionName })
      .locator(
        '[data-testid="countdown-timer"], .countdown-timer, [aria-label*="countdown"]'
      );
  }

  async selectStatusFilter(status: string): Promise<void> {
    const isSelect = (await this.statusFilterDropdown.evaluate(el => el.tagName)) === 'SELECT';

    if (isSelect) {
        await this.statusFilterDropdown.selectOption({ label: status });
    } else {
        await this.statusFilterDropdown.click();
        await this.page.locator(`[role="option"]:has-text("${status}")`).click();
    }
    await this.page.waitForLoadState('networkidle');
  }
  
  async getVehicleTypeFromCard(cardLocator: Locator): Promise<string> {
    const vehicleLocator = cardLocator.locator('[data-field="vehicle-type"], .vehicle-type');
    const vehicleText = await vehicleLocator.textContent();
    return vehicleText ? vehicleText.trim() : '';
  }

  async simulateStatsUpdate(): Promise<void> {
    await this.statisticsPanel.waitFor({ state: 'visible' }); 
    await this.page.waitForTimeout(500); 
  }
}
