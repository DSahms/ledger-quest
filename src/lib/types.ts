// ─── Core Types for Ledger Quest ─────────────────────────────────────────

export type ClaimCategorySlug =
  | 'homeowners'
  | 'auto'
  | 'health'
  | 'workers-comp'
  | 'disability'
  | 'life'
  | 'commercial';

export interface ClaimChapter {
  id: string;
  title: string;
  subtitle: string;
  seedQuestions: string[];
}

export interface ClaimCategory {
  slug: ClaimCategorySlug;
  name: string;
  description: string;
  icon: string;
  chapters: ClaimChapter[];
}

export type MessageRole = 'system' | 'assistant' | 'user';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: number;
  chapterId?: string;
}

export type AppView =
  | 'welcome'
  | 'select-category'
  | 'empathy-check'
  | 'interview'
  | 'report-review'
  | 'complete';

export type SessionStatus = 'idle' | 'active' | 'thinking' | 'paused' | 'complete';

export interface ReportSection {
  title: string;
  content: string;
}

export interface ClaimReport {
  sections: ReportSection[];
  generatedAt: number;
  signedOff: boolean;
  signedOffAt?: number;
}