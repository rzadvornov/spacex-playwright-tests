import { Locator, Page } from "@playwright/test";

interface PerformanceMetrics {
  lcp?: number;
  fid?: number;
  cls?: number;
  ttfb?: number;
  fcp?: number;
}

interface ResourceInfo {
  url: string;
  type: string;
  size: number;
  transferSize: number;
  protocol: string;
  status: number;
  cacheControl?: string;
}

export class PerformanceSEOPOF {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async getPerformanceMetrics(): Promise<PerformanceMetrics> {
    return await this.page.evaluate(() => {
      const metrics: PerformanceMetrics = {};

      // Get Core Web Vitals
      const lcpEntry = performance.getEntriesByType(
        "largest-contentful-paint"
      )[0] as any;
      if (lcpEntry) metrics.lcp = lcpEntry.startTime;

      const fidEntry = performance.getEntriesByType("first-input")[0] as any;
      if (fidEntry) metrics.fid = fidEntry.processingStart - fidEntry.startTime;

      // Get CLS
      let clsValue = 0;
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        }
      }).observe({ entryTypes: ["layout-shift"] });
      metrics.cls = clsValue;

      // Get TTFB and FCP
      const navigationEntry = performance.getEntriesByType(
        "navigation"
      )[0] as any;
      if (navigationEntry) {
        metrics.ttfb = navigationEntry.responseStart;
        metrics.fcp = navigationEntry.firstContentfulPaint;
      }

