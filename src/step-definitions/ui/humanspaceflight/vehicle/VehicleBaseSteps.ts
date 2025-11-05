import { Fixture, Then, When } from "playwright-bdd/decorators";
import { expect, Page } from "@playwright/test";
import { DataTable } from "playwright-bdd";
import { HumanSpaceflightPage } from "../../../../pages/ui/HumanSpaceflightPage";
import { InteractionHandler } from "../../../../utils/strategies/InteractionHandler";
import { SystemResponseValidator } from "../../../../utils/strategies/SystemResponseValidator";
import { CoreElementValidator } from "../../../../utils/strategies/CoreElementValidator";
import { CardInformationValidator } from "../../../../utils/strategies/CardInformationValidator";

@Fixture("vehicleBaseSteps")
export class VehicleBaseSteps {
  private interactionHandler: InteractionHandler;
  private systemResponseValidator: SystemResponseValidator;
  private coreElementValidator: CoreElementValidator;

  protected readonly TEST_CONSTANTS = {
    MIN_TOUCH_TARGET: 44,
    RESEARCH_CARD_NAME: "Develop your research",
    VEHICLE_NAMES: ["Dragon", "Starship"] as const,
  } as const;

  constructor(
    protected page: Page,
    protected humanSpaceflightPage: HumanSpaceflightPage
  ) {
    this.interactionHandler = new InteractionHandler(this.humanSpaceflightPage);
    this.systemResponseValidator = new SystemResponseValidator();
    this.coreElementValidator = new CoreElementValidator(this);
  }

  protected parseDataTable<T>(dataTable: DataTable): T[] {
    return dataTable.hashes().map((row) => row as T);
  }

  protected normalizeCardName(cardName: string): string {
    return cardName === "Research"
      ? this.TEST_CONSTANTS.RESEARCH_CARD_NAME
      : cardName;
  }

  protected expectCardToExist(cardContent: any, cardName: string): void {
    expect(cardContent, {
      message: `${cardName} card should exist`,
    }).not.toBeNull();
  }

  protected async getVehicleCardContent(cardName: string) {
    return this.humanSpaceflightPage.vehicles.getVehicleCardContent(cardName);
  }

  protected getAllCardNames(): string[] {
    return [
      ...this.TEST_CONSTANTS.VEHICLE_NAMES,
      this.TEST_CONSTANTS.RESEARCH_CARD_NAME,
    ];
  }

  protected async verifyVehicleMediaExists(cardName: string): Promise<boolean> {
    return this.humanSpaceflightPage.vehicles.verifyVehicleMediaExists(
      cardName
    );
  }

  async validateSectionTitle(): Promise<void> {
    const sectionVisible = await this.humanSpaceflightPage.vehicles[
      "vehiclesSection"
    ].isVisible();
    expect(sectionVisible, {
      message: "Vehicles section should be visible",
    }).toBeTruthy();
  }

  async validateVehicleCards(): Promise<void> {
    for (const vehicleName of this.TEST_CONSTANTS.VEHICLE_NAMES) {
      const content = await this.getVehicleCardContent(vehicleName);
      this.expectCardToExist(content, vehicleName);
    }
  }

  async validateResearchCard(): Promise<void> {
    const researchContent = await this.getVehicleCardContent(
      this.TEST_CONSTANTS.RESEARCH_CARD_NAME
    );
    this.expectCardToExist(researchContent, "Research");
  }

  async validateMediaElements(): Promise<void> {
    const allCards = this.getAllCardNames();

    for (const cardName of allCards) {
      const hasMedia = await this.verifyVehicleMediaExists(cardName);
      expect(hasMedia, {
        message: `${cardName} should have media`,
      }).toBeTruthy();
    }
  }

  async validateCallToActions(): Promise<void> {
    const allCards = this.getAllCardNames();

    for (const cardName of allCards) {
      const content = await this.getVehicleCardContent(cardName);
      expect(content?.learnMoreLink, {
        message: `${cardName} should have learn more link`,
      }).toBeTruthy();
    }
  }

  @When("I interact with the {string} on the {string} card")
  async interactWithCardElement(element: string, cardName: string) {
    const normalizedCardName = this.normalizeCardName(cardName);
    await this.interactionHandler.perform(element, normalizedCardName);
  }

  @Then("the interaction should result in {string}")
  async checkInteractionResult(action: string) {
    await this.validateInteractionResult(action);
  }

  @Then("the system should respond with {string}")
  async checkSystemResponse(response: string) {
    await this.systemResponseValidator.validate(
      response,
      this.page,
      this.humanSpaceflightPage
    );
  }

  private async validateInteractionResult(action: string): Promise<void> {
    const validActions = ["Click", "Play", "Hover", "Show touch feedback"];
    if (!validActions.includes(action)) {
      throw new Error(`Unknown interaction result: ${action}`);
    }
  }

  @When("I am viewing the Vehicles section")
  async viewVehiclesSection() {
    await this.humanSpaceflightPage.vehicles.scrollToVehiclesSection();
  }

