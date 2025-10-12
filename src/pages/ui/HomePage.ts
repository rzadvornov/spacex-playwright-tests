import { Page } from "@playwright/test";
import { BasePage } from "../base/BasePage";
import { FooterPOF } from "../fragments/FooterPOF";
import { HeaderPOF } from "../fragments/HeaderPOF";
import { HeroPOF } from "../fragments/HeroPOF";

export class HomePage extends BasePage {
  readonly header: HeaderPOF;
  readonly hero: HeroPOF;
  readonly footer: FooterPOF;

  public readonly page: Page;

  constructor(page: Page) {
    super(page);
    this.page = page;

    this.header = new HeaderPOF(page);
    this.hero = new HeroPOF(page);
    this.footer = new FooterPOF(page);
  }

  async open(urlPath: string = "/") {
    this.setupErrorListeners();
    await this.goto(this.baseURL + urlPath, { waitUntil: "domcontentloaded" });
  }
}
