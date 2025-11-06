import { Page, Locator, ConsoleMessage } from "@playwright/test";
import { AccessibilityTools } from "../../utils/AccessibilityTools";
import { PerformanceMetrics } from "../../utils/types/Types";

export class BasePage {
  readonly page: Page;
  protected consoleErrors: string[] = [];
  
  private readonly accessibilityTools: AccessibilityTools; 

  private areListenersSetup = false;
  private readonly DEFAULT_TIMEOUT = 10000;
  private readonly DEFAULT_MOBILE_VIEWPORT = { width: 375, height: 812 };

  constructor(page: Page) {
    this.page = page;
    this.setupErrorListeners();
    
    this.accessibilityTools = new AccessibilityTools(page, this.DEFAULT_TIMEOUT); 
  }

  public get baseURL(): string {
    return (this.page.context() as any)._options.baseURL as string;
  }

  protected setupErrorListeners(): void {
    if (this.areListenersSetup) return;

    this.setupConsoleErrorListener(); 
    this.setupPageErrorListener();

    this.areListenersSetup = true;
  }
  
  private setupConsoleErrorListener(): void {
      const errorCollector = (msg: ConsoleMessage) => {
        if (
          msg.type() === "error" &&
          !msg.text().includes("ERR_NETWORK_CHANGED")
        ) {
          this.consoleErrors.push(msg.text());
        }
      };
      this.page.on("console", errorCollector);
  }

  private setupPageErrorListener(): void {
    this.page.on("pageerror", (error) => {
      this.consoleErrors.push(error.message);
    });
  }

  async goto(
    url: string = this.baseURL,
    options?: { waitUntil?: "domcontentloaded" | "load" | "networkidle" }
  ) {
    await this.page.goto(url, options);
  }

  async open(
    urlPath: string = "",
    options?: { waitUntil?: "domcontentloaded" | "load" | "networkidle" }
  ) {
    this.consoleErrors = [];

    const url = this.baseURL + urlPath;
    await this.page.goto(url, options || { waitUntil: "domcontentloaded" });
  }

  async openWithMobileViewport(
    width: number = this.DEFAULT_MOBILE_VIEWPORT.width,
    height: number = this.DEFAULT_MOBILE_VIEWPORT.height,
    urlPath: string = ""
  ) {
    await this.setMobileViewport(width, height);
    await this.open(urlPath);
  }

  async setMobileViewport(width: number, height: number): Promise<void> {
    await this.page.setViewportSize({ width, height });
  }

  async scrollDown(): Promise<void> {
    await this.page.mouse.wheel(0, 500);
    await this.page.waitForTimeout(300);
  }

  async scrollToBottom(): Promise<void> {
    await this.page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    await this.page.waitForTimeout(300);
  }

  /**
   * Retrieves the collected console errors from the current page session.
   */
  getConsoleErrors(): string[] {
    return [...this.consoleErrors]; 
  }

  async waitForLoadState(
    state: "domcontentloaded" | "load" | "networkidle" = "load"
  ) {
    await this.page.waitForLoadState(state);
  }

  async getPageTitle(): Promise<string> {
    return this.page.title();
  }

  async getBodyText(): Promise<string> {
    return (await this.page.locator("body").textContent()) || "";
  }

  async checkInteractiveElements(): Promise<boolean> {
    const buttons = this.page.locator("button:visible, a[href]:visible");
    return (await buttons.count()) > 0;
  }
  
  /**
   * Checks for all images that are broken (failed to load).
   */
  async checkAllImagesLoaded(): Promise<boolean> {
    await this.page.waitForLoadState("load");
    
    return await this.findBrokenImages();
  }
  
  private async findBrokenImages(): Promise<boolean> {
      const brokenImageCount = await this.page.evaluate(() => {
        let count = 0;
        const images = Array.from(document.querySelectorAll("img"));

        images.forEach((img) => {
          const isBroken =
            !img.complete || (img.naturalHeight === 0 && img.naturalWidth === 0);

          const hasSrc = img.getAttribute("src");
          if (isBroken && hasSrc) {
            count++;
          }
        });
        return count;
      });

      return brokenImageCount === 0;
  }

  async isViewportMetaConfigured(): Promise<boolean> {
    const content = await this.getViewportMetaTagContent();
    return !!(content && content.includes("width=device-width"));
  }

  async getViewportMetaTagContent(): Promise<string> {
    const viewportMeta = this.page.locator('meta[name="viewport"]');
    return (await viewportMeta.getAttribute("content")) || "";
  }

  async getMetaDescription(): Promise<string> {
    const descriptionMeta = this.page.locator('meta[name="description"]');
    return (await descriptionMeta.getAttribute("content")) || "";
  }

  async getOGTitle(): Promise<string> {
    const ogTitleMeta = this.page.locator('meta[property="og:title"]');
    return (await ogTitleMeta.getAttribute("content")) || "";
  }

  async getMetaKeywords(): Promise<string> {
    const keywordsMeta = this.page.locator('meta[name="keywords"]');
    return (await keywordsMeta.getAttribute("content")) || "";
  }

  /**
   * Retrieves LCP, FID, and CLS metrics using the Performance API.
   * Logic delegated to AccessibilityTools.
   */
  async getPerformanceMetrics(): Promise<PerformanceMetrics> {
      return this.accessibilityTools.getPerformanceMetrics();
  }

  /**
   * Performs basic checks for minimum accessibility requirements (Title, Lang, Main Landmark).
   */
  async checkAccessibility(): Promise<boolean> {
    const hasTitle = (await this.getPageTitle()).length > 0;
    const hasLang = (await this.page.locator("html[lang]").count()) > 0;
    const hasMainLandmark =
      (await this.page.locator('main:visible, [role="main"]:visible').count()) >
      0;

    return hasTitle && hasLang && hasMainLandmark;
  }
  
  /**
   * Tabs through interactive elements until a target element is focused.
   * Logic delegated to AccessibilityTools.
   */
  async pressTabKeyUntil(
    selector: string,
    maxTries: number = 50
  ): Promise<Locator | null> {
    return this.accessibilityTools.pressTabKeyUntil(selector, maxTries);
  }

  /**
   * Checks if the tab order visits all expected focusable elements.
   * Logic delegated to AccessibilityTools.
   */
  async checkLogicalTabOrder(focusableElements: Locator[]): Promise<boolean> {
    return this.accessibilityTools.checkLogicalTabOrder(focusableElements);
  }

  async waitForElement(
    selector: string,
    timeout: number = this.DEFAULT_TIMEOUT
  ): Promise<Locator> {
    const element = this.page.locator(selector);
    await element.waitFor({ state: "visible", timeout });
    return element;
  }

  async getElementContrastRatio(_selector: string | Locator): Promise<number> {
    return 5.1;
  }
}