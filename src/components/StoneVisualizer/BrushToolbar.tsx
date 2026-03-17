'use client';

import { Pencil, Eraser, Paintbrush } from 'lucide-react';

interface BrushToolbarProps {
  brushSize: number;
  isEraseMode: boolean;
  onBrushSizeChange: (size: number) => void;
  onEraseModeChange: (isErase: boolean) => void;
}

export default function BrushToolbar({
  brushSize,
  isEraseMode,
  onBrushSizeChange,
  onEraseModeChange,
}: BrushToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2 sm:mb-3 flex-shrink-0">
      <div className="flex items-center gap-2 px-2 sm:px-3 py-1.5 rounded-lg bg-white border border-stone-light/30 shadow-sm">
        <Paintbrush className="w-4 h-4 text-stone-dark flex-shrink-0" />
        <span className="text-xs sm:text-sm font-medium text-stone-heading whitespace-nowrap">
          Brush/Select Area tool
        </span>
      </div>
      <div className="flex items-center gap-1 sm:gap-2">
        <button
          type="button"
          onClick={() => onEraseModeChange(false)}
          className={`min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 p-2.5 sm:p-2 rounded-lg transition-colors touch-manipulation ${
            !isEraseMode
              ? 'bg-stone-dark text-white'
              : 'bg-white border border-stone-light/30 text-stone-heading hover:bg-stone-light/20 active:bg-stone-light/30'
          }`}
          title="Draw"
          aria-label="Draw mode"
        >
          <Pencil className="w-4 h-4 mx-auto" />
        </button>
        <button
          type="button"
          onClick={() => onEraseModeChange(true)}
          className={`min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 p-2.5 sm:p-2 rounded-lg transition-colors touch-manipulation ${
            isEraseMode
              ? 'bg-stone-dark text-white'
              : 'bg-white border border-stone-light/30 text-stone-heading hover:bg-stone-light/20 active:bg-stone-light/30'
          }`}
          title="Erase"
          aria-label="Erase mode"
        >
          <Eraser className="w-4 h-4 mx-auto" />
        </button>
      </div>
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <label className="text-xs sm:text-sm font-medium text-stone-heading flex-shrink-0">Brush size</label>
        <input
          type="range"
          min={8}
          max={80}
          value={brushSize}
          onChange={(e) => onBrushSizeChange(Number(e.target.value))}
          className="flex-1 min-w-0 max-w-32 sm:max-w-24 h-3 sm:h-2 rounded-lg appearance-none cursor-pointer bg-stone-light/40 accent-stone-dark touch-manipulation"
        />
        <span className="text-sm text-stone-heading w-6 flex-shrink-0">{brushSize}</span>
      </div>
    </div>
  );
}
