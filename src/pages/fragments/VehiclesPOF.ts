import { Locator, Page } from "@playwright/test";
import { BasePage } from "../base/BasePage";
import { BoundingBox } from "../types/BoundingBox";
import { VehicleCard } from "../types/VehicleCard";
import { CardSpacing } from "../types/CardSpacing";

export class VehiclesPOF extends BasePage {
  private static readonly MIN_SPACING = 20;
  private static readonly VEHICLE_NAMES = {
    DRAGON: "dragon",
    STARSHIP: "starship", 
    RESEARCH: "develop your research"
  } as const;

  private readonly vehiclesSection: Locator;
  private readonly dragonCard: Locator;
  private readonly starshipCard: Locator;
  private readonly researchCard: Locator;

  constructor(page: Page) {
    super(page);
    this.vehiclesSection = page.locator('[data-test="vehicles-section"]');
    this.dragonCard = this.vehiclesSection.locator('[data-test="dragon-card"]');
    this.starshipCard = this.vehiclesSection.locator('[data-test="starship-card"]');
    this.researchCard = this.vehiclesSection.locator('[data-test="research-card"]');
  }

  async scrollToVehiclesSection(): Promise<void> {
    await this.vehiclesSection.scrollIntoViewIfNeeded();
    await this.page.waitForLoadState("domcontentloaded");
  }

  async getVehicleCardContent(vehicleName: string): Promise<VehicleCard | null> {
    const card = this.getVehicleCard(vehicleName);
    
    const isCardVisible = await card.isVisible().catch(() => false);
    if (!isCardVisible) {
      return null;
    }

    const [title, description, learnMoreLink] = await Promise.all([
      card.locator('[data-test="vehicle-title"]').textContent(),
      card.locator('[data-test="vehicle-description"]').textContent(),
      card.locator('[data-test="learn-more-link"]').getAttribute("href")
    ]);

    return {
      title: title?.trim() || "",
      description: description?.trim() || "",
      learnMoreLink: learnMoreLink || "",
    };
  }

  private getVehicleCard(vehicleName: string): Locator {
    const normalizedName = vehicleName.toLowerCase();
    
    switch (normalizedName) {
      case VehiclesPOF.VEHICLE_NAMES.DRAGON:
        return this.dragonCard;
      case VehiclesPOF.VEHICLE_NAMES.STARSHIP:
        return this.starshipCard;
      case VehiclesPOF.VEHICLE_NAMES.RESEARCH:
        return this.researchCard;
      default:
        throw new Error(`Unknown vehicle card: '${vehicleName}'. Available options: ${Object.values(VehiclesPOF.VEHICLE_NAMES).join(', ')}`);
    }
  }

  async verifyVehicleMediaExists(vehicleName: string): Promise<boolean> {
    const card = this.getVehicleCard(vehicleName);
    const media = card.locator('[data-test="vehicle-media"]');
    
    return await media.isVisible().catch(() => false);
  }

  async verifyVehicleMediaType(vehicleName: string): Promise<"video" | "image"> {
    const card = this.getVehicleCard(vehicleName);
    
    const [videoCount, imageCount] = await Promise.all([
      card.locator("video").count(),
      card.locator("img").count()
    ]);

    if (videoCount > 0) {
      return "video";
    } else if (imageCount > 0) {
      return "image";
    } else {
      throw new Error(`No media found for vehicle: ${vehicleName}`);
    }
  }

  async checkVehicleCardBackground(vehicleName: string): Promise<boolean> {
    const card = this.getVehicleCard(vehicleName);
    
    return await card.evaluate((element) => {
      const style = window.getComputedStyle(element);
      const backgroundImage = style.backgroundImage;
      
      return backgroundImage !== "none" && 
             backgroundImage !== "initial" && 
             !backgroundImage.includes("undefined");
    });
  }

  async checkBackgroundPosition(vehicleName: string): Promise<"left" | "right"> {
    const card = this.getVehicleCard(vehicleName);
    
    return await card.evaluate((element) => {
      const style = window.getComputedStyle(element);
      const backgroundPosition = style.backgroundPosition.toLowerCase();
      
      if (backgroundPosition.includes("left")) {
        return "left";
      } else if (backgroundPosition.includes("right")) {
        return "right";
      } else {
        const rect = element.getBoundingClientRect();
        const computedStyle = window.getComputedStyle(element);
        const isRTL = computedStyle.direction === "rtl";
        
        return isRTL ? "left" : "right";
      }
    });
  }

