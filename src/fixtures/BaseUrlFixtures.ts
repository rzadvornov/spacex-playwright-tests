import { test as base } from "@playwright/test";
import { APIBase } from "../services/base/APIBase";
import { BasePage } from "../services/base/BasePage";

export type BaseUrlFixtures = {
  basePage: BasePage;
  apiBase: APIBase;
};

export const test = base.extend<BaseUrlFixtures>({
  basePage: [
    async ({ page, baseURL }, use) => {
      if (!baseURL) {
        throw new Error(
          "BaseURL is missing. Check your playwright.config.ts 'use' section."
        );
      }
      const basePage = new BasePage(page);
      await use(basePage);
    },
    { scope: "test" },
  ],

  apiBase: [
    async ({ request }, use) => {
      const apiBase = new APIBase(request);
      await use(apiBase);
    },
    { scope: "test" },
  ],
});

export { expect } from "@playwright/test";
