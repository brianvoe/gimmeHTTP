# Changelog

All notable changes to GimmeHttp are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- Upgraded TypeScript to 7 (with `@typescript/typescript6` for tooling that still needs the JS Compiler API)
- Upgraded vue-router to 5
- Upgraded vite-plugin-dts to 5
- Refreshed development toolchain (Vite 8, Vitest 4.1, jsdom 29, Vue tooling)
- Node engine/CI pin raised to Node 24 LTS (`>=24.18.0`)
- Library TypeScript declarations now emit as a mirrored `dist/` tree (`dist/index.d.ts`) instead of a single rolled-up
  `gimmehttp.d.ts`
- Vue package build externalizes `highlight.js` (peer) instead of leftover Shiki config
- Removed unused deps/config (`vuex`, Prism stubs, orphan ESLint config)
- Dropped deprecated TypeScript `baseUrl` from `tsconfig.json`
- Added Google Analytics to the documentation site
- Builder `line` / `append` / `format` now support printf-style `%s` (escaped), `%r` (raw), and `%%`; client generators use this instead of manual `EscapeDoubleQuoted` calls

### Fixed

- README peer dependency docs now correctly list `highlight.js` (not Shiki)
- Corrected HTTP client generators across languages for valid, idiomatic request snippets:
  - JSON/form/text body serialization and language-native null literals
  - HTTPS vs HTTP selection (Node `http`/`https`, Python `http.client`)
  - Cookie headers, query-param merging, and shell curl query/body interaction
  - Compile-breaking output in Go, C#, Java OkHttp, Rust, Swift, C libcurl, PHP, and others

## [1.5.1] - 2025-12-05

### Changed

- Vue component style usage updates

## [1.5.0] - 2025-12-04

### Changed

- Replaced Shiki with `highlight.js` for Vue syntax highlighting
- `highlight.js` is now the optional peer dependency for the Vue component (breaking for apps that only installed
  `shiki`)

## [1.4.0] - 2025-10-28

### Added

- Builder support for query/params handling

## [1.3.1] - 2025-10-27

### Fixed

- Vue component SVG max-height styling

## [1.3.0] - 2025-10-27

### Changed

- Vue highlighting via a Shiki singleton service
- Vue component style updates

## [1.1.4] - 2025-10-26

### Changed

- Vue CSS height limitation fixes
- CSS variables and related styling polish
- Package export points and Vue CSS import usage
- Vite config split by usage (docs / lib / vue)
- Simplified TypeScript config

### Removed

- AdSense usage from the documentation site

## [1.1.2] - 2025-10-24

### Changed

- Vue declared as an optional peer dependency
- Shiki externalized from the Vue build; JS engine instead of WASM
- npm ignore and packaging updates
- Privacy page and AdSense placement updates in documentation

## [1.1.1] - 2025-10-21

### Changed

- Docs and packaging polish

## [1.1.0] - 2025-10-19

### Added

- Additional HTTP clients
- Broader client/unit test coverage
- Vue component tests and logo fallback behavior
- Optional error-handling support across languages

### Changed

- Shell client body output gated on method/body presence
- Vue class naming to reduce style conflicts

## [1.0.5] - 2025-10-16

### Changed

- Utility and Vue component refinements

## [1.0.4] - 2025-10-16

### Changed

- Packaging and docs updates

## [1.0.3] - 2025-10-05

### Changed

- Vue CSS import path updates
- CI workflow migrated from Jest to Vitest

## [1.0.2] - 2025-10-04

### Added

- README Vue usage section

### Changed

- Vue Vite build config updates
- Removed unnecessary publicDir artifacts from the Vue/docs build

## [1.0.1] - 2025-10-03

### Changed

- Vue component animation and style tweaks
- Documentation and README updates

## [1.0.0] - 2025-10-02

### Added

- First stable release of GimmeHttp
- Vue 3 component and docs site integration
- Vitest-based test suite (replacing Jest)

### Changed

- Library packaging and build scripts modernization

## [0.0.9] - 2025-01-09

### Changed

- Pre-1.0 packaging and dependency updates

## [0.0.8] - 2025-01-08

### Changed

- Pre-1.0 package updates

## [0.0.7] - 2025-01-02

### Changed

- Pre-1.0 version bump and related fixes

## [0.0.6] - 2024-12-27

### Changed

- Pre-1.0 package updates

## [0.0.5] - 2024-11-19

### Changed

- Pre-1.0 package updates

## [0.0.4] - 2024-11-15

### Changed

- Early API and packaging iteration

## [0.0.3] - 2024-11-15

### Changed

- Early API and packaging iteration

## [0.0.2] - 2024-11-15

### Changed

- Early API and packaging iteration

## [0.0.1] - 2024-11-08

### Added

- Initial project release