  @Then("the Vehicle section should display core elements:")
  async checkCoreElements(dataTable: DataTable) {
    const elements = this.parseDataTable<any>(dataTable);

    for (const element of elements) {
      await this.coreElementValidator.validate(element);
    }
  }

  @When("I locate the {string} card")
  async locateCard(vehicleName: string) {
    const normalizedName = this.normalizeCardName(vehicleName);
    const cardContent = await this.getVehicleCardContent(normalizedName);
    this.expectCardToExist(cardContent, vehicleName);
  }

  @Then("the card should display the following information:")
  async checkCardInformation(dataTable: DataTable) {
    const info = this.parseDataTable<any>(dataTable);

    for (const item of info) {
      await CardInformationValidator.validate(item);
    }
  }

  @Then("the research card should display the following:")
  async checkResearchCardContent(dataTable: DataTable) {
    const content = this.parseDataTable<any>(dataTable);
    await this.validateResearchCardContent(content);
  }

  @Then("the research card should emphasize:")
  async checkResearchCardEmphasis(dataTable: DataTable) {
    const aspects = this.parseDataTable<any>(dataTable);
    await this.validateResearchCardEmphasis(aspects);
  }

  @When("viewing on {string} with width {string}px")
  async setViewportForDevice(_device: string, width: string) {
    const widthNum = parseInt(width);
    await this.page.setViewportSize({ width: widthNum, height: 812 });
  }

  @Then("the vehicle cards should adapt:")
  async checkCardAdaptation(dataTable: DataTable) {
    const adaptations = this.parseDataTable<any>(dataTable);

    for (const adaptation of adaptations) {
      await this.validateCardAdaptation(adaptation);
    }
  }

  @Then("interactive elements should support:")
  async checkInteractiveElementSupport(dataTable: DataTable) {
    const supports = this.parseDataTable<any>(dataTable);

    for (const support of supports) {
      await this.validateInteractiveElementSupport(support);
    }
  }

  private async validateResearchCardContent(content: any[]): Promise<void> {
    const researchContent = await this.getVehicleCardContent(
      this.TEST_CONSTANTS.RESEARCH_CARD_NAME
    );
    this.expectCardToExist(researchContent, "Research");

    for (const item of content) {
      await this.validateResearchCardItem(item, researchContent!);
    }
  }

