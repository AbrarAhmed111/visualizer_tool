'use client';

import { RefObject } from 'react';

interface BrushCanvasProps {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  maskCanvasRef: RefObject<HTMLCanvasElement | null>;
  onPointerDown: (e: React.PointerEvent) => void;
  onPointerMove: (e: React.PointerEvent) => void;
  onPointerUp: (e: React.PointerEvent) => void;
  onPointerLeave: (e: React.PointerEvent) => void;
}

export default function BrushCanvas({
  canvasRef,
  maskCanvasRef,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerLeave,
}: BrushCanvasProps) {
  return (
    <div
      className="flex-1 flex items-center justify-center overflow-hidden rounded-xl border border-stone-light/30 bg-white shadow-sm p-1 min-h-0"
      style={{ touchAction: 'none', maxHeight: '80vh' }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerLeave}
    >
      <div className="relative inline-block max-h-[80vh]">
        <canvas
          ref={canvasRef}
          className="max-w-full h-auto block cursor-crosshair"
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
