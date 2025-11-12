import { Page, Locator } from "@playwright/test";
import { PerformanceMetrics, PerformanceMetricResolver } from "./types/Types";

export class AccessibilityTools {
  private readonly page: Page;
  private readonly defaultTimeout: number;

  constructor(page: Page, defaultTimeout: number) {
    this.page = page;
    this.defaultTimeout = defaultTimeout;
  }

  /**
   * Executes the performance observer logic within the browser context.
   * This function must be self-contained and not rely on 'this'.
   */
  private static performanceEvaluationFn(): Promise<PerformanceMetrics> {
    return new Promise<PerformanceMetrics>(
      (resolve: PerformanceMetricResolver) => {
        const metrics: PerformanceMetrics = {};
        let observersActive = 2;
        let resolved = false;

        const areMetricsComplete = (m: PerformanceMetrics): boolean => {
          return (
            m.lcp !== undefined && m.fid !== undefined && m.cls !== undefined
          );
        };

        const cleanupObservers = (
          ...observers: PerformanceObserver[]
        ): void => {
          observers.forEach((observer) => {
            try {
              observer.disconnect();
            } catch (error) {}
          });
        };

        const calculateCLS = (m: PerformanceMetrics): void => {
          const clsEntries = performance.getEntriesByType("layout-shift");
          m.cls = (clsEntries as any[]).reduce(
            (sum, entry: any) => sum + entry.value,
            0
          );
        };

        const checkAndResolve = () => {
          observersActive--;
          if (resolved) return;

          if (observersActive === 0 || areMetricsComplete(metrics)) {
            resolved = true;
            cleanupObservers(lcpObserver, fidObserver);
            calculateCLS(metrics);
            resolve(metrics);
          }
        };

        const setupLCPObserver = () => {
          const observer = new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const lastEntry = entries[entries.length - 1];
            if (lastEntry) {
              metrics.lcp = lastEntry.startTime;
              observer.disconnect();
              checkAndResolve();
            }
          });
          observer.observe({ entryTypes: ["largest-contentful-paint"] });
          return observer;
        };

        const setupFIDObserver = () => {
          const observer = new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries() as PerformanceEventTiming[];
            if (entries.length > 0) {
              const firstInput = entries[0];
              metrics.fid = firstInput.processingStart - firstInput.startTime;
              observer.disconnect();
              checkAndResolve();
            }
          });
          observer.observe({ entryTypes: ["first-input"] });
          return observer;
        };

        const lcpObserver = setupLCPObserver();
        const fidObserver = setupFIDObserver();

        setTimeout(() => {
          if (!resolved) {
            resolved = true;
            calculateCLS(metrics);
            cleanupObservers(lcpObserver, fidObserver);
            resolve(metrics);
          }
        }, 1000);
      }
    );
  }

  /**
   * Public method that delegates execution to the browser context.
   */
  async getPerformanceMetrics(): Promise<PerformanceMetrics> {
    return await this.page.evaluate(AccessibilityTools.performanceEvaluationFn);
  }

  async pressTabKeyUntil(
    selector: string,
    maxTries: number = 50
  ): Promise<Locator | null> {
    const targetLocator = this.page.locator(selector);

    await this.resetFocusToBody();

    for (let i = 0; i < maxTries; i++) {
      await this.pressTabAndWait();

      const isTargetFocused = await this.isElementFocused(targetLocator);

      if (isTargetFocused) {
        return targetLocator;
      }

      if (i > 1 && (await this.isBackAtBody())) {
        break;
      }
    }
    return null;
  }

  /**
   * Orchestrates the tab order check process.
   * Assumes this method is inside a class that has access to helper methods.
   */
  async checkLogicalTabOrder(focusableElements: Locator[]): Promise<boolean> {
    if (focusableElements.length === 0) {
      return true;
    }

    const { maxTries, tabCycleThreshold } = this.calculateTabOrderParameters(
      focusableElements.length
    );
    const visitedElements = new Map<string, number>();

    try {
      await this.resetFocusToStart();

      await this.performTabNavigationLoop(
        maxTries,
        tabCycleThreshold,
        visitedElements
      );

      return this.calculateTabOrderScore(
        visitedElements.size,
        focusableElements.length
      );
    } catch (error) {
      console.error("Error checking tab order:", error);
      return false;
    }
  }

  /**
   * Calculates the maximum attempts and loop threshold based on the number of elements.
   */
  private calculateTabOrderParameters(elementCount: number): {
    maxTries: number;
    tabCycleThreshold: number;
  } {
    return {
      maxTries: Math.min(elementCount * 2 + 10, 50),
      tabCycleThreshold: elementCount + 2,
    };
  }

  /**
   * Executes the loop that simulates 'Tab' key presses and records focus.
   */
  private async performTabNavigationLoop(
    maxTries: number,
    tabCycleThreshold: number,
    visitedElements: Map<string, number>
  ): Promise<void> {
    for (let attempt = 0; attempt < maxTries; attempt++) {
      await this.pressTabAndWait();

      const focusedElement = await this.getFocusedElement();
      const elementKey = await this.generateElementKey(focusedElement);

      const shouldStop = await this.shouldStopTabNavigation(
        focusedElement,
        attempt,
        tabCycleThreshold,
        visitedElements,
        elementKey
      );

      if (shouldStop) {
        break;
      }

      visitedElements.set(elementKey, attempt);
    }
  }

  /**
   * Checks all conditions (cycle break, infinite loop) for stopping the tab navigation.
   */
  private async shouldStopTabNavigation(
    focusedElement: Locator,
    attempt: number,
    tabCycleThreshold: number,
    visitedElements: Map<string, number>,
    elementKey: string
  ): Promise<boolean> {
    if (
      (await this.isBackAtStart(focusedElement)) &&
      attempt > tabCycleThreshold
    ) {
      return true;
    }

    if (this.isStuckInLoop(visitedElements, elementKey, attempt)) {
      console.warn(`Tab navigation stuck at element: ${elementKey}`);
      return true;
    }

    return false;
  }

  private async resetFocusToBody(): Promise<void> {
    await this.page.locator("body").click({ force: true });
  }

  private async pressTabAndWait(): Promise<void> {
    await this.page.keyboard.press("Tab");
    await this.page.waitForTimeout(50);
  }

  private async isElementFocused(locator: Locator): Promise<boolean> {
    return await locator.evaluate((el) => el === document.activeElement);
  }

  private async isBackAtBody(): Promise<boolean> {
    return await this.page
      .locator(":focus")
      .evaluate((el) => el === document.body);
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
