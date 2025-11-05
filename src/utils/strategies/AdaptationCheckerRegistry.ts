import { AdaptationChecker } from "../types/Types";

class AnimationAdaptationChecker implements AdaptationChecker {
  async hasAdapted(element: any): Promise<boolean> {
    return await element.evaluate((el: Element) => {
      const style = window.getComputedStyle(el);
      return (
        style.animationDuration === "0s" ||
        style.animationPlayState === "paused" ||
        style.transitionDuration === "0s"
      );
    });
  }
}

class AutoAdvanceAdaptationChecker implements AdaptationChecker {
  async hasAdapted(element: any): Promise<boolean> {
    return await element.evaluate((el: Element) => {
      return (
        !el.hasAttribute("data-autoplay") && !el.classList.contains("autoplay")
      );
    });
  }
}

class EffectAdaptationChecker implements AdaptationChecker {
  async hasAdapted(element: any): Promise<boolean> {
    return await element.evaluate((el: Element) => {
      const style = window.getComputedStyle(el);
      return style.transform === "none" && style.filter === "none";
    });
  }
}

class TransitionAdaptationChecker implements AdaptationChecker {
  async hasAdapted(element: any): Promise<boolean> {
    return await element.evaluate((el: Element) => {
      const style = window.getComputedStyle(el);
      return (
        style.transitionDuration === "0s" || style.transitionProperty === "none"
      );
    });
  }
}

export class AdaptationCheckerRegistry {
  private checkers = new Map<string, AdaptationChecker>();

  constructor() {
    this.register("disabled/minimal", new AnimationAdaptationChecker());
    this.register("no auto-advance", new AutoAdvanceAdaptationChecker());
    this.register("disabled", new EffectAdaptationChecker());
    this.register("simplified", new TransitionAdaptationChecker());
  }

  register(behavior: string, checker: AdaptationChecker): void {
    this.checkers.set(behavior.toLowerCase(), checker);
  }

  getChecker(behavior: string): AdaptationChecker | undefined {
    return this.checkers.get(behavior.toLowerCase());
  }
}