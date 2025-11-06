import { Page } from "@playwright/test";
import { PerformanceMetrics, ImageInfo, ResourceInfo, HeadingInfo, LinkInfo, DuplicateContentResult, MobileOptimizationResult, AccessibilityResult } from "../../utils/types/Types";

export class PerformanceSEOPOF {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  private async evaluateInPage<T>(fn: () => T): Promise<T> {
    return await this.page.evaluate(fn);
  }

  async getPerformanceMetrics(): Promise<PerformanceMetrics> {
    return await this.evaluateInPage(() => {
      const metrics: PerformanceMetrics = {};

      const lcpEntry = performance
        .getEntriesByType("largest-contentful-paint")
        .find((entry) => entry.name === "largest-contentful-paint") as
        | (PerformanceEntry & { startTime: number })
        | undefined;
      if (lcpEntry) {
        metrics.lcp = Math.round(lcpEntry.startTime);
      }

      const fidEntry = performance.getEntriesByType(
        "first-input"
      )[0] as PerformanceEventTiming | undefined;
      if (fidEntry) {
        metrics.fid = Math.round(fidEntry.processingStart - fidEntry.startTime);
      }

      const layoutShiftEntries = performance.getEntriesByType(
        "layout-shift"
      ) as any[];

      metrics.cls = layoutShiftEntries
        .filter((entry) => !entry.hadRecentInput)
        .reduce((sum, entry) => sum + entry.value, 0);

      const navigationEntry = performance.getEntriesByType(
        "navigation"
      )[0] as PerformanceNavigationTiming | undefined;
      if (navigationEntry?.responseStart) {
        metrics.ttfb = Math.round(navigationEntry.responseStart);
      }

      const fcpEntry = performance
        .getEntriesByType("paint")
        .find(
          (entry: PerformanceEntry) => entry.name === "first-contentful-paint"
        ) as (PerformanceEntry & { startTime: number }) | undefined;
      if (fcpEntry) {
        metrics.fcp = Math.round(fcpEntry.startTime);
      }

      return metrics;
    });
  }

  async getLighthouseScore(): Promise<number> {
    const metrics = await this.getPerformanceMetrics();

    let score = 100;
    if ((metrics.lcp ?? 0) > 2500) score -= 30;
    if ((metrics.fid ?? 0) > 100) score -= 20;
    if ((metrics.cls ?? 0) > 0.1) score -= 20;
    if ((metrics.fcp ?? 0) > 2000) score -= 15;

    return Math.max(0, score);
  }

  async getImageOptimizationInfo(): Promise<ImageInfo[]> {
    return await this.evaluateInPage(() => {
      return Array.from(document.querySelectorAll("img")).map(
        (img): ImageInfo => {
          const src = img.getAttribute("src") || "";
          const format = src.split(".").pop()?.toLowerCase() || "unknown";
          const naturalWidth = (img as HTMLImageElement).naturalWidth;
          const naturalHeight = (img as HTMLImageElement).naturalHeight;

          return {
            format,
            size: naturalWidth * naturalHeight,
            hasWebp: img.srcset?.toLowerCase().includes("webp") || false,
            hasSrcset: !!img.srcset && img.srcset.length > 0,
            loading: img.getAttribute("loading"),
          };
        }
      );
    });
  }

  async getCSSResourcesInfo(): Promise<ResourceInfo[]> {
    return await this.evaluateInPage(() => {
      const resources = performance.getEntriesByType(
        "resource"
      ) as PerformanceResourceTiming[];

      return resources
        .filter(
          (r) => r.initiatorType === "css" || r.name.endsWith(".css")
        )
        .map(
          (resource): ResourceInfo => ({
            url: resource.name,
            type: "css",
            size: resource.decodedBodySize || 0,
            transferSize: resource.transferSize || 0,
            protocol: resource.nextHopProtocol,
            status: 200,
          })
        );
    });
  }

  async getJavaScriptResourcesInfo(): Promise<ResourceInfo[]> {
    return await this.evaluateInPage(() => {
      const resources = performance.getEntriesByType(
        "resource"
      ) as PerformanceResourceTiming[];

      return resources
        .filter(
          (r) => r.initiatorType === "script" || r.name.endsWith(".js")
        )
        .map(
          (resource): ResourceInfo => ({
            url: resource.name,
            type: "js",
            size: resource.decodedBodySize || 0,
            transferSize: resource.transferSize || 0,
            protocol: resource.nextHopProtocol,
            status: 200,
          })
        );
    });
  }

  async getMetaTags(): Promise<{ [key: string]: string }> {
    return await this.evaluateInPage(() => {
      const metaTags = Array.from(document.querySelectorAll("meta"));
      return metaTags.reduce((acc: { [key: string]: string }, tag) => {
        const name =
          tag.getAttribute("name") || tag.getAttribute("property") || "";
        const content = tag.getAttribute("content") || "";

        if (name && content && !name.startsWith("og:")) {
          acc[name] = content;
        }

        return acc;
      }, {});
    });
  }

