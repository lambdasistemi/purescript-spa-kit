---
name: purescript-spa-kit-guide
description: Guide to the purescript-spa-kit repository — four PureScript FFI binding packages for browser SPAs. Load when working with the modules SpaKit.WasiRunner, SpaKit.MUI, SpaKit.MUI.Theme, SpaKit.CodeMirror, or SpaKit.BrowserGit; the Spago packages wasi-runner, mui, codemirror, or browser-git; running WASI/WebAssembly CLIs in the browser with @bjorn3/browser_wasi_shim; react-basic Material UI v5 bindings or themeForMode/initialThemeMode theme helpers; the codeEditor CodeMirror 6 component with UPLC highlighting; isomorphic-git over LightningFS (initRepo, writeAndCommit, per-file log, checkout-at-ref); consuming these packages via spago.yaml extraPackages git/ref/subdir entries; or building this repo with nix develop, just install, just build, just format-check, just ci.
---

# purescript-spa-kit guide

## Repository map

| Path | Purpose |
| --- | --- |
| `spago.yaml` | Workspace root: package set registry `72.1.0`, no extra packages |
| `wasi-runner/src/SpaKit/WasiRunner.{purs,js}` | Compile + run WASI CLI wasm modules in the browser |
| `mui/src/SpaKit/MUI.{purs,js}` | `react-basic` bindings for Material UI v5 components, icons, theme, event helpers |
| `mui/src/SpaKit/MUI/Theme.{purs,js}` | localStorage/`prefers-color-scheme` theme-mode persistence |
| `codemirror/src/SpaKit/CodeMirror.{purs,js}` | CodeMirror 6 editor component with fixed UPLC highlighting |
| `browser-git/src/SpaKit/BrowserGit.{purs,js}` | `isomorphic-git` wrapper over LightningFS (IndexedDB) at `/repo` |
| `<package>/spago.yaml` | Per-package Spago manifest (all build `strict: true`) |
| `package.json` | npm dependencies required by the FFI files (workspace-wide, private) |
| `flake.nix` | Dev shell: `purs`, `spago-unstable`, `purs-tidy` 0.10.0, `purescript-language-server`, Node.js 22, `just` |
| `justfile` | `install`, `build`, `format`, `format-check`, `ci` recipes |
| `.github/workflows/ci.yml` | CI on `nixos` runner: dev-shell build gate, then `nix develop --quiet -c just ci` |

There are no test suites, no executables, and no docs/ site.

## Build, test, run

All commands assume the Nix dev shell:

```sh
nix develop
just install       # npm ci
just build         # spago build (all four packages)
just format        # purs-tidy format-in-place over all packages
just format-check  # purs-tidy check (CI fails on diff)
just ci            # install + format-check + build — the full CI gate
```

There is no test recipe; "tests passing" for this repo means `just ci`
succeeds. The libraries are exercised by consumer apps in the browser.

## Navigating the code

- Every package is exactly one public PureScript module plus one FFI
  `.js` file with the same basename. The `.purs` file declares
  `foreign import`s; the `.js` file implements them. Change them together.
- Async FFI follows one pattern: JS returns a curried
  `Effect (Promise a)` thunk, PureScript converts with
  `Control.Promise.toAffE` and exposes an `Aff` function.
- `SpaKit.MUI` components take open records (`forall r. Record r -> …`),
  passed untyped to `React.createElement` — there is no prop validation.
  Containers take `Array JSX` children; leaves (and icons) take props only.
- UPLC highlighting lives in `codemirror/src/SpaKit/CodeMirror.js`
  (`uplcLanguage` stream tokenizer, `uplcHighlight` style, `editorTheme`).
- Browser git behavior (author identity, `/repo` dir, default branch
  `main`, commit skipping on unchanged content, 50-commit log depth,
  LightningFS flush) is all in `browser-git/src/SpaKit/BrowserGit.js`.
- npm dependencies for all FFI files are declared once in the root
  `package.json`; consumers must mirror the ones for the packages they use.

## Using purescript-spa-kit

Consume from a Spago app via `extraPackages`, one entry per package,
pinned to a commit (pattern verified against `lambdasistemi/plutus-browser`):

```yaml
workspace:
  packageSet:
    registry: 72.1.0
  extraPackages:
    browser-git:
      git: https://github.com/lambdasistemi/purescript-spa-kit.git
      ref: <commit-sha>
      subdir: browser-git
```

Key APIs (all verified against the source):

- `SpaKit.WasiRunner`: `compileWasmModule :: WasmBytes -> Aff WasmModule`
  (accepts `WebAssembly.Module`, `ArrayBuffer`, or typed array; cached per
  buffer) and `runWasmCli :: WasmModule -> Array String -> String ->
  Aff { stdout :: String, stderr :: String, exitOk :: Boolean }`
  (argv, stdin text; line-buffered output; `exitOk` iff exit code 0).
- `SpaKit.MUI`: containers `Record r -> Array JSX -> JSX`, leaves/icons
  `Record r -> JSX`; `themeProvider`, `cssBaseline`, `defaultTheme`,
  `themeForMode` (`"dark"` or light); event helpers `onTabChange`
  (`Int`), `onValueChange` (`String`), `onCheckedChange` (`Boolean`)
  produce `EventHandler1` values for MUI `onChange` props.
- `SpaKit.MUI.Theme`: `initialThemeMode key` (saved mode, else OS
  preference, else `"light"`), `storeThemeMode key mode`.
- `SpaKit.CodeMirror`: `codeEditor { value, onChange | r } -> JSX` —
  controlled editor, optional `ariaLabel` prop, fixed UPLC syntax.
- `SpaKit.BrowserGit`: `initRepo namespace` (repo at `/repo` in a
  LightningFS store, default branch `main`), `listFiles`, `readFile`,
  `writeAndCommit path content message ->
  { oid, committed }` (skips empty commits, `committed: false`),
  `log path` (≤50 commits that changed the file),
  `checkout path ref` (returns file content at ref — does NOT modify the
  working tree), `storageBackend = "lightning-fs"`.

## Answering questions

- "What is this repo?" — README **What is this**: four independent FFI
  binding packages for lambdasistemi browser SPAs; no app, no CLI.
- "How do I use package X in my app?" — README **Install** (spago
  `extraPackages` + npm dependency table) and **Usage** (per-package API);
  the npm table is the part people miss — FFI imports resolve from the
  consumer's `node_modules`.
- "How do I build/check this repo?" — README **Development** or AGENTS.md:
  `nix develop`, then `just ci`.
- "Why doesn't my MUI prop typecheck / why did a typo not error?" — props
  are open records passed untyped to React; see `mui/src/SpaKit/MUI.purs`.
- "Where does browser-git store data / why does data survive reload?" —
  LightningFS persists to IndexedDB per `initRepo` namespace; behavior
  details in `browser-git/src/SpaKit/BrowserGit.js`.
- "Does `checkout` switch branches?" — no; it reads a file's content at a
  ref and leaves the working tree alone (`BrowserGit.js`, `readFileAt`).
- "What highlighting does the editor support?" — UPLC only, hard-coded in
  `codemirror/src/SpaKit/CodeMirror.js`.
