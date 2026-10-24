// Builds public/assets/images/about-veins.webp from the Hero's gold texture:
// the folds and light rays of that texture, extracted as thin gold lines on a
// transparent background (difference of Gaussians, thresholded). About lays it
// over black "obsidian" and brightens it near the gold thread. The result is
// mirrored vertically so it tiles without a seam.
//
// Run with: node scripts/generate-about-veins.mjs
import sharp from "sharp";

const SOURCE = "public/assets/images/hero-background-gold-alternative.png";
const OUTPUT = "public/assets/images/about-veins.webp";
const WIDTH = 1600;
const GOLD = [239, 214, 131];

const base = sharp(SOURCE).resize({ width: WIDTH }).grayscale().normalise();
const { data: fine, info } = await base.clone().blur(2).raw().toBuffer({ resolveWithObject: true });
const { data: coarse } = await base.clone().blur(14).raw().toBuffer({ resolveWithObject: true });

const { width, height } = info;
const rgba = Buffer.alloc(width * height * 4);
for (let i = 0; i < width * height; i++) {
  // Contrast against the neighbourhood: thin dark folds and bright rays both count.
  const ridge = Math.abs(fine[i] - coarse[i]);
  const strength = Math.min(1, Math.max(0, (ridge - 2.2) / 9)) ** 1.15;
  rgba[i * 4] = GOLD[0];
  rgba[i * 4 + 1] = GOLD[1];
  rgba[i * 4 + 2] = GOLD[2];
  rgba[i * 4 + 3] = Math.round(strength * 255);
}

const tile = await sharp(rgba, { raw: { width, height, channels: 4 } }).png().toBuffer();
const flipped = await sharp(tile).flip().toBuffer();

await sharp({ create: { width, height: height * 2, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
  .composite([
    { input: tile, top: 0, left: 0 },
    { input: flipped, top: height, left: 0 },
  ])
  .webp({ quality: 82, alphaQuality: 90 })
  .toFile(OUTPUT);

console.log(`wrote ${OUTPUT} (${width}x${height * 2})`);
