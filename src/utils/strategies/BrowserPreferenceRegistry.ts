import { Page } from "@playwright/test";
import { BrowserPreferenceHandler } from "../types/Types";

class ReducedMotionHandler implements BrowserPreferenceHandler {
  constructor(private page: Page) {}

  async setPreference(setting: string): Promise<void> {
    await this.page.emulateMedia({
      reducedMotion: setting === "enabled" ? "reduce" : "no-preference",
    });
  }
}

class ColorSchemeHandler implements BrowserPreferenceHandler {
  constructor(private page: Page) {}

  async setPreference(setting: string): Promise<void> {
    await this.page.emulateMedia({ colorScheme: setting as any });
  }
}

class ContrastHandler implements BrowserPreferenceHandler {
  constructor(private page: Page) {}

  async setPreference(setting: string): Promise<void> {
    await this.page.emulateMedia({
      forcedColors: setting === "enabled" ? "active" : "none",
    });
  }
}

export class BrowserPreferenceRegistry {
  private handlers = new Map<string, BrowserPreferenceHandler>();

  constructor(page: Page) {
    this.register("prefers-reduced-motion", new ReducedMotionHandler(page));
    this.register("prefers-color-scheme", new ColorSchemeHandler(page));
    this.register("prefers-contrast", new ContrastHandler(page));
  }

  register(preference: string, handler: BrowserPreferenceHandler): void {
    this.handlers.set(preference.toLowerCase(), handler);
  }

  getHandler(preference: string): BrowserPreferenceHandler | undefined {
    return this.handlers.get(preference.toLowerCase());
  }
}