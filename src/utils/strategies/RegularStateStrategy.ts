import { expect } from "@playwright/test";
import { InteractiveStateStrategy } from "../../utils/types/Types";
import { HumanSpaceflightPage } from "../../pages/ui/HumanSpaceflightPage";

export class RegularStateStrategy implements InteractiveStateStrategy {
  constructor(private humanSpaceflightPage: HumanSpaceflightPage) {}

  async validate(): Promise<void> {
    await this.humanSpaceflightPage.destinations.unhoverDestination();

    const effectDisappeared =
      await this.humanSpaceflightPage.destinations.isDestinationHoverEffectDisappeared();
    expect(effectDisappeared, "Hover effect should disappear").toBeTruthy();

    const hasPointerCursor =
      await this.humanSpaceflightPage.destinations.isDestinationCursorPointer();
    expect(
      hasPointerCursor,
      "Cursor should not be pointer after unhover"
    ).toBeFalsy();
  }
}
