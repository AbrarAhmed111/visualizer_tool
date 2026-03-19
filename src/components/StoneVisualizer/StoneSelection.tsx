'use client';

import { STONE_PRODUCTS, type StoneProduct } from '@/constants/stoneProducts';
import StoneCard from './StoneCard';

interface StoneSelectionProps {
  selectedStone: StoneProduct | null;
  onSelectStone: (stone: StoneProduct) => void;
  disabled?: boolean;
}

export default function StoneSelection({ selectedStone, onSelectStone, disabled }: StoneSelectionProps) {
  return (
    <div className="flex flex-col gap-3 rounded-xl bg-stone-dark/8 border-2 border-stone-dark/15 p-4 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-stone-dark text-white text-sm font-bold">
          2
        </span>
        <h2 className="text-lg font-semibold text-stone-heading uppercase tracking-wide">
          Choose your stone
        </h2>
      </div>
      <p className="text-xs text-stone-heading/70 -mt-1">
        Pick a stone texture to apply to your selected area
      </p>
      <div className="grid grid-cols-2 max-sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {STONE_PRODUCTS.map((product) => (
          <StoneCard
            key={product.id}
            product={product}
            isSelected={selectedStone?.id === product.id}
            onSelect={() => onSelectStone(product)}
            disabled={disabled}
          />
        ))}
      </div>
    </div>
  );
}
