import { CueValidator } from "../types/Types";

class ColorCueValidator implements CueValidator {
  async hasCue(element: any): Promise<boolean> {
    return await element.evaluate((el: Element) => {
      const style = window.getComputedStyle(el);
      return (
        style.color !== "rgb(0, 0, 0)" && style.color !== "rgba(0, 0, 0, 0)"
      );
    });
  }
}

class IconCueValidator implements CueValidator {
  async hasCue(element: any): Promise<boolean> {
    return await element.evaluate(
      (el: Element) => el.querySelector('svg, .icon, [class*="icon"]') !== null
    );
  }
}

class TextCueValidator implements CueValidator {
  async hasCue(element: any): Promise<boolean> {
    const text = await element.textContent();
    return !!(text && text.trim().length > 0);
  }
}

class UnderlineCueValidator implements CueValidator {
  async hasCue(element: any): Promise<boolean> {
    return await element.evaluate((el: Element) => {
      const style = window.getComputedStyle(el);
      return (
        style.textDecoration.includes("underline") ||
        style.borderBottomWidth !== "0px"
      );
    });
  }
}

class ShapeCueValidator implements CueValidator {
  async hasCue(element: any): Promise<boolean> {
    return await element.evaluate((el: Element) => {
      const style = window.getComputedStyle(el);
      return (
        style.borderRadius !== "0px" ||
        style.borderWidth !== "0px" ||
        el.tagName.toLowerCase() === "button"
      );
    });
  }
}

class MessageCueValidator implements CueValidator {
  async hasCue(element: any): Promise<boolean> {
    return await element.evaluate((el: Element) => {
      return (
        el.getAttribute("aria-label") ||
        el.getAttribute("title") ||
        !!el.textContent?.trim()
      );
    });
  }
}

export class CueValidatorRegistry {
  private validators = new Map<string, CueValidator>();

  constructor() {
    this.register("color", new ColorCueValidator());
    this.register("icon", new IconCueValidator());
    this.register("text", new TextCueValidator());
    this.register("underline", new UnderlineCueValidator());
    this.register("shape", new ShapeCueValidator());
    this.register("message", new MessageCueValidator());
  }

  register(cueType: string, validator: CueValidator): void {
    this.validators.set(cueType.toLowerCase(), validator);
  }

  getValidator(cueType: string): CueValidator | undefined {
    return this.validators.get(cueType.toLowerCase());
  }
}