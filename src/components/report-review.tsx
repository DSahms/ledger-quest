'use client';

import { useAppStore } from '@/lib/store';
import { getCategory } from '@/lib/claim-data';
import { Button } from '@/components/ui/button';
import {
  BookOpen,
  CheckCircle2,
  FileText,
  RotateCcw,
  ArrowLeft,
} from 'lucide-react';
import { useState } from 'react';

export default function ReportReview() {
  const { categorySlug, report, signOffReport, setView, clearSession } = useAppStore();
  const [activeSection, setActiveSection] = useState(0);
  const [confirmedSections, setConfirmedSections] = useState<Set<number>>(new Set());

  const category = getCategory(categorySlug!);
  const sections = report?.sections || [];

  const confirmSection = (idx: number) => {
    setConfirmedSections((prev) => new Set([...prev, idx]));
    if (idx < sections.length - 1) {
      setActiveSection(idx + 1);
    }
  };

  const allConfirmed = confirmedSections.size === sections.length;

  const handleSignOff = () => {
    signOffReport();
  };

  return (
    <div className="flex flex-col h-dvh bg-white">
      {/* Header */}
      <header className="flex-shrink-0 border-b border-gray-100 px-4 py-3">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setView('interview')}
              className="text-gray-400 hover:text-gray-600 gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <BookOpen className="w-5 h-5 text-amber-600" />
            <span className="text-sm font-semibold text-gray-700">Claim Report</span>
          </div>
          <span className="text-xs text-gray-400">
            {category.name}
          </span>
        </div>
      </header>

      {/* Section tabs */}
      <div className="flex-shrink-0 border-b border-gray-100 px-4 overflow-x-auto">
        <div className="flex gap-1 max-w-2xl mx-auto py-2">
          {sections.map((sec, idx) => (
            <button
              key={idx}
              onClick={() => setActiveSection(idx)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                activeSection === idx
                  ? 'bg-amber-100 text-amber-800'
                  : confirmedSections.has(idx)
                    ? 'bg-green-50 text-green-700'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {confirmedSections.has(idx) ? (
                <CheckCircle2 className="w-3 h-3" />
              ) : (
                <span className="w-1.5 h-1.5 rounded-full bg-current opacity-50" />
              )}
              {sec.title.replace(/^\d+\.\s*/, '')}
            </button>
          ))}
        </div>
      </div>

      {/* Section content */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-2xl mx-auto">
          {sections[activeSection] && (
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                {sections[activeSection].title}
              </h2>
              <div className="bg-gray-50 rounded-xl p-4 sm:p-6">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-[15px]">
                  {sections[activeSection].content}
                </p>
              </div>

              <div className="mt-4 flex items-center gap-3">
                {!confirmedSections.has(activeSection) ? (
                  <>
                    <Button
                      onClick={() => confirmSection(activeSection)}
                      className="bg-amber-500 hover:bg-amber-600 text-white"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      This looks correct
                    </Button>
                    <p className="text-xs text-gray-400">
                      Review each section and confirm it is accurate.
                    </p>
                  </>
                ) : (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-sm font-medium">Confirmed</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 border-t border-gray-100 px-4 py-3 bg-white">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSession}
            className="text-gray-400 hover:text-red-500 text-xs gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            New Claim
          </Button>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">
              {confirmedSections.size} of {sections.length} confirmed
            </span>
            {allConfirmed && (
              <Button
                onClick={handleSignOff}
                className="bg-green-600 hover:bg-green-700 text-white gap-1"
              >
                <FileText className="w-4 h-4" />
                Sign Off & Complete
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}