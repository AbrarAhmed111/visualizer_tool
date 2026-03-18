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
  isGenerating?: boolean;
  isTextureLoading?: boolean;
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
  isGenerating = false,
  isTextureLoading = false,
  error,
  imageWarning,
}: VisualizerSidebarProps) {
  if (visualizationComplete) {
    return (
      <aside className="w-full lg:w-[420px] xl:w-[480px] flex-shrink-0 lg:flex-1 lg:min-h-0 border-t lg:border-t-0 lg:border-r border-stone-light/30 bg-white flex flex-col min-h-0 lg:overflow-hidden">
        <div className="scrollbar-thin flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-6 flex flex-col gap-4">
          <Image src="/logo.png" alt="Logo" width={120} height={40} className="h-48 w-auto object-contain" />
          <h2 className="text-lg font-semibold text-stone-heading uppercase tracking-wide">
            Your visualization
          </h2>
          <StoneSelection selectedStone={selectedStone} onSelectStone={onSelectStone} disabled={isTextureLoading} />
          {isTextureLoading && (
            <p className="text-sm text-stone-heading/70 flex items-center gap-2">
              <span className="inline-block w-4 h-4 border-2 border-stone-light/40 border-t-stone-dark rounded-full animate-spin" />
              Applying stone...
            </p>
          )}
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
        

<UploadSection
        onFileChange={onFileChange}
        onDrop={onDrop}
        onDragOver={onDragOver}
        imagePreviewUrl={imagePreviewUrl}
      />

        {hasImage && (
          <>
            <StoneSelection selectedStone={selectedStone} onSelectStone={onSelectStone} disabled={false} />
            
          </>
        )}

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
            <p className="text-amber-600 text-sm">Paint the area and select a stone to enable</p>
          )}
          <button
            type="button"
            onClick={onGenerateVisualization}
            disabled={!hasMask || !selectedStone || isGenerating}
            className="w-full px-4 py-2.5 rounded-lg bg-stone-dark text-white hover:bg-stone-dark/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium flex items-center justify-center gap-2 min-h-[44px]"
          >
            {isGenerating ? (
              <>
                <span className="inline-block w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Generating...
              </>
            ) : (
              'Generate Visualization'
            )}
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
