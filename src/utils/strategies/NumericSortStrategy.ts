import { Locator } from "@playwright/test";
import { SortStrategy } from "../../utils/types/Types";

export class NumericSortStrategy implements SortStrategy {
  constructor(
    private getValue: (card: Locator) => Promise<number>,
    private order: "ascending" | "descending"
  ) {}

  async verify(cards: Locator[]): Promise<void> {
    const scores: number[] = [];

    for (const card of cards) {
      const score = await this.getValue(card);

      if (scores.length > 0) {
        const lastScore = scores[scores.length - 1];
        if (this.order === "descending" && score > lastScore) {
          throw new Error(
            `Numeric sort failed (${this.order}): Found score ${score} which is greater than the previous score ${lastScore}.`
          );
        }
        if (this.order === "ascending" && score < lastScore) {
          throw new Error(
            `Numeric sort failed (${this.order}): Found score ${score} which is less than the previous score ${lastScore}.`
          );
        }
      }
      scores.push(score);
    }
  }
}
