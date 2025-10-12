import { Locator, Page } from "@playwright/test";
import { BasePage } from "../base/BasePage";

interface VehicleCard {
  title: string;
  description: string;
  learnMoreLink: string;
}

export class VehiclesPOF extends BasePage {
  private readonly vehiclesSection: Locator;
  private readonly dragonCard: Locator;
  private readonly starshipCard: Locator;
  private readonly researchCard: Locator;

  constructor(page: Page) {
    super(page);
    this.vehiclesSection = page.locator('[data-test="vehicles-section"]');
    this.dragonCard = this.vehiclesSection.locator('[data-test="dragon-card"]');
    this.starshipCard = this.vehiclesSection.locator(
      '[data-test="starship-card"]'
    );
    this.researchCard = this.vehiclesSection.locator(
      '[data-test="research-card"]'
    );
  }

  async scrollToVehiclesSection(): Promise<void> {
    await this.vehiclesSection.scrollIntoViewIfNeeded();
  }

  async getVehicleCardContent(
    vehicleName: string
  ): Promise<VehicleCard | null> {
    const card = this.getVehicleCard(vehicleName);
    if (!card) return null;

    const title = await card
      .locator('[data-test="vehicle-title"]')
      .textContent();
    const description = await card
      .locator('[data-test="vehicle-description"]')
      .textContent();
    const learnMoreLink = await card
      .locator('[data-test="learn-more-link"]')
      .getAttribute("href");

    return {
      title: title?.trim() || "",
      description: description?.trim() || "",
      learnMoreLink: learnMoreLink || "",
    };
  }

  private getVehicleCard(vehicleName: string): Locator {
    switch (vehicleName.toLowerCase()) {
      case "dragon":
        return this.dragonCard;
      case "starship":
        return this.starshipCard;
      case "develop your research":
        return this.researchCard;
      default:
        throw new Error(`Unknown vehicle card: ${vehicleName}`);
    }
  }

  async verifyVehicleMediaExists(vehicleName: string): Promise<boolean> {
    const card = this.getVehicleCard(vehicleName);
    const media = card.locator('[data-test="vehicle-media"]');
    return await media.isVisible();
  }

  async verifyVehicleMediaType(
    vehicleName: string
  ): Promise<"video" | "image"> {
    const card = this.getVehicleCard(vehicleName);
    const video = card.locator("video");
    const image = card.locator("img");
    return (await video.count()) > 0 ? "video" : "image";
  }

  async checkVehicleCardBackground(vehicleName: string): Promise<boolean> {
    const card = this.getVehicleCard(vehicleName);
    const backgroundImage = await card.evaluate((element) => {
      const style = window.getComputedStyle(element);
      return style.backgroundImage !== "none";
    });
    return backgroundImage;
  }

  async checkBackgroundPosition(
    vehicleName: string
  ): Promise<"left" | "right"> {
    const card = this.getVehicleCard(vehicleName);
    const position = await card.evaluate((element) => {
      const style = window.getComputedStyle(element);
      return style.backgroundPosition;
    });
    return position.includes("left") ? "left" : "right";
  }

  async clickLearnMore(vehicleName: string): Promise<void> {
    const card = this.getVehicleCard(vehicleName);
    await card.locator('[data-test="learn-more-link"]').click();
  }

  async verifyCardSpacing(): Promise<{
    vertical: boolean;
    horizontal: boolean;
  }> {
    const cards = [this.dragonCard, this.starshipCard, this.researchCard];

    // Check vertical spacing between cards
    const verticalSpacing = await Promise.all(
      cards.slice(1).map(async (card, index) => {
        const prevBounds = await cards[index].boundingBox();
        const currentBounds = await card.boundingBox();
        return (
          prevBounds &&
          currentBounds &&
          currentBounds.y - (prevBounds.y + prevBounds.height) >= 20
        );
      })
    );

    // Check horizontal spacing between text and media in each card
    const horizontalSpacing = await Promise.all(
      cards.map(async (card) => {
        const textContent = await card
          .locator('[data-test="vehicle-content"]')
          .boundingBox();
        const media = await card
          .locator('[data-test="vehicle-media"]')
          .boundingBox();
        return textContent && media && Math.abs(media.x - textContent.x) >= 20;
      })
    );

    return {
      vertical: verticalSpacing.every(Boolean),
      horizontal: horizontalSpacing.every(Boolean),
    };
  }
}
