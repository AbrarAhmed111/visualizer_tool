'use client';

import { useRef } from 'react';
import { Upload } from 'lucide-react';

interface UploadSectionProps {
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDrop: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  imagePreviewUrl?: string;
}

export default function UploadSection({ onFileChange, onDrop, onDragOver, imagePreviewUrl }: UploadSectionProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  if (imagePreviewUrl) {
    return (
      <div
        role="button"
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={(e) => e.key === 'Enter' && handleClick()}
        onDrop={onDrop}
        onDragOver={onDragOver}
        className="border-2 border-dashed border-stone-light/50 rounded-xl overflow-hidden hover:border-stone-dark/50 transition-colors cursor-pointer bg-stone-bg/50"
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/*"
          onChange={onFileChange}
          className="sr-only"
        />
       
      
      </div>
    );
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
      onDrop={onDrop}
      onDragOver={onDragOver}
      className="border-2 border-dashed border-stone-light/50 rounded-xl p-8 max-lg:p-6 text-center hover:border-stone-dark/50 transition-colors cursor-pointer bg-stone-bg/50"
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/*"
        onChange={onFileChange}
        className="sr-only"
      />
      <Upload className="w-12 h-12 max-lg:w-10 max-lg:h-10 mx-auto text-stone-dark mb-3" />
      <p className="text-sm font-medium text-stone-heading mb-1">
        Drag or Click to Upload
      </p>
      <p className="text-xs text-stone-light">
        JPG, PNG • Min. 800px wide (1200px+ recommended)
      </p>
    </div>
  );
}
