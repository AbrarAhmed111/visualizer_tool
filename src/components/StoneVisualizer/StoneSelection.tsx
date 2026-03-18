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
    <div className="flex flex-col gap-3">
      <h2 className="text-lg font-semibold text-stone-heading uppercase tracking-wide">
        Select Stone
      </h2>
      <div className="grid grid-cols-2 max-sm:grid-cols-2 lg:grid-cols-3 gap-1.5">
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
