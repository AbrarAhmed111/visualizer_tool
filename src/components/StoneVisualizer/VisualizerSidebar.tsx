'use client';

import type { StoneProduct } from '@/constants/stoneProducts';
import UploadSection from './UploadSection';
import StoneSelection from './StoneSelection';

interface VisualizerSidebarProps {
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDrop: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onGenerateVisualization: () => void;
  onChangeImage: () => void;
  onSelectStone: (stone: StoneProduct) => void;
  selectedStone: StoneProduct | null;
  hasImage: boolean;
  visualizationComplete: boolean;
  error: string | null;
  imageWarning: string | null;
}

export default function VisualizerSidebar({
  onFileChange,
  onDrop,
  onDragOver,
  onGenerateVisualization,
  onChangeImage,
  onSelectStone,
  selectedStone,
  hasImage,
  visualizationComplete,
  error,
  imageWarning,
}: VisualizerSidebarProps) {
  return (
    <aside className="w-full lg:w-80 xl:w-96 flex-shrink-0 border-t lg:border-t-0 lg:border-l border-stone-light/30 bg-white p-4 sm:p-6 flex flex-col gap-4 sm:gap-6 overflow-y-auto max-h-[50vh] lg:max-h-none">
      <h2 className="text-lg font-semibold text-stone-heading uppercase tracking-wide">
        Upload your space
      </h2>

      <UploadSection
        onFileChange={onFileChange}
        onDrop={onDrop}
        onDragOver={onDragOver}
      />

      {hasImage && (
        <StoneSelection selectedStone={selectedStone} onSelectStone={onSelectStone} />
      )}

      {hasImage && !visualizationComplete && (
        <button
          type="button"
          onClick={onGenerateVisualization}
          disabled={!selectedStone}
          className="w-full px-4 py-2.5 rounded-lg bg-stone-dark text-white hover:bg-stone-dark/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
        >
          Generate Visualization
        </button>
      )}

      {hasImage && (
        <button
          type="button"
          onClick={onChangeImage}
          className="w-full px-4 py-2.5 rounded-lg bg-stone-light/30 text-stone-heading hover:bg-stone-light/40 transition-colors text-sm font-medium"
        >
          Change image
        </button>
      )}

      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}

      {imageWarning && (
        <p className="text-amber-600 text-sm">{imageWarning}</p>
      )}
    </aside>
  );
}
