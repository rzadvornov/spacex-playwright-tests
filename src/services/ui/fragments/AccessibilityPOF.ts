import { Locator, Page } from "@playwright/test";
import { ElementAccessibilityInfo, MediaAccessibilityInfo } from "../../../utils/types/Types";

export class AccessibilityPOF {
  readonly page: Page;

  private static calculateContrastRatio(selector: string): number {
    const element = document.querySelector(selector) as HTMLElement;
    if (!element) return 0;

    const style = window.getComputedStyle(element);
    const textColor = style.color;
    const bgColor = style.backgroundColor;

    const getLuminance = (color: string): number => {
      const rgb = color.match(/\d+/g);
      if (!rgb || rgb.length < 3) return 0;

      const [r, g, b] = rgb.map(Number).map((val) => {
        val = val / 255;
        // Standard formula for sRGB to linear-light luminance
        return val <= 0.03928
          ? val / 12.92
          : Math.pow((val + 0.055) / 1.055, 2.4);
      });

      // WCAG Luminance formula
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };

    const textLuminance = getLuminance(textColor);
    const bgLuminance = getLuminance(bgColor);

    const lighter = Math.max(textLuminance, bgLuminance);
    const darker = Math.min(textLuminance, bgLuminance);

    // WCAG Contrast Ratio formula
    return (lighter + 0.05) / (darker + 0.05);
  }

  constructor(page: Page) {
    this.page = page;
  }

  public async getH1Count(): Promise<number> {
    return await this.page.locator("h1:visible").count();
  }

  public async getH1Text(): Promise<string | null> {
    const h1 = this.page.locator("h1:visible").first();
    return await h1.textContent();
  }

  public async getHeadingCounts(): Promise<Record<string, number>> {
    const headings = await this.page
      .locator(
        "h1:visible, h2:visible, h3:visible, h4:visible, h5:visible, h6:visible"
      )
      .all();
    const counts: Record<string, number> = {
      H1: 0,
      H2: 0,
      H3: 0,
      H4: 0,
      H5: 0,
      H6: 0,
    };

    for (const heading of headings) {
      const tagName = await heading.evaluate((el: Element) => el.tagName);
      counts[tagName] = (counts[tagName] || 0) + 1;
    }

    return counts;
  }

  public async checkHeadingHierarchy(): Promise<boolean> {
    const headings = await this.page
      .locator(
        "h1:visible, h2:visible, h3:visible, h4:visible, h5:visible, h6:visible"
      )
      .all();
    let currentLevel = 0;
    let hasH1 = false;

    for (const heading of headings) {
      const { level, isH1 } = await this.getHeadingLevel(heading);

      if (isH1) hasH1 = true;

      if (currentLevel > 0 && level > currentLevel + 1) {
        return false;
      }
      currentLevel = level;
    }

    return hasH1;
  }

  private async getHeadingLevel(
    heading: Locator
  ): Promise<{ level: number; isH1: boolean }> {
    return await heading.evaluate((el: Element) => {
      const tagName = el.tagName.toLowerCase();
      const level = parseInt(tagName.replace("h", ""), 10);
      return { level, isH1: level === 1 };
    });
  }

  public async hasSectionHeadings(minCount: number = 3): Promise<boolean> {
    const h2Count = await this.page.locator("h2:visible").count();
    const h3Count = await this.page.locator("h3:visible").count();
    return h2Count + h3Count >= minCount;
  }

  public async getLandmarkCount(
    tag: "header" | "main" | "nav" | "footer",
    role?: string
  ): Promise<number> {
    const selector = role ? `${tag}[role="${role}"]` : tag;
    return await this.page.locator(selector).count();
  }

  public async checkKeyboardAccessibility(selector: string): Promise<{
    isFocusable: boolean;
    hasFocusIndicator: boolean;
    isOperable: boolean;
  }> {
    const elements = await this.page.locator(selector).all();
    const results: ElementAccessibilityInfo[] = [];

    for (const element of elements) {
      if (!(await element.isVisible())) continue;

      const [isFocusable, hasFocusIndicator, isOperable] = await Promise.all([
        this.checkElementFocusability(element),
        this.checkFocusIndicator(element),
        this.checkElementOperability(element),
      ]);

      results.push({ isFocusable, hasFocusIndicator, isOperable });
    }

    if (results.length === 0) {
      return { isFocusable: true, hasFocusIndicator: true, isOperable: true };
    }

    return {
      isFocusable: results.every((r) => r.isFocusable),
      hasFocusIndicator: results.every((r) => r.hasFocusIndicator),
      isOperable: results.every((r) => r.isOperable),
    };
  }

