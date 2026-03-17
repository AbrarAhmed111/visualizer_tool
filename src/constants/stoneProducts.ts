export interface StoneProduct {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
}

// Watermark-free stone/gravel images
const STONE_IMAGES = [
  'https://images.unsplash.com/photo-1607490694033-27f5c5d6f8fa?w=400&h=400&fit=crop', // gravel
  'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=400&h=400&fit=crop', // pebbles
  'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=400&fit=crop', // stone
];

export const STONE_PRODUCTS: StoneProduct[] = [
  { id: '1', name: 'Piedmont Gold Gravel', description: 'Warm golden tones, ideal for driveways and pathways', imageUrl: STONE_IMAGES[0] },
  { id: '2', name: 'Arctic White Pebble', description: 'Bright white pebbles for a clean, modern look', imageUrl: STONE_IMAGES[1] },
  { id: '3', name: 'Crimson Quartz', description: 'Rich red quartz for bold accent areas', imageUrl: STONE_IMAGES[2] },
  { id: '4', name: 'Tennessee Quartz', description: 'Classic river rock blend with natural variation', imageUrl: STONE_IMAGES[0] },
  { id: '5', name: 'Piedmont Gravel', description: 'Versatile gravel for landscaping and drainage', imageUrl: STONE_IMAGES[1] },
  { id: '6', name: 'Arctic White Quartz', description: 'Crisp white quartz with subtle sparkle', imageUrl: STONE_IMAGES[2] },
  { id: '7', name: 'River Rock Blend', description: 'Mixed sizes for natural creek-bed aesthetics', imageUrl: STONE_IMAGES[0] },
  { id: '8', name: 'Smokey Grey Gravel', description: 'Neutral grey for contemporary landscapes', imageUrl: STONE_IMAGES[1] },
  { id: '9', name: 'Desert Tan Pebble', description: 'Earthy tan tones for warm outdoor spaces', imageUrl: STONE_IMAGES[2] },
  { id: '10', name: 'Midnight Black Stone', description: 'Deep black for dramatic contrast', imageUrl: STONE_IMAGES[0] },
  { id: '11', name: 'Copper Canyon Gravel', description: 'Rustic copper hues for southwestern style', imageUrl: STONE_IMAGES[1] },
  { id: '12', name: 'Pumice Stone', description: 'Lightweight volcanic stone, seamless texture', imageUrl: STONE_IMAGES[2] },
];
