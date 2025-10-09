import { Locator, Page } from "@playwright/test";

export abstract class BasePage {
  readonly page: Page;
  readonly baseURL: string;

  constructor(page: Page) {
    this.page = page;
    this.baseURL = this.getBaseURL();
  }

  async goto(url: string = this.baseURL, options?: { waitUntil?: 'domcontentloaded' | 'load' | 'networkidle' }) {
    await this.page.goto(url, options);
  }

  async waitForLoadState(state: 'domcontentloaded' | 'load' | 'networkidle' = 'domcontentloaded') {
    await this.page.waitForLoadState(state);
  }

  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }

  async getBodyText(): Promise<string> {
    return await this.page.locator('body').textContent() || '';
  }

  async checkImagesLoaded(): Promise<boolean> {
    await this.page.waitForLoadState('domcontentloaded');
    const images = this.page.locator('img[src]');
    const imageCount = await images.count();
    
    if (imageCount === 0) return true;
    
    const firstImage = images.first();
    const naturalWidth = await firstImage.evaluate((img: HTMLImageElement) => img.naturalWidth);
    return naturalWidth > 0;
  }

  async checkInteractiveElements(): Promise<boolean> {
    const buttons = this.page.locator('button, a[href]');
    const buttonCount = await buttons.count();
    
    if (buttonCount === 0) return false;
    
    const firstButton = buttons.first();
    return await firstButton.isEnabled();
  }

  async getPerformanceMetrics(): Promise<{ lcp?: number; fid?: number; cls?: number }> {
    return await this.page.evaluate(() => {
      return new Promise((resolve) => {
        const metrics: { lcp?: number; fid?: number; cls?: number } = {};
        
        // LCP measurement
        const lcpObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          const lastEntry = entries[entries.length - 1];
          metrics.lcp = lastEntry.startTime;
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        
        // FID measurement
        const fidObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          if (entries.length > 0) {
            const firstInput = entries[0] as PerformanceEventTiming;
            metrics.fid = firstInput.processingStart - firstInput.startTime;
          }
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
        
        // CLS measurement
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value;
            }
          }
          metrics.cls = clsValue;
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
        
        // Wait for metrics to be captured
        setTimeout(() => {
          lcpObserver.disconnect();
          fidObserver.disconnect();
          clsObserver.disconnect();
          resolve(metrics);
        }, 5000);
      });
    });
  }

  async captureNetworkRequests(): Promise<{ url: string; status: number }[]> {
    const requests: { url: string; status: number }[] = [];
    
    this.page.on('response', (response) => {
      requests.push({
        url: response.url(),
        status: response.status(),
      });
    });
    
    return requests;
  }

  async checkAccessibility(): Promise<boolean> {
    const hasTitle = (await this.page.title()).length > 0;
    const hasLang = await this.page.locator('html[lang]').count() > 0;
    const hasMainLandmark = await this.page.locator('main, [role="main"]').count() > 0;
    
    return hasTitle && hasLang && hasMainLandmark;
  }

  async waitForElement(selector: string, timeout: number = 10000): Promise<Locator> {
    const element = this.page.locator(selector);
    await element.waitFor({ state: 'visible', timeout });
    return element;
  }

  async scrollToBottom(): Promise<void> {
    await this.page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    await this.page.waitForTimeout(500);
  }

  async takeScreenshot(name: string): Promise<Buffer> {
    return await this.page.screenshot({ 
      path: `screenshots/${name}.png`,
      fullPage: true 
    });
  }

  private getBaseURL(): string {
    const contextOptions = (this.page.context() as any)._options;
    return contextOptions?.baseURL || 'https://www.spacex.com';
  }
} 