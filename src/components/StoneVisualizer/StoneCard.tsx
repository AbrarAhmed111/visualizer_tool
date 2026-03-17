'use client';

import type { StoneProduct } from '@/constants/stoneProducts';

interface StoneCardProps {
  product: StoneProduct;
  isSelected: boolean;
  onSelect: () => void;
}

export default function StoneCard({ product, isSelected, onSelect }: StoneCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full flex items-stretch gap-3 text-left rounded-xl border-2 transition-all focus:outline-none focus:ring-2 focus:ring-stone-dark focus:ring-offset-2 touch-manipulation active:scale-[0.99] shadow-sm hover:shadow-md min-h-[88px] ${
        isSelected
          ? 'border-stone-dark ring-2 ring-stone-dark/20 bg-stone-bg/30'
          : 'border-stone-light/30 hover:border-stone-light/60 bg-white'
      }`}
    >
      <div className="w-[50%] sm:w-28 h-[88px] sm:h-full flex-shrink-0 min-w-0 rounded-l-xl bg-stone-light/10 relative overflow-hidden" style={{ contain: 'paint' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.imageUrl}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ maxWidth: '100%', maxHeight: '100%' }}
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://placehold.co/200x200/9B9393/655858?text=${encodeURIComponent(product.name.slice(0, 2))}`;
          }}
        />
      </div>
      <div className="flex-1 min-w-0 py-2.5 pr-3 flex flex-col justify-center gap-0.5 rounded-r-xl">
        <p className="text-xs font-semibold text-gray-900 leading-tight">{product.name}</p>
        <p className="text-[11px] sm:text-xs text-gray-600 leading-snug line-clamp-2">{product.description}</p>
      </div>
    </button>
  );
}
