import {
  SpecVerificationStrategy,
  AttributeDetailTable,
} from "../../utils/types/Types";

export class AttributeDetailVerificationStrategy
  implements SpecVerificationStrategy
{
  constructor(
    private validationMethod: (
      attribute: string,
      detail: string
    ) => Promise<boolean>,
    private specType: string
  ) {}

  async validate(spec: AttributeDetailTable[0]): Promise<boolean> {
    return this.validationMethod(spec.Attribute, spec.Detail);
  }

  getErrorMessage(spec: AttributeDetailTable[0]): string {
    return `${this.specType} spec: Attribute '${spec.Attribute}' with Detail '${spec.Detail}' is not displayed.`;
  }
}
