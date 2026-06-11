# purescript-spa-kit task runner; recipes assume the Nix dev shell.

install:
    npm ci

build:
    spago build

format:
    purs-tidy format-in-place 'wasi-runner/src/**/*.purs' 'mui/src/**/*.purs' 'codemirror/src/**/*.purs'

format-check:
    purs-tidy check 'wasi-runner/src/**/*.purs' 'mui/src/**/*.purs' 'codemirror/src/**/*.purs'

ci: install format-check build