  async clickLearnMore(vehicleName: string): Promise<void> {
    const card = this.getVehicleCard(vehicleName);
    const learnMoreLink = card.locator('[data-test="learn-more-link"]');
    
    const isLinkVisible = await learnMoreLink.isVisible();
    if (!isLinkVisible) {
      throw new Error(`Learn more link not found or not visible for vehicle: ${vehicleName}`);
    }
    
    await learnMoreLink.click();
    await this.page.waitForLoadState("domcontentloaded");
  }

  async verifyCardSpacing(): Promise<CardSpacing> {
    const cards = [this.dragonCard, this.starshipCard, this.researchCard];
    
    const boundingBoxes = await Promise.all(
      cards.map(card => card.boundingBox())
    );

    const allCardsVisible = boundingBoxes.every(box => box !== null);
    if (!allCardsVisible) {
      return { vertical: false, horizontal: false };
    }

    const verticalSpacingResults = await this.checkVerticalSpacing(boundingBoxes as BoundingBox[]);
    const horizontalSpacingResults = await this.checkHorizontalSpacing(cards);

    return {
      vertical: verticalSpacingResults.every(Boolean),
      horizontal: horizontalSpacingResults.every(Boolean),
    };
  }

  private async checkVerticalSpacing(boundingBoxes: BoundingBox[]): Promise<boolean[]> {
    return boundingBoxes.slice(1).map((currentBox, index) => {
      const previousBox = boundingBoxes[index];
      const verticalGap = currentBox.y - (previousBox.y + previousBox.height);
      return verticalGap >= VehiclesPOF.MIN_SPACING;
    });
  }

  private async checkHorizontalSpacing(cards: Locator[]): Promise<boolean[]> {
    return await Promise.all(
      cards.map(async (card) => {
        const [textContentBox, mediaBox] = await Promise.all([
          card.locator('[data-test="vehicle-content"]').boundingBox(),
          card.locator('[data-test="vehicle-media"]').boundingBox()
        ]);

        if (!textContentBox || !mediaBox) {
          return false;
        }

        const horizontalGap = Math.abs(mediaBox.x - textContentBox.x);
        return horizontalGap >= VehiclesPOF.MIN_SPACING;
      })
    );
  }

  async getAllVehicleCardsContent(): Promise<Record<string, VehicleCard | null>> {
    const vehicleNames = Object.values(VehiclesPOF.VEHICLE_NAMES);
    const results = await Promise.all(
      vehicleNames.map(name => this.getVehicleCardContent(name))
    );

    return vehicleNames.reduce((acc, name, index) => {
      acc[name] = results[index];
      return acc;
    }, {} as Record<string, VehicleCard | null>);
  }

  async areAllCardsVisible(): Promise<boolean> {
    const visibilityChecks = await Promise.all([
      this.dragonCard.isVisible(),
      this.starshipCard.isVisible(),
      this.researchCard.isVisible()
    ]);

    return visibilityChecks.every(isVisible => isVisible);
  }

  async getCardLayoutInformation(): Promise<{
    dragon: { mediaType: "video" | "image"; backgroundPosition: "left" | "right" };
    starship: { mediaType: "video" | "image"; backgroundPosition: "left" | "right" };
    research: { mediaType: "video" | "image"; backgroundPosition: "left" | "right" };
  }> {
    const [dragonMediaType, dragonBackgroundPosition] = await Promise.all([
      this.verifyVehicleMediaType(VehiclesPOF.VEHICLE_NAMES.DRAGON),
      this.checkBackgroundPosition(VehiclesPOF.VEHICLE_NAMES.DRAGON)
    ]);

    const [starshipMediaType, starshipBackgroundPosition] = await Promise.all([
      this.verifyVehicleMediaType(VehiclesPOF.VEHICLE_NAMES.STARSHIP),
      this.checkBackgroundPosition(VehiclesPOF.VEHICLE_NAMES.STARSHIP)
    ]);

    const [researchMediaType, researchBackgroundPosition] = await Promise.all([
      this.verifyVehicleMediaType(VehiclesPOF.VEHICLE_NAMES.RESEARCH),
      this.checkBackgroundPosition(VehiclesPOF.VEHICLE_NAMES.RESEARCH)
    ]);

    return {
      dragon: { mediaType: dragonMediaType, backgroundPosition: dragonBackgroundPosition },
      starship: { mediaType: starshipMediaType, backgroundPosition: starshipBackgroundPosition },
      research: { mediaType: researchMediaType, backgroundPosition: researchBackgroundPosition }
    };
  }
}