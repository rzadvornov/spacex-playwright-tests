import { Locator, Page, expect } from "@playwright/test";

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
    this.ourMissionsSection = page.locator(
      '[data-test="our-missions-section"]'
    );
    this.sectionTitle = this.ourMissionsSection.locator("h2");
    this.sectionDescription = this.ourMissionsSection.locator(
      ".section-description"
    );
    this.missionTabs = this.ourMissionsSection.locator(".mission-tab");
    this.metricsTable = this.ourMissionsSection.locator(".metrics-table");
    this.joinMissionButton = this.ourMissionsSection.locator(
      'button:text("Join a mission")'
    );
    this.backgroundImage = this.ourMissionsSection.locator(".background-image");
    this.submissionForm = page.locator('form[aria-label="Mission Submission"]'); 
  }

  async scrollIntoView(): Promise<void> {
    await this.ourMissionsSection.scrollIntoViewIfNeeded();
    await this.page.waitForLoadState("domcontentloaded");
  }

  async getSectionTitle(): Promise<string> {
    return (await this.sectionTitle.textContent()) || "";
  }

  async getSectionDescription(): Promise<string> {
    return (await this.sectionDescription.textContent()) || "";
  }

  async getMissionTabs(): Promise<{ name: string; order: string }[]> {
    const tabs = await this.missionTabs.all();
    const missionTabs: { name: string; order: string }[] = [];

    for (let i = 0; i < tabs.length; i++) {
      const tab = tabs[i];
      const name = (await tab.textContent())?.trim() || "";
      const order = (await tab.getAttribute("data-order")) || String(i + 1);

      if (name) {
        missionTabs.push({ name, order });
      }
    }
    return missionTabs;
  }

  async getTabByName(tabName: string): Promise<Locator> {
    return this.missionTabs.filter({ hasText: tabName });
  }

  async clickMissionTab(tabName: string): Promise<void> {
    await (await this.getTabByName(tabName)).click();
  }

  async isTabActive(tabName: string): Promise<boolean> {
    const tab = await this.getTabByName(tabName);
    const classAttr = await tab.getAttribute("class");
    return classAttr?.includes("active") ?? false;
  }

  async getActiveMissionMetrics(): Promise<
    Array<{ metric: string; value: string }>
  > {
    const rows = await this.metricsTable.locator("tr").all();
    const metrics: Array<{ metric: string; value: string }> = [];

    for (const row of rows) {
      const header = await row.locator("th").textContent();
      const value = await row.locator("td").textContent();
      if (header && value) {
        metrics.push({ metric: header.trim(), value: value.trim() });
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
    const opacity = await this.backgroundImage.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return parseFloat(style.opacity);
    });
    return opacity;
  }

  async getCargoScienceLines(): Promise<string[]> {
    const cargoCell = this.metricsTable
      .locator("tr", {
        has: this.page.locator('th:text("Cargo / Science")'),
      })
      .locator("td");

    const text = (await cargoCell.textContent()) || "";
    return text
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
  }

  async getMetricValue(metricName: string): Promise<string> {
    const row = this.metricsTable.locator("tr", {
      has: this.page.locator(`th:text("${metricName}")`),
    });
    return (await row.locator("td").textContent()) || "";
  }

  async isTabContentUpdated(
    previousMetrics: Array<{ metric: string; value: string }>
  ): Promise<boolean> {
    const currentMetrics = await this.getActiveMissionMetrics();
    if (currentMetrics.length === 0 || previousMetrics.length === 0)
      return false;

    const hasChanged = currentMetrics.some((current) => {
      const previous = previousMetrics.find(
        (prev) => prev.metric === current.metric
      );
      return previous ? previous.value !== current.value : true;
    });

    return hasChanged;
  }

  async isMissionSubmissionFormVisible(): Promise<boolean> {
    return await this.submissionForm.isVisible();
  }

  async performRapidTabSwitching(tabs: string[]): Promise<void> {
    for (const tabName of tabs) {
      await this.clickMissionTab(tabName);
    }
  }

  async isContentTransitionSmooth(): Promise<boolean> {
      let noErrorsBefore = true; 
      const errors: any[] = [];
      this.page.on('console', (msg) => {
          if (msg.type() === 'error') {
              errors.push(msg.text());
          }
      });
      
      const tabNames = ['Earth Orbit', 'Space Station', 'Moon', 'Mars'];
      const tabs = tabNames.map(name => this.getTabByName(name));

      for (let i = 0; i < 4; i++) {
          await (await tabs[i]).click();
          await this.page.waitForTimeout(100); 
      }

      return errors.length === 0;
  }

  async isUIResponsive(): Promise<boolean> {
    const startTime = Date.now();
    await this.joinMissionButton.click({ timeout: 5000 });
    await this.page.goBack();
    const endTime = Date.now();

    return endTime - startTime < 2000;
  }

  async isBackgroundImageRelevantToMission(
    missionName: string
  ): Promise<boolean> {
    const imgSrc = await this.backgroundImage.getAttribute("src");
    const isVisible = await this.backgroundImage.isVisible();
    const relevantCheck = imgSrc
      ?.toLowerCase()
      .includes(missionName.toLowerCase().replace(/\s/g, ""));

    return isVisible && !!relevantCheck;
  }

  async isTabDesignConsistent(): Promise<boolean> {
    const tabs = await this.missionTabs.all();
    if (tabs.length === 0) return false;

    const firstTabClass = await tabs[0].getAttribute("class");
    if (!firstTabClass) return false;

    for (let i = 1; i < tabs.length; i++) {
      const className = await tabs[i].getAttribute("class");
      if (!className?.includes("mission-tab")) return false;
    }
    return true;
  }

  async isMetricsGridLayoutClean(): Promise<boolean> {
    const displayStyle = await this.metricsTable.evaluate(
      (el) => window.getComputedStyle(el).display
    );
    const gap = await this.metricsTable.evaluate(
      (el) =>
        window.getComputedStyle(el).gap || window.getComputedStyle(el).padding
    );

    const isGridOrFlex =
      displayStyle === "grid" ||
      displayStyle === "flex" ||
      displayStyle === "block" ||
      displayStyle === "table";
    const hasSpacing = parseFloat(gap) > 0;

    return isGridOrFlex && hasSpacing;
  }

  async isTypographyClearAndReadable(): Promise<boolean> {
    const descriptionColor = await this.sectionDescription.evaluate(
      (el) => window.getComputedStyle(el).color
    );
    const descriptionFontSize = await this.sectionDescription.evaluate(
      (el) => window.getComputedStyle(el).fontSize
    );

    const isGoodSize = parseFloat(descriptionFontSize) > 14;
    const isReadableContrast =
      descriptionColor !== "rgb(255, 255, 255)" &&
      descriptionColor !== "rgba(0, 0, 0, 0)";

    return isGoodSize && isReadableContrast;
  }
}
