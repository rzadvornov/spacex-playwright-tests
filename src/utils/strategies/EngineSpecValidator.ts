import { SpecValidationStrategy } from "../../utils/types/Types";
import { Falcon9Page } from "../../pages/ui/Falcon9Page";

export class EngineSpecValidator implements SpecValidationStrategy {
  constructor(private falcon9Page: Falcon9Page) {}

  async validate(field: string, detail: string): Promise<boolean> {
    return this.falcon9Page.isEngineSpecDisplayed(field, detail);
  }
}
