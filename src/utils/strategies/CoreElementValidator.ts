import { VehicleBaseSteps } from "../../step-definitions/ui/humanspaceflight/vehicle/VehicleBaseSteps";
import { InteractiveStateStrategy } from "../types/Types";

export abstract class BaseValidationStrategy implements InteractiveStateStrategy {
  constructor(protected steps: VehicleBaseSteps) {}
  abstract validate(): Promise<void>;
}

export class SectionTitleStrategy extends BaseValidationStrategy {
  async validate(): Promise<void> {
    await this.steps.validateSectionTitle();
  }
}

export class VehicleCardsStrategy extends BaseValidationStrategy {
  async validate(): Promise<void> {
    await this.steps.validateVehicleCards();
  }
}

export class ResearchCardStrategy extends BaseValidationStrategy {
  async validate(): Promise<void> {
    await this.steps.validateResearchCard();
  }
}

export class MediaElementsStrategy extends BaseValidationStrategy {
  async validate(): Promise<void> {
    await this.steps.validateMediaElements();
  }
}

export class CallToActionsStrategy extends BaseValidationStrategy {
  async validate(): Promise<void> {
    await this.steps.validateCallToActions();
  }
}

export class CoreElementValidator {
  private strategies: Map<string, BaseValidationStrategy>;

  constructor(steps: VehicleBaseSteps) {
    this.strategies = new Map<string, BaseValidationStrategy>([
      ["Section Title", new SectionTitleStrategy(steps)],
      ["Vehicle Cards", new VehicleCardsStrategy(steps)],
      ["Research Card", new ResearchCardStrategy(steps)],
      ["Media Elements", new MediaElementsStrategy(steps)],
      ["Call-to-Actions", new CallToActionsStrategy(steps)],
    ]);
  }

  async validate(element: any): Promise<void> {
    const strategy = this.strategies.get(element.Element);
    if (!strategy) {
      throw new Error(`Unknown core element: ${element.Element}`);
    }
    await strategy.validate();
  }
}