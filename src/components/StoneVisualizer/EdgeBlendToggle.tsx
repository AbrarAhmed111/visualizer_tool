'use client';

import type { EdgeMode } from '@/utils/canvasUtils';

interface EdgeBlendToggleProps {
  edgeMode: EdgeMode;
  onEdgeModeChange: (mode: EdgeMode) => void;
}

export default function EdgeBlendToggle({ edgeMode, onEdgeModeChange }: EdgeBlendToggleProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-stone-light/30 bg-white px-3 py-2.5 shadow-sm">
      <span className="text-xs font-semibold uppercase tracking-wide text-stone-heading shrink-0">
        Edge blend
      </span>
      <div className="flex rounded-lg border border-stone-light/40 p-0.5 bg-stone-bg/80 min-w-0 flex-1 max-w-[min(100%,280px)]">
        <button
          type="button"
          onClick={() => onEdgeModeChange('soft')}
          className={`flex-1 min-w-0 px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors ${
            edgeMode === 'soft'
              ? 'bg-stone-dark text-white shadow-sm'
              : 'text-stone-heading hover:bg-stone-light/30'
          }`}
        >
          Soft Edges
        </button>
        <button
          type="button"
          onClick={() => onEdgeModeChange('hard')}
          className={`flex-1 min-w-0 px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors ${
            edgeMode === 'hard'
              ? 'bg-stone-dark text-white shadow-sm'
              : 'text-stone-heading hover:bg-stone-light/30'
          }`}
        >
          Hard Edges
        </button>
      </div>
    </div>
  );
}
