export interface ResourceInfo {
  url: string;
  type: string;
  size: number;
  transferSize: number;
  protocol: string;
  status: number;
  cacheControl?: string;
}
