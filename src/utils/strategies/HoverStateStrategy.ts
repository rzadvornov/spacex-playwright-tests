import { expect } from "@playwright/test";
import { InteractiveStateStrategy } from "../../utils/types/Types";
import { HumanSpaceflightPage } from "../../services/ui/HumanSpaceflightPage";

export class HoverStateStrategy implements InteractiveStateStrategy {
  constructor(private humanSpaceflightPage: HumanSpaceflightPage) {}

  async validate(): Promise<void> {
    const hasHoverEffect =
      await this.humanSpaceflightPage.destinations.isDestinationHoverEffectVisible();
    expect(hasHoverEffect, "Element should show hover effect").toBeTruthy();

    const hasPointerCursor =
      await this.humanSpaceflightPage.destinations.isDestinationCursorPointer();
    expect(hasPointerCursor, "Cursor should be pointer on hover").toBeTruthy();
  }
}
