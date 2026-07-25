'use client';

import { useAppStore } from '@/lib/store';
import { CLAIM_CATEGORIES } from '@/lib/claim-data';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Home,
  Car,
  HeartPulse,
  HardHat,
  Accessibility,
  ShieldCheck,
  Building2,
  BookOpen,
  ArrowRight,
} from 'lucide-react';
import type { ClaimCategorySlug } from '@/lib/types';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Home,
  Car,
  HeartPulse,
  HardHat,
  Accessibility,
  ShieldCheck,
  Building2,
};

export default function CategorySelect() {
  const { setCategory } = useAppStore();

  return (
    <div className="flex flex-col items-center justify-start min-h-screen px-4 py-8 sm:py-12">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10">
          <div className="flex items-center justify-center gap-2 mb-3">
            <BookOpen className="w-7 h-7 text-amber-600" />
            <span className="text-sm font-medium text-amber-700 tracking-wide uppercase">
              Ledger Quest
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            What type of claim are you filing?
          </h1>
          <p className="text-gray-500 text-base sm:text-lg">
            Tap the category that best describes your situation.
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {CLAIM_CATEGORIES.map((cat) => {
            const IconComp = ICON_MAP[cat.icon] || Home;
            return (
              <Card
                key={cat.slug}
                className="cursor-pointer border-2 border-transparent hover:border-amber-400 hover:shadow-md transition-all duration-200 active:scale-[0.98] bg-white"
                onClick={() => setCategory(cat.slug as ClaimCategorySlug)}
              >
                <CardContent className="p-4 sm:p-5 flex items-start gap-3 sm:gap-4">
                  <div className="flex-shrink-0 w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-amber-50 flex items-center justify-center">
                    <IconComp className="w-5 h-5 sm:w-6 sm:h-6 text-amber-700" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-base sm:text-lg leading-tight">
                      {cat.name}
                    </h3>
                    <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                      {cat.description}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-300 flex-shrink-0 mt-1" />
                </CardContent>
              </Card>
            );
          })}
        </div>

        <p className="text-center text-xs text-gray-400 mt-8">
          Your information stays on this device until you submit your claim.
        </p>
      </div>
    </div>
  );
}