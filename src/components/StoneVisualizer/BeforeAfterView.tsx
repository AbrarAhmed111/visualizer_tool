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
        <div className="px-3 py-2 bg-stone-light/10 border-b border-stone-light/20 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wide text-stone-heading">
            Drag to compare Before & After
          </span>
          <button
            type="button"
            onClick={onEditSelection}
            className="text-xs text-stone-dark hover:underline"
          >
            Edit selection
          </button>
        </div>
        <div
          ref={sliderContainerRef}
          className="flex-1 relative overflow-hidden select-none flex items-center justify-center p-1 max-lg:p-0.5 min-h-0"
          style={{ touchAction: 'none', WebkitUserSelect: 'none', userSelect: 'none' }}
        >
<div
              className="relative w-full h-full max-w-full flex items-center justify-center rounded-lg isolate overflow-hidden max-h-[80vh] max-lg:max-h-[min(80vh,60dvh)]"
              style={{
                aspectRatio: imageDimensions
                  ? `${imageDimensions.width}/${imageDimensions.height}`
                  : '1',
                minHeight: 0,
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
            <div className="absolute top-3 left-3 z-10 px-3 py-1.5 rounded-lg bg-stone-dark/90 text-white text-sm font-semibold uppercase tracking-wide">
              Before
            </div>
            <div className="absolute top-3 right-3 z-10 px-3 py-1.5 rounded-lg bg-stone-dark/90 text-white text-sm font-semibold uppercase tracking-wide">
              After
            </div>
            <div
              className="absolute top-0 bottom-0 w-10 cursor-ew-resize flex items-center justify-center z-10"
              style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
              onPointerDown={onSliderPointerDown}
            >
              <div className="absolute left-1/2 top-0 bottom-0 w-0.5 -ml-px bg-white shadow-lg" />
              <div className="w-8 h-12 flex items-center justify-center rounded bg-white border border-stone-light/30 shadow-md hover:bg-stone-bg transition-colors">
                <GripVertical className="w-4 h-4 text-stone-heading" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
