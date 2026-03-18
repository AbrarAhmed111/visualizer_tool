'use client';

import { RefObject } from 'react';

interface BrushCanvasProps {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  maskCanvasRef: RefObject<HTMLCanvasElement | null>;
  onPointerDown: (e: React.PointerEvent) => void;
  onPointerMove: (e: React.PointerEvent) => void;
  onPointerUp: (e: React.PointerEvent) => void;
  onPointerLeave: (e: React.PointerEvent) => void;
  onPointerCancel?: (e: React.PointerEvent) => void;
}

export default function BrushCanvas({
  canvasRef,
  maskCanvasRef,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerLeave,
  onPointerCancel,
}: BrushCanvasProps) {
  return (
    <div className="flex-1 flex items-center justify-center overflow-auto rounded-xl border border-stone-light/30 bg-white shadow-sm p-1 min-h-0 touch-manipulation select-none">
      <div className="flex items-center justify-center w-full min-h-0 overflow-auto">
        <div className="relative inline-block">
          <canvas
            ref={canvasRef}
            className="max-w-full max-h-[75vh] sm:max-h-[80vh] w-auto h-auto block cursor-crosshair touch-none"
            style={{ touchAction: 'none' }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerLeave={onPointerLeave}
            onPointerCancel={onPointerCancel}
          />
          <canvas
            ref={maskCanvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none opacity-0"
            aria-hidden
          />
        </div>
      </div>
    </div>
  );
}
