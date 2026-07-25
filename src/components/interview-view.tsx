'use client';

import { useAppStore } from '@/lib/store';
import { getCategory } from '@/lib/claim-data';
import VoiceButton from './voice-button';
import { Button } from '@/components/ui/button';
import { BookOpen, Pause, RotateCcw, ChevronRight, SkipForward } from 'lucide-react';
import { useState, useRef, useEffect, useCallback } from 'react';

export default function InterviewView() {
  const {
    categorySlug,
    messages,
    status,
    currentChapterIndex,
    setStatus,
    addUserMessage,
    addAssistantMessage,
    advanceChapter,
    setView,
    setReport,
    saveSession,
    getSeedQuestion,
  } = useAppStore();

  const [inputText, setInputText] = useState('');
  const [streamingText, setStreamingText] = useState('');
  const [error, setError] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasInitialized = useRef(false);

  const category = getCategory(categorySlug!);
  const chapter = category.chapters[currentChapterIndex];
  const isLastChapter = currentChapterIndex >= category.chapters.length - 1;
  const progress = (currentChapterIndex / category.chapters.length) * 100;

  // Count exchanges in the current chapter (pairs of user+assistant)
  const chapterMessages = messages.filter(m => m.chapterId === chapter.id);
  const chapterExchanges = Math.floor(chapterMessages.filter(m => m.role === 'user').length);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, streamingText]);

  // ── Ask the next question (API or fallback) ──────────────────
  const askNextQuestion = useCallback(async (allMessages: typeof messages, targetChapterId: string, targetChapterIdx: number) => {
    const targetChapter = category.chapters[targetChapterIdx];
    const isEmpathy = targetChapter.id === 'safety-first' || targetChapter.id === 'our-condolences' || targetChapter.id === 'your-situation';
    const isFirstInChapter = allMessages.filter(m => m.chapterId === targetChapterId).length === 0;

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          categorySlug,
          chapterId: targetChapterId,
          messages: allMessages.map(m => ({ role: m.role, content: m.content, chapterId: m.chapterId })),
          isEmpathyCheck: isFirstInChapter && isEmpathy,
          isStreaming: true,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to connect');
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let fullText = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          fullText += chunk;
          setStreamingText(fullText);
        }
      }

      setStreamingText('');
      return fullText;
    } catch {
      // Fallback: pick a seed question, but never repeat one already asked
      const askedInChapter = allMessages
        .filter(m => m.chapterId === targetChapterId && m.role === 'assistant')
        .map(m => m.content);
      const seedQ = targetChapter.seedQuestions.find(sq => !askedInChapter.includes(sq));
      if (seedQ) return seedQ;
      // All seeds exhausted for this chapter — return a transition signal
      return 'I think I have what I need for this section. Let us move on to the next topic.';
    }
  }, [categorySlug, category.chapters]);

  // ── Initialize: first question ───────────────────────────────
  const initConversation = useCallback(async () => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    // Resuming a saved session
    if (messages.length > 0) {
      setStatus('active');
      return;
    }

    setStatus('thinking');
    const text = await askNextQuestion(messages, chapter.id, currentChapterIndex);
    addAssistantMessage(text);
    setStatus('active');
  }, []); // eslint-disable-line

  useEffect(() => {
    initConversation();
  }, []);

  // ── Send user message and get follow-up ──────────────────────
  const sendMessage = async (text: string) => {
    if (!text.trim() || status !== 'active') return;

    addUserMessage(text.trim());
    setInputText('');
    setStatus('thinking');
    setError('');

    const updatedMessages = useAppStore.getState().messages;

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          categorySlug,
          chapterId: chapter.id,
          messages: updatedMessages.map(m => ({ role: m.role, content: m.content, chapterId: m.chapterId })),
          isEmpathyCheck: false,
          isStreaming: true,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to get response');
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let fullText = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          fullText += chunk;
          setStreamingText(fullText);
        }
      }

      setStreamingText('');
      addAssistantMessage(fullText);

      // Check if LLM signaled section completion
      const isSectionComplete = fullText.toLowerCase().includes('i think i have what i need') ||
        fullText.toLowerCase().includes('i have what i need');

      if (isSectionComplete && !isLastChapter) {
        setTimeout(() => advanceToNextChapter(), 1500);
      } else if (isSectionComplete && isLastChapter) {
        setTimeout(() => generateReport(), 1500);
      }

      setStatus('active');
    } catch {
      // ── FALLBACK: no API key or API error ──
      setStreamingText('');

      // Check if we've asked all seed questions for this chapter
      const askedInChapter = updatedMessages
        .filter(m => m.chapterId === chapter.id && m.role === 'assistant')
        .map(m => m.content);
      const unusedSeed = chapter.seedQuestions.find(sq => !askedInChapter.includes(sq));

      if (unusedSeed) {
        // Still have seed questions left — ask the next one
        addAssistantMessage(unusedSeed);
      } else if (!isLastChapter) {
        // All seeds exhausted — auto-advance to next chapter
        addAssistantMessage('Thank you for sharing that. Let me move on to the next topic.');
        setTimeout(() => advanceToNextChapter(), 1200);
      } else {
        // Last chapter — offer to finish
        addAssistantMessage('Thank you for walking me through all of that. If you are ready, you can tap "Finish Interview" below, or if there is anything else you would like to add, go ahead.');
      }

      setStatus('active');
    }
  };

  // ── Advance to next chapter ──────────────────────────────────
  const advanceToNextChapter = async () => {
    const advanced = advanceChapter();
    if (!advanced) {
      // No more chapters — generate report
      await generateReport();
      return;
    }

    setStatus('thinking');
    const nextState = useAppStore.getState();
    const nextChapter = category.chapters[nextState.currentChapterIndex];
    const text = await askNextQuestion(nextState.messages, nextChapter.id, nextState.currentChapterIndex);
    addAssistantMessage(text);
    setStatus('active');
  };

  // ── Manual "Next Section" button ─────────────────────────────
  const handleNextSection = async () => {
    if (status !== 'active') return;
    setStatus('thinking');

    if (isLastChapter) {
      await generateReport();
      return;
    }

    await advanceToNextChapter();
  };

  // ── Generate report ──────────────────────────────────────────
  const generateReport = async () => {
    setStatus('thinking');
    setError('');
    try {
      const currentMessages = useAppStore.getState().messages;
      const res = await fetch('/api/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          categorySlug,
          messages: currentMessages.map(m => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok) throw new Error('Report generation failed');
      const data = await res.json();
      const sections = parseReportSections(data.report);
      setReport({
        sections,
        generatedAt: Date.now(),
        signedOff: false,
      });
      setView('report-review');
    } catch {
      // Fallback: build a basic report from the messages
      const currentMessages = useAppStore.getState().messages;
      const transcript = currentMessages
        .map(m => `${m.role === 'user' ? 'Claimant' : 'Interviewer'}: ${m.content}`)
        .join('\n\n');
      setReport({
        sections: [{ title: 'Claim Transcript', content: transcript }],
        generatedAt: Date.now(),
        signedOff: false,
      });
      setView('report-review');
    }
  };

  const handleSubmit = () => {
    if (inputText.trim()) {
      sendMessage(inputText.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleVoice = (transcript: string) => {
    if (transcript === '__SPEECH_NOT_SUPPORTED__') {
      setError('Voice input is not supported in this browser. Please type your response.');
      setTimeout(() => setError(''), 4000);
      return;
    }
    sendMessage(transcript);
  };

  const handlePause = () => {
    setStatus('paused');
    saveSession();
  };

  const handleResume = () => {
    setStatus('active');
  };

  // Can show "Next Section" button after at least 1 user message in current chapter
  const canAdvance = chapterExchanges >= 1 && status === 'active';

  return (
    <div className="flex flex-col h-dvh bg-white">
      {/* Header */}
      <header className="flex-shrink-0 border-b border-gray-100 px-4 py-3">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-600" />
            <span className="text-sm font-semibold text-gray-700">Ledger Quest</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">
              {chapter.title}
            </span>
            {status === 'paused' && (
              <Button variant="outline" size="sm" onClick={handleResume} className="text-xs h-7">
                Resume
              </Button>
            )}
          </div>
        </div>
        {/* Progress bar */}
        <div className="max-w-2xl mx-auto mt-2">
          <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-400 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </header>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-[15px] leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-amber-500 text-white rounded-br-md'
                  : 'bg-gray-100 text-gray-800 rounded-bl-md'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {/* Streaming text */}
        {streamingText && (
          <div className="flex justify-start">
            <div className="max-w-[85%] sm:max-w-[75%] rounded-2xl rounded-bl-md px-4 py-3 text-[15px] leading-relaxed bg-gray-100 text-gray-800">
              {streamingText}
              <span className="inline-block w-1.5 h-4 bg-amber-500 ml-0.5 animate-pulse rounded-sm" />
            </div>
          </div>
        )}

        {/* Thinking indicator */}
        {status === 'thinking' && !streamingText && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms]" />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]" />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          </div>
        )}

        {/* Paused overlay */}
        {status === 'paused' && (
          <div className="flex justify-center py-4">
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 text-center">
              <p className="text-amber-800 font-medium text-sm">Interview Paused</p>
              <p className="text-amber-600 text-xs mt-1">Your progress has been saved. Tap Resume when you are ready.</p>
            </div>
          </div>
        )}

        {error && (
          <div className="flex justify-center">
            <p className="text-red-500 text-sm bg-red-50 rounded-lg px-4 py-2">{error}</p>
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="flex-shrink-0 border-t border-gray-100 px-4 py-3 bg-white">
        <div className="max-w-2xl mx-auto">
          {status === 'active' && (
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type or tap the microphone to speak..."
                className="flex-1 h-12 px-4 rounded-full border border-gray-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none text-[15px] bg-gray-50 placeholder:text-gray-400 transition-colors"
              />
              <VoiceButton onTranscript={handleVoice} />
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!inputText.trim()}
                className="flex-shrink-0 w-12 h-12 rounded-full bg-gray-900 hover:bg-gray-800 active:bg-gray-700 disabled:bg-gray-200 disabled:cursor-not-allowed flex items-center justify-center transition-colors shadow-sm"
                aria-label="Send"
              >
                <ChevronRight className="w-5 h-5 text-white" />
              </button>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center justify-between mt-2">
            <div className="flex gap-1">
              {status === 'active' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handlePause}
                  className="text-gray-400 hover:text-gray-600 text-xs gap-1"
                >
                  <Pause className="w-3 h-3" />
                  Pause
                </Button>
              )}
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => useAppStore.getState().clearSession()}
                className="text-gray-400 hover:text-red-500 text-xs gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                Start Over
              </Button>
              {canAdvance && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextSection}
                  className="text-xs border-amber-300 text-amber-700 hover:bg-amber-50 gap-1"
                >
                  <SkipForward className="w-3 h-3" />
                  Next Section
                </Button>
              )}
              {status === 'active' && (
                <Button
                  size="sm"
                  onClick={() => generateReport()}
                  className="text-xs bg-amber-500 hover:bg-amber-600 text-white gap-1"
                >
                  Finish Interview
                  <ChevronRight className="w-3 h-3" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function parseReportSections(reportText: string): { title: string; content: string }[] {
  const sections: { title: string; content: string }[] = [];
  const parts = reportText.split(/(?=\*\*\d+\.|\*\*[A-Z])/);

  let currentTitle = '';
  let currentContent = '';

  for (const part of parts) {
    const titleMatch = part.match(/\*\*(\d+\.\s*.+?)\*\*/);
    const altTitleMatch = part.match(/\*\*([A-Z][^*]+)\*\*/);

    if (titleMatch || altTitleMatch) {
      if (currentTitle && currentContent.trim()) {
        sections.push({ title: currentTitle, content: currentContent.trim() });
      }
      currentTitle = (titleMatch || altTitleMatch)![1].replace(/\*\*/g, '').trim();
      currentContent = part.replace(/\*\*[^*]+\*\*/, '').trim();
    } else {
      currentContent += '\n' + part.trim();
    }
  }

  if (currentTitle && currentContent.trim()) {
    sections.push({ title: currentTitle, content: currentContent.trim() });
  }

  return sections.length > 0 ? sections : [{ title: 'Claim Report', content: reportText }];
}