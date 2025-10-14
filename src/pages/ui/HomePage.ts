import { Page } from "@playwright/test";
import { HeroPOF } from "../fragments/HeroPOF";
import { SpaceXPage } from "../base/SpaceXPage";

export class HomePage extends SpaceXPage {
  readonly hero: HeroPOF;

  public readonly page: Page;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.hero = new HeroPOF(page);
  }

  async open(urlPath: string = "/"): Promise<void> {
    this.setupErrorListeners();
    await this.goto(this.baseURL + urlPath, { waitUntil: "domcontentloaded" });
    await this.waitForAppContentLoad();
  }
}
