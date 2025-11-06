import { expect } from "@playwright/test";
import { Then, Fixture } from "playwright-bdd/decorators";
import { HumanSpaceflightPage } from "../../../../services/ui/HumanSpaceflightPage";
import type { ImageInfo } from "../../../../utils/types/Types";
import { DataTable } from "playwright-bdd";

@Fixture("imageOptimizationSteps")
export class ImageOptimizationSteps {
  private readonly PERFORMANCE_THRESHOLDS = {
    MAX_IMAGE_SIZE: 1_000_000,
    MIN_COMPRESSION_RATIO: 0.8,
  } as const;

  constructor(private humanSpaceflightPage: HumanSpaceflightPage) {}

  @Then("all images should be optimized for web")
  async checkImagesOptimized() {
    const imagesInfo = await this.getImageOptimizationInfo();

    for (const [index, img] of imagesInfo.entries()) {
      expect(img.size, {
        message: `Image at index ${index} should be less than ${this.PERFORMANCE_THRESHOLDS.MAX_IMAGE_SIZE} bytes`,
      }).toBeLessThan(this.PERFORMANCE_THRESHOLDS.MAX_IMAGE_SIZE);
    }
  }

  @Then("images should use modern formats \\(WebP, AVIF)")
  async checkModernImageFormats() {
    const imagesInfo = await this.getImageOptimizationInfo();
    const hasModernFormat = imagesInfo.some((img) => img.hasWebp);

    expect(hasModernFormat, {
      message: "At least one image should use modern formats (WebP, AVIF)",
    }).toBeTruthy();
  }

  @Then("images should have responsive sizes \\(srcset)")
  async checkResponsiveImages() {
    const imagesInfo = await this.getImageOptimizationInfo();
    const hasResponsive = imagesInfo.some((img) => img.hasSrcset);

    expect(hasResponsive, {
      message:
        "At least one image should have srcset attribute for responsive sizing",
    }).toBeTruthy();
  }

  @Then("images should load lazily when below the fold")
  async checkLazyLoading() {
    const imagesInfo = await this.getImageOptimizationInfo();
    const hasLazyLoad = imagesInfo.some((img) => img.loading === "lazy");

    expect(hasLazyLoad, {
      message: "At least one image should use lazy loading",
    }).toBeTruthy();
  }

  private async getImageOptimizationInfo(): Promise<ImageInfo[]> {
    return await this.humanSpaceflightPage.performanceSEO.getImageOptimizationInfo();
  }

  @Then("{string} should meet optimization requirements:")
  async checkResourceOptimization(resourceType: string, dataTable: DataTable) {
    const requirements = dataTable.hashes();

    const resourceValidators: Record<string, () => Promise<void>> = {
      images: async () => await this.checkImageOptimization(requirements),
    };

    const validator = resourceValidators[resourceType.toLowerCase()];
    if (!validator) {
      throw new Error(`Unknown resource type: ${resourceType}`);
    }
    await validator();
  }

  private async checkImageOptimization(requirements: any[]) {
    const imagesInfo = await this.getImageOptimizationInfo();

    for (const requirement of requirements) {
      const requirementValidators: Record<string, () => void> = {
        "Loading Strategy": () => {
          const hasLazyLoad = imagesInfo.some((img) => img.loading === "lazy");
          expect(hasLazyLoad, {
            message: "Images should use lazy loading strategy",
          }).toBeTruthy();
        },
        "Modern Format": () => {
          const hasModernFormat = imagesInfo.some((img) => img.hasWebp);
          expect(hasModernFormat, {
            message: "Images should use modern formats (WebP, AVIF)",
          }).toBeTruthy();
        },
        "Size Optimization": () => {
          const oversizedImages = imagesInfo.filter(
            (img) => img.size > this.PERFORMANCE_THRESHOLDS.MAX_IMAGE_SIZE
          );
          expect(oversizedImages.length, {
            message: "All images should be size optimized",
          }).toBe(0);
        },
      };

      const validator = requirementValidators[requirement.Requirement];
      if (!validator) {
        throw new Error(
          `Unknown image optimization requirement: ${requirement.Requirement}`
        );
      }
      validator();
    }
  }

  @Then("critical CSS should be inlined or loaded first")
  async checkCriticalCSS() {
    const cssResources =
      await this.humanSpaceflightPage.performanceSEO.getCSSResourcesInfo();
    const criticalCss = cssResources.find(
      (r) => r.url.includes("critical") || r.url.includes("inline")
    );

    expect(criticalCss, {
      message: "Critical CSS should be present (inlined or loaded first)",
    }).toBeDefined();
  }

  @Then("CSS should be minified")
  async checkCSSMinified() {
    const cssResources =
      await this.humanSpaceflightPage.performanceSEO.getCSSResourcesInfo();

    for (const [index, css] of cssResources.entries()) {
      const compressionRatio = css.size / css.transferSize;
      expect(compressionRatio, {
        message: `CSS resource at index ${index} should be minified (compression ratio: ${compressionRatio.toFixed(
          2
        )})`,
      }).toBeGreaterThan(this.PERFORMANCE_THRESHOLDS.MIN_COMPRESSION_RATIO);
    }
  }

  @Then("JavaScript should be minified")
  async checkJSMinified() {
    const jsResources =
      await this.humanSpaceflightPage.performanceSEO.getJavaScriptResourcesInfo();

    for (const [index, js] of jsResources.entries()) {
      const compressionRatio = js.size / js.transferSize;
      expect(compressionRatio, {
        message: `JavaScript resource at index ${index} should be minified (compression ratio: ${compressionRatio.toFixed(
          2
        )})`,
      }).toBeGreaterThan(this.PERFORMANCE_THRESHOLDS.MIN_COMPRESSION_RATIO);
    }
  }
}
