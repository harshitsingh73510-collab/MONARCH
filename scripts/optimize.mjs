import sharp from "sharp";
import { readdir } from "node:fs/promises";
import path from "node:path";

const dir = path.resolve("public/assets");
const files = await readdir(dir);
const pngs = files.filter((f) => f.endsWith(".png"));

for (const f of pngs) {
  const src = path.join(dir, f);
  const out = path.join(dir, f.replace(/\.png$/, ".webp"));
  const meta = await sharp(src).metadata();
  const targetW = Math.min(meta.width ?? 2200, 2200);
  await sharp(src)
    .resize({ width: targetW })
    .webp({ quality: 80, effort: 5 })
    .toFile(out);
  console.log(`${f} -> ${path.basename(out)}  (${targetW}w)`);
}
console.log("done");
