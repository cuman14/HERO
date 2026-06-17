const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [72, 96, 128, 144, 152, 180, 192, 384, 512];
const input = 'apps/judge/public/logo.svg';
const outputDir = 'apps/judge/public/icons';

async function generate() {
  for (const size of sizes) {
    const output = path.join(outputDir, `icon-${size}.png`);
    await sharp(input, { density: 300 })
      .resize(size, size, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
      .png()
      .toFile(output);
    console.log(`Generated ${output}`);
  }
}

generate().catch(console.error);