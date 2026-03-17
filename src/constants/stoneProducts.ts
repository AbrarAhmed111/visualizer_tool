export interface StoneProduct {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
}

const STONE_IMAGES = [
  'https://www.shutterstock.com/image-photo/top-view-crushed-terracotta-brick-260nw-2735421347.jpg',
  'https://tblawncare.store/cdn/shop/products/Untitleddesign_11.png?v=1680987614',
  'https://www.shutterstock.com/shutterstock/videos/3552768047/thumb/12.jpg?ip=x480',
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
