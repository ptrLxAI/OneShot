# Logo v2 "Smiling lens"

Proposal for the next OneShot logo: the amber camera of logo v1 (same palette, recognizable on existing home screens) whose lens smiles, because the app is about remembering the happy days, one shot per day. The glint keeps the single-shot spark of the old "1".

![Preview under launcher masks](preview.png)

- Source of truth: `scripts/logo/generate.mjs` (no npm dependencies). Never edit generated files by hand.
- Regenerate everything: `make logo` (Docker, `node:22-alpine` + `rsvg-convert`).
- Outputs: adaptive icon foreground and monochrome layer as VectorDrawables (`app/src/main/res/drawable/ic_launcher_*.xml`, wired in `mipmap-anydpi-v26/`), SVG masters here (`logo.svg` store icon, `foreground.svg`, `monochrome.svg`), `preview.png`, and the 512 px store icon `fastlane/metadata/android/en-US/images/icon.png`.
- Colors: amber `#FEBA4B`, night `#1F1B16` (adaptive background, `values/ic_launcher_background.xml`), cream `#FFF4DC`.
- Safe zone: the generator fails if the mark leaves the 33 dp radius that every launcher mask keeps.
