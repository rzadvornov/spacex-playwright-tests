import { Locator, Page } from "@playwright/test";
import { BoundingBox } from "./BoundingBox";

export type SharedContext = {
  startTime: number;
  apiData: any;
  performanceMetrics?: any;
  newTabPromise?: Promise<Page>;
  mediaType?: string;
  newPage?: Page;
  currentFocusedElement?: Locator | null;
  initialViewport?: Partial<BoundingBox>;
};
