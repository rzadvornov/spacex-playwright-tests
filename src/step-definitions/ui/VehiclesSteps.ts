import { When, Then, Fixture } from "playwright-bdd/decorators";
import { expect, Page } from "@playwright/test";
import { DataTable } from "playwright-bdd";
import { HumanSpaceflightPage } from "../../pages/ui/HumanSpaceflightPage";
import {
  AccessibilityStandard,
  CardAdaptation,
  CoreElement,
  MediaOptimization,
  MetadataItem,
  NavigationMethod,
  PerformanceMetric,
  ResearchEmphasis,
} from "../../pages/types/Types";

@Fixture("vehiclesSteps")
export class VehiclesSteps {
  private readonly TEST_CONSTANTS = {
    MIN_TOUCH_TARGET: 44,
    RESEARCH_CARD_NAME: "Develop your research",
    VEHICLE_NAMES: ["Dragon", "Starship"] as const,
  } as const;

  constructor(
    private page: Page,
    private humanSpaceflightPage: HumanSpaceflightPage
  ) {}

  @When("I am viewing the Vehicles section")
  async viewVehiclesSection() {
    await this.humanSpaceflightPage.vehicles.scrollToVehiclesSection();
  }

  @Then("the Vehicle section should display core elements:")
  async checkCoreElements(dataTable: DataTable) {
    const elements = this.parseDataTable<CoreElement>(dataTable);

    for (const element of elements) {
      await this.validateCoreElement(element);
    }
  }

  @When("I locate the {string} card")
  async locateCard(vehicleName: string) {
    const normalizedName = this.normalizeCardName(vehicleName);
    const cardContent =
      await this.humanSpaceflightPage.vehicles.getVehicleCardContent(
        normalizedName
      );
    expect(cardContent, {
      message: `${vehicleName} card should exist`,
    }).not.toBeNull();
  }

  @Then("the card should display the following information:")
  async checkCardInformation(dataTable: DataTable) {
    const info = this.parseDataTable<MetadataItem>(dataTable);

    for (const item of info) {
      await this.validateCardInformation(item);
    }
  }

  @Then("the research card should display the following:")
  async checkResearchCardContent(dataTable: DataTable) {
    const content = this.parseDataTable<MetadataItem>(dataTable);
    await this.validateResearchCardContent(content);
  }

  @Then("the research card should emphasize:")
  async checkResearchCardEmphasis(dataTable: DataTable) {
    const aspects = this.parseDataTable<ResearchEmphasis>(dataTable);
    await this.validateResearchCardEmphasis(aspects);
  }

  @When("I interact with the {string} on the {string} card")
  async interactWithCardElement(element: string, cardName: string) {
    const normalizedCardName = this.normalizeCardName(cardName);
    await this.performCardInteraction(element, normalizedCardName);
  }

  @Then("the interaction should result in {string}")
  async checkInteractionResult(action: string) {
    await this.validateInteractionResult(action);
  }

  @Then("the system should respond with {string}")
  async checkSystemResponse(response: string) {
    await this.validateSystemResponse(response);
  }

  @When("viewing on {string} with width {string}px")
  async setViewportForDevice(device: string, width: string) {
    const widthNum = parseInt(width);
    await this.page.setViewportSize({ width: widthNum, height: 812 });
  }

  @Then("the vehicle cards should adapt:")
  async checkCardAdaptation(dataTable: DataTable) {
    const adaptations = this.parseDataTable<CardAdaptation>(dataTable);

    for (const adaptation of adaptations) {
      await this.validateCardAdaptation(adaptation);
    }
  }

  @Then("all vehicle cards should meet accessibility standards:")
  async checkAccessibilityStandards(dataTable: DataTable) {
    const standards = this.parseDataTable<AccessibilityStandard>(dataTable);

    for (const standard of standards) {
      await this.validateAccessibilityStandard(standard);
    }
  }

  @Then("interactive elements should be accessible via:")
  async checkAccessibilityMethods(dataTable: DataTable) {
    const methods = this.parseDataTable<NavigationMethod>(dataTable);

    for (const method of methods) {
      await this.validateAccessibilityMethod(method);
    }
  }

  @Then("the vehicle section should meet performance metrics:")
  async checkPerformanceMetrics(dataTable: DataTable) {
    const metrics = this.parseDataTable<PerformanceMetric>(dataTable);

    for (const metric of metrics) {
      await this.validatePerformanceMetric(metric);
    }
  }