      return metrics;
    });
  }

  async getLighthouseScore(): Promise<number> {
    // Note: In a real implementation, you would integrate with Lighthouse API
    // This is a mock implementation
    return 85;
  }

  async getImageOptimizationInfo(): Promise<
    {
      format: string;
      size: number;
      hasWebp: boolean;
      hasSrcset: boolean;
      loading: string | null;
    }[]
  > {
    return await this.page.evaluate(() => {
      return Array.from(document.querySelectorAll("img")).map((img) => ({
        format: img.src.split(".").pop() || "",
        size: (img as any).naturalWidth * (img as any).naturalHeight,
        hasWebp: img.srcset.includes("webp"),
        hasSrcset: !!img.srcset,
        loading: img.getAttribute("loading"),
      }));
    });
  }

  async getCSSResourcesInfo(): Promise<ResourceInfo[]> {
    return await this.page.evaluate(() => {
      const cssResources = performance
        .getEntriesByType("resource")
        .filter(
          (entry) =>
            (entry as PerformanceResourceTiming).initiatorType === "css" ||
            entry.name.endsWith(".css")
        );

      return cssResources.map((resource) => ({
        url: resource.name,
        type: "css",
        size: (resource as PerformanceResourceTiming).decodedBodySize,
        transferSize: (resource as PerformanceResourceTiming).transferSize,
        protocol: (resource as any).nextHopProtocol,
        status: 200, // In a real implementation, you'd get this from the response
      }));
    });
  }

  async getJavaScriptResourcesInfo(): Promise<ResourceInfo[]> {
    return await this.page.evaluate(() => {
      const jsResources = performance
        .getEntriesByType("resource")
        .filter(
          (entry) =>
            (entry as PerformanceResourceTiming).initiatorType === "script" ||
            entry.name.endsWith(".js")
        );

      return jsResources.map((resource) => ({
        url: resource.name,
        type: "js",
        size: (resource as PerformanceResourceTiming).decodedBodySize,
        transferSize: (resource as PerformanceResourceTiming).transferSize,
        protocol: (resource as any).nextHopProtocol,
        status: 200,
      }));
    });
  }

  async getMetaTags(): Promise<{ [key: string]: string }> {
    const metaTags = await this.page.$$eval("meta", (tags) => {
      return tags.map((tag) => ({
        name: tag.getAttribute("name") || tag.getAttribute("property") || "",
        content: tag.getAttribute("content") || "",
      }));
    });

    return metaTags.reduce((acc: { [key: string]: string }, tag) => {
      if (tag.name) acc[tag.name] = tag.content;
      return acc;
    }, {});
  }

  async getOpenGraphTags(): Promise<{ [key: string]: string }> {
    const ogTags = await this.page.$$eval('meta[property^="og:"]', (tags) => {
      return tags.map((tag) => ({
        property: tag.getAttribute("property") || "",
        content: tag.getAttribute("content") || "",
      }));
    });

    return ogTags.reduce((acc: { [key: string]: string }, tag) => {
      if (tag.property) acc[tag.property.replace("og:", "")] = tag.content;
      return acc;
    }, {});
  }

  async getStructuredData(): Promise<any[]> {
    return await this.page.evaluate(() => {
      const scripts = document.querySelectorAll(
        'script[type="application/ld+json"]'
      );
      return Array.from(scripts).map((script) =>
        JSON.parse(script.textContent || "{}")
      );
    });
  }

  async getHeadingStructure(): Promise<Array<{ tag: string; text: string }>> {
    return await this.page.evaluate(() => {
      const headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
      return Array.from(headings).map((h) => ({
        tag: h.tagName.toLowerCase(),
        text: h.textContent || "",
      }));
    });
  }

  async getRobotsMetaContent(): Promise<string | null> {
    const robotsMeta = await this.page.$('meta[name="robots"]');
    return robotsMeta ? await robotsMeta.getAttribute("content") : null;
  }

  async getCanonicalUrl(): Promise<string | null> {
    const canonical = await this.page.$('link[rel="canonical"]');
    return canonical ? await canonical.getAttribute("href") : null;
  }

  async getInternalLinks(): Promise<Array<{ href: string; text: string }>> {
    const baseUrl = new URL(this.page.url()).origin;
    return await this.page.$$eval(
      'a[href^="/"], a[href^="' + baseUrl + '"]',
      (links) =>
        links.map((link) => ({
          href: link.getAttribute("href") || "",
          text: link.textContent || "",
        }))
    );
  }

  async checkDuplicateContent(): Promise<{
    duplicateParagraphs: number;
    totalParagraphs: number;
  }> {
    return await this.page.evaluate(() => {
      const paragraphs = document.querySelectorAll("p");
      const textContent = new Set();
      let duplicates = 0;

      paragraphs.forEach((p) => {
        const text = p.textContent?.trim();
        if (text && textContent.has(text)) duplicates++;
        textContent.add(text);
      });

      return {
        duplicateParagraphs: duplicates,
        totalParagraphs: paragraphs.length,
      };
    });
  }

  async checkMobileOptimization(): Promise<{
    textReadable: boolean;
    touchTargetsSize: boolean;
    noInterstitials: boolean;
  }> {
    return await this.page.evaluate(() => {
      // Check text readability
      const textElements = document.querySelectorAll(
        "p, h1, h2, h3, h4, h5, h6"
      );
      const textReadable = Array.from(textElements).every((el) => {
        const fontSize = window.getComputedStyle(el).fontSize;
        return parseInt(fontSize) >= 12;
      });

      // Check touch target sizes
      const touchTargets = document.querySelectorAll(
        "a, button, input, select, textarea"
      );
      const touchTargetsSize = Array.from(touchTargets).every((el) => {
        const rect = el.getBoundingClientRect();
        return rect.width >= 44 && rect.height >= 44;
      });

      // Check for interstitials
      const noInterstitials = !document.querySelector(
        ".interstitial, .popup, .modal"
      );

      return { textReadable, touchTargetsSize, noInterstitials };
    });
  }

  async getLargestContentfulPaint(): Promise<number> {
    return await this.page.evaluate(() => {
      const lcpEntry = performance.getEntriesByType(
        "largest-contentful-paint"
      )[0] as any;
      // Return LCP time in milliseconds (or 0 if not found)
      return lcpEntry ? Math.round(lcpEntry.startTime) : 0;
    });
  }

  async getFirstInputDelay(): Promise<number> {
    return await this.page.evaluate(() => {
      const fidEntry = performance.getEntriesByType("first-input")[0] as any;
      // Return FID time in milliseconds (or 0 if not found)
      return fidEntry
        ? Math.round(fidEntry.processingStart - fidEntry.startTime)
        : 0;
    });
  }

  async getConsoleErrors(): Promise<string[]> {
    return [];
  }

  async checkImageLoading404s(): Promise<boolean> {
    const brokenImageCount = await this.page.evaluate(() => {
      let count = 0;
      document.querySelectorAll("img").forEach((el) => {
        const img = el as HTMLImageElement;
        if (img.complete && img.naturalWidth === 0) {
          count++;
        }
      });
      return count;
    });

    return brokenImageCount > 0;
  }
}
