'use client';

import { useAppStore } from '@/lib/store';
import { getCategory } from '@/lib/claim-data';
import { Button } from '@/components/ui/button';
import { BookOpen, CheckCircle2, RotateCcw, Download, Share2 } from 'lucide-react';
import { useRef } from 'react';

export default function CompleteView() {
  const { categorySlug, report, clearSession } = useAppStore();
  const printRef = useRef<HTMLDivElement>(null);

  const category = getCategory(categorySlug!);

  const handleExport = () => {
    if (!printRef.current) return;
    const text = report?.sections
      .map(s => `${s.title}\n${'─'.repeat(s.title.length)}\n\n${s.content}`)
      .join('\n\n');

    const blob = new Blob([`LEDGER QUEST — ${category.name} Claim Report\n${'═'.repeat(50)}\nGenerated: ${new Date(report?.generatedAt || Date.now()).toLocaleString()}\nStatus: Signed Off\n\n${text}\n\n${'═'.repeat(50)}\nClaimant acknowledgment: I confirm that the information provided is true and complete to the best of my knowledge and recollection.\n`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ledger-quest-${categorySlug}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Success header */}
      <div className="bg-green-600 text-white px-4 py-10 text-center">
        <CheckCircle2 className="w-14 h-14 mx-auto mb-3 opacity-90" />
        <h1 className="text-2xl font-bold mb-1">Claim Recorded</h1>
        <p className="text-green-100 text-sm">
          Your {category.name.toLowerCase()} claim statement has been saved and signed off.
        </p>
      </div>

      {/* Report content */}
      <div ref={printRef} className="flex-1 px-4 py-6">
        <div className="max-w-2xl mx-auto space-y-5">
          {report?.sections.map((sec, idx) => (
            <div key={idx} className="bg-white rounded-xl p-4 sm:p-5 shadow-sm">
              <h3 className="font-bold text-gray-900 text-sm mb-2">{sec.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">{sec.content}</p>
            </div>
          ))}

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="text-amber-800 text-xs font-medium mb-1">Signed Off</p>
            <p className="text-amber-700 text-xs">
              {report?.signedOffAt
                ? `Acknowledged on ${new Date(report.signedOffAt).toLocaleString()}`
                : 'Pending'}
            </p>
            <p className="text-amber-600 text-xs mt-2 italic">
              &ldquo;I confirm that the information provided is true and complete to the best of my knowledge and recollection.&rdquo;
            </p>
          </div>
        </div>
      </div>

      {/* Footer actions */}
      <div className="flex-shrink-0 border-t border-gray-200 bg-white px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-3">
          <Button
            variant="outline"
            onClick={clearSession}
            className="gap-1 text-xs"
          >
            <RotateCcw className="w-3 h-3" />
            File New Claim
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleExport}
              className="gap-1 text-xs"
            >
              <Download className="w-3 h-3" />
              Export
            </Button>
            <Button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: 'Ledger Quest Claim Report',
                    text: 'Insurance claim statement recorded with Ledger Quest.',
                  }).catch(() => {});
                }
              }}
              className="bg-amber-500 hover:bg-amber-600 text-white gap-1 text-xs"
            >
              <Share2 className="w-3 h-3" />
              Share
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}