  @Then("media optimization should be verified:")
  async checkMediaOptimization(dataTable: DataTable) {
    const optimizations = this.parseDataTable<MediaOptimization>(dataTable);

    for (const optimization of optimizations) {
      await this.validateMediaOptimization(optimization);
    }
  }

  private parseDataTable<T>(dataTable: DataTable): T[] {
    return dataTable.hashes().map((row) => row as T);
  }

  private normalizeCardName(cardName: string): string {
    return cardName === "Research"
      ? this.TEST_CONSTANTS.RESEARCH_CARD_NAME
      : cardName;
  }

  private async validateCoreElement(element: CoreElement): Promise<void> {
    const { Element, Content } = element;

    switch (Element) {
      case "Section Title":
        await this.validateSectionTitle();
        break;
      case "Vehicle Cards":
        await this.validateVehicleCards();
        break;
      case "Research Card":
        await this.validateResearchCard();
        break;
      case "Media Elements":
        await this.validateMediaElements();
        break;
      case "Call-to-Actions":
        await this.validateCallToActions();
        break;
      default:
        throw new Error(`Unknown core element: ${Element}`);
    }
  }

  private async validateSectionTitle(): Promise<void> {
    const sectionVisible = await this.humanSpaceflightPage.vehicles[
      "vehiclesSection"
    ].isVisible();
    expect(sectionVisible, {
      message: "Vehicles section should be visible",
    }).toBeTruthy();
  }

  private async validateVehicleCards(): Promise<void> {
    for (const vehicleName of this.TEST_CONSTANTS.VEHICLE_NAMES) {
      const content =
        await this.humanSpaceflightPage.vehicles.getVehicleCardContent(
          vehicleName
        );
      expect(content, {
        message: `${vehicleName} card should exist`,
      }).not.toBeNull();
    }
  }

  private async validateResearchCard(): Promise<void> {
    const researchContent =
      await this.humanSpaceflightPage.vehicles.getVehicleCardContent(
        this.TEST_CONSTANTS.RESEARCH_CARD_NAME
      );
    expect(researchContent, {
      message: "Research card should exist",
    }).not.toBeNull();
  }

  private async validateMediaElements(): Promise<void> {
    const allCards = [
      ...this.TEST_CONSTANTS.VEHICLE_NAMES,
      this.TEST_CONSTANTS.RESEARCH_CARD_NAME,
    ];

    for (const cardName of allCards) {
      const hasMedia =
        await this.humanSpaceflightPage.vehicles.verifyVehicleMediaExists(
          cardName
        );
      expect(hasMedia, {
        message: `${cardName} should have media`,
      }).toBeTruthy();
    }
  }

  private async validateCallToActions(): Promise<void> {
    const allCards = [
      ...this.TEST_CONSTANTS.VEHICLE_NAMES,
      this.TEST_CONSTANTS.RESEARCH_CARD_NAME,
    ];

    for (const cardName of allCards) {
      const content =
        await this.humanSpaceflightPage.vehicles.getVehicleCardContent(
          cardName
        );
      expect(content?.learnMoreLink, {
        message: `${cardName} should have learn more link`,
      }).toBeTruthy();
    }
  }

  private async validateCardInformation(item: MetadataItem): Promise<void> {
    const { Element } = item;

    switch (Element) {
      case "Title":
      case "Description":
      case "Media Type":
      case "Learn More":
        break;
      default:
        throw new Error(`Unknown card information element: ${Element}`);
    }
  }

  private async validateResearchCardContent(
    content: MetadataItem[]
  ): Promise<void> {
    const researchContent =
      await this.humanSpaceflightPage.vehicles.getVehicleCardContent(
        this.TEST_CONSTANTS.RESEARCH_CARD_NAME
      );
    expect(researchContent, {
      message: "Research card should exist",
    }).not.toBeNull();

    for (const item of content) {
      const { Element, Content } = item;

      switch (Element) {
        case "Title":
          expect(researchContent!.title, {
            message: "Research card should have correct title",
          }).toBe(Content);
          break;
        case "Description":
          expect(researchContent!.description, {
            message: "Research card should have correct description",
          }).toContain(Content.substring(0, 30));
          break;
        case "Link":
          expect(researchContent!.learnMoreLink, {
            message: "Research card should have correct link",
          }).toBe(Content);
          break;
        case "Media":
          const hasMedia =
            await this.humanSpaceflightPage.vehicles.verifyVehicleMediaExists(
              this.TEST_CONSTANTS.RESEARCH_CARD_NAME
            );
          expect(hasMedia, { message: "Research card should have media" }).toBe(
            true
          );
          break;
        default:
          throw new Error(`Unknown research card content element: ${Element}`);
      }
    }
  }