  private async checkElementFocusability(element: Locator): Promise<boolean> {
    return await element.evaluate((el: Element) => {
      const tagName = el.tagName.toLowerCase();
      const tabIndex = (el as HTMLElement).tabIndex;
      const isDisabled = (el as HTMLButtonElement | HTMLInputElement).disabled;
      const ariaDisabled = el.getAttribute("aria-disabled") === "true";

      if (isDisabled || ariaDisabled) return false;

      const nativeFocusableTags = [
        "a",
        "button",
        "input",
        "select",
        "textarea",
        "details",
      ];
      const hasValidHref =
        tagName === "a" && (el as HTMLAnchorElement).href !== "";

      return (
        nativeFocusableTags.includes(tagName) || hasValidHref || tabIndex >= 0
      );
    });
  }

  private async checkFocusIndicator(element: Locator): Promise<boolean> {
    return await element.evaluate((el: Element) => {
      const style = window.getComputedStyle(el);

      const outlineExists =
        style.outlineStyle !== "none" && parseFloat(style.outlineWidth) > 0;
      const hasBoxShadow =
        style.boxShadow !== "none" && !style.boxShadow.includes("inset");

      return outlineExists || hasBoxShadow;
    });
  }

  private async checkElementOperability(element: Locator): Promise<boolean> {
    return await element.evaluate((el: Element) => {
      const tagName = el.tagName.toLowerCase();
      const hasOnClick = el.hasAttribute("onclick");
      const hasHref = (el as HTMLAnchorElement).href !== "";
      const hasInteractiveRole = [
        "button",
        "link",
        "checkbox",
        "radio",
      ].includes(el.getAttribute("role") || "");
      const isFormElement = ["input", "select", "textarea", "button"].includes(
        tagName
      );

      return hasOnClick || hasHref || hasInteractiveRole || isFormElement;
    });
  }

  public async checkDescriptiveLinkText(): Promise<{
    nonDescriptiveLinkCount: number;
  }> {
    const links = await this.page
      .locator('a:visible, [role="button"]:visible')
      .all();

    const genericTexts = new Set([
      "click here",
      "read more",
      "learn more",
      "go",
      "view",
      "here",
      "link",
    ]);

    let nonDescriptiveLinkCount = 0;

    for (const link of links) {
      const text = (await link.textContent())?.trim().toLowerCase() || "";

      if (!text || genericTexts.has(text)) {
        nonDescriptiveLinkCount++;
      }
    }

    return { nonDescriptiveLinkCount };
  }

  public async getElementContrastRatio(selector: string): Promise<number> {
    return await this.page.evaluate(
      AccessibilityPOF.calculateContrastRatio,
      selector
    );
  }

  public async checkElementColorContrast(
    selector: string,
    minRatio: number = 4.5
  ): Promise<boolean> {
    const contrastRatio = await this.getElementContrastRatio(selector);
    return contrastRatio >= minRatio;
  }

  public async checkMultipleElementsContrast(
    selectors: string[],
    minRatio: number = 4.5
  ): Promise<{
    passed: number;
    failed: number;
    details: Record<string, boolean>;
  }> {
    const results: Record<string, boolean> = {};
    let passed = 0;
    let failed = 0;

    for (const selector of selectors) {
      const hasGoodContrast = await this.checkElementColorContrast(
        selector,
        minRatio
      );
      results[selector] = hasGoodContrast;

      if (hasGoodContrast) {
        passed++;
      } else {
        failed++;
      }
    }

    return { passed, failed, details: results };
  }

  public async checkMinimumColorContrast(
    minRatio: number = 4.5
  ): Promise<boolean> {
    const bodyContrast = await this.getElementContrastRatio("body");
    return bodyContrast >= minRatio;
  }

  public async checkImageAccessibility(): Promise<{ missingAltCount: number }> {
    const images = await this.page.locator("img:visible").all();
    let missingAltCount = 0;

    for (const img of images) {
      const alt = await img.getAttribute("alt");
      if (alt === null || alt.trim() === "") {
        missingAltCount++;
      }
    }

    return { missingAltCount };
  }

  public async checkMediaFeatures(
    mediaType: "video" | "audio"
  ): Promise<MediaAccessibilityInfo> {
    const selector = mediaType === "video" ? "video:visible" : "audio:visible";
    const mediaElements = await this.page.locator(selector).all();

    if (mediaElements.length === 0) {
      return {
        hasControls: true,
        hasCaptions: true,
        isKeyboardAccessible: true,
      };
    }

    const results = await Promise.all(
      mediaElements.map(async (media) => {
        const hasControls = await media.evaluate(
          (el: HTMLMediaElement) => el.controls
        );

        const hasCaptions = await this.checkMediaCaptions(media, mediaType);

        return { hasControls, hasCaptions };
      })
    );

    const allHaveControls = results.every((r) => r.hasControls);
    const allHaveCaptions = results.every((r) => r.hasCaptions);

    return {
      hasControls: allHaveControls,
      hasCaptions: allHaveCaptions,
      isKeyboardAccessible: true,
    };
  }

