const STORAGE_KEY = 'stone-visualizer-progress';

export interface StoredProgress {
  imageBase64: string;
  imageDimensions: { width: number; height: number };
  maskBase64?: string;
  maskDimensions?: { width: number; height: number };
  selectedStoneId?: string;
  brushSize: number;
  isEraseMode: boolean;
  sliderPosition: number;
}

export function saveProgress(data: StoredProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    if (e instanceof DOMException && (e.name === 'QuotaExceededError' || e.code === 22)) {
      console.warn('Visualizer: localStorage quota exceeded, progress not saved');
    }
  }
}

export function loadProgress(): StoredProgress | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredProgress;
  } catch {
    return null;
  }
}

export function clearProgress(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore
  }
}
