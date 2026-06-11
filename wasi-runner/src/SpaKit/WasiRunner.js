import { WASI, File, OpenFile, ConsoleStdout } from "@bjorn3/browser_wasi_shim";

const moduleCache = new WeakMap();

export const compileWasmModuleImpl = (wasmSource) => () => {
  if (wasmSource instanceof WebAssembly.Module) {
    return Promise.resolve(wasmSource);
  }

  const cacheKey = cacheKeyFor(wasmSource);
  if (!moduleCache.has(cacheKey)) {
    moduleCache.set(cacheKey, WebAssembly.compile(wasmSource));
  }

  return moduleCache.get(cacheKey);
};

export const runWasmCliImpl = (wasmModule) => (args) => (stdinText) => () =>
  runWasmCli(wasmModule, args, stdinText);

async function runWasmCli(wasmModule, args, stdinText) {
  const stdin = new OpenFile(new File(new TextEncoder().encode(stdinText)));
  const stdoutLines = [];
  const stderrLines = [];
  const stdout = ConsoleStdout.lineBuffered((line) => stdoutLines.push(line));
  const stderr = ConsoleStdout.lineBuffered((line) => stderrLines.push(line));
  const wasi = new WASI(args, [], [stdin, stdout, stderr]);

  const inst = await WebAssembly.instantiate(wasmModule, {
    wasi_snapshot_preview1: wasi.wasiImport,
  });

  let exitOk = true;
  try {
    wasi.start(inst);
  } catch (err) {
    const code = typeof err?.code === "number" ? err.code : undefined;
    exitOk = code === 0;
    if (!exitOk) {
      stderrLines.push(String(err?.message || err));
    }
  }

  return {
    stdout: stdoutLines.join("\n"),
    stderr: stderrLines.join("\n"),
    exitOk,
  };
}

function cacheKeyFor(wasmSource) {
  if (wasmSource instanceof ArrayBuffer) {
    return wasmSource;
  }

  if (ArrayBuffer.isView(wasmSource)) {
    return wasmSource.buffer;
  }

  throw new TypeError("Expected a WebAssembly.Module, ArrayBuffer, or typed array");
}

