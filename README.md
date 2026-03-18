# Chase Materials – Stone Visualizer

A web-based stone visualizer tool for **Chase Materials Decorative Stone Supply**. Upload an image of your space, select a stone texture, paint the area you want to visualize, and preview the result before and after.

## Features

- **Upload your space** – Drag or click to upload JPG/PNG images (min. 800px wide, 1200px+ recommended)
- **Stone selection** – Choose from 7+ stone textures (#57 Driveway Gravel, New York River Rock, Slate Chips, and more)
- **Brush & mask** – Paint the area where you want the stone effect; use brush or erase mode
- **Before & after** – Compare original and visualized images with a draggable slider
- **Download** – Export your visualization as PNG
- **Responsive** – Works on desktop and mobile with touch support for brushing

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
```

### Production

```bash
npm start
```

## Wix Embedding

Use the `/embed` route for iframe integration:

```html
<iframe src="https://your-domain.com/embed" width="100%" height="600"></iframe>
```

## Stone Textures

Stone textures live in `public/stones/`. To convert HEIC files from `src/assets/img/stones/` to JPG:

```bash
npm run convert-stones
```

This converts all HEIC images to JPG and copies them to `public/stones/` with URL-safe names. To add new stones: place HEIC or JPG files in `src/assets/img/stones/`, run the script, then update `src/constants/stoneProducts.ts`.

## Tech Stack

- **Next.js 15** – React framework
- **TypeScript** – Type safety
- **Tailwind CSS** – Styling
- **Lucide React** – Icons
- **HTML5 Canvas API** – Brush display and texture compositing (Konva available for future use)

## Project Structure

```
src/
├── app/              # Next.js app router
├── components/
│   └── StoneVisualizer/   # Main visualizer components
├── constants/         # Stone products, config
├── utils/             # Canvas utilities
└── assets/            # Styles, images
```

## License

Private – Chase Materials Decorative Stone Supply
