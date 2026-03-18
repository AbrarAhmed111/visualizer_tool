'use client';

import { useRef } from 'react';
import { Upload } from 'lucide-react';

interface UploadSectionProps {
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDrop: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
}

export default function UploadSection({ onFileChange, onDrop, onDragOver }: UploadSectionProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
      onDrop={onDrop}
      onDragOver={onDragOver}
      className="border-2 border-dashed border-stone-light/50 rounded-xl p-4 sm:p-6 lg:p-8 text-center hover:border-stone-dark/50 transition-colors cursor-pointer bg-stone-bg/50 touch-manipulation"
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/*"
        onChange={onFileChange}
        className="sr-only"
      />
      <Upload className="w-10 h-10 sm:w-12 sm:h-12 mx-auto text-stone-dark mb-2 sm:mb-3" />
      <p className="text-xs sm:text-sm font-medium text-stone-heading mb-0.5 sm:mb-1">
        Drag or Click to Upload
      </p>
      <p className="text-[10px] sm:text-xs text-stone-light">
        JPG, PNG • Min. 800px wide (1200px+ recommended)
      </p>
    </div>
  );
}
