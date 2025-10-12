import { Page, expect } from "@playwright/test";
import { When, Then, Fixture } from "playwright-bdd/decorators";
import { DataTable } from "playwright-bdd";
import { HumanSpaceflightPage } from "../../pages/ui/HumanSpaceflightPage";
import { CustomTestArgs } from "../../fixtures/BddFixtures";

@Fixture("responsiveDesignSteps")
export class ResponsiveDesignSteps {
  constructor(
    private page: Page,
    private humanSpaceflightPage: HumanSpaceflightPage,
    private sharedContext: CustomTestArgs["sharedContext"]
  ) {}

  @Then("the page should maintain responsive integrity:")
  async checkResponsiveIntegrity(dataTable: DataTable) {
    const requirements = dataTable.rowsHash();

    // Check viewport meta tag
    const viewportMeta =
      await this.humanSpaceflightPage.responsiveDesign.getViewportMetaContent();
    expect(viewportMeta, {
      message:
        requirements.Viewport ||
        "Viewport meta tag should be properly configured",
    }).toBeTruthy();

    // Check media queries
    const mediaQueriesActive =
      await this.humanSpaceflightPage.responsiveDesign.areMediaQueriesActive();
    expect(mediaQueriesActive, {
      message:
        requirements["Media Queries"] || "Media queries should be active",
    }).toBe(true);

    // Check base font units
    const usesRelativeUnits =
      await this.humanSpaceflightPage.responsiveDesign.checkRelativeFontUnits();
    expect(usesRelativeUnits, {
      message:
        requirements["Base Font"] || "Font units should be relative (rem/em)",
    }).toBe(true);

    const containerFluid =
      await this.humanSpaceflightPage.responsiveDesign.isContainerFluid();
    expect(containerFluid, {
      message: "Container should be fluid with max-width limits",
    }).toBe(true);

    const gridImplemented =
      await this.humanSpaceflightPage.responsiveDesign.isGridSystemImplemented();
    expect(gridImplemented, {
      message: "Grid system should be implemented",
    }).toBe(true);
  }

  @Then("responsive images should be properly configured:")
  async checkResponsiveImages(dataTable: DataTable) {
    const requirements = dataTable.rowsHash();
    const imageConfigs =
      await this.humanSpaceflightPage.responsiveDesign.checkResponsiveImages();

    expect(imageConfigs.hasSrcset, {
      message:
        requirements.srcset ||
        "Images should have srcset attribute with multiple resolution options",
    }).toBe(true);

    expect(imageConfigs.hasSizes, {
      message:
        requirements.sizes ||
        "Images should have sizes attribute for viewport-based selection",
    }).toBe(true);

    expect(imageConfigs.hasLazyLoading, {
      message:
        requirements["lazy loading"] ||
        "Images should implement lazy loading for below-fold images",
    }).toBe(true);

    expect(imageConfigs.preservesAspectRatio, {
      message:
        requirements["aspect ratio"] ||
        "Images should preserve aspect ratio during scaling",
    }).toBe(true);
  }

  @When("I view the {string} on a mobile device with width {string}px")
  async viewSectionOnMobile(section: string, width: string) {
    await this.humanSpaceflightPage.responsiveDesign.setViewportSize(
      parseInt(width)
    );
    await this.humanSpaceflightPage.responsiveDesign.scrollToSection(section);
  }

  @Then("the section should meet mobile requirements:")
  async checkMobileRequirements(dataTable: DataTable) {
    const requirements = dataTable.rowsHash();
    const checks =
      await this.humanSpaceflightPage.responsiveDesign.checkMobileRequirements();

    expect(checks.layout).toBe(requirements.Layout);
    expect(checks.contentFlow).toBe(requirements["Content Flow"]);
    expect(checks.touchTargets >= 44, {
      message: "Touch targets should be at least 44px",
    }).toBe(true);
    expect(checks.textSize >= 16, {
      message: "Base text size should be at least 16px",
    }).toBe(true);
  }

  @When("I interact with {string} on {string} with width {string}px")
  async interactWithElement(element: string, device: string, width: string) {
    await this.humanSpaceflightPage.responsiveDesign.setViewportSize(
      parseInt(width)
    );
    await this.humanSpaceflightPage.responsiveDesign.interactWithElement(
      element
    );
  }

  @Then("the interaction should follow device patterns:")
  async checkDevicePatterns(dataTable: DataTable) {
    const requirements = dataTable.rowsHash();
    const patterns =
      await this.humanSpaceflightPage.responsiveDesign.checkInteractionPatterns();

    expect(patterns.inputMethod).toBe(requirements["Input Method"]);
    expect(patterns.feedback).toBe(requirements["Feedback Type"]);
    expect(patterns.responseTime, {
      message: "Response time should be under 100ms",
    }).toBeLessThan(100);
    expect(patterns.visualCues, {
      message: "Visual cues should be present",
    }).toBeTruthy();
    expect(patterns.errorHandling).toBe(requirements["Error Feedback"]);
  }

