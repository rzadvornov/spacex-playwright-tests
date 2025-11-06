import { SpecValidationStrategy } from "../../utils/types/Types";
import { Falcon9Page } from "../../services/ui/Falcon9Page";

export class MerlinVacuumSpecValidator implements SpecValidationStrategy {
  constructor(private falcon9Page: Falcon9Page) {}

  async validate(field: string, detail: string): Promise<boolean> {
    return this.falcon9Page.isMerlinVacuumSpecDisplayed(field, detail);
  }
}
