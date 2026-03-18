'use client';

import { ChevronDown } from 'lucide-react';

interface ScrollDownIndicatorProps {
  visible: boolean;
}

export default function ScrollDownIndicator({ visible }: ScrollDownIndicatorProps) {
  if (!visible) return null;

  return (
    <div
      className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
      aria-hidden
    >
      <div className="flex flex-col items-center gap-1">
        <span className="text-xs font-medium text-stone-heading/70 uppercase tracking-wider">
          Scroll for more
        </span>
        <div className="animate-bounce">
          <ChevronDown className="w-8 h-8 text-stone-dark drop-shadow-sm" />
        </div>
      </div>
    </div>
  );
}
