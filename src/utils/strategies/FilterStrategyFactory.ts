import { FilterStrategy } from "../../utils/types/Types";
import { CareersPage } from "../../pages/ui/CareersPage";

class DepartmentFilterStrategy implements FilterStrategy {
  async applyFilter(
    careersPage: CareersPage,
    department: string,
    type?: string
  ): Promise<void> {
    await careersPage.jobFilterPanel.scrollIntoViewIfNeeded();
    await careersPage.applyFilters(department, type || "");
  }
}

class LocationFilterStrategy implements FilterStrategy {
  async applyFilter(
    careersPage: CareersPage,
    location: string,
    _additionalValue?: string
  ): Promise<void> {
    await careersPage.searchForJob(location);
  }
}

class ExperienceFilterStrategy implements FilterStrategy {
  async applyFilter(
    careersPage: CareersPage,
    _experience: string,
    _additionalValue?: string
  ): Promise<void> {
    await careersPage.jobFilterPanel.scrollIntoViewIfNeeded();
  }
}

export class FilterStrategyFactory {
  private static strategies: Map<string, FilterStrategy> = new Map([
    ["department", new DepartmentFilterStrategy()],
    ["location", new LocationFilterStrategy()],
    ["experience", new ExperienceFilterStrategy()],
  ]);

  static getStrategy(type: string): FilterStrategy {
    const strategy = this.strategies.get(type);
    if (!strategy) {
      throw new Error(`No filter strategy found for type: ${type}`);
    }
    return strategy;
  }
}
