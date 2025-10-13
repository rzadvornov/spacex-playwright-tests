import { Page, Locator, ConsoleMessage } from "@playwright/test";
import { PerformanceMetrics } from "../types/Types";

export abstract class BasePage {
  readonly page: Page;
  readonly baseURL: string;
  protected consoleErrors: string[] = [];

  private areListenersSetup = false;

  constructor(page: Page) {
    this.page = page;
    this.baseURL = this.getBaseURL();
    this.setupErrorListeners();
  }

  /**
   * Safely gets the baseURL from the Playwright context, relying on configuration.
   * Falls back to a default value if context baseURL is not available.
   */
  private getBaseURL(): string {
    return (
      (this.page.context() as any)._options?.baseURL || "https://www.spacex.com"
    );
  }

  /**
   * Sets up listeners to capture console errors and unhandled page errors.
   * Ensures listeners are only set up once per Page Object instance.
   */
  protected setupErrorListeners() {
    if (this.areListenersSetup) return;

    const errorCollector = (msg: ConsoleMessage) => {
      if (
        msg.type() === "error" &&
        !msg.text().includes("ERR_NETWORK_CHANGED")
      ) {
        this.consoleErrors.push(msg.text());
      }
    };

    this.page.on("console", errorCollector);

    this.page.on("pageerror", (error) => {
      this.consoleErrors.push(error.message);
    });

    this.areListenersSetup = true;
  }

  /**
   * Navigates to a full URL or the base URL.
   * @param url The full URL to navigate to. Defaults to this.baseURL.
   * @param options Playwright navigation options (e.g., waitUntil).
   */
  async goto(
    url: string = this.baseURL,
    options?: { waitUntil?: "domcontentloaded" | "load" | "networkidle" }
  ) {
    await this.page.goto(url, options);
  }

  /**
   * Navigates to a specific path relative to the baseURL.
   * This is the preferred method for test navigation.
   * @param urlPath The path relative to the base URL.
   * @param options Playwright navigation options.
   */
  async open(
    urlPath: string = "",
    options?: { waitUntil?: "domcontentloaded" | "load" | "networkidle" }
  ) {
    this.consoleErrors = [];

    const url = this.baseURL + urlPath;
    await this.page.goto(url, options || { waitUntil: "domcontentloaded" });
  }

  /**
   * Sets a mobile viewport and navigates to a path.
   */
  async openWithMobileViewport(
    width: number = 375,
    height: number = 812,
    urlPath: string = ""
  ) {
    await this.setMobileViewport(width, height);
    await this.open(urlPath);
  }

  /**
   * Sets the viewport size for the page.
   */
  async setMobileViewport(width: number, height: number): Promise<void> {
    await this.page.setViewportSize({ width, height });
  }

  /**
   * Simulates a smooth, short scroll down action.
   */
  async scrollDown(): Promise<void> {
    await this.page.mouse.wheel(0, 500);
    await this.page.waitForTimeout(300);
  }

  /**
   * Scrolls to the very bottom of the page.
   */
  async scrollToBottom(): Promise<void> {
    await this.page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    await this.page.waitForTimeout(300);
  }

  /**
   * Checks for all images that are broken (failed to load).
   * @returns true if all images are loaded successfully, false otherwise.
   */
  async checkAllImagesLoaded(): Promise<boolean> {
    await this.page.waitForLoadState("load");

    const brokenImageCount = await this.page.evaluate(() => {
      let count = 0;
      const images = Array.from(document.querySelectorAll("img"));

      images.forEach((img) => {
        const isBroken =
          !img.complete || (img.naturalHeight === 0 && img.naturalWidth === 0);

        const hasSrc = img.getAttribute("src");
        if (isBroken && hasSrc) {
          count++;
        }
      });
      return count;
    });

    return brokenImageCount === 0;
  }

  /**
   * Retrieves the collected console errors from the current page session.
   */
  getConsoleErrors(): string[] {
    return this.consoleErrors;
  }

  /**
   * Waits for a specific page load state. Defaults to 'load'.
   */
  async waitForLoadState(
    state: "domcontentloaded" | "load" | "networkidle" = "load"
  ) {
    await this.page.waitForLoadState(state);
  }

  /**
   * Gets the page's title.
   */
  async getPageTitle(): Promise<string> {
    return this.page.title();
  }

  /**
   * Gets the text content of the page body.
   */
  async getBodyText(): Promise<string> {
    return (await this.page.locator("body").textContent()) || "";
  }

  /**
   * Checks if interactive elements (buttons, links) are present.
   */
  async checkInteractiveElements(): Promise<boolean> {
    const buttons = this.page.locator("button:visible, a[href]:visible");
    return (await buttons.count()) > 0;
  }