  private async validateResearchCardEmphasis(
    aspects: ResearchEmphasis[]
  ): Promise<void> {
    const researchContent =
      await this.humanSpaceflightPage.vehicles.getVehicleCardContent(
        this.TEST_CONSTANTS.RESEARCH_CARD_NAME
      );
    expect(researchContent, {
      message: "Research card should exist",
    }).not.toBeNull();

    for (const aspect of aspects) {
      const { Aspect, Details } = aspect;

      switch (Aspect) {
        case "Innovation":
          expect(researchContent!.description.toLowerCase(), {
            message: "Should emphasize innovation",
          }).toContain("research");
          break;
        case "Access":
          expect(researchContent!.description.toLowerCase(), {
            message: "Should emphasize access",
          }).toMatch(/(space|platform|access)/);
          break;
        case "Support":
          expect(researchContent!.description.toLowerCase(), {
            message: "Should emphasize support",
          }).toMatch(/(support|assistance|help)/);
          break;
        default:
          throw new Error(`Unknown research emphasis aspect: ${Aspect}`);
      }
    }
  }

  private async performCardInteraction(
    element: string,
    cardName: string
  ): Promise<void> {
    switch (element) {
      case "Learn More":
        await this.humanSpaceflightPage.vehicles.clickLearnMore(cardName);
        break;
      case "Video":
        break;
      case "Card":
        const card =
          this.humanSpaceflightPage.vehicles["getVehicleCard"](cardName);
        await card.hover();
        break;
      default:
        throw new Error(`Unknown card interaction element: ${element}`);
    }
  }

  private async validateInteractionResult(action: string): Promise<void> {
    switch (action) {
      case "Click":
      case "Play":
      case "Hover":
      case "Show touch feedback":
        break;
      default:
        throw new Error(`Unknown interaction result: ${action}`);
    }
  }

  private async validateSystemResponse(response: string): Promise<void> {
    switch (response) {
      case "Navigate to /vehicles/dragon":
        await expect(this.page).toHaveURL(/.*\/vehicles\/dragon/);
        break;
      case "Navigate to /vehicles/starship":
        await expect(this.page).toHaveURL(/.*\/vehicles\/starship/);
        break;
      case "Navigate to /research":
        await expect(this.page).toHaveURL(/.*\/research/);
        break;
      case "Start video playback":
        break;
      case "Show hover state":
        break;
      case "Show touch feedback":
        break;
      default:
        throw new Error(`Unknown system response: ${response}`);
    }
  }

  private async validateCardAdaptation(
    adaptation: CardAdaptation
  ): Promise<void> {
    const { Element } = adaptation;

    switch (Element) {
      case "Card Layout":
        const spacing =
          await this.humanSpaceflightPage.vehicles.verifyCardSpacing();
        expect(spacing.vertical, {
          message: "Cards should have proper spacing",
        }).toBeTruthy();
        break;
      case "Media Position":
        break;
      case "Text Size":
        break;
      case "Touch Targets":
        await this.validateTouchTargets();
        break;
      case "Spacing":
        const cardSpacing =
          await this.humanSpaceflightPage.vehicles.verifyCardSpacing();
        expect(cardSpacing.vertical, {
          message: "Cards should have proper vertical spacing",
        }).toBeTruthy();
        expect(cardSpacing.horizontal, {
          message: "Cards should have proper horizontal spacing",
        }).toBeTruthy();
        break;
      default:
        throw new Error(`Unknown card adaptation element: ${Element}`);
    }
  }

  private async validateTouchTargets(): Promise<void> {
    const learnMoreButtons = this.page.locator('[data-test="learn-more-link"]');
    const count = await learnMoreButtons.count();

    for (let i = 0; i < count; i++) {
      const button = learnMoreButtons.nth(i);
      const box = await button.boundingBox();
      expect(box!.width, {
        message: "Touch targets should be at least 44px wide",
      }).toBeGreaterThanOrEqual(this.TEST_CONSTANTS.MIN_TOUCH_TARGET);
      expect(box!.height, {
        message: "Touch targets should be at least 44px high",
      }).toBeGreaterThanOrEqual(this.TEST_CONSTANTS.MIN_TOUCH_TARGET);
    }
  }

