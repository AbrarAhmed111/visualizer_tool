'use client';

import { STONE_PRODUCTS, type StoneProduct } from '@/constants/stoneProducts';
import StoneCard from './StoneCard';

interface StoneSelectionProps {
  selectedStone: StoneProduct | null;
  onSelectStone: (stone: StoneProduct) => void;
}

export default function StoneSelection({ selectedStone, onSelectStone }: StoneSelectionProps) {
  return (
    <div className="flex flex-col gap-3 flex-1 min-h-0">
      <h2 className="text-lg font-semibold text-stone-heading uppercase tracking-wide flex-shrink-0">
        Select Stone
      </h2>
      <div className="flex flex-col gap-2 overflow-y-auto max-h-[400px] sm:max-h-[480px] lg:max-h-[560px] overscroll-contain px-3">
        {STONE_PRODUCTS.map((product) => (
          <StoneCard
            key={product.id}
            product={product}
            isSelected={selectedStone?.id === product.id}
            onSelect={() => onSelectStone(product)}
          />
        ))}
      </div>
    </div>
  );
}
