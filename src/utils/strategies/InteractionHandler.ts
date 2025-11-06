import { HumanSpaceflightPage } from "../../services/ui/HumanSpaceflightPage";

export class InteractionHandler {
  private strategies: Map<string, (cardName: string) => Promise<void>>;

  constructor(private humanSpaceflightPage: HumanSpaceflightPage) {
    this.strategies = new Map([
      ["Learn More", this.handleLearnMore.bind(this)],
      ["Video", this.handleVideo.bind(this)],
      ["Card", this.handleCardHover.bind(this)],
    ]);
  }

  async perform(element: string, cardName: string): Promise<void> {
    const handler = this.strategies.get(element);
    if (!handler) {
      throw new Error(`Unknown card interaction element: ${element}`);
    }
    await handler(cardName);
  }

  private async handleLearnMore(cardName: string): Promise<void> {
    await this.humanSpaceflightPage.vehicles.clickLearnMore(cardName);
  }

  private async handleVideo(cardName: string): Promise<void> {
    const card = this.humanSpaceflightPage.vehicles["getVehicleCard"](cardName);
    const video = card.locator("video").first();
    await video.click();
  }

  private async handleCardHover(cardName: string): Promise<void> {
    const card = this.humanSpaceflightPage.vehicles["getVehicleCard"](cardName);
    await card.hover();
  }
}
