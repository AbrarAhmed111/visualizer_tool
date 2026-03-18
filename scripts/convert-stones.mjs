#!/usr/bin/env node
/**
 * Converts HEIC stone images to JPG and copies JPG files to public/stones.
 * Run: node scripts/convert-stones.mjs
 */
import { readFile, writeFile, readdir, copyFile, mkdir } from 'fs/promises';
import { join, dirname, extname } from 'path';
import { fileURLToPath } from 'url';
import convert from 'heic-convert';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const SOURCE = join(ROOT, 'src', 'assets', 'img', 'stones');
const DEST = join(ROOT, 'public', 'stones');

// Map source filenames to URL-safe output names
const OUTPUT_NAMES = {
  '#57 driveway gravel .HEIC': '57-driveway-gravel.jpg',
  '#57 driveway gravel .heic': '57-driveway-gravel.jpg',
  "1-2' New York river rock (Dry).JPG": 'new-york-river-rock-dry.jpg',
  "1-2' New York river rock (Dry).jpg": 'new-york-river-rock-dry.jpg',
  "1-2' New York river rock.HEIC": 'new-york-river-rock.jpg',
  "1-2' New York river rock.heic": 'new-york-river-rock.jpg',
  '#57 Slate chips.HEIC': '57-slate-chips.jpg',
  '#57 Slate chips.heic': '57-slate-chips.jpg',
  '1-3 grey river rock.HEIC': '1-3-grey-river-rock.jpg',
  '1-3 grey river rock.heic': '1-3-grey-river-rock.jpg',
  '#57 Grey river rock.heic': '57-grey-river-rock.jpg',
  '#57 Grey river rock.HEIC': '57-grey-river-rock.jpg',
  '2-5" cane creek river rock.HEIC': 'cane-creek-river-rock.jpg',
  '2-5" cane creek river rock.heic': 'cane-creek-river-rock.jpg',
};

async function main() {
  await mkdir(DEST, { recursive: true });
  const files = await readdir(SOURCE);

  for (const file of files) {
    const ext = extname(file).toLowerCase();
    let outputName = OUTPUT_NAMES[file];
    if (!outputName) {
      // Fallback: create URL-safe name from filename
      const base = file.replace(/\.[^.]+$/, '').replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '').toLowerCase();
      outputName = base ? `${base}.jpg` : null;
    }
    if (!outputName) {
      console.warn(`Skipping ${file}`);
      continue;
    }

    const inputPath = join(SOURCE, file);
    const outputPath = join(DEST, outputName);

    if (ext === '.heic') {
      console.log(`Converting ${file} -> ${outputName}`);
      try {
        const inputBuffer = await readFile(inputPath);
        const outputBuffer = await convert({
          buffer: inputBuffer,
          format: 'JPEG',
          quality: 0.9,
        });
        await writeFile(outputPath, outputBuffer);
        console.log(`  Done`);
      } catch (err) {
        console.error(`  Error:`, err.message);
      }
    } else if (ext === '.jpg' || ext === '.jpeg') {
      console.log(`Copying ${file} -> ${outputName}`);
      await copyFile(inputPath, outputPath);
      console.log(`  Done`);
    }
  }

  console.log('\nStone conversion complete.');
}

main().catch(console.error);
