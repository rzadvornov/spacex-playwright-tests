import { BasePage } from "../base/BasePage";
import { Page, Locator } from "@playwright/test";
import { FooterPOF } from "../ui/fragments/FooterPOF";
import { HeaderPOF } from "../ui/fragments/HeaderPOF";

export abstract class SpaceXPage extends BasePage {
  readonly header: HeaderPOF;
  readonly footer: FooterPOF;
  readonly appRoot: Locator;

  constructor(page: Page) {
    super(page);

    this.header = new HeaderPOF(page);
    this.footer = new FooterPOF(page);
    this.appRoot = page.locator("app-root").first();
  }

  async clickLogo(): Promise<void> {
    await this.header.clickLogo();
  }

  async waitForAppContentLoad(): Promise<void> {
    await this.waitForElement("app-root");
  }

  async verifyPageTitle(expectedTitle: string): Promise<boolean> {
    const actualTitle = await this.getPageTitle();
    return actualTitle.includes(expectedTitle);
  }
}