  async getOpenGraphTags(): Promise<{ [key: string]: string }> {
    return await this.evaluateInPage(() => {
      const ogTags = Array.from(
        document.querySelectorAll('meta[property^="og:"]')
      );
      return ogTags.reduce((acc: { [key: string]: string }, tag) => {
        const property = tag.getAttribute("property") || "";
        const content = tag.getAttribute("content") || "";

        if (property && content) {
          const key = property.replace("og:", "");
          acc[key] = content;
        }

        return acc;
      }, {});
    });
  }

  async getStructuredData(): Promise<any[]> {
    return await this.evaluateInPage(() => {
      const scripts = document.querySelectorAll(
        'script[type="application/ld+json"]'
      );
      return Array.from(scripts)
        .map((script) => {
          try {
            return JSON.parse(script.textContent?.trim() || "{}");
          } catch {
            return {};
          }
        })
        .filter((data) => Object.keys(data).length > 0);
    });
  }

  async getHeadingStructure(): Promise<HeadingInfo[]> {
    return await this.evaluateInPage(() => {
      const headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
      return Array.from(headings).map(
        (heading): HeadingInfo => ({
          tag: heading.tagName.toLowerCase(),
          text: heading.textContent?.trim() || "",
        })
      );
    });
  }

  async getRobotsMetaContent(): Promise<string | null> {
    return await this.evaluateInPage(() => {
      const robotsMeta = document.querySelector('meta[name="robots"]');
      return robotsMeta?.getAttribute("content") || null;
    });
  }

  async getCanonicalUrl(): Promise<string | null> {
    return await this.evaluateInPage(() => {
      const canonical = document.querySelector('link[rel="canonical"]');
      return canonical?.getAttribute("href") || null;
    });
  }

  async getInternalLinks(): Promise<LinkInfo[]> {
    return await this.evaluateInPage(() => {
      const origin = window.location.origin;
      const links = Array.from(document.querySelectorAll("a[href]"));

      return links
        .filter((link) => {
          const href = link.getAttribute("href") || "";
          if (href.startsWith("/")) return true;
          try {
            const url = new URL(href, origin);
            return url.origin === origin;
          } catch {
            return false; 
          }
        })
        .map(
          (link): LinkInfo => ({
            href: link.getAttribute("href") || "",
            text: link.textContent?.trim() || "",
          })
        );
    });
  }

  async checkDuplicateContent(): Promise<DuplicateContentResult> {
    return await this.evaluateInPage(() => {
      const paragraphs = Array.from(document.querySelectorAll("p"));
      const textContent = new Set<string>();
      let duplicates = 0;

      paragraphs.forEach((p) => {
        const text = p.textContent?.trim().replace(/\s+/g, " ");
        if (text) {
          if (textContent.has(text)) {
            duplicates++;
          } else {
            textContent.add(text);
          }
        }
      });

      return {
        duplicateParagraphs: duplicates,
        totalParagraphs: paragraphs.length,
      };
    });
  }

  async checkMobileOptimization(): Promise<MobileOptimizationResult> {
    return await this.evaluateInPage(() => {
      const textElements = Array.from(
        document.querySelectorAll("p, h1, h2, h3, h4, h5, h6, li, td")
      );
      const textReadable = textElements.every((el) => {
        const fontSize = parseInt(window.getComputedStyle(el).fontSize) || 0;
        return fontSize >= 12;
      });

      const interactiveElements = Array.from(
        document.querySelectorAll(
          "a, button, input, select, textarea, [role='button'], [role='link']"
        )
      );
      const touchTargetsSize = interactiveElements.every((el) => {
        const rect = el.getBoundingClientRect();
        // Standard minimum touch target size (48x48 is common, using 44x44 as a common test)
        return rect.width >= 44 || rect.height >= 44;
      });

      const noInterstitials = !document.querySelector(
        ".interstitial, .popup, .modal, [aria-modal='true'], [role='dialog']"
      );

      return { textReadable, touchTargetsSize, noInterstitials };
    });
  }

