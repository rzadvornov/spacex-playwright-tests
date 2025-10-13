import { Locator, Page } from "@playwright/test";
import { MissionTab } from "../types/MissionTab";
import { MissionMetric } from "../types/MissionMetric";

export class OurMissionsPOF {
  readonly page: Page;
  readonly ourMissionsSection: Locator;
  readonly sectionTitle: Locator;
  readonly sectionDescription: Locator;
  readonly missionTabs: Locator;
  readonly metricsTable: Locator;
  readonly joinMissionButton: Locator;
  readonly backgroundImage: Locator;
  readonly submissionForm: Locator;

  constructor(page: Page) {
    this.page = page;
    this.ourMissionsSection = page.locator('[data-test="our-missions-section"]');
    this.sectionTitle = this.ourMissionsSection.locator("h2");
    this.sectionDescription = this.ourMissionsSection.locator(".section-description");
    this.missionTabs = this.ourMissionsSection.locator(".mission-tab");
    this.metricsTable = this.ourMissionsSection.locator(".metrics-table");
    this.joinMissionButton = this.ourMissionsSection.locator('button:text("Join a mission")');
    this.backgroundImage = this.ourMissionsSection.locator(".background-image");
    this.submissionForm = page.locator('form[aria-label="Mission Submission"]');
  }

  private async getElementTextContent(element: Locator): Promise<string> {
    const text = await element.textContent();
    return text?.trim() ?? "";
  }

  private async getElementAttribute(element: Locator, attribute: string): Promise<string> {
    const value = await element.getAttribute(attribute);
    return value ?? "";
  }

  private async getComputedStyle(element: Locator, property: string): Promise<string> {
    return await element.evaluate((el: Element, prop: string) => {
      return window.getComputedStyle(el)[prop as any];
    }, property);
  }

  private parseStyleNumber(styleValue: string): number {
    return parseFloat(styleValue) || 0;
  }

  async scrollIntoView(): Promise<void> {
    await this.ourMissionsSection.scrollIntoViewIfNeeded();
    await this.page.waitForLoadState("domcontentloaded");
  }

  async getSectionTitle(): Promise<string> {
    return await this.getElementTextContent(this.sectionTitle);
  }

  async getSectionDescription(): Promise<string> {
    return await this.getElementTextContent(this.sectionDescription);
  }

  async getMissionTabs(): Promise<MissionTab[]> {
    const tabsCount = await this.missionTabs.count();
    const missionTabs: MissionTab[] = [];

    for (let i = 0; i < tabsCount; i++) {
      const tab = this.missionTabs.nth(i);
      const [name, order] = await Promise.all([
        this.getElementTextContent(tab),
        this.getElementAttribute(tab, "data-order")
      ]);

      if (name) {
        missionTabs.push({ 
          name, 
          order: order || String(i + 1) 
        });
      }
    }
    
    return missionTabs;
  }

  async getTabByName(tabName: string): Promise<Locator> {
    return this.missionTabs.filter({ hasText: tabName });
  }

  async clickMissionTab(tabName: string): Promise<void> {
    const tab = await this.getTabByName(tabName);
    await tab.click();
  }

  async isTabActive(tabName: string): Promise<boolean> {
    const tab = await this.getTabByName(tabName);
    const classAttr = await this.getElementAttribute(tab, "class");
    return classAttr.includes("active");
  }

  async getActiveMissionMetrics(): Promise<MissionMetric[]> {
    const rows = await this.metricsTable.locator("tr").all();
    const metrics: MissionMetric[] = [];

    for (const row of rows) {
      const [header, value] = await Promise.all([
        this.getElementTextContent(row.locator("th")),
        this.getElementTextContent(row.locator("td"))
      ]);

      if (header && value) {
        metrics.push({ 
          metric: header, 
          value: value 
        });
      }
    }
    
    return metrics;
  }

  async isJoinMissionButtonVisible(): Promise<boolean> {
    return await this.joinMissionButton.isVisible();
  }

  async clickJoinMissionButton(): Promise<void> {
    await this.joinMissionButton.click();
    await this.page.waitForLoadState("domcontentloaded");
  }

  async isBackgroundImageVisible(): Promise<boolean> {
    return await this.backgroundImage.isVisible();
  }

  async getBackgroundImageOpacity(): Promise<number> {
    const opacity = await this.getComputedStyle(this.backgroundImage, "opacity");
    return this.parseStyleNumber(opacity);
  }

  async getCargoScienceLines(): Promise<string[]> {
    const cargoCell = this.metricsTable
      .locator("tr", {
        has: this.page.locator('th:text("Cargo / Science")'),
      })
      .locator("td");

    const text = await this.getElementTextContent(cargoCell);
    return text
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
  }

