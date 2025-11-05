import { HomePageCoreSteps } from "../../step-definitions/ui/home/HomePageCoreSteps";
import { CoreRequirement, HomeCoreRequirementStrategy } from "../types/Types";

class HeroSectionStrategy implements HomeCoreRequirementStrategy {
  async validate(
    _requirement: CoreRequirement,
    steps: HomePageCoreSteps
  ): Promise<void> {
    await steps.validateHeroSectionVisibility();
  }
}

class PageTitleStrategy implements HomeCoreRequirementStrategy {
  async validate(
    requirement: CoreRequirement,
    steps: HomePageCoreSteps
  ): Promise<void> {
    await steps.validatePageTitle(requirement.Requirement);
  }
}

class NavigationStrategy implements HomeCoreRequirementStrategy {
  async validate(
    _requirement: CoreRequirement,
    steps: HomePageCoreSteps
  ): Promise<void> {
    await steps.validateHeaderAccessibility();
  }
}

class LoadTimeStrategy implements HomeCoreRequirementStrategy {
  async validate(
    requirement: CoreRequirement,
    steps: HomePageCoreSteps
  ): Promise<void> {
    await steps.validateLoadTime(requirement.Requirement);
  }
}

export class CoreRequirementStrategyManager {
  private strategies: Map<string, HomeCoreRequirementStrategy> = new Map();

  constructor() {
    this.strategies.set("Load Time", new LoadTimeStrategy());
    this.strategies.set("Page Title", new PageTitleStrategy());
    this.strategies.set("Hero Section", new HeroSectionStrategy());
    this.strategies.set("Navigation", new NavigationStrategy());
  }

  getStrategy(element: string): HomeCoreRequirementStrategy | undefined {
    return this.strategies.get(element);
  }
}