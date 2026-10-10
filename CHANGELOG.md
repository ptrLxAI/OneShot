# Changelog

## [1.2.0](https://github.com/ptrLxAI/OneShot/compare/v1.1.1...v1.2.0) (2026-10-10)


### New features

* **branding:** add script-generated logo v2 with themed icon ([#78](https://github.com/ptrLxAI/OneShot/issues/78)) ([9aee50e](https://github.com/ptrLxAI/OneShot/commit/9aee50ea7b32b9769a694c746621da14aeb7dc78))
* **ui:** target Android 16 with edge-to-edge, predictive back and a splash screen ([#96](https://github.com/ptrLxAI/OneShot/issues/96)) ([0f12489](https://github.com/ptrLxAI/OneShot/commit/0f12489666b10773d88a3ac34bcf2c3a78eae6c3))


### Bug fixes

* import valid entries of a JSON export and report skipped invalid ones ([#89](https://github.com/ptrLxAI/OneShot/issues/89)) ([f5695f1](https://github.com/ptrLxAI/OneShot/commit/f5695f13b1c2217dc04c4ca7f7ee65e8b486822e))
* Sort baseline.profm for reproducible builds ([c52830b](https://github.com/ptrLxAI/OneShot/commit/c52830bdcad465dc3bc66198cb0c0c53d35e6e1b))
* Sort baseline.profm for reproducible builds ([4710d08](https://github.com/ptrLxAI/OneShot/commit/4710d080f0fb5152f5f87f16655f2538f395d39e))

## [1.1.1] - 2023-04-08

### New features

* German translation

### Bug fixes

* [#5] Image preview too dark: Removed gradient in large image view

## [1.1.0] - 2023-03-15

### New features

* Added feature for image import (only via copy)
* New Screenshots of updated UI with new sample pictures

## [1.0.0] - 2023-02-20

Initial release including:

* Implementation of base application in Kotlin and UI in Jetpack Compose:
  * Request for folder permission
  * CRUD for capture image, happiness, diary
  * Flashbacks, diary view, calendar view and streak-count
* Room database storage and data export to JSON
* Dark- / light theme aligned with system design
* App Logo v1
