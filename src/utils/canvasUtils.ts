/** Composites a stone texture over a user-brushed region using banded perspective and configurable edge blending. */

// ─── Config ───────────────────────────────────────────────────────────────────

export type EdgeMode = 'soft' | 'hard';

export interface OverlayConfig {
  scaleFar: number;
  scaleNear: number;
  bandCount: number;
  tileFilter: string;
  compositeFilter: string;
  featherRadius: number | 'auto';
  shadowStrength: number;
  /** 'soft' = tight blurred mask (natural boundary, minimal bleed into grass). 'hard' = blur then clip to brush (no outside bleed). */
  edgeMode: EdgeMode;
}

export const DEFAULT_CONFIG: OverlayConfig = {
  scaleFar:        0.02,
  scaleNear:       0.095,
  bandCount:       8,
  tileFilter:      'contrast(1.3) brightness(0.9)',
  compositeFilter: 'contrast(1.1) saturate(1.1)',
  featherRadius:   'auto',
  shadowStrength:  0.1,
  edgeMode:        'soft',
};

// ─── Canvas pool ──────────────────────────────────────────────────────────────

const _pool: HTMLCanvasElement[] = [];

function acquire(w: number, h: number): HTMLCanvasElement {
  const c = _pool.pop() ?? document.createElement('canvas');
  c.width  = w;
  c.height = h;
  return c;
}

