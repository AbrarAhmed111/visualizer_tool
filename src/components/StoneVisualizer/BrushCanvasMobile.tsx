'use client';

import { useRef, useEffect, RefObject } from 'react';

interface BrushCanvasMobileProps {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  maskCanvasRef: RefObject<HTMLCanvasElement | null>;
  onDrawStart: (clientX: number, clientY: number, pressure?: number) => void;
  onDrawMove: (clientX: number, clientY: number, pressure?: number) => void;
  onDrawEnd: () => void;
  onDrawCancel: () => void;
  isDrawingAllowed: boolean;
}

/**
 * Mobile-only brush canvas using native touch events.
 * Touch handlers on canvas only: touching the image disables scroll for drawing,
 * touching outside allows normal page scroll. Document listeners capture touchmove/touchend
 * when finger moves outside the canvas during a stroke.
 */
export default function BrushCanvasMobile({
  canvasRef,
  maskCanvasRef,
  onDrawStart,
  onDrawMove,
  onDrawEnd,
  onDrawCancel,
  isDrawingAllowed,
}: BrushCanvasMobileProps) {
  const activeTouchIdRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const opts: AddEventListenerOptions = { passive: false };

    const onTouchMove = (e: TouchEvent) => {
      if (activeTouchIdRef.current === null || e.touches.length === 0) return;
      e.preventDefault();
      const touch = Array.from(e.touches).find((t) => t.identifier === activeTouchIdRef.current);
      if (touch) {
        onDrawMove(touch.clientX, touch.clientY, 0.5);
      }
    };

    const cleanupDocListeners = () => {
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('touchend', onTouchEnd);
      document.removeEventListener('touchcancel', onTouchCancel);
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (e.changedTouches.length === 0) return;
      const ended = Array.from(e.changedTouches).some(
        (t) => t.identifier === activeTouchIdRef.current
      );
      if (ended) {
        activeTouchIdRef.current = null;
        onDrawEnd();
        cleanupDocListeners();
      }
    };

    const onTouchCancel = () => {
      activeTouchIdRef.current = null;
      onDrawCancel();
      cleanupDocListeners();
    };

    const onTouchStart = (e: TouchEvent) => {
      if (!isDrawingAllowed || e.touches.length === 0) return;
      e.preventDefault();
      const touch = e.touches[0];
      activeTouchIdRef.current = touch.identifier;
      onDrawStart(touch.clientX, touch.clientY, 0.5);
      document.addEventListener('touchmove', onTouchMove, opts);
      document.addEventListener('touchend', onTouchEnd, opts);
      document.addEventListener('touchcancel', onTouchCancel, opts);
    };

    canvas.addEventListener('touchstart', onTouchStart, opts);

    return () => {
      canvas.removeEventListener('touchstart', onTouchStart);
      cleanupDocListeners();
    };
  }, [canvasRef, isDrawingAllowed, onDrawStart, onDrawMove, onDrawEnd, onDrawCancel]);

  return (
    <div
      className="flex-1 flex items-center justify-center overflow-auto rounded-xl border border-stone-light/30 bg-white shadow-sm p-1 min-h-0 touch-manipulation select-none"
      style={{
        WebkitUserSelect: 'none',
        userSelect: 'none',
      }}
    >
      <div className="flex items-center justify-center w-full min-h-0 overflow-auto">
        <div className="relative inline-block">
          <canvas
            ref={canvasRef}
            className="max-w-full max-h-[75vh] w-auto h-auto block touch-none"
            style={{ touchAction: 'none' }}
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
