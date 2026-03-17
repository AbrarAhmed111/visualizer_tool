import { BRUSH_OVERLAY_COLOR } from '@/constants/visualizer';

export function drawBrushOverlay(
  targetCanvas: HTMLCanvasElement,
  maskCanvas: HTMLCanvasElement,
  image: HTMLImageElement
) {
  const ctx = targetCanvas.getContext('2d');
  if (!ctx) return;

  const w = targetCanvas.width;
  const h = targetCanvas.height;

  ctx.clearRect(0, 0, w, h);
  ctx.drawImage(image, 0, 0, w, h);

  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = w;
  tempCanvas.height = h;
  const tempCtx = tempCanvas.getContext('2d');
  if (!tempCtx) return;

  tempCtx.fillStyle = BRUSH_OVERLAY_COLOR;
  tempCtx.fillRect(0, 0, w, h);
  tempCtx.globalCompositeOperation = 'destination-in';
  tempCtx.drawImage(maskCanvas, 0, 0);

  ctx.globalCompositeOperation = 'source-over';
  ctx.globalAlpha = 1;
  ctx.drawImage(tempCanvas, 0, 0);
}
