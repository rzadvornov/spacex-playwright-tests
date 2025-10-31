import { expect, Page } from "@playwright/test";

type AsyncCheckMethod = () => Promise<boolean>;

export class AssertionHelper {
  constructor(private page: Page) {}

  async validateBooleanCheck(
    checkMethod: AsyncCheckMethod,
    errorMessage: string
  ): Promise<void> {
    const result = await checkMethod();
    expect(result, errorMessage).toBeTruthy();
  }

  assertMetric(
    actual: number | undefined,
    maxAllowed: number,
    message: string
  ): void {
    expect(actual, {
      message: `${message}. Actual value: ${actual}`,
    }).toBeLessThan(maxAllowed);
  }

  assertValuePresent<T>(actual: T | null | undefined, message: string): void {
    expect(actual, message).toBeTruthy();
  }
}
