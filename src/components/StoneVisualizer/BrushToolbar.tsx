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
    <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 mb-2 sm:mb-2 flex-shrink-0">
      <div className="flex items-center justify-between sm:justify-start gap-2">
        <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-2.5 py-2 sm:py-1 rounded-lg bg-white border border-stone-light/30 shadow-sm">
          <Paintbrush className="w-4 h-4 text-stone-dark flex-shrink-0" />
          <span className="text-xs sm:text-sm font-medium text-stone-heading whitespace-nowrap">
            Brush/Select Area tool
          </span>
        </div>
        <div className="flex items-center gap-1 sm:gap-1.5">
          <button
            type="button"
            onClick={() => onEraseModeChange(false)}
            className={`min-w-[48px] min-h-[48px] sm:min-w-[36px] sm:min-h-[36px] p-2.5 sm:p-1.5 rounded-lg transition-colors touch-manipulation ${
              !isEraseMode
                ? 'bg-stone-dark text-white'
                : 'bg-white border border-stone-light/30 text-stone-heading hover:bg-stone-light/20 active:bg-stone-light/30'
            }`}
            title="Draw"
            aria-label="Draw mode"
          >
            <Pencil className="w-4 h-4 sm:w-3 sm:h-3 mx-auto" />
          </button>
          <button
            type="button"
            onClick={() => onEraseModeChange(true)}
            className={`min-w-[48px] min-h-[48px] sm:min-w-[36px] sm:min-h-[36px] p-2.5 sm:p-1.5 rounded-lg transition-colors touch-manipulation ${
              isEraseMode
                ? 'bg-stone-dark text-white'
                : 'bg-white border border-stone-light/30 text-stone-heading hover:bg-stone-light/20 active:bg-stone-light/30'
            }`}
            title="Erase"
            aria-label="Erase mode"
          >
            <Eraser className="w-4 h-4 sm:w-3 sm:h-3 mx-auto" />
          </button>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-1 min-w-0 sm:max-w-[180px] bg-white rounded-lg border border-stone-light/30 shadow-sm px-2 sm:px-2.5 py-2.5 sm:py-1">
        <label className="text-xs sm:text-sm font-medium text-stone-heading flex-shrink-0 whitespace-nowrap">Size</label>
        <input
          type="range"
          min={8}
          max={80}
          value={brushSize}
          onChange={(e) => onBrushSizeChange(Number(e.target.value))}
          className="flex-1 min-w-[60px] min-h-[28px] sm:min-h-0 sm:h-2 rounded-lg appearance-none cursor-pointer bg-stone-light/40 accent-stone-dark touch-manipulation"
          style={{ minHeight: 28 }}
        />
        <span className="text-xs sm:text-sm font-semibold text-stone-heading w-6 sm:w-7 flex-shrink-0 text-right tabular-nums">{brushSize}</span>
      </div>
    </div>
  );
}
