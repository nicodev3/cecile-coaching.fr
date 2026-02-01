import sharp from 'sharp';
import toIco from 'to-ico';
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');

const SOURCE_IMAGE = join(rootDir, 'src', 'assets', 'logo-source.png');
const OUTPUT_ICO = join(rootDir, 'public', 'favicon.ico');
const OUTPUT_PNG = join(rootDir, 'public', 'favicon-32x32.png');
const OUTPUT_SVG = join(rootDir, 'public', 'favicon.svg');

const SIZES = [16, 32, 48];

async function generateFavicon() {
  try {
    const buffers = await Promise.all(
      SIZES.map((size) =>
        sharp(SOURCE_IMAGE)
          .resize(size, size)
          .png()
          .toBuffer()
      )
    );

    const ico = await toIco(buffers);
    writeFileSync(OUTPUT_ICO, ico);
    console.log('✓ favicon.ico généré (16x16, 32x32, 48x48)');

    const png32 = buffers[1];
    writeFileSync(OUTPUT_PNG, png32);
    console.log('✓ favicon-32x32.png généré');

    const base64 = png32.toString('base64');
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32">
  <image width="32" height="32" xlink:href="data:image/png;base64,${base64}"/>
</svg>`;
    writeFileSync(OUTPUT_SVG, svg);
    console.log('✓ favicon.svg généré');
  } catch (err) {
    console.error('Erreur:', err.message);
    process.exit(1);
  }
}

generateFavicon();
