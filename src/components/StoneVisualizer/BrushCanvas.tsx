'use client';

import { RefObject, useCallback } from 'react';

interface BrushCanvasProps {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  maskCanvasRef: RefObject<HTMLCanvasElement | null>;
  onPointerDown: (e: React.PointerEvent) => void;
  onPointerMove: (e: React.PointerEvent) => void;
  onPointerUp: (e: React.PointerEvent) => void;
  onPointerLeave: (e: React.PointerEvent) => void;
  onBrushDown: (clientX: number, clientY: number) => void;
  onBrushMove: (clientX: number, clientY: number) => void;
  onBrushUp: () => void;
}

export default function BrushCanvas({
  canvasRef,
  maskCanvasRef,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerLeave,
  onBrushDown,
  onBrushMove,
  onBrushUp,
}: BrushCanvasProps) {
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length > 0) {
        e.preventDefault();
        const touch = e.touches[0];
        onBrushDown(touch.clientX, touch.clientY);
      }
    },
    [onBrushDown]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length > 0) {
        e.preventDefault();
        const touch = e.touches[0];
        onBrushMove(touch.clientX, touch.clientY);
      }
    },
    [onBrushMove]
  );

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length === 0) onBrushUp();
    },
    [onBrushUp]
  );

  const handleTouchCancel = useCallback(() => onBrushUp(), [onBrushUp]);

  return (
    <div
      className="flex-1 flex items-center justify-center overflow-hidden rounded-xl border border-stone-light/30 bg-white shadow-sm p-1 min-h-0"
      style={{
        touchAction: 'none',
        maxHeight: '80vh',
      }}
    >
      <div className="relative inline-block max-h-[80vh] max-lg:max-h-[min(80vh,60dvh)]">
        <canvas
          ref={canvasRef}
          className="max-w-full h-auto block cursor-crosshair max-lg:touch-none max-lg:select-none"
          style={{ touchAction: 'none' }}
        />
        <canvas
          ref={maskCanvasRef}
          className="absolute top-0 left-0 pointer-events-none opacity-0"
          style={{ width: '100%', height: '100%' }}
          aria-hidden
        />
        {/* Desktop: pointer events */}
        <div
          className="absolute inset-0 max-lg:hidden cursor-crosshair"
          style={{ touchAction: 'none' }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerLeave}
        />
        {/* Mobile: touch events - prevents scroll, supports drag & hold */}
        <div
          className="absolute inset-0 hidden max-lg:block"
          style={{
            touchAction: 'none',
            WebkitTouchCallout: 'none',
            WebkitUserSelect: 'none',
            userSelect: 'none',
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchCancel}
        />
      </div>
    </div>
  );
}
