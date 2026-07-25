'use client';

import { useAppStore } from '@/lib/store';
import CategorySelect from '@/components/category-select';
import InterviewView from '@/components/interview-view';
import ReportReview from '@/components/report-review';
import CompleteView from '@/components/complete-view';
import { Button } from '@/components/ui/button';
import { BookOpen, ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Home() {
  const { view, setView, loadSession } = useAppStore();
  const [mounted, setMounted] = useState(false);

  // On mount, check for a saved session
  useEffect(() => {
    if (view === 'welcome') {
      const hasSession = loadSession();
      if (!hasSession) {
        setView('welcome');
      }
    }
    setMounted(true);
  }, []);

  // During SSR and initial hydration, always render welcome
  // to prevent hydration mismatch from localStorage session restore
  if (!mounted) return <WelcomeScreen />;

  switch (view) {
    case 'welcome':
      return <WelcomeScreen />;
    case 'select-category':
      return <CategorySelect />;
    case 'empathy-check':
    case 'interview':
      return <InterviewView />;
    case 'report-review':
      return <ReportReview />;
    case 'complete':
      return <CompleteView />;
    default:
      return <WelcomeScreen />;
  }
}

function WelcomeScreen() {
  const { setView, clearSession, loadSession } = useAppStore();

  const handleContinue = () => {
    const hasSession = loadSession();
    if (hasSession) {
      // loadSession already sets the correct view
    } else {
      setView('select-category');
    }
  };

  const handleNew = () => {
    clearSession();
    setView('select-category');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 bg-gradient-to-b from-amber-50 to-white">
      <div className="text-center max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-200">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight mb-2">
          Ledger Quest
        </h1>
        <p className="text-lg text-amber-700 font-medium mb-6">
          Your claim, guided by you.
        </p>

        {/* Description */}
        <p className="text-gray-500 text-base leading-relaxed mb-10">
          We will walk you through filing your insurance claim one question
          at a time. You can speak or type — there is no rush, and no wrong
          way to answer. Just tell us what happened, in your own words.
        </p>

        {/* Actions */}
        <div className="flex flex-col gap-3 w-full max-w-xs mx-auto">
          <Button
            onClick={handleNew}
            size="lg"
            className="w-full bg-amber-500 hover:bg-amber-600 text-white text-base h-12 rounded-xl gap-2 shadow-md shadow-amber-200"
          >
            File a New Claim
            <ArrowRight className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            onClick={handleContinue}
            size="lg"
            className="w-full text-base h-12 rounded-xl text-gray-600"
          >
            Continue a Saved Claim
          </Button>
        </div>

        {/* Footer */}
        <p className="text-xs text-gray-400 mt-12">
          Part of The Ledger Series
        </p>
      </div>
    </div>
  );
}