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
    <div className="flex flex-wrap items-center gap-2 max-lg:gap-2 max-lg:mb-2 mb-3 flex-shrink-0">
      <div className="flex items-center gap-2 px-3 py-1.5 max-lg:px-2 max-lg:py-1 rounded-lg bg-white border border-stone-light/30 shadow-sm">
        <Paintbrush className="w-4 h-4 max-lg:w-3.5 max-lg:h-3.5 text-stone-dark" />
        <span className="text-sm max-lg:text-xs font-medium text-stone-heading">
          Brush/Select Area tool
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onEraseModeChange(false)}
          className={`p-2 max-lg:p-1.5 rounded-lg transition-colors ${
            !isEraseMode
              ? 'bg-stone-dark text-white'
              : 'bg-white border border-stone-light/30 text-stone-heading hover:bg-stone-light/20'
          }`}
          title="Draw"
        >
          <Pencil className="w-4 h-4 max-lg:w-3.5 max-lg:h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => onEraseModeChange(true)}
          className={`p-2 max-lg:p-1.5 rounded-lg transition-colors ${
            isEraseMode
              ? 'bg-stone-dark text-white'
              : 'bg-white border border-stone-light/30 text-stone-heading hover:bg-stone-light/20'
          }`}
          title="Erase"
        >
          <Eraser className="w-4 h-4 max-lg:w-3.5 max-lg:h-3.5" />
        </button>
      </div>
      <div className="flex items-center gap-2">
        <label className="text-sm max-lg:text-xs font-medium text-stone-heading">Brush size</label>
        <input
          type="range"
          min={8}
          max={80}
          value={brushSize}
          onChange={(e) => onBrushSizeChange(Number(e.target.value))}
          className="w-24 max-lg:w-16 h-2 rounded-lg appearance-none cursor-pointer bg-stone-light/40 accent-stone-dark"
        />
        <span className="text-sm max-lg:text-xs text-stone-heading w-6">{brushSize}</span>
      </div>
    </div>
  );
}