  private async checkMediaCaptions(
    media: Locator,
    mediaType: "video" | "audio"
  ): Promise<boolean> {
    if (mediaType === "video") {
      return (await media.locator('track[kind="captions"]').count()) > 0;
    }
    return true;
  }

  public async checkMotionAccessibility(): Promise<{
    noAutoAdvance: boolean;
    noParallax: boolean;
    simplifiedTransitions: boolean;
  }> {
    const [noAutoAdvance, noParallax, hasAggressiveAnimations] =
      await Promise.all([
        this.checkAutoAdvanceContent(),
        this.checkParallaxEffects(),
        this.checkAggressiveAnimations(),
      ]);

    return {
      noAutoAdvance,
      noParallax,
      simplifiedTransitions: !hasAggressiveAnimations,
    };
  }

  private static checkAutoAdvanceLogic(): boolean {
    const autoAdvanceSelectors = [
      ".carousel[data-autoplay]",
      ".slider[data-autoplay]",
      "[autoplay]",
      "[data-auto-advance]",
    ];
    return !autoAdvanceSelectors.some((selector) =>
      document.querySelector(selector)
    );
  }

  private async checkAutoAdvanceContent(): Promise<boolean> {
    return await this.page.evaluate(AccessibilityPOF.checkAutoAdvanceLogic);
  }

  private static checkParallaxLogic(): boolean {
    const parallaxSelectors = [
      ".parallax",
      "[data-parallax]",
      '[style*="parallax"]',
    ];
    return !parallaxSelectors.some((selector) =>
      document.querySelector(selector)
    );
  }

  private async checkParallaxEffects(): Promise<boolean> {
    return await this.page.evaluate(AccessibilityPOF.checkParallaxLogic);
  }

  private static checkAggressiveAnimationsLogic(): boolean {
    const elements = Array.from(document.querySelectorAll("*"));

    return elements.some((el) => {
      const style = window.getComputedStyle(el);

      const animationDuration = parseFloat(style.animationDuration) || 0;
      const transitionDuration = parseFloat(style.transitionDuration) || 0;

      return (
        (animationDuration > 0 && animationDuration < 0.3) ||
        (transitionDuration > 0 && transitionDuration < 0.3)
      );
    });
  }

  private async checkAggressiveAnimations(): Promise<boolean> {
    return await this.page.evaluate(
      AccessibilityPOF.checkAggressiveAnimationsLogic
    );
  }

  public async checkFlashingContent(): Promise<boolean> {
    const [hasFlashingClasses, hasRapidAnimations] = await Promise.all([
      this.checkFlashingCSSClasses(),
      this.checkRapidAnimations(),
    ]);

    return !hasFlashingClasses && !hasRapidAnimations;
  }

  private static checkFlashingCSSClassesLogic(): boolean {
    const flashingSelectors = [
      ".blink",
      ".flash",
      ".flicker",
      '[class*="blink"]',
      '[class*="flash"]',
    ];
    return flashingSelectors.some((selector) =>
      document.querySelector(selector)
    );
  }

  private async checkFlashingCSSClasses(): Promise<boolean> {
    return await this.page.evaluate(
      AccessibilityPOF.checkFlashingCSSClassesLogic
    );
  }

  private static checkRapidAnimationsLogic(): boolean {
    const elements = Array.from(document.querySelectorAll("*"));

    return elements.some((el) => {
      const style = window.getComputedStyle(el);
      const animationDuration = parseFloat(style.animationDuration) || 0;

      return animationDuration > 0 && animationDuration < 0.2;
    });
  }

  private async checkRapidAnimations(): Promise<boolean> {
    return await this.page.evaluate(AccessibilityPOF.checkRapidAnimationsLogic);
  }

  public async submitFormWithInvalidData(
    formSelector: string = "form"
  ): Promise<void> {
    const form = this.page.locator(formSelector).first();

    const requiredFields = await form.locator("[required]").all();
    for (const field of requiredFields) {
      await field.fill("");
    }

    const submitButton = form
      .locator('button[type="submit"], input[type="submit"]')
      .first();
    await submitButton.click();

    await this.page.waitForTimeout(800);
  }

  public async checkAccessibleFormValidation(): Promise<{
    errorMessagesPresent: boolean;
  }> {
    const errorSelectors = [
      '[role="alert"]',
      '[aria-live="assertive"]',
      ".error-message:visible",
      ".invalid:visible",
      '[aria-invalid="true"]:visible',
    ];

    const errorCount = await Promise.all(
      errorSelectors.map((selector) => this.page.locator(selector).count())
    );

    const totalErrors = errorCount.reduce((sum, count) => sum + count, 0);

    return { errorMessagesPresent: totalErrors > 0 };
  }

  public async isAriaLiveRegionUsed(): Promise<boolean> {
    const liveRegionCount = await this.page.locator("[aria-live]").count();
    return liveRegionCount > 0;
  }

  public async getHtmlLangAttribute(): Promise<string | null> {
    return await this.page.locator("html").getAttribute("lang");
  }
}