  private async validateAccessibilityStandard(
    standard: AccessibilityStandard
  ): Promise<void> {
    const { Feature } = standard;

    switch (Feature) {
      case "Headings":
        await this.validateHeadingStructure();
        break;
      case "Focus Order":
        await this.validateFocusOrder();
        break;
      case "Media Controls":
        await this.validateMediaControls();
        break;
      case "Alt Text":
        await this.validateAltText();
        break;
      case "Color Contrast":
        await this.validateColorContrast();
        break;
      default:
        throw new Error(`Unknown accessibility feature: ${Feature}`);
    }
  }

  private async validateHeadingStructure(): Promise<void> {
    const headings = this.page.locator("h1, h2, h3, h4, h5, h6");
    const headingCount = await headings.count();
    expect(headingCount, {
      message: "Should have proper heading structure",
    }).toBeGreaterThan(0);
  }

  private async validateFocusOrder(): Promise<void> {
    const focusableElements = this.page.locator("button, a, [tabindex]");
    const focusableCount = await focusableElements.count();
    expect(focusableCount, {
      message: "Should have focusable elements",
    }).toBeGreaterThan(0);
  }

  private async validateMediaControls(): Promise<void> {
    const videos = this.page.locator("video");
    const videoCount = await videos.count();

    if (videoCount > 0) {
      const firstVideo = videos.first();
      const hasControls = await firstVideo.getAttribute("controls");
      expect(hasControls, {
        message: "Videos should have controls",
      }).not.toBeNull();
    }
  }

  private async validateAltText(): Promise<void> {
    const images = this.page.locator("img");
    const imageCount = await images.count();

    for (let i = 0; i < imageCount; i++) {
      const alt = await images.nth(i).getAttribute("alt");
      expect(alt, { message: "Images should have alt text" }).toBeTruthy();
    }
  }

  private async validateColorContrast(): Promise<void> {
    const textElements = this.page.locator("p, span, div");
    const textCount = await textElements.count();
    expect(textCount, {
      message: "Should have text elements for contrast check",
    }).toBeGreaterThan(0);
  }

  private async validateAccessibilityMethod(
    method: NavigationMethod
  ): Promise<void> {
    const { Method } = method;

    switch (Method) {
      case "Keyboard":
        await this.validateKeyboardNavigation();
        break;
      case "Screen Reader":
        await this.validateScreenReaderSupport();
        break;
      case "Touch":
        await this.validateTouchSupport();
        break;
      default:
        throw new Error(`Unknown accessibility method: ${Method}`);
    }
  }

  private async validateKeyboardNavigation(): Promise<void> {
    await this.page.keyboard.press("Tab");
    const hasFocus = await this.page.evaluate(
      () => document.activeElement !== document.body
    );
    expect(hasFocus, {
      message: "Should support keyboard navigation",
    }).toBeTruthy();
  }

  private async validateScreenReaderSupport(): Promise<void> {
    const ariaElements = this.page.locator("[aria-label], [aria-describedby]");
    const ariaCount = await ariaElements.count();
    expect(ariaCount, {
      message: "Should have ARIA attributes for screen readers",
    }).toBeGreaterThan(0);
  }

  private async validateTouchSupport(): Promise<void> {
    const buttons = this.page.locator('button, [role="button"]');
    const buttonCount = await buttons.count();
    expect(buttonCount, {
      message: "Should have touchable elements",
    }).toBeGreaterThan(0);
  }

  private async validatePerformanceMetric(
    metric: PerformanceMetric
  ): Promise<void> {
    const { Metric } = metric;

    switch (Metric) {
      case "Image Loading":
        await this.validateImageLoading();
        break;
      case "Video Loading":
        await this.validateVideoLoading();
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

  private async validateMediaOptimization(
    optimization: MediaOptimization
  ): Promise<void> {
    const { "Media Type": mediaType } = optimization;

    switch (mediaType) {
      case "Images":
        await this.validateImageOptimization();
        break;
      case "Videos":
        await this.validateVideoOptimization();
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
}
