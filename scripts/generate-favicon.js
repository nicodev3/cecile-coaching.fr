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
const OUTPUT_APPLE = join(rootDir, 'public', 'apple-touch-icon.png');

const SIZES = [16, 32, 48];
const WHITE = { r: 255, g: 255, b: 255 };
const PURPLE = { r: 92, g: 24, b: 120 };

async function createHighContrastLogo() {
  const { data: alpha, info } = await sharp(SOURCE_IMAGE)
    .extractChannel('alpha')
    .erode(3)
    .raw()
    .toBuffer({ resolveWithObject: true });
  const rgba = Buffer.alloc(info.width * info.height * 4);

  for (let index = 0; index < alpha.length; index += 1) {
    const pixel = index * 4;
    rgba[pixel] = PURPLE.r;
    rgba[pixel + 1] = PURPLE.g;
    rgba[pixel + 2] = PURPLE.b;
    rgba[pixel + 3] = alpha[index];
  }

  return sharp(rgba, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .trim({ threshold: 1, lineArt: true })
    .png()
    .toBuffer();
}

async function resizeOnWhite(logo, size) {
  const padding = size === 16 ? 1 : Math.max(1, Math.round(size * 0.035));
  const innerSize = size - padding * 2;
  const resizedLogo = await sharp(logo)
    .resize(innerSize, innerSize, {
      fit: 'inside',
      kernel: 'mks2021',
      withoutEnlargement: false,
    })
    .sharpen({ sigma: 0.5, m1: 0.5, m2: 1.5 })
    .png()
    .toBuffer();

  return sharp({
    create: {
      width: size,
      height: size,
      channels: 3,
      background: WHITE,
    },
  })
    .composite([{ input: resizedLogo, gravity: 'center' }])
    .flatten({ background: WHITE })
    .png()
    .toBuffer();
}

async function generateFavicon() {
  try {
    const logo = await createHighContrastLogo();
    const buffers = await Promise.all(SIZES.map((size) => resizeOnWhite(logo, size)));

    const ico = await toIco(buffers);
    writeFileSync(OUTPUT_ICO, ico);
    console.log('✓ favicon.ico généré (16x16, 32x32, 48x48)');

    const png32 = buffers[1];
    writeFileSync(OUTPUT_PNG, png32);
    console.log('✓ favicon-32x32.png généré');

    const png128 = await resizeOnWhite(logo, 128);
    const base64 = png128.toString('base64');
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 128 128">
  <rect width="128" height="128" fill="#fff"/>
  <image width="128" height="128" xlink:href="data:image/png;base64,${base64}"/>
</svg>`;
    writeFileSync(OUTPUT_SVG, svg);
    console.log('✓ favicon.svg généré');

    writeFileSync(OUTPUT_APPLE, await resizeOnWhite(logo, 180));
    console.log('✓ apple-touch-icon.png généré (180x180)');
  } catch (err) {
    console.error('Erreur:', err.message);
    process.exit(1);
  }
}

generateFavicon();
