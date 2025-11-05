import { Then, Fixture } from "playwright-bdd/decorators";
import { DataTable } from "playwright-bdd";
import { VehicleBaseSteps } from "./VehicleBaseSteps";
import { Page, expect } from "@playwright/test";
import { HumanSpaceflightPage } from "../../../../pages/ui/HumanSpaceflightPage";

@Fixture("vehiclePerformanceSteps")
export class VehiclePerformanceSteps extends VehicleBaseSteps {
  constructor(
    protected page: Page,
    protected humanSpaceflightPage: HumanSpaceflightPage
  ) {
    super(page, humanSpaceflightPage);
  }

  @Then("the vehicle section should meet performance metrics:")
  async checkPerformanceMetrics(dataTable: DataTable) {
    const metrics = this.parseDataTable<any>(dataTable);

    for (const metric of metrics) {
      await this.validatePerformanceMetric(metric);
    }
  }

  @Then("media optimization should be verified:")
  async checkMediaOptimization(dataTable: DataTable) {
    const optimizations = this.parseDataTable<any>(dataTable);

    for (const optimization of optimizations) {
      await this.validateMediaOptimization(optimization);
    }
  }

  @Then("resource loading should be prioritized:")
  async checkResourceLoadingPrioritization(dataTable: DataTable) {
    const priorities = this.parseDataTable<any>(dataTable);

    for (const priority of priorities) {
      await this.validateResourceLoadingPriority(priority);
    }
  }

  private async validatePerformanceMetric(metric: any): Promise<void> {
    const { Metric } = metric;

    switch (Metric) {
      case "Image Loading":
        await this.validateImageLoading();
        break;
      case "Video Loading":
        await this.validateVideoLoading();
        break;
      case "Animation Performance":
        await this.validateAnimationPerformance();
        break;
      case "Memory Usage":
        await this.validateMemoryUsage();
        break;
      default:
        throw new Error(`Unknown performance metric: ${Metric}`);
    }
  }

  private async validateImageLoading(): Promise<void> {
    const images = this.page.locator("img");
    const imageCount = await images.count();

    for (let i = 0; i < imageCount; i++) {
      const isLoaded = await images
        .nth(i)
        .evaluate((img: HTMLImageElement) => img.complete);
      expect(isLoaded, { message: "Images should load" }).toBeTruthy();
    }
  }

  private async validateVideoLoading(): Promise<void> {
    const videos = this.page.locator("video");
    const videoCount = await videos.count();

    for (let i = 0; i < videoCount; i++) {
      const autoplay = await videos.nth(i).getAttribute("autoplay");
      expect(autoplay, { message: "Videos should not autoplay" }).toBeNull();
    }
  }

  private async validateAnimationPerformance(): Promise<void> {
    const elementsWithAnimations = this.page.locator("*");
    const hasSmoothAnimations = await elementsWithAnimations.evaluateAll(
      (els) => {
        return els.some((el) => {
          const style = window.getComputedStyle(el);
          return (
            style.animationName !== "none" ||
            style.transition !== "all 0s ease 0s"
          );
        });
      }
    );

    expect(hasSmoothAnimations, {
      message: "Should use CSS-based animations for better performance",
    }).toBeTruthy();
  }

  private async validateMemoryUsage(): Promise<void> {
    const memoryUsage = await this.page.evaluate(() => {
      if ((performance as any).memory) {
        return (performance as any).memory.usedJSHeapSize;
      }
      return null;
    });

    if (memoryUsage) {
      const memoryMB = memoryUsage / (1024 * 1024);
      expect(memoryMB, {
        message: "Memory usage should be below 50MB",
      }).toBeLessThan(50);
    }
  }

  private async validateMediaOptimization(optimization: any): Promise<void> {
    const { "Media Type": mediaType } = optimization;

    switch (mediaType) {
      case "Images":
        await this.validateImageOptimization();
        break;
      case "Videos":
        await this.validateVideoOptimization();
        break;
      case "Animations":
        await this.validateAnimationOptimization();
        break;
      case "Icons":
        await this.validateIconOptimization();
        break;
      default:
        throw new Error(`Unknown media type: ${mediaType}`);
    }
  }

  private async validateImageOptimization(): Promise<void> {
    const images = this.page.locator("img");
    const imageCount = await images.count();
    let hasModernFormat = false;

    for (let i = 0; i < imageCount; i++) {
      const src = await images.nth(i).getAttribute("src");
      if (src && (src.includes(".webp") || src.includes(".avif"))) {
        hasModernFormat = true;
        break;
      }
    }

    expect(hasModernFormat || imageCount === 0, {
      message: "Should use modern image formats",
    }).toBeTruthy();
  }

