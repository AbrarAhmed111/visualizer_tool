'use client';

import Image from 'next/image';
import { Download } from 'lucide-react';
import type { StoneProduct } from '@/constants/stoneProducts';
import UploadSection from './UploadSection';
import StoneSelection from './StoneSelection';

interface VisualizerSidebarProps {
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDrop: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onGenerateVisualization: () => void;
  onChangeImage: () => void;
  onDownload: () => void;
  onRestart: () => void;
  onSelectStone: (stone: StoneProduct) => void;
  selectedStone: StoneProduct | null;
  hasImage: boolean;
  imagePreviewUrl?: string;
  hasMask: boolean;
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
  onDownload,
  onRestart,
  onSelectStone,
  selectedStone,
  hasImage,
  imagePreviewUrl,
  hasMask,
  visualizationComplete,
  error,
  imageWarning,
}: VisualizerSidebarProps) {
  if (visualizationComplete) {
    return (
      <aside className="w-full lg:w-[420px] xl:w-[480px] flex-shrink-0 lg:flex-1 lg:min-h-0 border-t lg:border-t-0 lg:border-r border-stone-light/30 bg-white flex flex-col min-h-0 lg:overflow-hidden">
        <div className="scrollbar-thin items-center justify-center flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-6 flex flex-col gap-4">
          <Image src="/logo.png" alt="Logo" width={120} height={40} className="h-48 w-auto object-contain" />
          <h2 className="text-lg font-semibold text-stone-heading uppercase tracking-wide">
            Your visualization
          </h2>
        </div>
        <div className="flex-shrink-0 p-4 max-lg:p-3 pt-3 border-t border-stone-light/30 bg-white flex flex-col gap-2">
          <button
            type="button"
            onClick={onDownload}
            className="w-full px-4 py-2.5 rounded-lg bg-stone-dark text-white hover:bg-stone-dark/90 transition-colors text-sm font-medium flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download
          </button>
          <button
            type="button"
            onClick={onRestart}
            className="w-full px-4 py-2.5 rounded-lg bg-stone-light/30 text-stone-heading hover:bg-stone-light/40 transition-colors text-sm font-medium"
          >
            Restart
          </button>
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-full lg:w-[420px] xl:w-[480px] flex-shrink-0 lg:flex-1 lg:min-h-0 border-t lg:border-t-0 lg:border-r border-stone-light/30 bg-white flex flex-col min-h-0 lg:overflow-hidden">
      <div className="scrollbar-thin flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-6 max-lg:p-4 flex flex-col gap-4 max-lg:gap-4">
        <Image src="/logo.png" alt="Logo" width={120} height={40} className="h-36 w-auto object-contain" />
        <h2 className="text-lg font-semibold text-stone-heading uppercase tracking-wide">
          Upload your space
        </h2>

<UploadSection
        onFileChange={onFileChange}
        onDrop={onDrop}
        onDragOver={onDragOver}
        imagePreviewUrl={imagePreviewUrl}
      />

        {hasImage && (
          <div className="rounded-xl bg-stone-dark/5 border border-stone-dark/10 p-4 animate-fade-in">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-stone-dark text-white text-sm font-bold">
                1
              </span>
              <p className="text-sm font-semibold text-stone-heading">
                Select the area where you want stone
              </p>
            </div>
            <p className="text-xs text-stone-heading/70 mt-2 ml-9">
              Use the brush tool on your image to paint over driveways, patios, or walkways.
            </p>
          </div>
        )}

        <StoneSelection selectedStone={selectedStone} onSelectStone={onSelectStone} disabled={!hasImage} />

        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}

        {imageWarning && (
          <p className="text-amber-600 text-sm">{imageWarning}</p>
        )}
      </div>

      {hasImage && (
        <div className="flex-shrink-0 p-4 max-lg:p-3 pt-3 border-t border-stone-light/30 bg-white flex flex-col gap-2">
          {!hasMask && (
            <p className="text-amber-600 text-sm flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500/20 text-amber-600 text-xs font-bold">!</span>
              Paint the area on your image first, then generate
            </p>
          )}
          <button
            type="button"
            onClick={onGenerateVisualization}
            disabled={!selectedStone || !hasMask}
            className="w-full px-4 py-2.5 rounded-lg bg-stone-dark text-white hover:bg-stone-dark/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
          >
            Generate Visualization
          </button>
          <button
            type="button"
            onClick={onChangeImage}
            className="w-full px-4 py-2.5 rounded-lg bg-stone-light/30 text-stone-heading hover:bg-stone-light/40 transition-colors text-sm font-medium"
          >
            Change image
          </button>
        </div>
      )}
    </aside>
  );
}