  private async validateResearchCardItem(
    item: any,
    researchContent: any
  ): Promise<void> {
    const { Element, Content } = item;

    switch (Element) {
      case "Title":
        expect(researchContent.title, {
          message: "Research card should have correct title",
        }).toBe(Content);
        break;
      case "Description":
        expect(researchContent.description, {
          message: "Research card should have correct description",
        }).toContain(Content.substring(0, 30));
        break;
      case "Link":
        expect(researchContent.learnMoreLink, {
          message: "Research card should have correct link",
        }).toBe(Content);
        break;
      case "Media":
        const hasMedia = await this.verifyVehicleMediaExists(
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

  private async validateResearchCardEmphasis(aspects: any[]): Promise<void> {
    const researchContent = await this.getVehicleCardContent(
      this.TEST_CONSTANTS.RESEARCH_CARD_NAME
    );
    this.expectCardToExist(researchContent, "Research");

    for (const aspect of aspects) {
      await this.validateResearchEmphasisAspect(aspect, researchContent!);
    }
  }

  private async validateResearchEmphasisAspect(
    aspect: any,
    researchContent: any
  ): Promise<void> {
    const { Aspect } = aspect;
    const description = researchContent.description.toLowerCase();

    switch (Aspect) {
      case "Innovation":
        expect(description, {
          message: "Should emphasize innovation",
        }).toContain("research");
        break;
      case "Access":
        expect(description, {
          message: "Should emphasize access",
        }).toMatch(/(space|platform|access)/);
        break;
      case "Support":
        expect(description, {
          message: "Should emphasize support",
        }).toMatch(/(support|assistance|help)/);
        break;
      default:
        throw new Error(`Unknown research emphasis aspect: ${Aspect}`);
    }
  }

  private async validateCardAdaptation(adaptation: any): Promise<void> {
    const { Element } = adaptation;

    switch (Element) {
      case "Card Layout":
        await this.validateCardLayout();
        break;
      case "Media Position":
        await this.validateMediaPosition();
        break;
      case "Text Size":
        await this.validateTextSize();
        break;
      case "Touch Targets":
        await this.validateTouchTargets();
        break;
      case "Spacing":
        await this.validateCardSpacing();
        break;
      default:
        throw new Error(`Unknown card adaptation element: ${Element}`);
    }
  }

  private async validateCardLayout(): Promise<void> {
    const spacing =
      await this.humanSpaceflightPage.vehicles.verifyCardSpacing();
    expect(spacing.vertical, {
      message: "Cards should have proper spacing",
    }).toBeTruthy();
  }

  private async validateMediaPosition(): Promise<void> {
    const layoutInfo =
      await this.humanSpaceflightPage.vehicles.getCardLayoutInformation();

    const viewportSize = this.page.viewportSize();
    const isMobile = viewportSize && viewportSize.width < 768;

    if (isMobile) {
      for (const [vehicle, _info] of Object.entries(layoutInfo)) {
        const hasTopMedia = await this.checkMediaPositionTop(vehicle);
        expect(hasTopMedia, {
          message: `${vehicle} media should be positioned appropriately for mobile`,
        }).toBeTruthy();
      }
    }
  }

  private async checkMediaPositionTop(vehicleName: string): Promise<boolean> {
    const card =
      this.humanSpaceflightPage.vehicles["getVehicleCard"](vehicleName);
    const media = card.locator("img, video").first();
    const cardRect = await card.boundingBox();
    const mediaRect = await media.boundingBox();

    if (!cardRect || !mediaRect) return false;

    const mediaTopRelative = mediaRect.y - cardRect.y;
    return mediaTopRelative < cardRect.height * 0.3;
  }

  private async validateTextSize(): Promise<void> {
    const viewportSize = this.page.viewportSize();
    const isMobile = viewportSize && viewportSize.width < 768;

    const title = this.page.locator('[data-test="vehicle-title"]').first();
    const titleSize = await title.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return parseFloat(style.fontSize);
    });

    if (isMobile) {
      expect(titleSize, {
        message: "Title text should be appropriately sized for mobile",
      }).toBeLessThanOrEqual(24);
    } else {
      expect(titleSize, {
        message: "Title text should be appropriately sized for desktop",
      }).toBeGreaterThanOrEqual(20);
    }
  }

  private async validateTouchTargets(): Promise<void> {
    const buttons = this.page.locator('button, [role="button"], a');
    const buttonCount = await buttons.count();

    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i);
      const size = await button.boundingBox();

      if (size) {
        const minDimension = Math.min(size.width, size.height);
        expect(minDimension, {
          message: "Touch targets should meet minimum size requirements",
        }).toBeGreaterThanOrEqual(this.TEST_CONSTANTS.MIN_TOUCH_TARGET);
      }
    }
  }

  private async validateCardSpacing(): Promise<void> {
    const cards = this.page.locator(
      '[data-test="dragon-card"], [data-test="starship-card"], [data-test="research-card"]'
    );
    const cardCount = await cards.count();

    if (cardCount > 1) {
      const firstCard = cards.first();
      const secondCard = cards.nth(1);

      const firstRect = await firstCard.boundingBox();
      const secondRect = await secondCard.boundingBox();

      if (firstRect && secondRect) {
        const verticalSpacing = secondRect.y - (firstRect.y + firstRect.height);
        expect(verticalSpacing, {
          message: "Cards should have sufficient vertical spacing",
        }).toBeGreaterThan(16);
      }
    }
  }

  private async validateInteractiveElementSupport(support: any): Promise<void> {
    const { Feature } = support;

    switch (Feature) {
      case "Touch":
        await this.validateTouchSupport();
        break;
      case "Hover":
        await this.validateHoverSupport();
        break;
      case "Focus":
        await this.validateFocusSupport();
        break;
      case "Keyboard":
        await this.validateKeyboardSupport();
        break;
      default:
        throw new Error(`Unknown interactive element feature: ${Feature}`);
    }
  }

  private async validateTouchSupport(): Promise<void> {
    const touchElements = this.page.locator(
      '[data-test="dragon-card"], [data-test="starship-card"], [data-test="research-card"]'
    );
    const touchCount = await touchElements.count();

    for (let i = 0; i < touchCount; i++) {
      const element = touchElements.nth(i);
      const size = await element.boundingBox();

      if (size) {
        const minDimension = Math.min(size.width, size.height);
        expect(minDimension, {
          message: "Interactive elements should be touch-friendly",
        }).toBeGreaterThanOrEqual(this.TEST_CONSTANTS.MIN_TOUCH_TARGET);
      }
    }
  }

  private async validateHoverSupport(): Promise<void> {
    const hoverElements = this.page.locator(
      '[data-test="dragon-card"], [data-test="starship-card"], [data-test="research-card"]'
    );
    const firstElement = hoverElements.first();

    await firstElement.hover();
    await this.page.waitForTimeout(300);

    const hasHoverEffect = await firstElement.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return (
        style.transform !== "none" ||
        style.boxShadow !== "none" ||
        style.filter !== "none"
      );
    });

    expect(hasHoverEffect, {
      message: "Interactive elements should have hover effects",
    }).toBeTruthy();
  }

  private async validateFocusSupport(): Promise<void> {
    const focusableElements = this.page.locator(
      'button, a, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements.first();

    await firstElement.focus();
    const isFocused = await firstElement.evaluate(
      (el) => document.activeElement === el
    );

    expect(isFocused, {
      message: "Interactive elements should be focusable",
    }).toBeTruthy();
  }

  private async validateKeyboardSupport(): Promise<void> {
    const interactiveElements = this.page.locator('button, a, [role="button"]');
    const firstElement = interactiveElements.first();

    await firstElement.focus();
    await this.page.keyboard.press("Enter");

    const wasActivated = await firstElement.evaluate((el) => {
      return (
        el.getAttribute("data-activated") === "true" ||
        el.classList.contains("active")
      );
    });

    expect(wasActivated, {
      message: "Interactive elements should respond to keyboard input",
    }).toBeTruthy();
  }
}
