/**
 * Draws the base image with stone texture overlay in masked areas.
 * Texture tiles seamlessly and scales proportionally within the mask.
 */
export function drawBrushOverlay(
  targetCanvas: HTMLCanvasElement,
  maskCanvas: HTMLCanvasElement,
  image: HTMLImageElement,
  textureImage: HTMLImageElement | null
) {
  const ctx = targetCanvas.getContext('2d');
  if (!ctx) return;

  const w = targetCanvas.width;
  const h = targetCanvas.height;

  ctx.clearRect(0, 0, w, h);
  ctx.drawImage(image, 0, 0, w, h);

  // Fallback: use subtle overlay when no texture (e.g. no stone selected)
  if (!textureImage || textureImage.width === 0 || textureImage.height === 0) {
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = w;
    tempCanvas.height = h;
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return;
    tempCtx.fillStyle = 'rgba(100, 100, 100, 0.4)';
    tempCtx.fillRect(0, 0, w, h);
    tempCtx.globalCompositeOperation = 'destination-in';
    tempCtx.drawImage(maskCanvas, 0, 0);
    ctx.globalCompositeOperation = 'source-over';
    ctx.drawImage(tempCanvas, 0, 0);
    return;
  }

  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = w;
  tempCanvas.height = h;
  const tempCtx = tempCanvas.getContext('2d');
  if (!tempCtx) return;

  // Scale texture to smaller repeat size so stones appear realistic (not oversized)
  const patternSize = 120;
  const patternCanvas = document.createElement('canvas');
  patternCanvas.width = patternSize;
  patternCanvas.height = patternSize;
  const patternCtx = patternCanvas.getContext('2d');
  if (!patternCtx) return;
  patternCtx.drawImage(textureImage, 0, 0, patternSize, patternSize);

  const pattern = tempCtx.createPattern(patternCanvas, 'repeat');
  if (!pattern) return;

  tempCtx.fillStyle = pattern;
  tempCtx.fillRect(0, 0, w, h);
  tempCtx.globalCompositeOperation = 'destination-in';
  tempCtx.drawImage(maskCanvas, 0, 0);

  ctx.globalCompositeOperation = 'source-over';
  ctx.globalAlpha = 1;
  ctx.drawImage(tempCanvas, 0, 0);
}
