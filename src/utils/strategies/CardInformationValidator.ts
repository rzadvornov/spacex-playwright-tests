export class CardInformationValidator {
  static async validate(_item: any): Promise<void> {
    const { Element } = _item;
    const validElements = ["Title", "Description", "Media Type", "Learn More"];

    if (!validElements.includes(Element)) {
      throw new Error(`Unknown card information element: ${Element}`);
    }
  }
}
