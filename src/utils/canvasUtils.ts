/**
 * drawBrushOverlay.ts
 *
 * Composites a stone texture over a user-brushed region of a photo.
 *
 * This is a faithful refactor of the original v1 implementation that produced
 * the best visual output. The logic is preserved exactly — the only changes are:
 *
 *   1. All magic numbers extracted into OverlayConfig / DEFAULT_CONFIG
 *   2. Seam fix: each band's pattern is offset with setTransform so tile
 *      boundaries never align between adjacent bands (golden-ratio spacing)
 *   3. Each band tile is built at its exact required size — no downscaling
 *      from a large source, which was blurring small far-away stones
 *   4. Canvas pool to reduce GC pressure on repeated calls (material switching)
 *
 * What is deliberately NOT changed from v1:
 *   - Stones are drawn at full opacity (alpha 1.0) — no ghosting
 *   - contrast(1.3) brightness(0.9) filter on each band tile — this is what
 *     makes stones look crisp and not washed out, do not change
 *   - 10% multiply shadow pass — preserves scene lighting cues
 *   - 6 bands (bumped to 8 for smoother perspective, same technique)
 *   - featherRadius auto-calculated from canvas width
 *   - No rotation, no tint gradient, no AO pass — these all made it worse
 */

// ─── Config ───────────────────────────────────────────────────────────────────

export interface OverlayConfig {
  /**
   * Perspective scale range as a fraction of canvas width.
   * scaleFar  = tile size at the top (far, small stones).  Default 0.025
   * scaleNear = tile size at the bottom (near, large stones). Default 0.12
   * These match the original v1 values (0.025 and 0.12).
   */
  scaleFar: number;
  scaleNear: number;

  /**
   * Number of perspective bands. More = smoother gradient.
   * v1 used 6; 8 gives a slightly smoother perspective with minimal cost.
   */
  bandCount: number;

  /**
   * CSS filter applied to each band's pattern canvas before tiling.
   * v1 used 'contrast(1.3) brightness(0.9)' — this is what makes stones
   * look crisp. Do not reduce contrast or increase brightness.
   */
  tileFilter: string;

  /**
   * CSS filter applied to the final stone composite on the main canvas.
   * v1 used 'contrast(1.1) saturate(1.1)'.
   */
  compositeFilter: string;

  /**
   * Feather blur radius for the mask soft edge.
   * 'auto' = clamp(w * 0.006, 4, 12) — same formula as v1.
   */
  featherRadius: number | 'auto';

  /**
   * Shadow blend-through strength. v1 used 0.1.
   * 0 = no shadow bleed. Keep <= 0.12 or stones go dark/muddy.
   */
  shadowStrength: number;
}

export const DEFAULT_CONFIG: OverlayConfig = {
  scaleFar:        0.02,    // smaller stones
  scaleNear:       0.095,   // smaller stones
  bandCount:       8,       // v1 used 6, 8 is smoother
  tileFilter:      'contrast(1.3) brightness(0.9)',  // v1 original — keep this
  compositeFilter: 'contrast(1.1) saturate(1.1)',    // v1 original
  featherRadius:   'auto',  // v1 formula: clamp(w*0.006, 4, 12)
  shadowStrength:  0.1,     // v1 original
};

// ─── Canvas pool ──────────────────────────────────────────────────────────────
//
// drawBrushOverlay is called on every material switch and every brush stroke.
// Pooling canvases avoids repeated allocation/GC which causes jank on mobile.

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

/**
 * Composites a stone texture over a user-brushed region of a photo.
 *
 * @param targetCanvas  Visible output canvas
 * @param maskCanvas    Brush mask — white where stone should appear
 * @param image         User's property photo
 * @param textureImage  Selected stone texture (high-res, flat top-down shot)
 * @param config        Optional overrides — see DEFAULT_CONFIG
 */
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

  // ── Step 1: Soft-edge mask ────────────────────────────────────────────────
  //
  // Blur the hard brush mask so stone fill feathers into surrounding grass.
  // v1 formula: clamp(w * 0.006, 4, 12).
  const featherRadius =
    cfg.featherRadius === 'auto'
      ? Math.max(4, Math.min(12, Math.round(w * 0.006)))
      : cfg.featherRadius;

  const softMask    = acquire(w, h);
  const softMaskCtx = softMask.getContext('2d')!;
  softMaskCtx.filter = `blur(${featherRadius}px)`;
  softMaskCtx.drawImage(maskCanvas, 0, 0);
  softMaskCtx.filter = 'none';

  // ── Step 2: Perspective-banded texture layer ──────────────────────────────
  //
  // Render each band as a tiled pattern at the band's specific scale.
  // Each band tile is built at its exact required size — no resampling from
  // a larger canvas, which would blur the stones at small (far) sizes.
  //
  // Seam fix: use setTransform on each pattern to offset the tile origin by
  // a golden-ratio-derived amount. This prevents the tile grid from aligning
  // between adjacent bands, so the band boundary never coincides with a
  // tile edge.
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

    // Overlap: extend band into neighbors; band 1+ fades in at top over previous band
    const drawYTop = i > 0 ? yTop - overlapPx : yTop;
    const drawYBottom = i < cfg.bandCount - 1 ? yBottom + overlapPx : yBottom;
    const drawH = drawYBottom - drawYTop;

    const bandCanvas = acquire(w, drawH);
    const bandCtx = bandCanvas.getContext('2d')!;
    bandCtx.fillStyle = pattern;
    bandCtx.fillRect(0, 0, w, drawH);

    // Fade-in at top for bands 1+: transparent → opaque so we blend over previous band (no gaps)
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

  // Clip the stone layer to the soft mask (destination-in respects alpha)
  stoneCtx.globalCompositeOperation = 'destination-in';
  stoneCtx.drawImage(softMask, 0, 0);
  stoneCtx.globalCompositeOperation = 'source-over';

  // ── Step 3: Composite stone layer — full opacity, with filter ────────────
  //
  // Full alpha 1.0: stones fully cover the photo. No ghosting.
  // The composite filter matches v1: contrast(1.1) saturate(1.1).
  ctx.globalAlpha              = 1;
  ctx.globalCompositeOperation = 'source-over';
  ctx.filter                   = cfg.compositeFilter;
  ctx.drawImage(stoneCanvas, 0, 0);
  ctx.filter                   = 'none';
  release(stoneCanvas);

  // ── Step 4: Shadow blend-through ─────────────────────────────────────────
  //
  // Multiply the original photo at low opacity inside the masked area.
  // Preserves scene shadows (driveway cracks, tree shade) so stones look
  // grounded in the scene. v1 used 10% — keep at or below 12%.
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

  // Always restore clean state before returning
  ctx.globalAlpha              = 1;
  ctx.globalCompositeOperation = 'source-over';

  release(softMask);
}