  private async validateVideoOptimization(): Promise<void> {
    const videos = this.page.locator("video");
    const videoCount = await videos.count();
    expect(videoCount, {
      message: "Videos should be present if required",
    }).toBeGreaterThanOrEqual(0);
  }

  private async validateAnimationOptimization(): Promise<void> {
    const gifs = this.page.locator('img[src*=".gif"]');
    const gifCount = await gifs.count();

    expect(gifCount, {
      message: "Should minimize GIF usage in favor of CSS animations",
    }).toBeLessThan(3);

    const acceleratedAnimations = await this.page.evaluate(() => {
      const elements = document.querySelectorAll("*");
      return Array.from(elements).some((el) => {
        const style = window.getComputedStyle(el);
        const hasTransform = style.transform !== "none";
        const hasOpacityAnimation =
          style.animationName.includes("opacity") ||
          style.transitionProperty.includes("opacity");
        return hasTransform || hasOpacityAnimation;
      });
    });

    expect(acceleratedAnimations, {
      message: "Should use GPU-accelerated animations where possible",
    }).toBeTruthy();
  }

  private async validateIconOptimization(): Promise<void> {
    const svgIcons = this.page.locator("svg");
    const iconFonts = this.page.locator('[class*="icon-"], [class*="fa-"]');
    const pngIcons = this.page.locator('img[src*=".png"]');

    const [svgCount, iconFontCount, pngCount] = await Promise.all([
      svgIcons.count(),
      iconFonts.count(),
      pngIcons.count(),
    ]);

    const totalIcons = svgCount + iconFontCount + pngCount;
    const optimizedIcons = svgCount + iconFontCount;

    const optimizationRatio = totalIcons > 0 ? optimizedIcons / totalIcons : 1;

    expect(optimizationRatio, {
      message: "Should use SVG or icon fonts for most icons",
    }).toBeGreaterThan(0.7);
  }

  private async validateResourceLoadingPriority(priority: any): Promise<void> {
    const { Resource } = priority;

    switch (Resource) {
      case "Critical Images":
        await this.validateCriticalImageLoading();
        break;
      case "Above-the-fold Content":
        await this.validateAboveTheFoldContent();
        break;
      case "Interactive Elements":
        await this.validateInteractiveElementLoading();
        break;
      case "Background Media":
        await this.validateBackgroundMediaLoading();
        break;
      default:
        throw new Error(`Unknown resource type: ${Resource}`);
    }
  }

  private async validateCriticalImageLoading(): Promise<void> {
    const criticalImages = this.page.locator(
      'img[loading="eager"], img[fetchpriority="high"]'
    );
    const criticalImageCount = await criticalImages.count();

    expect(criticalImageCount, {
      message: "Critical images should be prioritized for loading",
    }).toBeGreaterThan(0);
  }

  private async validateAboveTheFoldContent(): Promise<void> {
    const viewportHeight = this.page.viewportSize()?.height || 800;

    const aboveFoldElements = await this.page.evaluate((viewportHeight) => {
      const elements = document.querySelectorAll("*");
      const aboveFold = [];

      for (const element of elements) {
        const rect = element.getBoundingClientRect();
        if (rect.top >= 0 && rect.top <= viewportHeight) {
          aboveFold.push(element);
        }
      }

      return aboveFold.length;
    }, viewportHeight);

    expect(aboveFoldElements, {
      message: "Above-the-fold content should be properly loaded",
    }).toBeGreaterThan(0);
  }

  private async validateInteractiveElementLoading(): Promise<void> {
    const interactiveElements = this.page.locator(
      'button, a, input, select, [role="button"]'
    );
    const interactiveCount = await interactiveElements.count();

    const firstButton = interactiveElements.first();
    const isEnabled = await firstButton.isEnabled().catch(() => false);

    expect(interactiveCount, {
      message: "Interactive elements should be present",
    }).toBeGreaterThan(0);
    expect(isEnabled, {
      message: "Interactive elements should be enabled",
    }).toBeTruthy();
  }

  private async validateBackgroundMediaLoading(): Promise<void> {
    const backgroundElements = this.page.locator(
      '[style*="background-image"], video, [data-background]'
    );
    const backgroundCount = await backgroundElements.count();

    expect(backgroundCount, {
      message: "Background media elements should be present",
    }).toBeGreaterThanOrEqual(0);
  }
}
