"use client";

// Static SVG grain + vignette. Fixed overlay, pointer-events none.
const grainSvg = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>`
)}`;

export default function Grain() {
  return (
    <>
      <div
        className="grain"
        style={{ backgroundImage: `url("${grainSvg}")` }}
        aria-hidden
      />
      <div className="vignette" aria-hidden />
    </>
  );
}
