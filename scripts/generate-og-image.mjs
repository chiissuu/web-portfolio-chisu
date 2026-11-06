// Generates public/assets/images/og-chiissuu.png (1200x630), the card shown
// when the site is shared (Open Graph / Twitter). It composes the site's own
// gold wordmark over the graphite background with the gold halo, plus the name
// and the role line. Run it again after changing the wordmark or the texts:
//
//   node scripts/generate-og-image.mjs
//
// `sharp` comes with Astro (its image service), so nothing extra to install.

import sharp from "sharp";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const images = join(root, "public", "assets", "images");

const W = 1200;
const H = 630;

const background = Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#050505"/>
      <stop offset="0.52" stop-color="#1b1b1f"/>
      <stop offset="1" stop-color="#050505"/>
    </linearGradient>
    <radialGradient id="halo" cx="0.5" cy="0.4" r="0.55">
      <stop offset="0" stop-color="#b99a45" stop-opacity="0.34"/>
      <stop offset="1" stop-color="#b99a45" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="thread" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#c19b3d" stop-opacity="0"/>
      <stop offset="1" stop-color="#efd683"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#halo)"/>
  <rect x="${W / 2 - 1}" y="0" width="2" height="74" fill="url(#thread)"/>
  <rect x="${W / 2 - 7}" y="68" width="14" height="14" fill="#0b0b0c" stroke="#efd683" stroke-width="2" transform="rotate(45 ${W / 2} 75)"/>
  <text x="${W / 2}" y="470" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="46" font-weight="700" fill="#f3f4f5">Jesús León</text>
  <text x="${W / 2}" y="520" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="26" letter-spacing="3" fill="#e0c58b">SOFTWARE ENGINEER  ·  DATA SCIENCE  ·  GFX</text>
  <text x="${W / 2}" y="580" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="22" letter-spacing="2" fill="#8b8f96">chiissuu.com</text>
</svg>`);

const wordmark = await sharp(join(images, "hero-wordmark-gold.webp"))
  .trim()
  .resize({ width: 560 })
  .toBuffer();
const wordmarkHeight = (await sharp(wordmark).metadata()).height ?? 0;

await sharp(background)
  .composite([{ input: wordmark, left: Math.round((W - 560) / 2), top: Math.round(110 + (320 - wordmarkHeight) / 2) }])
  .png({ compressionLevel: 9 })
  .toFile(join(images, "og-chiissuu.png"));

console.log("og-chiissuu.png written");
