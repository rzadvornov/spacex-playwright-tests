import {
  SpecVerificationStrategy,
  TechnicalSpecTable,
} from "../../utils/types/Types";
import { FalconHeavyPage } from "../../services/ui/FalconHeavyPage";

export class TechnicalSpecVerificationStrategy
  implements SpecVerificationStrategy
{
  constructor(private falconHeavyPage: FalconHeavyPage) {}

  async validate(spec: TechnicalSpecTable[0]): Promise<boolean> {
    return this.falconHeavyPage.isTechnicalSpecValueDisplayed(
      spec.Attribute,
      spec["Metric Value"],
      spec["Imperial Value"]
    );
  }

  getErrorMessage(spec: TechnicalSpecTable[0]): string {
    return `Technical spec: Attribute '${spec.Attribute}' with Metric '${spec["Metric Value"]}' and Imperial '${spec["Imperial Value"]}' is not displayed as expected.`;
  }
}
