'use client';

import { RefObject } from 'react';
import { GripVertical } from 'lucide-react';
import type { ImageDimensions } from '@/types/visualizer';

interface BeforeAfterViewProps {
  beforeCanvasRef: RefObject<HTMLCanvasElement | null>;
  resultCanvasRef: RefObject<HTMLCanvasElement | null>;
  sliderContainerRef: RefObject<HTMLDivElement | null>;
  imageDimensions: ImageDimensions | null;
  sliderPosition: number;
  onSliderPointerDown: (e: React.PointerEvent) => void;
  onEditSelection: () => void;
}

export default function BeforeAfterView({
  beforeCanvasRef,
  resultCanvasRef,
  sliderContainerRef,
  imageDimensions,
  sliderPosition,
  onSliderPointerDown,
  onEditSelection,
}: BeforeAfterViewProps) {
  return (
    <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden rounded-xl border border-stone-light/30 bg-white shadow-sm">
        <div className="px-2 sm:px-3 py-1.5 sm:py-2 bg-stone-light/10 border-b border-stone-light/20 flex items-center justify-between gap-2">
          <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-stone-heading truncate">
            Drag to compare Before & After
          </span>
          <button
            type="button"
            onClick={onEditSelection}
            className="text-[10px] sm:text-xs text-stone-dark hover:underline flex-shrink-0 py-2 px-1 touch-manipulation"
          >
            Edit selection
          </button>
        </div>
        <div
          ref={sliderContainerRef}
          className="flex-1 relative overflow-auto select-none flex items-center justify-center p-1 min-h-0"
          style={{ touchAction: 'none' }}
        >
          <div
            className="relative w-full max-w-full flex items-center justify-center rounded-lg isolate"
            style={{
              aspectRatio: imageDimensions
                ? `${imageDimensions.width}/${imageDimensions.height}`
                : '1',
              minHeight: 0,
              maxHeight: '80vh',
            }}
          >
            <canvas
              ref={beforeCanvasRef}
              className="absolute inset-0 w-full h-full block"
              style={{ objectFit: 'contain' }}
            />
            <div
              className="absolute inset-0"
              style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}
            >
              <canvas
                ref={resultCanvasRef}
                className="w-full h-full block"
                style={{ objectFit: 'contain' }}
              />
            </div>
            <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10 px-2 py-1 sm:px-3 sm:py-1.5 rounded-md sm:rounded-lg bg-stone-dark/90 text-white text-[10px] sm:text-sm font-semibold uppercase tracking-wide">
              Before
            </div>
            <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10 px-2 py-1 sm:px-3 sm:py-1.5 rounded-md sm:rounded-lg bg-stone-dark/90 text-white text-[10px] sm:text-sm font-semibold uppercase tracking-wide">
              After
            </div>
            <div
              className="absolute top-0 bottom-0 w-12 sm:w-10 min-w-[48px] cursor-ew-resize flex items-center justify-center z-10 touch-manipulation"
              style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
              onPointerDown={onSliderPointerDown}
              role="slider"
              aria-label="Compare before and after"
              tabIndex={0}
            >
              <div className="absolute left-1/2 top-0 bottom-0 w-0.5 -ml-px bg-white shadow-lg" />
              <div className="w-10 h-14 sm:w-8 sm:h-12 flex items-center justify-center rounded bg-white border border-stone-light/30 shadow-md hover:bg-stone-bg active:bg-stone-bg transition-colors">
                <GripVertical className="w-4 h-4 text-stone-heading" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
