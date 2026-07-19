import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const input = path.join(root, "public", "logo-source.png");
const output = path.join(root, "public", "logo.png");

const BLACK_THRESHOLD = 42;

const { data, info } = await sharp(input)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

for (let i = 0; i < data.length; i += 4) {
  const r = data[i];
  const g = data[i + 1];
  const b = data[i + 2];
  const max = Math.max(r, g, b);

  if (max <= BLACK_THRESHOLD) {
    data[i + 3] = 0;
    continue;
  }

  if (max <= BLACK_THRESHOLD + 35) {
    const alpha = Math.round(((max - BLACK_THRESHOLD) / 35) * 255);
    data[i + 3] = Math.min(data[i + 3], alpha);
  }
}

await sharp(data, {
  raw: {
    width: info.width,
    height: info.height,
    channels: 4,
  },
})
  .png()
  .toFile(output);

console.log(`Logo saved: ${output} (${info.width}x${info.height})`);
