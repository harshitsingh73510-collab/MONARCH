/**
 * MONARCH — selected work. One source for the homepage grid, /work and the
 * menu. Every card opens the real, live site in a new tab. Copy describes what
 * each site actually is — no invented clients, metrics or awards.
 * Images are captures of the live builds (scripts/work-images.mjs).
 */

export type Project = {
  slug: string;
  no: string;
  name: string;
  kind: string;
  tags: string[];
  year: string;
  line: string;
  cover: string;
  /** frames cycled on hover — a silent reel of the live site */
  reel: string[];
  url: string;
};

const img = (slug: string, name: string) => `/work/${slug}/${name}.webp`;

export const PROJECTS: Project[] = [
  {
    slug: "noir",
    no: "01",
    name: "Noir",
    kind: "Fragrance house",
    tags: ["Concept", "Art direction", "WebGL", "Motion"],
    year: "2025",
    line: "A perfume house sold as pure atmosphere — only what a scent leaves behind.",
    cover: img("noir", "cover"),
    reel: ["hero", "forest", "materials", "pluie", "maker"].map((n) => img("noir", n)),
    url: "https://p3-nwiw.vercel.app",
  },
  {
    slug: "vanta",
    no: "02",
    name: "Vanta",
    kind: "Alpine retreat",
    tags: ["Web", "Editorial design", "Development"],
    year: "2026",
    line: "Three rooms at 2,140 metres — built so the mountain stays the loudest thing.",
    cover: img("vanta", "cover"),
    reel: ["hero", "rooms", "spa", "silence", "site"].map((n) => img("vanta", n)),
    url: "https://vanta-hazel-nine.vercel.app/",
  },
  {
    slug: "noctis",
    no: "03",
    name: "Noctis",
    kind: "Maison de parfum",
    tags: ["Brand world", "Web", "Commerce"],
    year: "2026",
    line: "A night-time fragrance house — three scents, each with its own hour.",
    cover: img("noctis", "cover"),
    reel: ["hero", "embers", "materials", "field", "amber"].map((n) => img("noctis", n)),
    url: "https://noctis-wheat.vercel.app/",
  },
  {
    slug: "monolith",
    no: "04",
    name: "Monolith",
    kind: "Experimental WebGL",
    tags: ["Concept", "Creative technology", "WebGL"],
    year: "2026",
    line: "A machine excavated 1,412 metres down. Wake it and it shows you what it remembers.",
    cover: img("monolith", "cover"),
    reel: ["hero", "object", "memory", "signal", "core"].map((n) => img("monolith", n)),
    url: "https://monolith-liart.vercel.app/",
  },
  {
    slug: "strata",
    no: "05",
    name: "Strata",
    kind: "Architecture practice",
    tags: ["Web", "Design", "3D", "Creative technology"],
    year: "2025",
    line: "Blueprint to reality, made literal — a live 3D massing model that builds itself as you scroll.",
    cover: img("strata", "cover"),
    reel: ["hero", "a", "b", "c"].map((n) => img("strata", n)),
    url: "https://strata-weld-two.vercel.app",
  },
  {
    slug: "aera",
    no: "06",
    name: "ÆRA",
    kind: "Single-object luxury",
    tags: ["Concept", "Art direction", "WebGL", "3D"],
    year: "2025",
    line: "One impossible object — a tungsten mass in a titanium gimbal the whole scroll orbits.",
    cover: img("aera", "cover"),
    reel: ["hero", "titanium", "precision", "plate"].map((n) => img("aera", n)),
    url: "https://aera-eight.vercel.app",
  },
];
