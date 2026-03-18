export interface StoneProduct {
  id: string;
  name: string;
  imageUrl: string;
}

const SHUTTERSTOCK_IMAGES = [
  'https://www.shutterstock.com/image-photo/gray-gravel-stones-construction-industry-600w-2477629139.jpg',
  'https://www.shutterstock.com/image-photo/black-gravel-stone-floor-finishing-260nw-2661228387.jpg',
  'https://www.shutterstock.com/image-photo/gray-small-rocks-ground-texture-600w-2664866343.jpg',
] as const;

export const STONE_PRODUCTS: StoneProduct[] = [
  { id: '1', name: 'Piedmont Gold Gravel', imageUrl: SHUTTERSTOCK_IMAGES[0] },
  { id: '2', name: 'Arctic White Pebble', imageUrl: SHUTTERSTOCK_IMAGES[1] },
  { id: '3', name: 'Crimson Quartz', imageUrl: SHUTTERSTOCK_IMAGES[2] },
  { id: '4', name: 'Tennessee Quartz', imageUrl: SHUTTERSTOCK_IMAGES[0] },
  { id: '5', name: 'Piedmont Gravel', imageUrl: SHUTTERSTOCK_IMAGES[1] },
  { id: '6', name: 'Arctic White Quartz', imageUrl: SHUTTERSTOCK_IMAGES[2] },
  { id: '7', name: 'River Rock Blend', imageUrl: SHUTTERSTOCK_IMAGES[0] },
  { id: '8', name: 'Smokey Grey Gravel', imageUrl: SHUTTERSTOCK_IMAGES[1] },
  { id: '9', name: 'Desert Tan Pebble', imageUrl: SHUTTERSTOCK_IMAGES[2] },
  { id: '10', name: 'Midnight Black Stone', imageUrl: SHUTTERSTOCK_IMAGES[0] },
  { id: '11', name: 'Copper Canyon Gravel', imageUrl: SHUTTERSTOCK_IMAGES[1] },
  { id: '12', name: 'Pumice Stone', imageUrl: SHUTTERSTOCK_IMAGES[2] },
];
