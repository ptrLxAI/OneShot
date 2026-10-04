#!/usr/bin/env node
// OneShot logo v2 "Smiling lens": the amber camera of logo v1 whose lens smiles,
// because OneShot is about remembering the happy days, one shot per day.
//
// Single source of truth for the mark. All shapes are SVG path strings on the
// 108x108 adaptive-icon canvas, so the very same geometry is written as
//   - Android VectorDrawables (adaptive foreground + monochrome themed icon),
//   - SVG masters in logo/v2/ (icon, foreground, monochrome, mask preview sheet).
// PNGs (fastlane store icon, preview) are rasterized from the SVGs by
// scripts/logo/render.sh with rsvg-convert. No npm dependencies.
//
// Usage: node scripts/logo/generate.mjs   (from the repository root; `make logo` runs everything)
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

// Palette of logo v1, kept for recognition on existing home screens.
const AMBER = "#FEBA4B";
const NIGHT = "#1F1B16"; // adaptive icon background (values/ic_launcher_background.xml)
const CREAM = "#FFF4DC";

// Adaptive icon canvas: 108x108, the launcher shows the inner 72x72 and masks
// may cut anything outside a circle of radius 33 around the center (safe zone).
const SIZE = 108;
const C = SIZE / 2;
const SAFE_RADIUS = 33;

const f = (n) => Number(n.toFixed(2));

function roundedRect(x, y, w, h, r) {
  return (
    `M${f(x + r)},${f(y)} H${f(x + w - r)} A${r},${r} 0 0 1 ${f(x + w)},${f(y + r)} ` +
    `V${f(y + h - r)} A${r},${r} 0 0 1 ${f(x + w - r)},${f(y + h)} H${f(x + r)} ` +
    `A${r},${r} 0 0 1 ${f(x)},${f(y + h - r)} V${f(y + r)} A${r},${r} 0 0 1 ${f(x + r)},${f(y)} Z`
  );
}

function circle(cx, cy, r) {
  return `M${f(cx - r)},${f(cy)} A${r},${r} 0 1 0 ${f(cx + r)},${f(cy)} A${r},${r} 0 1 0 ${f(cx - r)},${f(cy)} Z`;
}

// Open arc from angle a1 to a2 (degrees, 0 = right, clockwise because y points down).
function arc(cx, cy, r, a1, a2) {
  const p = (a) => [cx + r * Math.cos((a * Math.PI) / 180), cy + r * Math.sin((a * Math.PI) / 180)];
  const [x1, y1] = p(a1);
  const [x2, y2] = p(a2);
  const large = Math.abs(a2 - a1) > 180 ? 1 : 0;
  return `M${f(x1)},${f(y1)} A${r},${r} 0 ${large} 1 ${f(x2)},${f(y2)}`;
}

// ---- Geometry -------------------------------------------------------------
const body = { x: 28, y: 39, w: 52, h: 35, r: 9 };
const shutter = { x: 35, y: 34, w: 14, h: 7, r: 3 };
const lens = { cx: 56, cy: 56.5, r: 12.5 };
const smile = { r: 7, a1: 25, a2: 155, width: 3.2 };
const glint = { cx: 60.5, cy: 50.5, r: 2.1 };

const bodyPath = roundedRect(body.x, body.y, body.w, body.h, body.r);
const shutterPath = roundedRect(shutter.x, shutter.y, shutter.w, shutter.h, shutter.r);
const lensPath = circle(lens.cx, lens.cy, lens.r);
const smilePath = arc(lens.cx, lens.cy - 1.5, smile.r, smile.a1, smile.a2);
const glintPath = circle(glint.cx, glint.cy, glint.r);

// Full-color foreground: amber camera, night lens (reads as glass), amber smile, cream glint.
const foreground = [
  { d: shutterPath, fill: AMBER },
  { d: bodyPath, fill: AMBER },
  { d: lensPath, fill: NIGHT },
  { d: smilePath, stroke: AMBER, width: smile.width },
  { d: glintPath, fill: CREAM },
];

// Monochrome (Android 13 themed icons): one color, the lens is a hole in the body.
const monochrome = [
  { d: shutterPath, fill: "#000000" },
  { d: `${bodyPath} ${lensPath}`, fill: "#000000", evenOdd: true },
  { d: smilePath, stroke: "#000000", width: smile.width },
  { d: glintPath, fill: "#000000" },
];

// ---- Safe-zone check: every corner of every shape inside the 33dp circle ----
function assertSafe() {
  const corners = [
    [body.x + body.r * 0.3, body.y + body.r * 0.3],
    [body.x + body.w - body.r * 0.3, body.y + body.h - body.r * 0.3],
    [body.x + body.r * 0.3, body.y + body.h - body.r * 0.3],
    [body.x + body.w - body.r * 0.3, body.y + body.r * 0.3],
    [shutter.x, shutter.y],
    [shutter.x + shutter.w, shutter.y],
  ];
  for (const [x, y] of corners) {
    const dist = Math.hypot(x - C, y - C);
    if (dist > SAFE_RADIUS) throw new Error(`point ${x},${y} is ${dist.toFixed(1)}dp from center, outside the safe zone`);
  }
}

