'use client';

import type { StoneProduct } from '@/constants/stoneProducts';

interface StoneCardProps {
  product: StoneProduct;
  isSelected: boolean;
  onSelect: () => void;
  disabled?: boolean;
}

export default function StoneCard({ product, isSelected, onSelect, disabled }: StoneCardProps) {
  return (
    <button
      type="button"
      onClick={disabled ? undefined : onSelect}
      disabled={disabled}
      className={`w-full text-left rounded-lg overflow-hidden border-2 transition-all focus:outline-none focus:ring-2 focus:ring-stone-dark focus:ring-offset-2 ${
        disabled
          ? 'opacity-50 cursor-not-allowed border-stone-light/30'
          : isSelected
            ? 'border-stone-dark ring-2 ring-stone-dark/20'
            : 'border-stone-light/40 hover:border-stone-light'
      }`}
    >
      <div className="aspect-[4/3] w-full max-lg:aspect-[3/2] bg-stone-light/20 relative overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://placehold.co/200x200/9B9393/655858?text=${encodeURIComponent(product.name.slice(0, 2))}`;
          }}
        />
      </div>
      <div className="p-2 bg-white">
        <p className="text-sm font-medium text-stone-heading line-clamp-2" title={product.name}>{product.name}</p>
     
      </div>
    </button>
  );
}
