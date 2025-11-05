import { StateChecker } from "../types/Types";

class HoverStateChecker implements StateChecker {
  async hasState(element: any): Promise<boolean> {
    const styles = await element.evaluate((el: Element) => {
      const style = window.getComputedStyle(el);
      return {
        cursor: style.cursor,
        backgroundColor: style.backgroundColor,
        borderColor: style.borderColor,
      };
    });

    return (
      styles.cursor === "pointer" ||
      styles.backgroundColor !== "rgba(0, 0, 0, 0)" ||
      styles.borderColor !== "rgba(0, 0, 0, 0)"
    );
  }
}

class FocusStateChecker implements StateChecker {
  async hasState(element: any): Promise<boolean> {
    const styles = await element.evaluate((el: Element) => {
      const style = window.getComputedStyle(el);
      return {
        outline: style.outline,
        boxShadow: style.boxShadow,
        borderColor: style.borderColor,
      };
    });

    return (
      styles.outline !== "none" ||
      styles.boxShadow !== "none" ||
      styles.borderColor !== "rgba(0, 0, 0, 0)"
    );
  }
}

class ActiveStateChecker implements StateChecker {
  async hasState(element: any): Promise<boolean> {
    const styles = await element.evaluate((el: Element) => {
      const style = window.getComputedStyle(el);
      return {
        transform: style.transform,
        backgroundColor: style.backgroundColor,
      };
    });

    return (
      styles.transform !== "none" ||
      styles.backgroundColor !== "rgba(0, 0, 0, 0)"
    );
  }
}

export class StateCheckerRegistry {
  private checkers = new Map<string, StateChecker>();

  constructor() {
    this.register("hover", new HoverStateChecker());
    this.register("focus", new FocusStateChecker());
    this.register("active", new ActiveStateChecker());
  }

  register(state: string, checker: StateChecker): void {
    this.checkers.set(state.toLowerCase(), checker);
  }

  getChecker(state: string): StateChecker | undefined {
    return this.checkers.get(state.toLowerCase());
  }
}