  async getMetricValue(metricName: string): Promise<string> {
    const row = this.metricsTable.locator("tr", {
      has: this.page.locator(`th:text("${metricName}")`),
    });
    return await this.getElementTextContent(row.locator("td"));
  }

  async isTabContentUpdated(previousMetrics: MissionMetric[]): Promise<boolean> {
    const currentMetrics = await this.getActiveMissionMetrics();
    
    if (currentMetrics.length === 0 || previousMetrics.length === 0) {
      return false;
    }

    return currentMetrics.some((current) => {
      const previous = previousMetrics.find(prev => prev.metric === current.metric);
      return previous ? previous.value !== current.value : true;
    });
  }

  async isMissionSubmissionFormVisible(): Promise<boolean> {
    return await this.submissionForm.isVisible();
  }

  async performRapidTabSwitching(tabs: string[]): Promise<void> {
    for (const tabName of tabs) {
      await this.clickMissionTab(tabName);
      await this.page.waitForTimeout(50);
    }
  }

  async isContentTransitionSmooth(): Promise<boolean> {
    const errors: string[] = [];
    
    this.page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    const tabNames = ['Earth Orbit', 'Space Station', 'Moon', 'Mars'];
    
    for (let i = 0; i < 4; i++) {
      await this.clickMissionTab(tabNames[i]);
      await this.page.waitForTimeout(100);
    }

    this.page.off('console', () => {});
    
    return errors.length === 0;
  }

  async isUIResponsive(): Promise<boolean> {
    const startTime = Date.now();
    
    try {
      await this.joinMissionButton.click({ timeout: 5000 });
      await this.page.goBack();
      const endTime = Date.now();
      
      return endTime - startTime < 2000;
    } catch {
      return false;
    }
  }

  async isBackgroundImageRelevantToMission(missionName: string): Promise<boolean> {
    const [isVisible, imgSrc] = await Promise.all([
      this.backgroundImage.isVisible(),
      this.getElementAttribute(this.backgroundImage, "src")
    ]);

    if (!isVisible || !imgSrc) {
      return false;
    }

    const normalizedMissionName = missionName.toLowerCase().replace(/\s/g, "");
    const normalizedSrc = imgSrc.toLowerCase();
    
    return normalizedSrc.includes(normalizedMissionName);
  }

  async isTabDesignConsistent(): Promise<boolean> {
    const tabsCount = await this.missionTabs.count();
    if (tabsCount === 0) return false;

    for (let i = 0; i < tabsCount; i++) {
      const className = await this.getElementAttribute(this.missionTabs.nth(i), "class");
      if (!className.includes("mission-tab")) {
        return false;
      }
    }
    
    return true;
  }

  async isMetricsGridLayoutClean(): Promise<boolean> {
    const [displayStyle, gap] = await Promise.all([
      this.getComputedStyle(this.metricsTable, "display"),
      this.getComputedStyle(this.metricsTable, "gap")
    ]);

    const validDisplays = ["grid", "flex", "block", "table"];
    const gapValue = this.parseStyleNumber(gap);
    const hasSpacing = gapValue > 0;

    return validDisplays.includes(displayStyle) && hasSpacing;
  }

  async isTypographyClearAndReadable(): Promise<boolean> {
    const [color, fontSize] = await Promise.all([
      this.getComputedStyle(this.sectionDescription, "color"),
      this.getComputedStyle(this.sectionDescription, "fontSize")
    ]);

    const fontSizeValue = this.parseStyleNumber(fontSize);
    const isGoodSize = fontSizeValue > 14;
    const isReadableContrast = !color.includes("255, 255, 255") && color !== "rgba(0, 0, 0, 0)";

    return isGoodSize && isReadableContrast;
  }

  async getMissionTabsCount(): Promise<number> {
    return await this.missionTabs.count();
  }

  async getMetricsCount(): Promise<number> {
    const metrics = await this.getActiveMissionMetrics();
    return metrics.length;
  }

  async isSectionFullyLoaded(): Promise<boolean> {
    const [isSectionVisible, hasTabs, hasMetrics] = await Promise.all([
      this.ourMissionsSection.isVisible(),
      this.missionTabs.first().isVisible(),
      this.metricsTable.isVisible()
    ]);

    return isSectionVisible && hasTabs && hasMetrics;
  }

  async getActiveTabName(): Promise<string> {
    const tabs = await this.getMissionTabs();
    for (const tab of tabs) {
      if (await this.isTabActive(tab.name)) {
        return tab.name;
      }
    }
    return "";
  }
}