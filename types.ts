export interface Metric {
  category: string;
  score: number;
  fullMark: number;
}

export interface TechnicalFeedback {
  strengths: string[];
  improvements: string[];
  tips: string[];
}

export interface ArtAnalysis {
  technicalScores: Metric[];
  detectedPatterns: string[];
  feedback: TechnicalFeedback;
  colorPalette: string[];
  catCommentary: string; // The "voice" of the cat assistant
}

export enum AnalysisStatus {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR',
}