// ---- Writers ----------------------------------------------------------------
function svgShapes(shapes) {
  return shapes
    .map(({ d, fill, stroke, width, evenOdd }) =>
      stroke
        ? `  <path d="${d}" fill="none" stroke="${stroke}" stroke-width="${width}" stroke-linecap="round"/>`
        : `  <path d="${d}" fill="${fill}"${evenOdd ? ' fill-rule="evenodd"' : ""}/>`,
    )
    .join("\n");
}

function svg(shapes, { background, viewBox = `0 0 ${SIZE} ${SIZE}` } = {}) {
  const bg = background ? `  <rect x="0" y="0" width="${SIZE}" height="${SIZE}" fill="${background}"/>\n` : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}">\n${bg}${svgShapes(shapes)}\n</svg>\n`;
}

function vectorDrawable(shapes, comment) {
  const paths = shapes
    .map(({ d, fill, stroke, width, evenOdd }) =>
      stroke
        ? `    <path\n        android:pathData="${d}"\n        android:strokeColor="${stroke}"\n        android:strokeWidth="${width}"\n        android:strokeLineCap="round" />`
        : `    <path\n        android:pathData="${d}"\n        android:fillColor="${fill}"${evenOdd ? '\n        android:fillType="evenOdd"' : ""} />`,
    )
    .join("\n");
  return `<?xml version="1.0" encoding="utf-8"?>
<!-- ${comment} Generated by scripts/logo/generate.mjs, do not edit by hand. -->
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="${SIZE}dp"
    android:height="${SIZE}dp"
    android:viewportWidth="${SIZE}"
    android:viewportHeight="${SIZE}">
${paths}
</vector>
`;
}

const adaptiveIcon = `<?xml version="1.0" encoding="utf-8"?>
<!-- Generated by scripts/logo/generate.mjs, do not edit by hand. -->
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@color/ic_launcher_background" />
    <foreground android:drawable="@drawable/ic_launcher_foreground" />
    <monochrome android:drawable="@drawable/ic_launcher_monochrome" />
</adaptive-icon>
`;

// Preview sheet for review: the icon under common launcher masks plus a themed icon.
function previewSheet() {
  const cell = 140;
  const masks = [
    ["circle", `<circle cx="54" cy="54" r="54"/>`],
    ["squircle", `<rect x="0" y="0" width="108" height="108" rx="34"/>`],
    ["rounded square", `<rect x="0" y="0" width="108" height="108" rx="18"/>`],
  ];
  const tile = (i, inner, clip, label) =>
    `<g transform="translate(${20 + i * cell} 20)"><defs><clipPath id="m${i}">${clip}</clipPath></defs>` +
    `<g clip-path="url(#m${i})" transform="scale(1.111)" >${inner}</g>` +
    `<text x="60" y="140" font-family="sans-serif" font-size="12" text-anchor="middle" fill="#5b5146">${label}</text></g>`;
  // Launchers show the 72x72 center of the 108 canvas scaled to the icon size.
  const full = `<g transform="scale(1.5) translate(-18 -18)"><rect width="108" height="108" fill="${NIGHT}"/>${svgShapes(foreground)}</g>`;
  const themed = `<g transform="scale(1.5) translate(-18 -18)"><rect width="108" height="108" fill="#E6DFF7"/><g fill="#4A3D7A" stroke="#4A3D7A">${svgShapes(monochrome).replaceAll('"#000000"', '"#4A3D7A"')}</g></g>`;
  const tiles = [
    ...masks.map(([label, clip], i) => tile(i, full, clip, label)),
    tile(3, themed, masks[0][1], "themed (Android 13+)"),
  ];
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${40 + 4 * cell} 190" width="${2 * (40 + 4 * cell)}" height="380">
  <rect width="100%" height="100%" fill="#FBF6EE"/>
  ${tiles.join("\n  ")}
</svg>
`;
}

async function write(rel, content) {
  const file = path.join(ROOT, rel);
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, content);
  console.log("wrote", rel);
}

assertSafe();
const res = "app/src/main/res";
await write(`${res}/drawable/ic_launcher_foreground.xml`, vectorDrawable(foreground, "OneShot logo v2 adaptive icon foreground."));
await write(`${res}/drawable/ic_launcher_monochrome.xml`, vectorDrawable(monochrome, "OneShot logo v2 themed icon (monochrome)."));
await write(`${res}/mipmap-anydpi-v26/ic_launcher.xml`, adaptiveIcon);
await write(`${res}/mipmap-anydpi-v26/ic_launcher_round.xml`, adaptiveIcon);
await write("logo/v2/foreground.svg", svg(foreground));
await write("logo/v2/monochrome.svg", svg(monochrome));
// Store icon: the visible 72x72 center of the adaptive canvas on the background, full bleed.
await write("logo/v2/logo.svg", svg(foreground, { background: NIGHT, viewBox: "18 18 72 72" }));
await write("logo/v2/preview.svg", previewSheet());
