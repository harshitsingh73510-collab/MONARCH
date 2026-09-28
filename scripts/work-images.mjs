// Turns full-page captures of each live project into the webp plates used by
// the Selected Work corridor and the /work/[slug] pages.
//   node scripts/work-images.mjs <captures-dir>
// Captures are 1920×1080 PNGs named <site>-<n>.png. `crop.top` trims a site's
// own nav bar where it would fight Monarch's chrome (or show a brand we no
// longer present).
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const SRC = process.argv[2];
if (!SRC) throw new Error("usage: node scripts/work-images.mjs <captures-dir>");

const MAP = {
  noir: { hero: 0, cover: 0, forest: 1, materials: 2, maker: 3, pluie: 4, time: 6 },
  vanta: { hero: "h0", cover: 1, rooms: 2, spa: 3, silence: 4, contour: 5, site: 6 },
  noctis: { hero: 0, cover: 0, embers: 1, materials: 3, field: 4, amber: 6 },
  monolith: { hero: "h1", cover: 5, object: 2, memory: 3, signal: 4, core: 6 },
  strata: { hero: 0, a: 1, b: 5, c: 7 },
  aera: { hero: 0, cover: 1, wait: 0, titanium: 2, precision: 3, plate: 4 },
};

// Corridor covers are image-only crops (no site typography) so each world's
// title can sit on its own atmosphere: [shot, left, top, width, height]
const COVERS = {
  noir: [0, 1070, 70, 840, 1010],
  vanta: [5, 420, 20, 1500, 840],
  noctis: [0, 470, 0, 880, 1080],
  monolith: [6, 160, 0, 1600, 770],
  strata: [1, 1210, 220, 710, 520],
  aera: [1, 420, 70, 1080, 700],
};

for (const [site, map] of Object.entries(MAP)) {
  const out = path.join("public", "work", site);
  fs.mkdirSync(out, { recursive: true });
  const top = map.crop?.top ?? 0;
  for (const [name, n] of Object.entries(map)) {
    if (name === "crop") continue;
    const file = path.join(SRC, `${site}-${n}.png`);
    if (!fs.existsSync(file)) {
      console.warn("missing", file);
      continue;
    }
    let img = sharp(file);
    if (top) img = img.extract({ left: 0, top, width: 1920, height: 1080 - top });
    await img.resize({ width: 1920 }).webp({ quality: 80 }).toFile(path.join(out, `${name}.webp`));
  }
  const [n, left, t, width, height] = COVERS[site];
  await sharp(path.join(SRC, `${site}-${n}.png`))
    .extract({ left, top: t, width, height })
    .resize({ width: 1800, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(path.join(out, "cover.webp"));
  console.log("done", site);
}