function release(...canvases: HTMLCanvasElement[]): void {
  for (const c of canvases) {
    const ctx = c.getContext('2d');
    if (ctx) ctx.clearRect(0, 0, c.width, c.height);
    _pool.push(c);
  }
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function drawBrushOverlay(
  targetCanvas: HTMLCanvasElement,
  maskCanvas: HTMLCanvasElement,
  image: HTMLImageElement,
  textureImage: HTMLImageElement | null,
  config: Partial<OverlayConfig> = {},
): void {
  const ctx = targetCanvas.getContext('2d');
  if (!ctx) return;

  const cfg = { ...DEFAULT_CONFIG, ...config };
  const w   = targetCanvas.width;
  const h   = targetCanvas.height;

  ctx.clearRect(0, 0, w, h);
  ctx.drawImage(image, 0, 0, w, h);

  // ── No texture selected: show neutral brush indicator ────────────────────
  if (!textureImage || textureImage.width === 0 || textureImage.height === 0) {
    const fb    = acquire(w, h);
    const fbCtx = fb.getContext('2d')!;
    fbCtx.fillStyle = 'rgba(100,100,100,0.4)';
    fbCtx.fillRect(0, 0, w, h);
    fbCtx.globalCompositeOperation = 'destination-in';
    fbCtx.drawImage(maskCanvas, 0, 0);
    fbCtx.globalCompositeOperation = 'source-over';
    ctx.globalCompositeOperation   = 'source-over';
    ctx.drawImage(fb, 0, 0);
    release(fb);
    return;
  }

  // ── Step 1: Mask edge (soft vs hard) ───────────────────────────────────────
  const autoFeatherHard = Math.max(4, Math.min(12, Math.round(w * 0.006)));
  // Soft: narrow transition only — crisp stones, boundary fades without a wide blurry halo into grass
  const autoFeatherSoft = Math.max(2, Math.min(5, Math.round(w * 0.0032)));

  const featherRadius =
    cfg.featherRadius === 'auto'
      ? cfg.edgeMode === 'soft'
        ? autoFeatherSoft
        : autoFeatherHard
      : cfg.edgeMode === 'soft'
        ? Math.max(2, Math.min(5, Math.round(cfg.featherRadius * 0.5)))
        : cfg.featherRadius;

  const softMask    = acquire(w, h);
  const softMaskCtx = softMask.getContext('2d')!;

  if (cfg.edgeMode === 'soft') {
    // Soft edges: light blur on mask — short feather, stones stay sharp away from the edge
    softMaskCtx.filter = `blur(${featherRadius}px)`;
    softMaskCtx.drawImage(maskCanvas, 0, 0);
    softMaskCtx.filter = 'none';
  } else {
    // Hard edges: blur then clip to hard boundary (feather stays inside brush only)
    const hardMask    = acquire(w, h);
    const hardMaskCtx = hardMask.getContext('2d')!;
    hardMaskCtx.drawImage(maskCanvas, 0, 0);

    softMaskCtx.filter = `blur(${featherRadius}px)`;
    softMaskCtx.drawImage(hardMask, 0, 0);
    softMaskCtx.filter = 'none';

    softMaskCtx.globalCompositeOperation = 'destination-in';
    softMaskCtx.drawImage(hardMask, 0, 0);
    softMaskCtx.globalCompositeOperation = 'source-over';

    release(hardMask);
  }

  // ── Step 2: Perspective-banded texture layer ──────────────────────────────
  const sw = textureImage.naturalWidth || textureImage.width;
  const sh = textureImage.naturalHeight || textureImage.height;
  const cropSize = Math.min(sw, sh);
  const cropX = Math.round((sw - cropSize) / 2);
  const cropY = Math.round((sh - cropSize) / 2);

  const stoneCanvas = acquire(w, h);
  const stoneCtx = stoneCanvas.getContext('2d')!;
  stoneCtx.clearRect(0, 0, w, h);

  const phi = 1.6180339887;
  const overlapFrac = 0.2;

  for (let i = 0; i < cfg.bandCount; i++) {
    const t0 = i / cfg.bandCount;
    const t1 = (i + 1) / cfg.bandCount;

    const scale = cfg.scaleFar + (cfg.scaleNear - cfg.scaleFar) * (i / Math.max(1, cfg.bandCount - 1));
    const patternSize = Math.max(24, cropSize * scale);

    const tileSize = 4;
    const megaSize = patternSize * 2;
    const tile = acquire(megaSize, megaSize);
    const tileCtx = tile.getContext('2d')!;
    tileCtx.imageSmoothingEnabled = true;
    tileCtx.imageSmoothingQuality = 'high';
    tileCtx.filter = cfg.tileFilter;
    for (let row = 0; row < tileSize; row++) {
      for (let col = 0; col < tileSize; col++) {
        tileCtx.drawImage(textureImage, cropX, cropY, cropSize, cropSize, col * patternSize, row * patternSize, patternSize, patternSize);
      }
    }
    tileCtx.filter = 'none';

    const pattern = stoneCtx.createPattern(tile, 'repeat');
    if (!pattern) { release(tile); continue; }

    const dx = (i * phi * megaSize) % megaSize;
    const dy = (i * phi * megaSize * 0.7) % megaSize;
    const mat = new DOMMatrix();
    mat.translateSelf(dx, dy);
    pattern.setTransform(mat);

    const yTop = Math.round(t0 * h);
    const yBottom = Math.round(t1 * h);
    const bandH = yBottom - yTop;
    const overlapPx = Math.max(6, Math.round(bandH * overlapFrac));

    const drawYTop = i > 0 ? yTop - overlapPx : yTop;
    const drawYBottom = i < cfg.bandCount - 1 ? yBottom + overlapPx : yBottom;
    const drawH = drawYBottom - drawYTop;

    const bandCanvas = acquire(w, drawH);
    const bandCtx = bandCanvas.getContext('2d')!;
    bandCtx.fillStyle = pattern;
    bandCtx.fillRect(0, 0, w, drawH);

    if (i > 0 && overlapPx < drawH) {
      const grad = bandCtx.createLinearGradient(0, 0, 0, drawH);
      grad.addColorStop(0, 'rgba(0,0,0,0)');
      grad.addColorStop(overlapPx / drawH, 'rgba(0,0,0,1)');
      grad.addColorStop(1, 'rgba(0,0,0,1)');
      bandCtx.globalCompositeOperation = 'destination-in';
      bandCtx.fillStyle = grad;
      bandCtx.fillRect(0, 0, w, drawH);
      bandCtx.globalCompositeOperation = 'source-over';
    }

    stoneCtx.drawImage(bandCanvas, 0, drawYTop);
    release(tile, bandCanvas);
  }

  // Clip stone layer to soft mask
  stoneCtx.globalCompositeOperation = 'destination-in';
  stoneCtx.drawImage(softMask, 0, 0);
  stoneCtx.globalCompositeOperation = 'source-over';

  // ── Step 3: Composite stone layer — full opacity, with filter ────────────
  ctx.globalAlpha              = 1;
  ctx.globalCompositeOperation = 'source-over';
  ctx.filter                   = cfg.compositeFilter;
  ctx.drawImage(stoneCanvas, 0, 0);
  ctx.filter                   = 'none';
  release(stoneCanvas);

  // ── Step 4: Shadow blend-through ─────────────────────────────────────────
  if (cfg.shadowStrength > 0) {
    const shadow    = acquire(w, h);
    const shadowCtx = shadow.getContext('2d')!;
    shadowCtx.drawImage(image, 0, 0, w, h);
    shadowCtx.globalCompositeOperation = 'destination-in';
    shadowCtx.drawImage(softMask, 0, 0);
    shadowCtx.globalCompositeOperation = 'source-over';

    ctx.globalAlpha              = cfg.shadowStrength;
    ctx.globalCompositeOperation = 'multiply';
    ctx.drawImage(shadow, 0, 0);
    ctx.globalAlpha              = 1;
    ctx.globalCompositeOperation = 'source-over';
    release(shadow);
  }

  ctx.globalAlpha              = 1;
  ctx.globalCompositeOperation = 'source-over';

  release(softMask);
}
