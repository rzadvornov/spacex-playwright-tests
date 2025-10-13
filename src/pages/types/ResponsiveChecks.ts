export interface ResponsiveChecks {
  hasHorizontalScroll: boolean;
  textZoomRequired: boolean;
  isContentSingleColumn: boolean;
  touchTargetsSized: boolean;
  [key: string]: boolean; 
}
