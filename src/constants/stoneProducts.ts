export interface StoneProduct {
  id: string;
  name: string;
  imageUrl: string;
  textureUrl: string; // For overlay - same as imageUrl, used for texture tiling
}

// Stone textures from public/stones - URL-safe filenames from convert-stones script
export const STONE_PRODUCTS: StoneProduct[] = [
  { id: '1', name: "#57 Driveway Gravel", imageUrl: "/stones/57-driveway-gravel.jpg", textureUrl: "/stones/57-driveway-gravel.jpg" },
  { id: '2', name: "1-2' New York River Rock (Dry)", imageUrl: "/stones/1-2-new-york-river-rock-dry.jpg", textureUrl: "/stones/1-2-new-york-river-rock-dry.jpg" },
  { id: '3', name: "#57 Slate Chips", imageUrl: "/stones/57-slate-chips.jpg", textureUrl: "/stones/57-slate-chips.jpg" },
  { id: '4', name: "1-2' New York River Rock", imageUrl: "/stones/1-2-new-york-river-rock.jpg", textureUrl: "/stones/1-2-new-york-river-rock.jpg" },
  { id: '5', name: "#57 Grey River Rock", imageUrl: "/stones/57-grey-river-rock.jpg", textureUrl: "/stones/57-grey-river-rock.jpg" },
  { id: '6', name: "1-3 Grey River Rock", imageUrl: "/stones/1-3-grey-river-rock.jpg", textureUrl: "/stones/1-3-grey-river-rock.jpg" },
  { id: '7', name: '2-5" Cane Creek River Rock', imageUrl: "/stones/2-5-cane-creek-river-rock.jpg", textureUrl: "/stones/2-5-cane-creek-river-rock.jpg" },
];
