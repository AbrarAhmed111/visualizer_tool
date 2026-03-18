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
    <div
      className="flex-1 flex items-center justify-center overflow-auto rounded-xl border border-stone-light/30 bg-white shadow-sm p-1 min-h-0 touch-manipulation select-none"
      style={{ touchAction: 'none', WebkitUserSelect: 'none', userSelect: 'none' }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerLeave}
      onPointerCancel={onPointerCancel}
    >
      <div className="relative flex items-center justify-center inline-block w-full max-h-[60vh] sm:max-h-[70vh] lg:max-h-[80vh]">
        <canvas
          ref={canvasRef}
          className="max-w-full w-full h-auto block cursor-crosshair touch-none"
          style={{ touchAction: 'none' }}
        />
        <canvas
          ref={maskCanvasRef}
          className="absolute top-0 left-0 pointer-events-none opacity-0"
          style={{ width: '100%', height: '100%' }}
          aria-hidden
        />
      </div>
    </div>
  );
}
