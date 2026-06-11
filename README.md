# purescript-spa-kit

Reusable PureScript browser SPA packages used by lambdasistemi apps.

Packages:

- `wasi-runner`: run a WASI CLI from browser JavaScript with `@bjorn3/browser_wasi_shim`.
- `mui`: thin `react-basic` bindings for Material UI v5 components and theme helpers.
- `codemirror`: a `react-basic` CodeMirror 6 editor component with UPLC highlighting.
- `browser-git`: a thin browser `isomorphic-git` wrapper over persistent LightningFS storage.

## Development

```sh
nix develop
npm ci
spago build
```

The workspace uses Spago registry `72.1.0`. Keep `spago.lock` and
`package-lock.json` committed.
