# Repository Agent Guide

## What this repo is

`purescript-spa-kit` is a Spago multi-package workspace of four independent
PureScript FFI binding libraries for browser single-page apps:
`wasi-runner` (run WASI CLIs in the browser via `@bjorn3/browser_wasi_shim`),
`mui` (`react-basic` bindings for Material UI v5 plus theme helpers),
`codemirror` (a CodeMirror 6 editor component with UPLC highlighting), and
`browser-git` (`isomorphic-git` over persistent LightningFS storage).
Libraries only: no executables, no test suites, no docs site. Consumer apps
(e.g. `lambdasistemi/plutus-browser`) pull packages via Spago
`extraPackages` git references with `subdir`, and must add the matching
npm dependencies to their own `package.json`.

## How to work here

- Enter the dev shell first: `nix develop` (provides `purs`, `spago`,
  `purs-tidy` 0.10.0, `purescript-language-server`, Node.js 22, `just`).
- Install npm dependencies: `just install` (runs `npm ci`).
- Build: `just build` (runs `spago build`; all packages build strict).
- Format: `just format`; verify formatting: `just format-check`.
- Full local CI gate: `just ci` (install + format-check + build — exactly
  what GitHub Actions runs via `nix develop --quiet -c just ci`).
- Each package is one PureScript module plus one FFI `.js` file under
  `<package>/src/SpaKit/`. When changing a `foreign import`, update both
  files together.
- A new npm dependency in any FFI file must be added to the root
  `package.json`; keep `spago.lock` and `package-lock.json` committed.
- Commit messages follow Conventional Commits (`feat:`, `fix:`, `docs:`, …).

## Skills

Activatable procedures live under `skills/`. Load the one whose
description matches your task:

- `skills/purescript-spa-kit-guide/` — repository map, build/test/run
  commands, code navigation, and verified usage examples for all four
  packages; how to answer user questions about this repo.
