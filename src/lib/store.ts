import { create } from 'zustand';
import type {
  AppView,
  ClaimCategorySlug,
  ChatMessage,
  SessionStatus,
  ClaimReport,
  ReportSection,
} from './types';
import { getCategory, getChapter } from './claim-data';

function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

interface AppState {
  // ── Navigation ──
  view: AppView;
  setView: (v: AppView) => void;

  // ── Claim setup ──
  categorySlug: ClaimCategorySlug | null;
  setCategory: (slug: ClaimCategorySlug) => void;

  // ── Interview state ──
  status: SessionStatus;
  setStatus: (s: SessionStatus) => void;
  messages: ChatMessage[];
  currentChapterIndex: number;

  // ── Report ──
  report: ClaimReport | null;

  // ── Persistence ──
  saveSession: () => void;
  loadSession: () => boolean;
  clearSession: () => void;

  // ── Interview actions ──
  addUserMessage: (content: string) => void;
  addAssistantMessage: (content: string) => void;
  advanceChapter: () => boolean; // returns false if last chapter
  setReport: (report: ClaimReport) => void;
  signOffReport: () => void;
  getSeedQuestion: () => string;
}

export const useAppStore = create<AppState>((set, get) => ({
  view: 'welcome',
  setView: (v) => set({ view: v }),

  categorySlug: null,
  setCategory: (slug) => {
    set({ categorySlug: slug, messages: [], currentChapterIndex: 0, status: 'active', report: null, view: 'empathy-check' });
    get().saveSession();
  },

  status: 'idle',
  setStatus: (s) => set({ status: s }),
  messages: [],
  currentChapterIndex: 0,

  report: null,

  // ── Session persistence (localStorage) ──
  saveSession: () => {
    const { categorySlug, messages, currentChapterIndex, status, report } = get();
    if (!categorySlug) return;
    const session = { categorySlug, messages, currentChapterIndex, status, report };
    localStorage.setItem('ledger-quest-session', JSON.stringify(session));
  },

  loadSession: () => {
    try {
      const raw = localStorage.getItem('ledger-quest-session');
      if (!raw) return false;
      const session = JSON.parse(raw);
      if (!session.categorySlug || !session.messages) return false;
      set({
        categorySlug: session.categorySlug,
        messages: session.messages,
        currentChapterIndex: session.currentChapterIndex || 0,
        status: session.status || 'paused',
        report: session.report || null,
        view: session.report?.signedOff ? 'complete' : 'interview',
      });
      return true;
    } catch {
      return false;
    }
  },

  clearSession: () => {
    localStorage.removeItem('ledger-quest-session');
    set({
      view: 'welcome',
      categorySlug: null,
      messages: [],
      currentChapterIndex: 0,
      status: 'idle',
      report: null,
    });
  },

  // ── Message actions ──
  addUserMessage: (content) => {
    const { currentChapterIndex, categorySlug } = get();
    const cat = getCategory(categorySlug!);
    const chapter = cat.chapters[currentChapterIndex];
    const msg: ChatMessage = {
      id: uid(),
      role: 'user',
      content,
      timestamp: Date.now(),
      chapterId: chapter?.id,
    };
    set((s) => ({ messages: [...s.messages, msg] }));
    get().saveSession();
  },

  addAssistantMessage: (content) => {
    const { currentChapterIndex, categorySlug } = get();
    const cat = getCategory(categorySlug!);
    const chapter = cat.chapters[currentChapterIndex];
    const msg: ChatMessage = {
      id: uid(),
      role: 'assistant',
      content,
      timestamp: Date.now(),
      chapterId: chapter?.id,
    };
    set((s) => ({ messages: [...s.messages, msg] }));
    get().saveSession();
  },

  advanceChapter: () => {
    const { currentChapterIndex, categorySlug } = get();
    const cat = getCategory(categorySlug!);
    const nextIndex = currentChapterIndex + 1;
    if (nextIndex >= cat.chapters.length) return false;
    set({ currentChapterIndex: nextIndex });
    get().saveSession();
    return true;
  },

  setReport: (report) => {
    set({ report });
    get().saveSession();
  },

  signOffReport: () => {
    const { report } = get();
    if (!report) return;
    set({
      report: { ...report, signedOff: true, signedOffAt: Date.now() },
      view: 'complete',
    });
    get().saveSession();
  },

  getSeedQuestion: () => {
    const { currentChapterIndex, categorySlug, messages } = get();
    const cat = getCategory(categorySlug!);
    const chapter = cat.chapters[currentChapterIndex];
    // Pick a seed question, cycling through them
    const chapterMsgCount = messages.filter(m => m.chapterId === chapter.id).length;
    return chapter.seedQuestions[chapterMsgCount % chapter.seedQuestions.length];
  },
}));