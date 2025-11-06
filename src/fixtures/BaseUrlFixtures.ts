import { test as base } from '@playwright/test';
import { ApiBase } from '../pages/base/APIBase';
import { BasePage } from '../pages/base/BasePage';

export type BaseUrlFixtures = { 
  basePage: BasePage; 
  apiBase: ApiBase; 
};

export const test = base.extend<BaseUrlFixtures>({
  
  basePage: [async ({ page, baseURL }, use) => {
    if (!baseURL) {
        throw new Error("BaseURL is missing. Check your playwright.config.ts 'use' section.");
    }
    const basePage = new BasePage(page);
    await use(basePage);
  }, { scope: 'test' }],

  apiBase: [async ({ request }, use) => {
    const apiBase = new ApiBase(request);
    await use(apiBase);
  }, { scope: 'test' }],
});

export { expect } from '@playwright/test';