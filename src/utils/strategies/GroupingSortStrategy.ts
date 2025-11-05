import { Locator } from "@playwright/test";
import { SortStrategy } from "../../utils/types/Types";

export class GroupingSortStrategy implements SortStrategy {
  constructor(private getValue: (card: Locator) => Promise<string>) {}

  async verify(cards: Locator[]): Promise<void> {
    const values: string[] = [];
    let currentGroupValue: string | null = null;

    for (const card of cards) {
      const value = await this.getValue(card);

      if (currentGroupValue === null) {
        currentGroupValue = value;
      } else if (value !== currentGroupValue) {
        currentGroupValue = value;
        if (values.includes(value)) {
          throw new Error(
            `Grouping sort failed: Found group value "${value}" which already appeared earlier in the list.`
          );
        }
      }
      values.push(value);
    }
  }
}
