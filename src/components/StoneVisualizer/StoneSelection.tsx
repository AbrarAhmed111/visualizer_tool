'use client';

import { STONE_PRODUCTS, type StoneProduct } from '@/constants/stoneProducts';
import StoneCard from './StoneCard';

interface StoneSelectionProps {
  selectedStone: StoneProduct | null;
  onSelectStone: (stone: StoneProduct) => void;
}

export default function StoneSelection({ selectedStone, onSelectStone }: StoneSelectionProps) {
  return (
    <div className="flex flex-col gap-3 flex-1 min-h-0 min-h-[240px] sm:min-h-0">
      <h2 className="text-base sm:text-lg font-semibold text-stone-heading uppercase tracking-wide flex-shrink-0">
        Select Stone
      </h2>
      {/* Mobile: vertical scrollable list - full cards with image, name, description */}
      <div
        className="flex sm:hidden flex-col gap-3 overflow-y-auto overflow-x-hidden py-1 px-1 overscroll-contain max-h-[320px]"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {STONE_PRODUCTS.map((product) => (
          <StoneCard
            key={product.id}
            product={product}
            isSelected={selectedStone?.id === product.id}
            onSelect={() => onSelectStone(product)}
            variant="mobile"
          />
        ))}
      </div>
      {/* Desktop: vertical list */}
      <div className="hidden sm:flex flex-col gap-2 overflow-y-auto max-h-[280px] sm:max-h-[400px] lg:max-h-[480px] overscroll-contain px-3">
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
