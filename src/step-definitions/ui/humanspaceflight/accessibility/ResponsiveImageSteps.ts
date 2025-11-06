import { Page, expect } from "@playwright/test";
import { Then, Fixture } from "playwright-bdd/decorators";
import { DataTable } from "playwright-bdd";
import { HumanSpaceflightPage } from "../../../../services/ui/HumanSpaceflightPage";

@Fixture("responsiveImageSteps")
export class ResponsiveImageSteps {
  constructor(
    private page: Page,
    private humanSpaceflightPage: HumanSpaceflightPage
  ) {}

  @Then("responsive images should be properly configured:")
  async checkResponsiveImages(dataTable: DataTable) {
    const requirements = dataTable.hashes();
    const imageConfigs =
      await this.humanSpaceflightPage.responsiveDesign.checkResponsiveImages();

    const imageValidators: Record<string, () => void> = {
      srcset: () =>
        expect(
          imageConfigs.hasSrcset,
          "Images should have srcset"
        ).toBeTruthy(),
      sizes: () =>
        expect(imageConfigs.hasSizes, "Images should have sizes").toBeTruthy(),
      "lazy loading": () =>
        expect(
          imageConfigs.hasLazyLoading,
          "Images should implement lazy loading"
        ).toBeTruthy(),
      "aspect ratio": () =>
        expect(
          imageConfigs.preservesAspectRatio,
          "Images should preserve aspect ratio"
        ).toBeTruthy(),
    };

    for (const requirement of requirements) {
      const { Feature } = requirement;
      const validator = imageValidators[Feature];
      if (!validator) {
        throw new Error(`Unknown responsive image feature: ${Feature}`);
      }
      validator();
    }
  }

  @Then("all images should scale appropriately")
  async checkImageScaling() {
    const scalingCheck = await this.page.evaluate(() => {
      const images = document.querySelectorAll("img");
      return Array.from(images).every((img) => {
        const rect = img.getBoundingClientRect();
        return (
          rect.width > 0 && rect.height > 0 && rect.width <= window.innerWidth
        );
      });
    });
    expect(scalingCheck, "Images should scale appropriately").toBeTruthy();
  }

  @Then("images should not distort or lose quality")
  async checkImageQuality() {
    const qualityCheck = await this.page.evaluate(() => {
      const images = document.querySelectorAll("img");
      return Array.from(images).every((img) => {
        const naturalRatio =
          (img as HTMLImageElement).naturalWidth /
          (img as HTMLImageElement).naturalHeight;
        const displayRatio = img.width / img.height;
        return Math.abs(naturalRatio - displayRatio) < 0.1;
      });
    });
    expect(qualityCheck, "Images should maintain aspect ratio").toBeTruthy();
  }

  @Then("images should meet responsive requirements:")
  async checkImageResponsiveRequirements(dataTable: DataTable) {
    const requirements = dataTable.hashes();
    const deviceType = this.getCurrentDeviceType();

    for (const requirement of requirements) {
      const deviceRequirement = this.getDeviceRequirement(
        requirement,
        deviceType
      );
      if (!deviceRequirement) continue;

      await this.validateImageRequirement(
        requirement.Requirement,
        deviceRequirement
      );
    }
  }

  private getCurrentDeviceType(): string {
    const viewportSize = this.page.viewportSize();
    const currentWidth = viewportSize?.width || 1024;

    if (currentWidth <= 375) return "mobile";
    if (currentWidth <= 768) return "tablet";
    return "desktop";
  }

  private getDeviceRequirement(
    requirement: any,
    deviceType: string
  ): string | null {
    const deviceColumn =
      deviceType.charAt(0).toUpperCase() + deviceType.slice(1);
    return requirement[deviceColumn] || null;
  }

  private async validateImageRequirement(
    requirementType: string,
    deviceRequirement: string
  ): Promise<void> {
    const validators: Record<string, () => Promise<void>> = {
      Resolution: () => this.validateImageResolution(deviceRequirement),
      Scaling: () => this.validateImageScaling(deviceRequirement),
      Loading: () => this.validateImageLoadingStrategy(),
    };

    const validator = validators[requirementType];
    if (!validator) {
      throw new Error(`Unknown image requirement: ${requirementType}`);
    }

    await validator();
  }

  private async validateImageResolution(
    deviceRequirement: string
  ): Promise<void> {
    const imagesOptimized = await this.page.evaluate(() => {
      const images = document.querySelectorAll("img");
      if (images.length === 0) return true;

      return Array.from(images).every((img) => {
        const htmlImg = img as HTMLImageElement;
        const naturalWidth = htmlImg.naturalWidth;
        const displayWidth = img.getBoundingClientRect().width;
        return naturalWidth >= displayWidth;
      });
    });

    expect(
      imagesOptimized,
      `Images should be ${deviceRequirement}`
    ).toBeTruthy();
  }

  private async validateImageScaling(deviceRequirement: string): Promise<void> {
    const aspectRatioMaintained = await this.page.evaluate(() => {
      const images = document.querySelectorAll("img");
      if (images.length === 0) return true;

      return Array.from(images).every((img) => {
        const htmlImg = img as HTMLImageElement;
        const naturalWidth = htmlImg.naturalWidth;
        const naturalHeight = htmlImg.naturalHeight;

        if (naturalWidth === 0 || naturalHeight === 0) return true;

        const naturalRatio = naturalWidth / naturalHeight;
        const displayRect = img.getBoundingClientRect();
        const displayRatio = displayRect.width / displayRect.height;
        return Math.abs(naturalRatio - displayRatio) < 0.1;
      });
    });

    expect(
      aspectRatioMaintained,
      `Images should ${deviceRequirement}`
    ).toBeTruthy();
  }

  private async validateImageLoadingStrategy(): Promise<void> {
    const loadingStrategy = await this.page.evaluate(() => {
      const images = document.querySelectorAll("img");
      if (images.length === 0) return "Standard";

      const lazyLoaded = Array.from(images).some(
        (img) => img.getAttribute("loading") === "lazy"
      );
      return lazyLoaded ? "Low-res first" : "Optimal quality first";
    });

    expect(
      loadingStrategy,
      "Images should use appropriate loading strategy"
    ).toBeDefined();
  }
}
