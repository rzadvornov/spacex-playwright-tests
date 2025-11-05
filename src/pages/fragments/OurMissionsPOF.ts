import { Locator, Page } from "@playwright/test";
import { MissionMetric, MissionTab } from "../../utils/types/Types";

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
  public previousActiveTab: string = "Earth Orbit";

  constructor(page: Page) {
    this.page = page;
    this.ourMissionsSection = page
      .locator('[data-test="our-missions-section"], .our-missions-section')
      .first();
    this.sectionTitle = this.ourMissionsSection
      .locator("h2, .section-title")
      .first();
    this.sectionDescription = this.ourMissionsSection
      .locator(".section-description, .description")
      .first();
    this.missionTabs = this.ourMissionsSection.locator(".mission-tab");
    this.metricsTable = this.ourMissionsSection.locator(".metrics-table");
    this.joinMissionButton = this.ourMissionsSection
      .locator('button:text("Join a mission"), a:text("Join a mission")')
      .first();
    this.backgroundImage = this.ourMissionsSection
      .locator(".background-image, img.background")
      .first();
    this.submissionForm = page
      .locator('form[aria-label="Mission Submission"], form.mission-form')
      .first();
  }

  private async getElementTextContent(element: Locator): Promise<string> {
    const text = await element.innerText();
    return text?.trim() ?? "";
  }

  private async getElementAttribute(
    element: Locator,
    attribute: string
  ): Promise<string> {
    const value = await element.getAttribute(attribute);
    return value ?? "";
  }

  private async getComputedStyle(
    element: Locator,
    property: string
  ): Promise<string> {
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
    const tabLocators = await this.missionTabs.all();
    if (tabLocators.length === 0) {
      return [];
    }

    const missionTabPromises = tabLocators.map(async (tab, index) => {
      const [name, order] = await Promise.all([
        this.getElementTextContent(tab),
        this.getElementAttribute(tab, "data-order"),
      ]);

      return {
        "Tab Name": name,
        Order: order || String(index + 1),
      };
    });

    return (await Promise.all(missionTabPromises)).filter(
      (tab) => tab["Tab Name"]
    );
  }

  async getTabByName(tabName: string): Promise<Locator> {
    return this.missionTabs
      .filter({ hasText: new RegExp(`^${tabName}$`, "i") })
      .first();
  }

  async clickMissionTab(tabName: string): Promise<void> {
    const tab = await this.getTabByName(tabName);

    this.previousActiveTab = await this.getActiveTabName();

    await tab.click();

    await tab.waitFor({ state: "attached" });
    await this.ourMissionsSection.waitFor({ state: "visible" });
  }

  async isTabActive(tabName: string): Promise<boolean> {
    const tab = await this.getTabByName(tabName);
    const classAttr = await this.getElementAttribute(tab, "class");
    return classAttr.includes("active");
  }

  async getActiveMissionMetrics(): Promise<MissionMetric[]> {
    const rows = await this.metricsTable.locator("tr").all();
    const metrics: MissionMetric[] = [];

    const rowPromises = rows.map(async (row) => {
      const headerLocator = row.locator("th").first();
      const valueLocator = row.locator("td").first();

      const [header, value] = await Promise.all([
        this.getElementTextContent(headerLocator),
        this.getElementTextContent(valueLocator),
      ]);

      return { header, value };
    });

    const results = await Promise.all(rowPromises);

    for (const { header, value } of results) {
      if (header && value) {
        metrics.push({
          Metric: header,
          Value: value,
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
    await this.page.waitForLoadState("networkidle");
  }

  async isBackgroundImageVisible(): Promise<boolean> {
    return await this.backgroundImage.isVisible();
  }

  async getBackgroundImageOpacity(): Promise<number> {
    const opacity = await this.getComputedStyle(
      this.backgroundImage,
      "opacity"
    );
    return this.parseStyleNumber(opacity);
  }

  async getCargoScienceLines(): Promise<string[]> {
    const cargoCell = this.metricsTable
      .locator("tr", {
        has: this.page.locator('th:text("Cargo / Science")'),
      })
      .locator("td")
      .first();

    const text = await this.getElementTextContent(cargoCell);
    return text
      .split(/[\r\n]+/)
      .map((line) => line.trim())
      .filter(Boolean);
  }

  async getMetricValue(metricName: string): Promise<string> {
    const row = this.metricsTable
      .locator("tr", {
        has: this.page.locator(`th:text-is-visible("${metricName}")`),
      })
      .first();

    await row.waitFor({ state: "attached", timeout: 5000 });

    return await this.getElementTextContent(row.locator("td").first());
  }

  async isTabContentUpdated(
    previousMetrics: MissionMetric[]
  ): Promise<boolean> {
    await this.page.waitForTimeout(300);

    const currentMetrics = await this.getActiveMissionMetrics();

    if (currentMetrics.length === 0 || previousMetrics.length === 0) {
      return false;
    }

    return currentMetrics.some((current) => {
      const previous = previousMetrics.find(
        (prev) => prev.Metric === current.Metric
      );
      return previous ? previous.Value !== current.Value : true;
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
    const TIMEOUT = 100;

    const consoleListener = (msg: {
      type: () => string;
      text: () => string;
    }) => {
      if (msg.type() === "error" || msg.type() === "warning") {
        errors.push(msg.text());
      }
    };
    this.page.on("console", consoleListener);

    const tabNames = ["Earth Orbit", "Space Station", "Moon", "Mars"];

    for (const tabName of tabNames) {
      await this.clickMissionTab(tabName);
      await this.page.waitForTimeout(TIMEOUT);
    }

    this.page.off("console", consoleListener);

    return errors.length === 0;
  }

  async isUIResponsive(): Promise<boolean> {
    const MAX_RESPONSE_TIME_MS = 1500;

    await this.joinMissionButton.waitFor({ state: "visible" });
    const startTime = Date.now();

    try {
      await this.joinMissionButton.click({ timeout: 5000 });
      await this.page.waitForLoadState("networkidle", { timeout: 5000 });

      const endTime = Date.now();
      const responseTime = endTime - startTime;

      await this.page.goBack({ waitUntil: "domcontentloaded" });

      return responseTime < MAX_RESPONSE_TIME_MS;
    } catch (e) {
      return false;
    }
  }

  async isBackgroundImageRelevantToMission(
    missionName: string
  ): Promise<boolean> {
    const [isVisible, imgSrc] = await Promise.all([
      this.backgroundImage.isVisible(),
      this.getElementAttribute(this.backgroundImage, "src"),
    ]);

    if (!isVisible || !imgSrc) {
      return false;
    }

    const normalizedMissionName = missionName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");
    const normalizedSrc = imgSrc.toLowerCase().replace(/[^a-z0-9]/g, "");

    return normalizedSrc.includes(normalizedMissionName);
  }

  async isTabDesignConsistent(): Promise<boolean> {
    const tabs = await this.missionTabs.all();
    if (tabs.length === 0) return false;

    const allHaveBaseClassChecks = tabs.map(async (tab) => {
      const className = await this.getElementAttribute(tab, "class");
      return className.includes("mission-tab");
    });

    if (!(await Promise.all(allHaveBaseClassChecks)).every(Boolean))
      return false;

    const firstTabBox = await tabs[0].boundingBox();
    if (!firstTabBox) return false;

    for (let i = 1; i < tabs.length; i++) {
      const currentTabBox = await tabs[i].boundingBox();
      if (
        !currentTabBox ||
        Math.abs(currentTabBox.height - firstTabBox.height) > 2
      ) {
        return false;
      }
    }

    return true;
  }

  async isMetricsGridLayoutClean(): Promise<boolean> {
    const tableBody = this.metricsTable.locator("tbody, div").first();

    const [displayStyle, gap] = await Promise.all([
      this.getComputedStyle(tableBody, "display"),
      this.getComputedStyle(tableBody, "gap"),
    ]);

    const isCleanLayout =
      displayStyle.includes("grid") || displayStyle.includes("flex");
    const gapValue = this.parseStyleNumber(gap);
    const hasSpacing = gapValue > 8;

    return isCleanLayout && hasSpacing;
  }

  async isTypographyClearAndReadable(): Promise<boolean> {
    const sectionDesc = this.sectionDescription;
    await sectionDesc.waitFor({ state: "attached" });

    const [color, fontSize, lineHeight, fontFamily] = await Promise.all([
      this.getComputedStyle(sectionDesc, "color"),
      this.getComputedStyle(sectionDesc, "fontSize"),
      this.getComputedStyle(sectionDesc, "lineHeight"),
      this.getComputedStyle(sectionDesc, "fontFamily"),
    ]);

    const fontSizeValue = this.parseStyleNumber(fontSize);
    const lineHeightValue = this.parseStyleNumber(lineHeight);

    const isGoodSize = fontSizeValue > 15;
    const hasGoodLineHeight = lineHeightValue / fontSizeValue > 1.2;
    const isReadableContrast =
      !color.includes("rgb(255, 255, 255)") && color !== "rgba(0, 0, 0, 0)";
    const hasSansSerif = !fontFamily.includes("serif");

    return (
      isGoodSize && hasGoodLineHeight && isReadableContrast && hasSansSerif
    );
  }

  async getMissionTabsCount(): Promise<number> {
    return await this.missionTabs.count();
  }

  async getMetricsCount(): Promise<number> {
    const metrics = await this.getActiveMissionMetrics();
    return metrics.length;
  }

  async isSectionFullyLoaded(): Promise<boolean> {
    await this.ourMissionsSection.waitFor({ state: "visible", timeout: 10000 });

    const [hasTabs, hasMetrics] = await Promise.all([
      this.missionTabs.first().isVisible(),
      this.metricsTable.isVisible(),
    ]);

    return hasTabs && hasMetrics;
  }

  async getActiveTabName(): Promise<string> {
    const activeTab = this.missionTabs.locator(".active").first();
    if ((await activeTab.count()) === 0) {
      return "";
    }
    return await this.getElementTextContent(activeTab);
  }

  async clickButton(buttonText: string): Promise<void> {
    const button = this.ourMissionsSection
      .locator("button, a", {
        hasText: new RegExp(`^${buttonText}$`, "i"),
      })
      .first();
    await button.click();
    await this.page.waitForLoadState("networkidle");
  }

  async isUpcomingLaunchesWidgetVisible(): Promise<boolean> {
    const possibleSelectors = [
      ".upcoming-launches",
      ".launches-widget",
      ".missions-widget",
      '[data-testid="upcoming-launches"]',
      '[class*="launch-summary"]',
      '[class*="mission-summary"]',
    ];

    const isVisibleChecks = possibleSelectors.map((selector) =>
      this.page.locator(selector).first().isVisible()
    );

    const results = await Promise.all(isVisibleChecks);
    return results.some((isVisible) => isVisible);
  }

  public async getPreviousActiveTab(): Promise<string> {
    return this.previousActiveTab;
  }

  async isBackgroundImageUpdated(): Promise<boolean> {
    const currentSrc = await this.getElementAttribute(
      this.backgroundImage,
      "src"
    );

    const tabs = await this.getMissionTabs();
    if (tabs.length < 2) return false;

    const currentActiveName = await this.getActiveTabName();
    const nextTabName = tabs.find((t) => t["Tab Name"] !== currentActiveName)?.[
      "Tab Name"
    ];

    if (!nextTabName) return false;

    await this.clickMissionTab(nextTabName);

    await this.page.waitForTimeout(500);

    const newSrc = await this.getElementAttribute(this.backgroundImage, "src");

    await this.clickMissionTab(currentActiveName);

    return currentSrc !== newSrc;
  }
}
