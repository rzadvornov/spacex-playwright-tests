export interface AccessibilityCompliance {
  textScaling: string;
  touchTargets: number;
  zoomSupport: string;
  contrast: string;
  [key: string]: string | number;
}
