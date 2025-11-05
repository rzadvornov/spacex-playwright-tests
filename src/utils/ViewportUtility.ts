import { Page } from "@playwright/test";
import { BoundingBox } from "./types/Types";

type ViewportCheckCallback = (size: BoundingBox) => Promise<void>;

export class ViewportUtility {
  private readonly VIEWPORT_SIZES: BoundingBox[] = [
    { x: 0, y: 0, width: 375, height: 667 }, // Mobile
    { x: 0, y: 0, width: 768, height: 1024 }, // Tablet
    { x: 0, y: 0, width: 1920, height: 1080 }, // Desktop
  ];

  constructor(private page: Page) {}

  async checkAllViewports(callback: ViewportCheckCallback): Promise<void> {
    const originalViewport = this.page.viewportSize();

    try {
      for (const size of this.VIEWPORT_SIZES) {
        await this.page.setViewportSize({
          width: size.width,
          height: size.height,
        });
        await this.page.waitForTimeout(100);

        await callback(size);
      }
    } finally {
      if (originalViewport) {
        await this.page.setViewportSize(originalViewport);
      }
    }
  }

 getViewportNameFromSize(viewportSize: {
    width: number;
    height: number;
  }): string {
     const matchedSize = this.VIEWPORT_SIZES.find(
      (size: any) =>
        size.width === viewportSize.width && size.height === viewportSize.height
    );

    if (matchedSize) {
      if (viewportSize.width === 375) return "mobile";
      if (viewportSize.width === 768) return "tablet";
      if (viewportSize.width === 1920) return "desktop";
    }

    return `${viewportSize.width}x${viewportSize.height}`;
 }
  
}
