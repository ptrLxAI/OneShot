# Changelog

## [1.2.0](https://github.com/ptrLxAI/OneShot/compare/v1.1.1...v1.2.0) (2026-10-11)


### New features

* **branding:** add script-generated logo v2 with themed icon ([f5e2c18](https://github.com/ptrLxAI/OneShot/commit/f5e2c181c0960ad89fd1a6c9e54a7a854910f57e))
* **ui:** target Android 16 with edge-to-edge, predictive back and a splash screen ([06d6b9e](https://github.com/ptrLxAI/OneShot/commit/06d6b9e92b0dea94360e18d83d51dd255e061ef9))


### Bug fixes

* import valid entries of a JSON export and report skipped invalid ones ([7520719](https://github.com/ptrLxAI/OneShot/commit/752071919d150a11bb2b1554aa576650effe84c1))
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
