import { InteractiveStateStrategy } from "../../utils/types/Types";

export class InteractiveStateContext {
  private strategies: Map<string, InteractiveStateStrategy> = new Map();

  registerStrategy(state: string, strategy: InteractiveStateStrategy): void {
    this.strategies.set(state, strategy);
  }

  async executeStrategy(state: string): Promise<void> {
    const strategy = this.strategies.get(state);
    if (!strategy) {
      throw new Error(`No strategy registered for state: ${state}`);
    }
    await strategy.validate();
  }
}