  @When("the viewport width changes from {string} to {string} pixels")
  async changeViewportWidth(startWidth: string, endWidth: string) {
    await this.humanSpaceflightPage.responsiveDesign.setViewportSize(
      parseInt(startWidth)
    );
    await this.page.waitForTimeout(500); // Allow for initial layout
    await this.humanSpaceflightPage.responsiveDesign.setViewportSize(
      parseInt(endWidth)
    );
  }

  @Then("the layout should adapt appropriately:")
  async checkLayoutAdaptation(dataTable: DataTable) {
    const adaptations =
      await this.humanSpaceflightPage.responsiveDesign.checkLayoutTransitions();
    const requirements = dataTable.rowsHash();

    for (const [element, states] of Object.entries(adaptations)) {
      expect(states.startState).toBe(requirements[`${element} Start`]);
      expect(states.endState).toBe(requirements[`${element} End`]);
      expect(states.transition).toBe(requirements[`${element} Transition`]);
    }
  }

  @Then("responsive implementation should meet performance criteria:")
  async checkPerformanceCriteria(dataTable: DataTable) {
    const performance =
      await this.humanSpaceflightPage.responsiveDesign.checkPerformanceMetrics();
    const criteria = dataTable.rowsHash();

    expect(performance.cls, {
      message: "CLS should be less than 0.1",
    }).toBeLessThan(0.1);
    expect(performance.resizeResponse, {
      message: "Resize response should be under 100ms",
    }).toBeLessThan(100);
    expect(performance.imageLoading, {
      message: "Image loading should be progressive and optimized",
    }).toBe("Progressive, optimized");
    expect(performance.animationFps, {
      message: "Animation FPS should be at least 60",
    }).toBeGreaterThanOrEqual(60);
  }

  @Then("responsive assets should be optimized:")
  async checkAssetOptimization(dataTable: DataTable) {
    const optimization =
      await this.humanSpaceflightPage.responsiveDesign.checkAssetOptimization();
    const requirements = dataTable.rowsHash();

    for (const [assetType, strategy] of Object.entries(optimization)) {
      expect(strategy).toBe(requirements[assetType]);
    }
  }

  @Then("the responsive design should maintain accessibility:")
  async checkAccessibility(dataTable: DataTable) {
    const accessibility =
      await this.humanSpaceflightPage.responsiveDesign.checkAccessibilityCompliance();
    const requirements = dataTable.rowsHash();

    expect(accessibility.textScaling, {
      message: "Should support 200% zoom",
    }).toBe("Supports 200% zoom");
    expect(accessibility.touchTargets, {
      message: "Touch targets should be at least 44px",
    }).toBeGreaterThanOrEqual(44);

    for (const [feature, requirement] of Object.entries(requirements)) {
      if (feature !== "WCAG Level") {
        expect(accessibility[feature.toLowerCase().replace(/\s+/g, "")]).toBe(
          requirement
        );
      }
    }
  }

  @Then("device-specific accessibility features:")
  async checkDeviceSpecificAccessibility(dataTable: DataTable) {
    const deviceFeatures = dataTable.hashes();

    for (const feature of deviceFeatures) {
      const { Device, Feature, Implementation } = feature;

      // Verify the feature is implemented based on device type
      const isImplemented = await this.page.evaluate((deviceType) => {
        switch (deviceType) {
          case "Mobile":
            return document.querySelector("[data-touch-gestures]") !== null;
          case "Tablet":
            return document.body.classList.contains("orientation-support");
          case "Desktop":
            return document.querySelector("[tabindex]") !== null;
          case "All":
            return document.querySelector("[role]") !== null;
          default:
            return false;
        }
      }, Device);

      expect(isImplemented, {
        message: `${Feature} should be implemented for ${Device}`,
      }).toBe(true);
    }
  }

  @Then("images should meet responsive requirements:")
  async checkImageResponsiveRequirements(dataTable: DataTable) {
    const requirements = dataTable.hashes();
    const viewport = this.page.viewportSize();
    const currentWidth = viewport?.width || 1024;

    for (const requirement of requirements) {
      const { Requirement, Mobile, Tablet, Desktop } = requirement;
      let expectedValue: string;

      if (currentWidth <= 375) {
        expectedValue = Mobile;
      } else if (currentWidth <= 768) {
        expectedValue = Tablet;
      } else {
        expectedValue = Desktop;
      }

      switch (Requirement) {
        case "Resolution":
          const hasOptimizedImages = await this.page.evaluate(() => {
            const images = document.querySelectorAll("img");
            return Array.from(images).every((img) => {
              const src = img.getAttribute("src") || "";
              return src.includes("optimized") || src.includes("webp");
            });
          });
          expect(hasOptimizedImages, {
            message: `Images should be ${expectedValue}`,
          }).toBe(true);
          break;

        case "Scaling":
          const maintainsAspectRatio = await this.page.evaluate(() => {
            const images = document.querySelectorAll("img");
            return Array.from(images).every((img) => {
              const naturalRatio = img.naturalWidth / img.naturalHeight;
              const displayRatio = img.width / img.height;
              return Math.abs(naturalRatio - displayRatio) < 0.1;
            });
          });
          expect(maintainsAspectRatio, {
            message: `Images should ${expectedValue}`,
          }).toBe(true);
          break;

        case "Loading":
          const loadingStrategy = await this.page.evaluate(() => {
            const images = document.querySelectorAll("img");
            const hasLazy = Array.from(images).some(
              (img) => img.loading === "lazy"
            );
            return hasLazy ? "Progressive loading" : "Standard loading";
          });
          expect(loadingStrategy, {
            message: `Loading should be ${expectedValue}`,
          }).toBe(expectedValue);
          break;
      }
    }
  }

