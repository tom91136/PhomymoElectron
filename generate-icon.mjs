import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const here = dirname(fileURLToPath(import.meta.url));
const root = here;
const src = resolve(root, 'assets', 'icon.svg');
const out = resolve(root, 'assets', 'icon.png');

readFileSync(src);
const pngBuffer = await sharp(src)
  .resize(512, 512, {
    fit: 'contain',
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  })
  .png()
  .toBuffer();

writeFileSync(out, pngBuffer);
