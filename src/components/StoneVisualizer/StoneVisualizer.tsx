'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { getStroke } from 'perfect-freehand';
import type { StoneProduct } from '@/constants/stoneProducts';
import { STONE_PRODUCTS } from '@/constants/stoneProducts';
import { MIN_IMAGE_WIDTH, RECOMMENDED_IMAGE_WIDTH } from '@/constants/visualizer';
import { drawBrushOverlay } from '@/utils/canvasUtils';
import { getSvgPathFromStroke } from '@/utils/strokeUtils';
import { saveProgress, loadProgress, clearProgress } from '@/utils/visualizerStorage';
import BrushToolbar from './BrushToolbar';
import BrushCanvas from './BrushCanvas';
import BeforeAfterView from './BeforeAfterView';
import VisualizerSidebar from './VisualizerSidebar';

export default function StoneVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const maskCanvasRef = useRef<HTMLCanvasElement>(null);
  const resultCanvasRef = useRef<HTMLCanvasElement>(null);
  const beforeCanvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const sliderContainerRef = useRef<HTMLDivElement>(null);
  const strokePointsRef = useRef<number[][]>([]);
  const maskSnapshotRef = useRef<ImageData | null>(null);
  const rafRef = useRef<number | null>(null);
  const pendingMaskRestoreRef = useRef<{ base64: string; w: number; h: number } | null>(null);
  const imageBase64Ref = useRef<string | null>(null);

  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null);
  const [brushSize, setBrushSize] = useState(30);
  const [isEraseMode, setIsEraseMode] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageWarning, setImageWarning] = useState<string | null>(null);
  const [visualizationComplete, setVisualizationComplete] = useState(false);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [selectedStone, setSelectedStone] = useState<StoneProduct | null>(null);
  const [isDraggingSlider, setIsDraggingSlider] = useState(false);
  const [windowSize, setWindowSize] = useState({ w: 0, h: 0 });

  const saveCurrentProgress = useCallback(() => {
    const base64 = imageBase64Ref.current;
    const maskCanvas = maskCanvasRef.current;
    const dims = imageDimensions;
    if (!base64 || !dims) return;

    const maskBase64 = maskCanvas?.toDataURL('image/png');
    const maskDims = maskCanvas && maskCanvas.width > 0 ? { width: maskCanvas.width, height: maskCanvas.height } : undefined;

    saveProgress({
      imageBase64: base64,
      imageDimensions: dims,
      maskBase64: maskBase64 || undefined,
      maskDimensions: maskDims,
      selectedStoneId: selectedStone?.id,
      brushSize,
      isEraseMode,
      sliderPosition,
    });
  }, [imageDimensions, selectedStone?.id, brushSize, isEraseMode, sliderPosition]);

  const loadImageFromDataUrl = useCallback((dataUrl: string) => {
    imageBase64Ref.current = dataUrl;
    const img = new Image();
    img.onload = () => {
      if (img.width < MIN_IMAGE_WIDTH) {
        setError(`Image must be at least ${MIN_IMAGE_WIDTH}px wide. Your image is ${img.width}px.`);
        setImageWarning(null);
        return;
      }
      setError(null);
      if (img.width < RECOMMENDED_IMAGE_WIDTH) {
        setImageWarning(`Recommended: Use images ${RECOMMENDED_IMAGE_WIDTH}px+ wide for best results.`);
      } else {
        setImageWarning(null);
      }
      setImage(img);
      setImageDimensions({ width: img.width, height: img.height });
    };
    img.onerror = () => setError('Failed to load image.');
    img.src = dataUrl;
  }, []);

  const loadImage = useCallback((file: File) => {
    const isImage = file.type.startsWith('image/') ||
      /\.(jpg|jpeg|png)$/i.test(file.name);
    if (!isImage) {
      setError('Please upload a JPG, JPEG, or PNG image.');
      return;
    }
    setError(null);
    setImageWarning(null);
    setVisualizationComplete(false);

    const reader = new FileReader();
    reader.onload = () => {
      loadImageFromDataUrl(reader.result as string);
    };
    reader.onerror = () => setError('Failed to read file.');
    reader.readAsDataURL(file);
  }, [loadImageFromDataUrl]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) loadImage(file);
    e.target.value = '';
  }, [loadImage]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) loadImage(file);
  }, [loadImage]);

  const handleDragOver = useCallback((e: React.DragEvent) => e.preventDefault(), []);

  const getCanvasPoint = useCallback((clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas || !containerRef.current) return null;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: Math.floor((clientX - rect.left) * scaleX),
      y: Math.floor((clientY - rect.top) * scaleY),
    };
  }, []);

  const redrawBrushView = useCallback(() => {
    const canvas = canvasRef.current;
    const maskCanvas = maskCanvasRef.current;
    if (!canvas || !maskCanvas || !image) return;
    drawBrushOverlay(canvas, maskCanvas, image);
  }, [image]);

  const drawStrokeToMask = useCallback(
    (points: number[][]) => {
      const maskCanvas = maskCanvasRef.current;
      const canvas = canvasRef.current;
      if (!maskCanvas || !canvas || !imageDimensions || points.length === 0) return;

      const ctx = maskCanvas.getContext('2d');
      if (!ctx) return;

      // Restore mask from snapshot (start of stroke)
      const snapshot = maskSnapshotRef.current;
      if (snapshot) {
        ctx.putImageData(snapshot, 0, 0);
      }

      ctx.globalCompositeOperation = isEraseMode ? 'destination-out' : 'source-over';
      ctx.fillStyle = isEraseMode ? 'rgba(0,0,0,1)' : 'rgba(255,255,255,1)';

      if (points.length === 1) {
        const [x, y] = points[0];
        const r = brushSize / 2;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      } else {
        const stroke = getStroke(points, {
          size: brushSize,
          thinning: 0,
          smoothing: 0.6,
          streamline: 0.65,
          simulatePressure: true,
          last: false,
        });
        if (stroke.length >= 4) {
          const pathData = getSvgPathFromStroke(stroke);
          const path = new Path2D(pathData);
          ctx.fill(path);
        }
      }
      redrawBrushView();
    },
    [brushSize, isEraseMode, imageDimensions, redrawBrushView]
  );

  const scheduleStrokeDraw = useCallback(() => {
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      drawStrokeToMask(strokePointsRef.current);
    });
  }, [drawStrokeToMask]);

  const buildResultImage = useCallback(() => {
    const resultCanvas = resultCanvasRef.current;
    const maskCanvas = maskCanvasRef.current;
    if (!resultCanvas || !maskCanvas || !image) return;
    drawBrushOverlay(resultCanvas, maskCanvas, image);
  }, [image]);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!image || visualizationComplete) return;
      e.preventDefault();
      const point = getCanvasPoint(e.clientX, e.clientY);
      if (point) {
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
        setIsDrawing(true);
        const maskCanvas = maskCanvasRef.current;
        if (maskCanvas) {
          const ctx = maskCanvas.getContext('2d');
          if (ctx) {
            maskSnapshotRef.current = ctx.getImageData(0, 0, maskCanvas.width, maskCanvas.height);
          }
        }
        strokePointsRef.current = [[point.x, point.y, e.pressure || 0.5]];
        drawStrokeToMask(strokePointsRef.current);
      }
    },
    [image, visualizationComplete, getCanvasPoint, drawStrokeToMask]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (isDrawing) {
        const point = getCanvasPoint(e.clientX, e.clientY);
        if (point) {
          strokePointsRef.current.push([point.x, point.y, e.pressure || 0.5]);
          scheduleStrokeDraw();
        }
      }
    },
    [isDrawing, getCanvasPoint, scheduleStrokeDraw]
  );

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignore if capture was already released
    }
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    setIsDrawing(false);
    maskSnapshotRef.current = null;
    strokePointsRef.current = [];
    // Save progress after stroke completes (defer so mask is painted)
    setTimeout(() => saveCurrentProgress(), 0);
  }, [saveCurrentProgress]);

  const handlePointerLeave = useCallback((e: React.PointerEvent) => {
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignore if no capture
    }
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    setIsDrawing(false);
    maskSnapshotRef.current = null;
    strokePointsRef.current = [];
  }, []);

  const handlePointerCancel = useCallback((e: React.PointerEvent) => {
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignore
    }
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    setIsDrawing(false);
    maskSnapshotRef.current = null;
    strokePointsRef.current = [];
  }, []);

  const handleGenerateVisualization = useCallback(() => {
    clearProgress();
    setVisualizationComplete(true);
  }, []);

  const handleSliderPointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    setIsDraggingSlider(true);
  }, []);

  const handleEditSelection = useCallback(() => {
    setVisualizationComplete(false);
  }, []);

  const handleChangeImage = useCallback(() => {
    clearProgress();
    imageBase64Ref.current = null;
    setImage(null);
    setImageDimensions(null);
    setVisualizationComplete(false);
    setImageWarning(null);
  }, []);

  useEffect(() => {
    if (isDraggingSlider) {
      const handleMove = (e: PointerEvent) => {
        const container = sliderContainerRef.current;
        if (!container) return;
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
        setSliderPosition(percent);
      };
      const handleUp = () => setIsDraggingSlider(false);
      window.addEventListener('pointermove', handleMove);
      window.addEventListener('pointerup', handleUp);
      return () => {
        window.removeEventListener('pointermove', handleMove);
        window.removeEventListener('pointerup', handleUp);
      };
    }
  }, [isDraggingSlider]);

  useEffect(() => {
    const handleResize = () => setWindowSize({ w: window.innerWidth, h: window.innerHeight });
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const stored = loadProgress();
    if (!stored?.imageBase64) return;

    if (stored.selectedStoneId) {
      const stone = STONE_PRODUCTS.find((p) => p.id === stored.selectedStoneId);
      if (stone) setSelectedStone(stone);
    }
    setBrushSize(stored.brushSize ?? 30);
    setIsEraseMode(stored.isEraseMode ?? false);
    setSliderPosition(stored.sliderPosition ?? 50);

    if (stored.maskBase64 && stored.maskDimensions) {
      pendingMaskRestoreRef.current = {
        base64: stored.maskBase64,
        w: stored.maskDimensions.width,
        h: stored.maskDimensions.height,
      };
    }
    loadImageFromDataUrl(stored.imageBase64);
  }, [loadImageFromDataUrl]);

  useEffect(() => {
    if (!image || !imageDimensions) return;

    const canvas = canvasRef.current;
    const maskCanvas = maskCanvasRef.current;
    const resultCanvas = resultCanvasRef.current;
    if (!canvas || !maskCanvas) return;

    const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 1024;
    const sidebarWidth = isDesktop ? 384 : 0;
    const padding = typeof window !== 'undefined' && window.innerWidth < 640 ? 16 : 32;
    const maxWidth = typeof window !== 'undefined' ? Math.min(1200, window.innerWidth - sidebarWidth - padding) : 1200;
    const toolbarHeight = typeof window !== 'undefined' && window.innerWidth < 640 ? 64 : 52;
    const maxHeight = typeof window !== 'undefined' ? window.innerHeight - toolbarHeight - 32 : 800;

    let w = imageDimensions.width;
    let h = imageDimensions.height;
    if (w > maxWidth || h > maxHeight) {
      const ratio = Math.min(maxWidth / w, maxHeight / h);
      w = Math.floor(w * ratio);
      h = Math.floor(h * ratio);
    }

    canvas.width = w;
    canvas.height = h;
    maskCanvas.width = w;
    maskCanvas.height = h;
    if (resultCanvas) {
      resultCanvas.width = w;
      resultCanvas.height = h;
    }
    const beforeCanvas = beforeCanvasRef.current;
    if (beforeCanvas) {
      beforeCanvas.width = w;
      beforeCanvas.height = h;
      const beforeCtx = beforeCanvas.getContext('2d');
      if (beforeCtx) {
        beforeCtx.clearRect(0, 0, w, h);
        beforeCtx.drawImage(image, 0, 0, w, h);
      }
    }

    const maskCtx = maskCanvas.getContext('2d');
    if (maskCtx) {
      maskCtx.clearRect(0, 0, w, h);
      const pending = pendingMaskRestoreRef.current;
      if (pending && pending.w === w && pending.h === h) {
        pendingMaskRestoreRef.current = null;
        const maskImg = new Image();
        maskImg.onload = () => {
          maskCtx.drawImage(maskImg, 0, 0);
          redrawBrushView();
        };
        maskImg.src = pending.base64;
      }
    }

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(image, 0, 0, w, h);
    }
  }, [image, imageDimensions, windowSize, redrawBrushView]);

  useEffect(() => {
    if (visualizationComplete) {
      buildResultImage();
    }
  }, [visualizationComplete, buildResultImage]);

  useEffect(() => {
    if (!image || !imageDimensions || !imageBase64Ref.current || visualizationComplete) return;
    const id = setTimeout(saveCurrentProgress, 300);
    return () => clearTimeout(id);
  }, [image, imageDimensions, selectedStone, brushSize, isEraseMode, sliderPosition, visualizationComplete, saveCurrentProgress]);

  return (
    <div ref={containerRef} className="h-dvh min-h-screen overflow-hidden bg-stone-bg flex flex-col lg:flex-row safe-area-padding">
      <div className="flex-1 flex flex-col min-w-0 p-2 sm:p-3 lg:p-4 min-h-0 overflow-hidden">
        {!image ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-stone-heading/60 text-sm">
              Upload an image to get started
            </p>
          </div>
        ) : (
          <div className="flex flex-col flex-1 gap-0">
            <div className={visualizationComplete ? 'flex flex-col flex-1 min-h-0 overflow-hidden' : 'hidden'}>
              <BeforeAfterView
                beforeCanvasRef={beforeCanvasRef}
                resultCanvasRef={resultCanvasRef}
                sliderContainerRef={sliderContainerRef}
                imageDimensions={imageDimensions}
                sliderPosition={sliderPosition}
                onSliderPointerDown={handleSliderPointerDown}
                onEditSelection={handleEditSelection}
              />
            </div>

            <div className={visualizationComplete ? 'hidden' : 'flex flex-col flex-1 min-h-0 overflow-hidden'}>
              <BrushToolbar
                brushSize={brushSize}
                isEraseMode={isEraseMode}
                onBrushSizeChange={setBrushSize}
                onEraseModeChange={setIsEraseMode}
              />
              <BrushCanvas
                canvasRef={canvasRef}
                maskCanvasRef={maskCanvasRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerLeave}
                onPointerCancel={handlePointerCancel}
              />
            </div>
          </div>
        )}
      </div>

      <VisualizerSidebar
        onFileChange={handleFileChange}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onGenerateVisualization={handleGenerateVisualization}
        onChangeImage={handleChangeImage}
        onSelectStone={setSelectedStone}
        selectedStone={selectedStone}
        hasImage={!!image}
        visualizationComplete={visualizationComplete}
        error={error}
        imageWarning={imageWarning}
      />
    </div>
  );
}
