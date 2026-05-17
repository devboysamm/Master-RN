#!/usr/bin/env node
/**
 * Converts assets/*.svg to the PNGs Expo needs.
 * Run once: `cd mobile-app && npm install --no-save sharp && node scripts/gen-icons.js`
 */
const path = require('path');
const fs = require('fs');

const SHARP_PATH = (() => {
  try { return require.resolve('sharp'); } catch { return null; }
})();
if (!SHARP_PATH) {
  console.error('\nMissing dependency: sharp');
  console.error('Run:  npm install --no-save sharp');
  process.exit(1);
}

const sharp = require('sharp');

const ROOT = path.join(__dirname, '..', 'assets');

const jobs = [
  { src: 'icon.svg',          out: 'icon.png',          size: 1024 },
  { src: 'adaptive-icon.svg', out: 'adaptive-icon.png', size: 1024 },
  { src: 'splash.svg',        out: 'splash.png',        width: 1284, height: 2778 },
];

async function main() {
  for (const j of jobs) {
    const inputPath = path.join(ROOT, j.src);
    const outputPath = path.join(ROOT, j.out);
    if (!fs.existsSync(inputPath)) {
      console.warn(`skip — missing: ${inputPath}`);
      continue;
    }
    const buf = fs.readFileSync(inputPath);
    const pipeline = sharp(buf, { density: 400 });
    if (j.width && j.height) {
      await pipeline.resize(j.width, j.height).png().toFile(outputPath);
    } else {
      await pipeline.resize(j.size, j.size).png().toFile(outputPath);
    }
    console.log(`wrote ${outputPath}`);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