  @When("viewing content on {string} with width {string}px")
  async setViewportForTypography(device: string, width: string) {
    await this.humanSpaceflightPage.responsiveDesign.setViewportSize(
      parseInt(width)
    );
  }

  @Then("typography should meet readability standards:")
  async checkTypographyReadability(dataTable: DataTable) {
    const requirements = dataTable.hashes();

    for (const requirement of requirements) {
      const { Element, Value } = requirement;

      switch (Element) {
        case "Base Size":
          const baseSize = await this.page.evaluate(() => {
            return parseInt(getComputedStyle(document.body).fontSize);
          });
          expect(baseSize, {
            message: `Base font size should be ${Value}`,
          }).toBeGreaterThanOrEqual(parseInt(Value));
          break;

        case "Line Height":
          const lineHeight = await this.page.evaluate(() => {
            const paragraphs = document.querySelectorAll("p");
            if (paragraphs.length === 0) return 1.5;
            return (
              parseFloat(getComputedStyle(paragraphs[0]).lineHeight) /
              parseFloat(getComputedStyle(paragraphs[0]).fontSize)
            );
          });
          expect(lineHeight, {
            message: `Line height should be ${Value}`,
          }).toBeCloseTo(parseFloat(Value), 1);
          break;

        case "Line Length":
          const maxChars = await this.page.evaluate(() => {
            const paragraphs = document.querySelectorAll("p");
            if (paragraphs.length === 0) return 0;
            const longest = Array.from(paragraphs).reduce((longest, p) => {
              const chars = p.textContent?.length || 0;
              return chars > longest ? chars : longest;
            }, 0);
            return longest;
          });
          expect(maxChars, {
            message: `Line length should not exceed ${Value} characters`,
          }).toBeLessThanOrEqual(parseInt(Value));
          break;
      }
    }
  }

  @When("device orientation changes to {string} on {string}")
  async changeDeviceOrientation(orientation: string, device: string) {
    const currentSize = this.page.viewportSize();
    if (currentSize) {
      if (orientation === "Landscape") {
        await this.humanSpaceflightPage.responsiveDesign.setViewportSize(
          Math.max(currentSize.width, currentSize.height),
          Math.min(currentSize.width, currentSize.height)
        );
      } else {
        await this.humanSpaceflightPage.responsiveDesign.setViewportSize(
          Math.min(currentSize.width, currentSize.height),
          Math.max(currentSize.width, currentSize.height)
        );
      }
    }
  }

  @Then("the layout should adapt with requirements:")
  async checkOrientationAdaptation(dataTable: DataTable) {
    const requirements = dataTable.hashes();

    for (const requirement of requirements) {
      const { Element, Requirement, Validation } = requirement;

      switch (Element) {
        case "Content":
          const noOverflow = await this.page.evaluate(() => {
            return document.body.scrollWidth <= window.innerWidth;
          });
          expect(noOverflow, {
            message: "Content should not have overflow",
          }).toBe(true);
          break;

        case "Navigation":
          const navAdapted = await this.page.evaluate((req) => {
            const nav = document.querySelector("nav");
            if (!nav) return false;

            if (req.includes("Collapse")) {
              return (
                window.getComputedStyle(nav).display === "none" ||
                document.querySelector(".hamburger-menu") !== null
              );
            } else if (req.includes("Expand")) {
              return window.getComputedStyle(nav).display !== "none";
            }
            return true;
          }, Requirement);
          expect(navAdapted, {
            message: `Navigation should ${Requirement}`,
          }).toBe(true);
          break;

        case "Images":
          const imagesHandled = await this.page.evaluate(() => {
            const images = document.querySelectorAll("img");
            return Array.from(images).every((img) => {
              const rect = img.getBoundingClientRect();
              return (
                rect.width > 0 &&
                rect.height > 0 &&
                rect.width <= window.innerWidth
              );
            });
          });
          expect(imagesHandled, {
            message: `Images should ${Requirement}`,
          }).toBe(true);
          break;
      }
    }
  }
}
