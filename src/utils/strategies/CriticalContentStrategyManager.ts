import { HomePageCoreSteps } from "../../step-definitions/ui/home/HomePageCoreSteps";
import { CriticalContent, CriticalContentStrategy } from "../types/Types";
class CallToActionStrategy implements CriticalContentStrategy {
  async validate(
    _content: CriticalContent,
    steps: HomePageCoreSteps
  ): Promise<void> {
    await steps.validateCallToAction();
  }
}

class MissionTitleStrategy implements CriticalContentStrategy {
  async validate(
    _content: CriticalContent,
    steps: HomePageCoreSteps
  ): Promise<void> {
    await steps.validateMissionTitle();
  }
}

class MissionStatusStrategy implements CriticalContentStrategy {
  async validate(
    _content: CriticalContent,
    steps: HomePageCoreSteps
  ): Promise<void> {
    await steps.validateMissionStatus();
  }
}

class ScrollIndicatorStrategy implements CriticalContentStrategy {
  async validate(
    _content: CriticalContent,
    steps: HomePageCoreSteps
  ): Promise<void> {
    await steps.validateScrollIndicator();
  }
}

export class CriticalContentStrategyManager {
  private strategies: Map<string, CriticalContentStrategy> = new Map();

  constructor() {
    this.strategies.set("Mission Title", new MissionTitleStrategy());
    this.strategies.set("Mission Status", new MissionStatusStrategy());
    this.strategies.set("Call-to-Action", new CallToActionStrategy());
    this.strategies.set("Scroll Indicator", new ScrollIndicatorStrategy());
  }

  getStrategy(contentType: string): CriticalContentStrategy | undefined {
    return this.strategies.get(contentType);
  }
}