  async checkAccessibility(): Promise<AccessibilityResult> {
    return await this.evaluateInPage(() => {
      const images = Array.from(document.querySelectorAll("img"));
      const altTextPresent = images.every((img) => {
        const alt = img.getAttribute("alt");
        return alt !== null && alt.trim().length > 0 && alt.toLowerCase() !== "image";
      });

      const interactiveElements = Array.from(
        document.querySelectorAll(
          "button, a, input, select, textarea, [role]"
        )
      );
      const ariaLabelsUsed = interactiveElements.some((el) => {
        return (
          el.hasAttribute("aria-label") ||
          el.hasAttribute("aria-labelledby") ||
          (el.getAttribute("role") !== null && el.getAttribute("role") !== "presentation")
        );
      });

      const focusableElements = Array.from(
        document.querySelectorAll(
          'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
      );
      const keyboardNavigable = focusableElements.length > 0;

      const semanticElements = Array.from(
        document.querySelectorAll("main, nav, article, section, header, footer")
      );
      const semanticHTMLUsed = semanticElements.length > 0;

      const htmlLang = document.documentElement.getAttribute("lang");
      const languageSpecified = !!htmlLang && htmlLang.length > 0;

      return {
        altTextPresent,
        ariaLabelsUsed,
        keyboardNavigable,
        semanticHTMLUsed,
        languageSpecified,
      };
    });
  }

  async getAriaLabels(): Promise<{ element: string; label: string }[]> {
    return await this.evaluateInPage(() => {
      const elementsWithAria = Array.from(
        document.querySelectorAll("[aria-label]")
      );
      return elementsWithAria.map((el) => ({
        element: el.tagName.toLowerCase(),
        label: el.getAttribute("aria-label") || "",
      }));
    });
  }

  async getImagesWithAltText(): Promise<{ src: string; alt: string }[]> {
    return await this.evaluateInPage(() => {
      const images = Array.from(document.querySelectorAll("img"));
      return images
        .map((img) => ({
          src: img.getAttribute("src") || "",
          alt: img.getAttribute("alt") || "",
        }))
        .filter((img) => img.alt.length > 0);
    });
  }

  async checkFocusIndicators(): Promise<boolean> {
    return await this.evaluateInPage(() => {
      const focusableElements = Array.from(
        document.querySelectorAll(
          'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
      );

      return focusableElements.some((el) => {
        const style = window.getComputedStyle(el);
        return (
          !style.outline.includes("none") ||
          !style.boxShadow.includes("none")
        );
      });
    });
  }

  async getSemanticElements(): Promise<string[]> {
    return await this.evaluateInPage(() => {
      const semanticElements = Array.from(
        document.querySelectorAll(
          "main, nav, article, section, header, footer, aside, figure, figcaption, time, mark"
        )
      );
      return semanticElements.map((el) => el.tagName.toLowerCase());
    });
  }

  async getLargestContentfulPaint(): Promise<number> {
    return await this.evaluateInPage(() => {
      const lcpEntry = performance
        .getEntriesByType("largest-contentful-paint")
        .find((entry) => entry.name === "largest-contentful-paint") as
        | (PerformanceEntry & { startTime: number })
        | undefined;
      return lcpEntry ? Math.round(lcpEntry.startTime) : 0;
    });
  }

  async getFirstInputDelay(): Promise<number> {
    return await this.evaluateInPage(() => {
      const fidEntry = performance.getEntriesByType(
        "first-input"
      )[0] as PerformanceEventTiming | undefined;
      return fidEntry
        ? Math.round(fidEntry.processingStart - fidEntry.startTime)
        : 0;
    });
  }

  async getFirstContentfulPaint(): Promise<number> {
    return await this.evaluateInPage(() => {
      const fcpEntry = performance
        .getEntriesByType("paint")
        .find(
          (entry: PerformanceEntry) => entry.name === "first-contentful-paint"
        ) as (PerformanceEntry & { startTime: number }) | undefined;
      return fcpEntry ? Math.round(fcpEntry.startTime) : 0;
    });
  }

  async checkImageLoading404s(): Promise<boolean> {
    return await this.evaluateInPage(() => {
      const images = Array.from(document.querySelectorAll("img"));
      return images.some((img) => {
        const image = img as HTMLImageElement;
        return image.complete && image.naturalWidth === 0;
      });
    });
  }

  async getPageLoadTime(): Promise<number> {
    return await this.evaluateInPage(() => {
      const navigationEntry = performance.getEntriesByType(
        "navigation"
      )[0] as PerformanceNavigationTiming | undefined;
      return navigationEntry
        ? Math.round(navigationEntry.loadEventEnd - navigationEntry.fetchStart)
        : 0;
    });
  }

  async getResourceCount(): Promise<{
    css: number;
    js: number;
    images: number;
  }> {
    return await this.evaluateInPage(() => {
      const resources = performance.getEntriesByType(
        "resource"
      ) as PerformanceResourceTiming[];

      return {
        css: resources.filter(
          (r) => r.initiatorType === "css" || r.name.endsWith(".css")
        ).length,
        js: resources.filter(
          (r) => r.initiatorType === "script" || r.name.endsWith(".js")
        ).length,
        images: resources.filter((r) => r.initiatorType === "img").length,
      };
    });
  }

  async isAboveTheFoldContentLoaded(): Promise<boolean> {
    return await this.evaluateInPage(() => {
      const viewportHeight = window.innerHeight;
      const elements = document.querySelectorAll("h1, h2, img, p, main, [role='main']");

      return Array.from(elements).some((el) => {
        const rect = el.getBoundingClientRect();
        return rect.height > 0 && rect.width > 0 && rect.top >= 0 && rect.top <= viewportHeight;
      });
    });
  }
}