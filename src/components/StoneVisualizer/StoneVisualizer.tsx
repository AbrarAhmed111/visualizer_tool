'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import type { StoneProduct } from '@/constants/stoneProducts';
import { MIN_IMAGE_WIDTH, RECOMMENDED_IMAGE_WIDTH } from '@/constants/visualizer';
import { drawBrushOverlay } from '@/utils/canvasUtils';
import { Paintbrush } from 'lucide-react';
import BrushToolbar from './BrushToolbar';
import BrushCanvas from './BrushCanvas';
import ScrollDownIndicator from './ScrollDownIndicator';
import BeforeAfterView from './BeforeAfterView';
import VisualizerSidebar from './VisualizerSidebar';

export default function StoneVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const maskCanvasRef = useRef<HTMLCanvasElement>(null);
  const resultCanvasRef = useRef<HTMLCanvasElement>(null);
  const beforeCanvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const sliderContainerRef = useRef<HTMLDivElement>(null);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);

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
  const [hasMask, setHasMask] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const hasScrolledDownRef = useRef(false);
  const [textureImage, setTextureImage] = useState<HTMLImageElement | null>(null);
  const [isTextureLoading, setIsTextureLoading] = useState(false);

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

    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      if (img.width < MIN_IMAGE_WIDTH) {
        URL.revokeObjectURL(objectUrl);
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
      setHasMask(false);
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      setError('Failed to load image. Please try a different file.');
    };
    img.src = objectUrl;
  }, []);

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

  // Load texture when stone is selected - enables material switching with loading state
  useEffect(() => {
    if (!selectedStone?.textureUrl) {
      setTextureImage(null);
      setIsTextureLoading(false);
      return;
    }
    setIsTextureLoading(true);
    const img = new Image();
    const url = selectedStone.textureUrl;
    const minLoadMs = 400; // Ensure loading is visible even when cached
    const start = Date.now();
    img.onload = () => {
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, minLoadMs - elapsed);
      setTimeout(() => {
        setTextureImage(img);
        setIsTextureLoading(false);
      }, remaining);
    };
    img.onerror = () => {
      setTextureImage(null);
      setIsTextureLoading(false);
    };
    img.src = url;
  }, [selectedStone?.textureUrl]);

  const getCanvasPoint = useCallback((clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas || !containerRef.current) return null;
    const rect = canvas.getBoundingClientRect();
    const cw = canvas.width;
    const ch = canvas.height;
    // Account for object-fit: contain - image may have letterboxing
    const scale = Math.min(rect.width / cw, rect.height / ch);
    const displayedWidth = cw * scale;
    const displayedHeight = ch * scale;
    const offsetX = (rect.width - displayedWidth) / 2;
    const offsetY = (rect.height - displayedHeight) / 2;
    const relX = clientX - rect.left - offsetX;
    const relY = clientY - rect.top - offsetY;
    const x = Math.floor((relX / displayedWidth) * cw);
    const y = Math.floor((relY / displayedHeight) * ch);
    // Clamp to canvas bounds (clicks in letterbox area)
    return {
      x: Math.max(0, Math.min(cw - 1, x)),
      y: Math.max(0, Math.min(ch - 1, y)),
    };
  }, []);

  const redrawBrushView = useCallback(() => {
    const canvas = canvasRef.current;
    const maskCanvas = maskCanvasRef.current;
    if (!canvas || !maskCanvas || !image) return;
    // Brush phase: gray overlay only. Stone texture appears only after Generate.
    drawBrushOverlay(canvas, maskCanvas, image, null);
  }, [image]);

  const drawBrushStroke = useCallback(
    (x: number, y: number) => {
      const maskCanvas = maskCanvasRef.current;
      const canvas = canvasRef.current;
      if (!maskCanvas || !canvas || !imageDimensions) return;

      const ctx = maskCanvas.getContext('2d');
      if (!ctx) return;

      const radius = brushSize / 2;
      ctx.globalCompositeOperation = isEraseMode ? 'destination-out' : 'source-over';
      ctx.fillStyle = isEraseMode ? 'rgba(0,0,0,1)' : 'rgba(255,255,255,1)';

      const last = lastPointRef.current;
      if (last) {
        const dist = Math.hypot(x - last.x, y - last.y);
        const steps = Math.max(1, Math.ceil(dist / (radius * 0.5)));
        for (let i = 1; i <= steps; i++) {
          const t = i / steps;
          const px = last.x + (x - last.x) * t;
          const py = last.y + (y - last.y) * t;
          ctx.beginPath();
          ctx.arc(px, py, radius, 0, Math.PI * 2);
          ctx.fill();
        }
      } else {
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
      lastPointRef.current = { x, y };
      setHasMask(true);
      redrawBrushView();
    },
    [brushSize, isEraseMode, imageDimensions, redrawBrushView]
  );

  const buildResultImage = useCallback(() => {
    const resultCanvas = resultCanvasRef.current;
    const maskCanvas = maskCanvasRef.current;
    if (!resultCanvas || !maskCanvas || !image) return;
    drawBrushOverlay(resultCanvas, maskCanvas, image, textureImage);
  }, [image, textureImage]);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!image || visualizationComplete) return;
      const point = getCanvasPoint(e.clientX, e.clientY);
      if (point) {
        setIsDrawing(true);
        drawBrushStroke(point.x, point.y);
      }
    },
    [image, visualizationComplete, getCanvasPoint, drawBrushStroke]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (isDrawing) {
        const point = getCanvasPoint(e.clientX, e.clientY);
        if (point) drawBrushStroke(point.x, point.y);
      }
    },
    [isDrawing, getCanvasPoint, drawBrushStroke]
  );

  const handlePointerUp = useCallback(() => {
    setIsDrawing(false);
    lastPointRef.current = null;
  }, []);

  const handlePointerLeave = useCallback(() => {
    setIsDrawing(false);
    lastPointRef.current = null;
  }, []);

  const handleBrushDown = useCallback(
    (clientX: number, clientY: number) => {
      if (!image || visualizationComplete) return;
      const point = getCanvasPoint(clientX, clientY);
      if (point) {
        setIsDrawing(true);
        drawBrushStroke(point.x, point.y);
      }
    },
    [image, visualizationComplete, getCanvasPoint, drawBrushStroke]
  );

  const handleBrushMove = useCallback(
    (clientX: number, clientY: number) => {
      const point = getCanvasPoint(clientX, clientY);
      if (point) drawBrushStroke(point.x, point.y);
    },
    [getCanvasPoint, drawBrushStroke]
  );

  const handleGenerateVisualization = useCallback(() => {
    setIsGenerating(true);
  }, []);

  // Loading animation: after delay, reveal result (keeps user's selected stone)
  useEffect(() => {
    if (!isGenerating) return;
    const timer = setTimeout(() => {
      setVisualizationComplete(true);
      setIsGenerating(false);
    }, 1800);
    return () => clearTimeout(timer);
  }, [isGenerating]);

  const handleSliderPointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    setIsDraggingSlider(true);
  }, []);

  const handleEditSelection = useCallback(() => {
    setVisualizationComplete(false);
  }, []);

  const handleChangeImage = useCallback(() => {
    setImage(null);
    setImageDimensions(null);
    setVisualizationComplete(false);
    setImageWarning(null);
    setHasMask(false);
  }, []);

  const handleDownload = useCallback(() => {
    const canvas = resultCanvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'stone-visualization.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  }, []);

  const handleRestart = useCallback(() => {
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
    if (!image || !imageDimensions) return;

    const canvas = canvasRef.current;
    const maskCanvas = maskCanvasRef.current;
    const resultCanvas = resultCanvasRef.current;
    if (!canvas || !maskCanvas) return;

    const sidebarWidth = typeof window !== 'undefined' && window.innerWidth >= 1024 ? 480 : 0;
    const maxWidth = typeof window !== 'undefined' ? window.innerWidth - sidebarWidth - 32 : 1200;
    const maxHeight = typeof window !== 'undefined' ? Math.floor(window.innerHeight * 0.8) : 800;

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
    if (maskCtx) maskCtx.clearRect(0, 0, w, h);

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(image, 0, 0, w, h);
    }
  }, [image, imageDimensions]);

  useEffect(() => {
    if (visualizationComplete) {
      buildResultImage();
    }
  }, [visualizationComplete, buildResultImage]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (hasScrolledDownRef.current) return;
      if (container.scrollTop >= 80) {
        hasScrolledDownRef.current = true;
        setShowScrollIndicator(false);
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div ref={containerRef} className="h-screen overflow-hidden max-lg:overflow-y-auto max-lg:min-h-[100dvh] bg-stone-bg flex flex-col lg:flex-row">
      <div className="max-lg:order-2 flex-shrink-0 w-full lg:w-auto lg:h-full lg:flex lg:flex-col lg:min-h-0 lg:overflow-hidden">
      <VisualizerSidebar
        onFileChange={handleFileChange}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onGenerateVisualization={handleGenerateVisualization}
        onChangeImage={handleChangeImage}
        onDownload={handleDownload}
        onRestart={handleRestart}
        onSelectStone={setSelectedStone}
        selectedStone={selectedStone}
        hasImage={!!image}
        imagePreviewUrl={image?.src}
        hasMask={hasMask}
        visualizationComplete={visualizationComplete}
        isGenerating={isGenerating}
        isTextureLoading={isTextureLoading}
        error={error}
        imageWarning={imageWarning}
      />
      </div>
      <div className="max-lg:order-1 flex-1 flex flex-col min-w-0 p-2 max-lg:p-1.5 min-h-0 overflow-hidden max-lg:min-h-[50vh]">
        {!image ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-stone-heading/60 text-sm">
              Upload an image to get started
            </p>
          </div>
        ) : (
          <div className="flex flex-col flex-1 gap-0">
            <div className={visualizationComplete ? 'flex flex-col flex-1 min-h-0 overflow-hidden relative' : 'hidden'}>
              {isTextureLoading && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-stone-bg/95 backdrop-blur-sm rounded-xl">
                  <div className="w-10 h-10 border-2 border-stone-light/40 border-t-stone-dark rounded-full animate-spin" />
                  <p className="mt-3 text-stone-heading text-sm font-medium">Applying stone...</p>
                </div>
              )}
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

            <div className={visualizationComplete ? 'hidden' : 'flex flex-col flex-1 min-h-0 overflow-hidden relative'}>
              {isGenerating && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-stone-bg/95 backdrop-blur-sm rounded-xl">
                  <div className="w-12 h-12 border-4 border-stone-light/40 border-t-stone-dark rounded-full animate-spin" />
                  <p className="mt-4 text-stone-heading font-medium">Generating your visualization...</p>
                  <p className="mt-1 text-sm text-stone-heading/60">Choosing your stone</p>
                </div>
              )}
              <BrushToolbar
                brushSize={brushSize}
                isEraseMode={isEraseMode}
                onBrushSizeChange={setBrushSize}
                onEraseModeChange={setIsEraseMode}
              />
              <div className="flex-1 relative min-h-0 flex flex-col">
                {!hasMask && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
                    <div className="rounded-xl bg-stone-dark/90 text-white px-5 py-4 shadow-lg max-w-[280px] mx-4 animate-fade-in">
                      <p className="text-sm font-semibold text-center">
                        Paint over the area where you want stone
                      </p>
                      <p className="text-xs text-white/80 text-center mt-1">
                        Use the brush to mark driveways, patios, or walkways
                      </p>
                      <div className="flex justify-center mt-3">
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border-2 border-white/50 bg-white/10">
                          <Paintbrush className="w-5 h-5 text-white" />
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                <BrushCanvas
                canvasRef={canvasRef}
                maskCanvasRef={maskCanvasRef}
                imageDimensions={imageDimensions}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerLeave}
                onBrushDown={handleBrushDown}
                onBrushMove={handleBrushMove}
                onBrushUp={handlePointerUp}
              />
              </div>
            </div>
          </div>
        )}
      </div>
      <ScrollDownIndicator visible={showScrollIndicator} />
    </div>
  );
}
