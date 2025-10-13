export interface InteractionPatterns {
  inputMethod: string;
  feedback: string;
  responseTime: number;
  visualCues: boolean;
  errorHandling: string;
  [key: string]: string | number | boolean; 
}