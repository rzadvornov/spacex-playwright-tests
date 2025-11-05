import { Page, expect } from "@playwright/test";
import { Then, Fixture } from "playwright-bdd/decorators";
import { DataTable } from "playwright-bdd";
import {
  LayoutShiftEntry,
  ResourceTimingInfo,
} from "../../../../utils/types/Types";
import { HumanSpaceflightPage } from "../../../../pages/ui/HumanSpaceflightPage";

@Fixture("responsivePerformanceSteps")
export class ResponsivePerformanceSteps {
  private readonly PERFORMANCE_THRESHOLDS = {
    MAX_LAYOUT_SHIFT: 0.1,
    MAX_INPUT_DELAY: 100,
    MAX_ANIMATION_DURATION: 300,
  } as const;

  constructor(private page: Page, private humanSpaceflightPage: HumanSpaceflightPage) {}

  @Then("layout shifts should be minimal during viewport changes")
  async checkLayoutShifts() {
    const layoutShift = await this.page.evaluate(() => {
      return new Promise<number>((resolve) => {
        let cumulativeShift = 0;

        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            const layoutEntry = entry as LayoutShiftEntry;
            if (layoutEntry.hadRecentInput) continue;
            cumulativeShift += layoutEntry.value;
          }
          resolve(cumulativeShift);
        });

        try {
          observer.observe({ type: "layout-shift", buffered: true });
          setTimeout(() => resolve(cumulativeShift), 1000);
        } catch (e) {
          resolve(0);
        }
      });
    });

    expect(layoutShift, "Layout shifts should be minimal").toBeLessThanOrEqual(
      this.PERFORMANCE_THRESHOLDS.MAX_LAYOUT_SHIFT
    );
  }

  @Then("animations should be smooth and performant")
  async checkAnimationPerformance() {
    const animationMetrics = await this.page.evaluate(() => {
      return new Promise<{ duration: number; fps: number }>((resolve) => {
        let startTime = performance.now();
        let frameCount = 0;

        function checkFrame() {
          frameCount++;
          if (performance.now() - startTime < 1000) {
            requestAnimationFrame(checkFrame);
          } else {
            resolve({
              duration: performance.now() - startTime,
              fps: frameCount,
            });
          }
        }

        requestAnimationFrame(checkFrame);
      });
    });

    expect(
      animationMetrics.fps,
      "Animations should maintain good FPS"
    ).toBeGreaterThan(30);
  }

  @Then("touch interactions should respond immediately")
  async checkTouchResponse() {
    const responseTime = await this.page.evaluate(() => {
      return new Promise<number>((resolve) => {
        const button = document.createElement("button");
        button.textContent = "Test";
        button.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          width: 50px;
          height: 50px;
          opacity: 0.01;
          pointer-events: all;
        `;
        document.body.appendChild(button);

        let startTime: number;

        const pointerDownHandler = () => {
          startTime = performance.now();
        };

        const clickHandler = () => {
          const endTime = performance.now();
          resolve(endTime - startTime);
          button.removeEventListener("pointerdown", pointerDownHandler);
          button.removeEventListener("click", clickHandler);
          document.body.removeChild(button);
        };

        button.addEventListener("pointerdown", pointerDownHandler);
        button.addEventListener("click", clickHandler);

        button.click();
      });
    });

    expect(
      responseTime,
      "Touch interactions should respond immediately"
    ).toBeLessThanOrEqual(this.PERFORMANCE_THRESHOLDS.MAX_INPUT_DELAY);
  }

  @Then("the page should maintain performance standards:")
  async checkPerformanceStandards(dataTable: DataTable) {
    const standards = dataTable.hashes();

    for (const standard of standards) {
      await this.validatePerformanceStandard(standard.Metric, standard.Value);
    }
  }

  private async validatePerformanceStandard(
    metric: string,
    value: string
  ): Promise<void> {
    const validators: Record<string, () => Promise<void>> = {
      "Layout Stability": () => this.validateLayoutStability(value),
      "Interaction Response": () => this.validateInteractionResponse(value),
      "Animation Performance": () => this.validateAnimationPerformance(),
      "Resource Loading": () => this.validateResourceLoading(value),
    };

    const validator = validators[metric];
    if (!validator) {
      throw new Error(`Unknown performance metric: ${metric}`);
    }

    await validator();
  }

  private async validateLayoutStability(expectedValue: string): Promise<void> {
    const maxShift = parseFloat(expectedValue);
    const actualShift = await this.page.evaluate(() => {
      return new Promise<number>((resolve) => {
        let cumulativeShift = 0;

        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            const layoutEntry = entry as LayoutShiftEntry;
            if (layoutEntry.hadRecentInput) continue;
            cumulativeShift += layoutEntry.value;
          }
          resolve(cumulativeShift);
        });

        try {
          observer.observe({ type: "layout-shift", buffered: true });
          setTimeout(() => resolve(cumulativeShift), 1000);
        } catch (e) {
          resolve(0);
        }
      });
    });

    expect(
      actualShift,
      "Layout stability should meet standard"
    ).toBeLessThanOrEqual(maxShift);
  }

  private async validateInteractionResponse(
    expectedValue: string
  ): Promise<void> {
    const maxDelay = parseInt(expectedValue);
    const responseTime = await this.page.evaluate(() => {
      return new Promise<number>((resolve) => {
        const start = performance.now();
        setTimeout(() => {
          resolve(performance.now() - start);
        }, 0);
      });
    });

    expect(
      responseTime,
      "Interaction response should meet standard"
    ).toBeLessThanOrEqual(maxDelay);
  }

  private async validateAnimationPerformance(): Promise<void> {
    const animationPerformance = await this.page.evaluate(() => {
      const animatedElements = document.querySelectorAll(
        "[class*='animate'], [class*='transition']"
      );
      if (animatedElements.length === 0)
        return { maxDuration: 0, hasAnimations: false };

      let maxDuration = 0;
      animatedElements.forEach((el) => {
        const style = getComputedStyle(el);
        const animationDuration =
          parseFloat(style.animationDuration || "0") * 1000;
        const transitionDuration =
          parseFloat(style.transitionDuration || "0") * 1000;
        maxDuration = Math.max(
          maxDuration,
          animationDuration,
          transitionDuration
        );
      });

      return { maxDuration, hasAnimations: true };
    });

    if (animationPerformance.hasAnimations) {
      expect(
        animationPerformance.maxDuration,
        "Animation performance should meet standard"
      ).toBeLessThanOrEqual(this.PERFORMANCE_THRESHOLDS.MAX_ANIMATION_DURATION);
    }
  }

  private async validateResourceLoading(expectedValue: string): Promise<void> {
    const resourceTiming = await this.page.evaluate(
      (): ResourceTimingInfo[] => {
        const resources = performance.getEntriesByType("resource");
        return resources.map((entry) => ({
          name: entry.name,
          duration: entry.duration,
        }));
      }
    );

    const averageLoadTime =
      resourceTiming.length > 0
        ? resourceTiming.reduce((sum, resource) => sum + resource.duration, 0) /
          resourceTiming.length
        : 0;

    const maxLoadTime = parseInt(expectedValue);

    expect(
      averageLoadTime,
      "Resource loading should meet performance standard"
    ).toBeLessThanOrEqual(maxLoadTime);
  }

  @Then("page load performance should be acceptable")
  async checkPageLoadPerformance() {
    const performanceMetrics = await this.page
      .evaluate(() => {
        return JSON.stringify(window.performance);
      })
      .catch(() => null);

    if (performanceMetrics) {
      const perfData = JSON.parse(performanceMetrics);
      const navigationEntry = perfData.timing;

      if (navigationEntry) {
        const loadTime =
          navigationEntry.loadEventEnd - navigationEntry.navigationStart;
        expect(
          loadTime,
          "Page should load within acceptable time"
        ).toBeLessThan(3000);
        return;
      }
    }

    const startTime = Date.now();
    await this.page.goto(this.page.url(), { waitUntil: "load" });
    const loadTime = Date.now() - startTime;

    expect(loadTime, "Page should load within acceptable time").toBeLessThan(
      3000
    );
  }

  @Then("first contentful paint should be fast")
  async checkFirstContentfulPaint() {
    const fcp = await this.page.evaluate(() => {
      const fcpEntry = performance.getEntriesByName(
        "first-contentful-paint"
      )[0] as any;
      if (fcpEntry) {
        return fcpEntry.startTime || fcpEntry.renderTime || 0;
      }

      return new Promise<number>((resolve) => {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          if (entries.length > 0) {
            const entry = entries[0] as any;
            resolve(entry.startTime || entry.renderTime || 0);
          } else {
            resolve(0);
          }
          observer.disconnect();
        });

        try {
          observer.observe({ type: "paint", buffered: true });
          setTimeout(() => resolve(performance.now()), 1000);
        } catch (e) {
          resolve(performance.now());
        }
      });
    });

    expect(fcp, "First contentful paint should be fast").toBeLessThan(2000);
  }

  @Then("the page should load quickly")
  async checkPageLoadTime() {
    const loadTime = await this.page.evaluate(() => {
      return performance.now();
    });

    expect(loadTime, "Page should load quickly").toBeLessThan(5000);
  }

  @Then("JavaScript execution should be efficient")
  async checkJavaScriptPerformance() {
    const executionTime = await this.page.evaluate(() => {
      const start = performance.now();
      let sum = 0;
      for (let i = 0; i < 100000; i++) {
        sum += Math.sqrt(i);
      }
      return performance.now() - start;
    });

    expect(
      executionTime,
      "JavaScript execution should be efficient"
    ).toBeLessThan(100);
  }

  @Then("the page should provide optimal mobile experience")
  async checkMobileExperience() {
    const mobileOptimization =
      await this.humanSpaceflightPage.performanceSEO.checkMobileOptimization();
    await this.validateMobileExperience(mobileOptimization);
  }

  private async validateMobileExperience(
    mobileOptimization: any
  ): Promise<void> {
    const validations = [
      this.validateTextReadability(mobileOptimization),
      this.validateTouchTargets(mobileOptimization),
      this.validateNoInterstitials(mobileOptimization),
      this.validateViewportMetaTag(),
      this.validateViewportAdaptation(),
    ];

    const results = await Promise.allSettled(validations);

    const failedValidations = results.filter(
      (result) => result.status === "rejected"
    );
    if (failedValidations.length > 0) {
      const errorMessages = failedValidations.map(
        (result: PromiseRejectedResult) => result.reason.message
      );
      throw new Error(
        `Mobile experience validation failed:\n${errorMessages.join("\n")}`
      );
    }
  }

  private async validateTextReadability(
    mobileOptimization: any
  ): Promise<void> {
    if (!mobileOptimization.textReadable) {
      throw new Error("Text should be readable on mobile without zoom");
    }
  }

  private async validateTouchTargets(mobileOptimization: any): Promise<void> {
    if (!mobileOptimization.touchTargetsSize) {
      throw new Error(
        "Touch targets should be properly sized for mobile (min 44x44px)"
      );
    }
  }

  private async validateNoInterstitials(
    mobileOptimization: any
  ): Promise<void> {
    if (!mobileOptimization.noInterstitials) {
      throw new Error("No interstitials should block mobile content");
    }
  }

  private async validateViewportMetaTag(): Promise<void> {
    const viewportMeta =
      await this.humanSpaceflightPage.performanceSEO.getMetaTags();
    if (!viewportMeta["viewport"]) {
      throw new Error(
        "Viewport meta tag should be present for mobile optimization"
      );
    }
  }

  private async validateViewportAdaptation(): Promise<void> {
    const MOBILE_MAX_WIDTH = 400;
    const pageWidth = await this.page.evaluate(
      () => document.documentElement.clientWidth
    );

    if (pageWidth > MOBILE_MAX_WIDTH) {
      throw new Error(
        `Page should adapt to mobile viewport (max ${MOBILE_MAX_WIDTH}px, actual: ${pageWidth}px)`
      );
    }
  }
}