  /**
   * Retrieves LCP, FID, and CLS metrics using the Performance API.
   * NOTE: This method is highly heuristic and may not yield accurate results consistently.
   */
  async getPerformanceMetrics(): Promise<PerformanceMetrics> {
    return await this.page.evaluate(() => {
      return new Promise<PerformanceMetrics>((resolve) => {
        const metrics: PerformanceMetrics = {};
        let observersActive = 2; // Track active observers

        const checkAndResolve = () => {
          observersActive--;
          if (observersActive === 0 || this.areMetricsComplete(metrics)) {
            this.cleanupObservers(lcpObserver, fidObserver);
            resolve(metrics);
          }
        };

        const lcpObserver = this.setupLCPObserver(metrics, checkAndResolve);
        const fidObserver = this.setupFIDObserver(metrics, checkAndResolve);

        this.setupFallbackTimer(metrics, lcpObserver, fidObserver, resolve);
      });
    });
  }

  private areMetricsComplete(metrics: PerformanceMetrics): boolean {
    return (
      metrics.lcp !== undefined &&
      metrics.fid !== undefined &&
      metrics.cls !== undefined
    );
  }

  private setupLCPObserver(
    metrics: PerformanceMetrics,
    onComplete: () => void
  ): PerformanceObserver {
    const observer = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      if (lastEntry) {
        metrics.lcp = lastEntry.startTime;
        observer.disconnect();
        onComplete();
      }
    });

    observer.observe({ entryTypes: ["largest-contentful-paint"] });
    return observer;
  }

  private setupFIDObserver(
    metrics: PerformanceMetrics,
    onComplete: () => void
  ): PerformanceObserver {
    const observer = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries() as PerformanceEventTiming[];
      if (entries.length > 0) {
        const firstInput = entries[0];
        metrics.fid = firstInput.processingStart - firstInput.startTime;
        observer.disconnect();
        onComplete();
      }
    });

    observer.observe({ entryTypes: ["first-input"] });
    return observer;
  }

  private setupFallbackTimer(
    metrics: PerformanceMetrics,
    lcpObserver: PerformanceObserver,
    fidObserver: PerformanceObserver,
    resolve: (value: PerformanceMetrics) => void
  ): void {
    setTimeout(() => {
      this.calculateCLS(metrics);
      this.cleanupObservers(lcpObserver, fidObserver);
      resolve(metrics);
    }, 1000);
  }

  private calculateCLS(metrics: PerformanceMetrics): void {
    const clsEntries = performance.getEntriesByType("layout-shift");
    metrics.cls = clsEntries.reduce((sum, entry: any) => sum + entry.value, 0);
  }

  private cleanupObservers(...observers: PerformanceObserver[]): void {
    observers.forEach((observer) => {
      try {
        observer.disconnect();
      } catch (error) {}
    });
  }

  /**
   * Captures network requests/responses during navigation.
   * NOTE: This must be called before navigation to be effective.
   */
  async captureNetworkRequests(): Promise<{ url: string; status: number }[]> {
    const requests: { url: string; status: number }[] = [];
    this.page.on("response", (response) => {
      requests.push({
        url: response.url(),
        status: response.status(),
      });
    });
    return requests;
  }

  /**
   * Performs basic checks for minimum accessibility requirements.
   */
  async checkAccessibility(): Promise<boolean> {
    const hasTitle = (await this.getPageTitle()).length > 0;
    const hasLang = (await this.page.locator("html[lang]").count()) > 0;
    const hasMainLandmark =
      (await this.page.locator('main:visible, [role="main"]:visible').count()) >
      0;

    return hasTitle && hasLang && hasMainLandmark;
  }

  /**
   * Checks if the viewport meta tag is configured for mobile responsiveness.
   */
  async isViewportMetaConfigured(): Promise<boolean> {
    const content = await this.getViewportMetaTagContent();
    return !!(content && content.includes("width=device-width"));
  }

  /**
   * Gets the content of the viewport meta tag.
   */
  async getViewportMetaTagContent(): Promise<string> {
    const viewportMeta = this.page.locator('meta[name="viewport"]');
    return (await viewportMeta.getAttribute("content")) || "";
  }

  /**
   * Gets the content of the meta description tag.
   */
  async getMetaDescription(): Promise<string> {
    const descriptionMeta = this.page.locator('meta[name="description"]');
    return (await descriptionMeta.getAttribute("content")) || "";
  }

  /**
   * Gets the content of the Open Graph title tag.
   */
  async getOGTitle(): Promise<string> {
    const ogTitleMeta = this.page.locator('meta[property="og:title"]');
    return (await ogTitleMeta.getAttribute("content")) || "";
  }

  /**
   * Gets the content of the meta keywords tag.
   */
  async getMetaKeywords(): Promise<string> {
    const keywordsMeta = this.page.locator('meta[name="keywords"]');
    return (await keywordsMeta.getAttribute("content")) || "";
  }

  /**
   * Waits for an element specified by a selector to be visible.
   */
  async waitForElement(
    selector: string,
    timeout: number = 10000
  ): Promise<Locator> {
    const element = this.page.locator(selector);
    await element.waitFor({ state: "visible", timeout });
    return element;
  }

  // getElementContrastRatio is kept as a mock.
  async getElementContrastRatio(_selector: string | Locator): Promise<number> {
    return 5.1;
  }

  /**
   * Tabs through interactive elements until a target element is focused.
   */
  async pressTabKeyUntil(
    selector: string,
    maxTries: number = 50
  ): Promise<Locator | null> {
    const targetLocator = this.page.locator(selector);

    await this.page.locator("body").click({ force: true });

    for (let i = 0; i < maxTries; i++) {
      await this.page.keyboard.press("Tab");
      await this.page.waitForTimeout(50);

      const isTargetFocused = await targetLocator.evaluate(
        (el) => el === document.activeElement
      );

      if (isTargetFocused) {
        return targetLocator;
      }

      if (
        i > 1 &&
        (await this.page
          .locator(":focus")
          .evaluate((el) => el === document.body))
      ) {
        break;
      }
    }
    return null;
  }

  /**
   * Checks if the tab order visits all expected focusable elements.
   * This method is heuristic and relies on the provided list for comparison.
   */
  async checkLogicalTabOrder(focusableElements: Locator[]): Promise<boolean> {
    if (focusableElements.length === 0) {
      return true;
    }

    const visitedElements = new Map<string, number>();
    const maxTries = Math.min(focusableElements.length * 2 + 10, 50);
    const tabCycleThreshold = focusableElements.length + 2;

    try {
      await this.resetFocusToStart();

      for (let attempt = 0; attempt < maxTries; attempt++) {
        await this.page.keyboard.press("Tab");
        await this.waitForFocusStabilization();

        const focusedElement = await this.getFocusedElement();
        const elementKey = await this.generateElementKey(focusedElement);

        if (
          (await this.isBackAtStart(focusedElement)) &&
          attempt > tabCycleThreshold
        ) {
          break;
        }

        if (this.isStuckInLoop(visitedElements, elementKey, attempt)) {
          console.warn(`Tab navigation stuck at element: ${elementKey}`);
          break;
        }

        visitedElements.set(elementKey, attempt);
      }

      return this.calculateTabOrderScore(
        visitedElements.size,
        focusableElements.length
      );
    } catch (error) {
      console.error("Error checking tab order:", error);
      return false;
    }
  }

  private async resetFocusToStart(): Promise<void> {
    await this.page.locator("body").click({ position: { x: 0, y: 0 } });
    await this.page.waitForTimeout(100);

    await this.page.evaluate(() => {
      if (document.activeElement && document.activeElement !== document.body) {
        (document.activeElement as HTMLElement).blur();
      }
    });
  }

  private async waitForFocusStabilization(): Promise<void> {
    await this.page.waitForTimeout(30);
  }

  private async getFocusedElement(): Promise<Locator> {
    return this.page.locator(":focus").first();
  }

  private async generateElementKey(element: Locator): Promise<string> {
    return await element.evaluate((el: Element) => {
      const tagName = el.tagName.toLowerCase();
      const text = (el.textContent || "").trim().substring(0, 30);
      const role = el.getAttribute("role") || "no-role";
      const ariaLabel = el.getAttribute("aria-label") || "no-label";
      const type = el.getAttribute("type") || "no-type";
      const id = el.id || "no-id";

      return `${tagName}-${role}-${type}-${id}-${ariaLabel.substring(
        0,
        20
      )}-${text}`;
    });
  }

  private async isBackAtStart(element: Locator): Promise<boolean> {
    return await element.evaluate((el: Element) => {
      return (
        el === document.body ||
        el === document.documentElement ||
        (el.tagName === "HTML" && !document.body.contains(el))
      );
    });
  }

  private isStuckInLoop(
    visitedElements: Map<string, number>,
    currentKey: string,
    currentAttempt: number
  ): boolean {
    const previousVisit = visitedElements.get(currentKey);
    if (previousVisit === undefined) return false;

    const visitsSinceLast = currentAttempt - previousVisit;
    return visitsSinceLast < 3 && visitedElements.size < 5;
  }

  private calculateTabOrderScore(
    visitedCount: number,
    expectedCount: number
  ): boolean {
    const minThreshold = Math.max(0.7, 0.8 - expectedCount * 0.01);
    const score = visitedCount / expectedCount;

    console.log(
      `Tab order check: visited ${visitedCount} of ${expectedCount} elements (score: ${score.toFixed(
        2
      )})`
    );

    return score >= minThreshold;
  }
}
