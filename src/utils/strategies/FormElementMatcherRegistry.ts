import { FormElementMatcher } from "../types/Types";

class TextInputMatcher implements FormElementMatcher {
  matches(tagName: string, inputType: string | null): boolean {
    return (
      tagName === "input" &&
      (!inputType || ["text", "email", "tel"].includes(inputType))
    );
  }
}

class SelectMatcher implements FormElementMatcher {
  matches(tagName: string, _inputType: string | null): boolean {
    return tagName === "select";
  }
}

class CheckboxMatcher implements FormElementMatcher {
  matches(tagName: string, inputType: string | null): boolean {
    return tagName === "input" && inputType === "checkbox";
  }
}

class RadioMatcher implements FormElementMatcher {
  matches(tagName: string, inputType: string | null): boolean {
    return tagName === "input" && inputType === "radio";
  }
}

export class FormElementMatcherRegistry {
  private matchers = new Map<string, FormElementMatcher>();

  constructor() {
    this.register("text input", new TextInputMatcher());
    this.register("select", new SelectMatcher());
    this.register("checkbox", new CheckboxMatcher());
    this.register("radio", new RadioMatcher());
  }

  register(type: string, matcher: FormElementMatcher): void {
    this.matchers.set(type.toLowerCase(), matcher);
  }

  getMatcher(type: string): FormElementMatcher | undefined {
    return this.matchers.get(type.toLowerCase());
  }
}