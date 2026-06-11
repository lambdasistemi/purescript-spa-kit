module SpaKit.WasiRunner
  ( WasmBytes
  , WasmModule
  , WasmCliResult
  , compileWasmModule
  , runWasmCli
  ) where

import Prelude

import Control.Promise (Promise, toAffE)
import Effect (Effect)
import Effect.Aff (Aff)

foreign import data WasmBytes :: Type

foreign import data WasmModule :: Type

type WasmCliResult =
  { stdout :: String
  , stderr :: String
  , exitOk :: Boolean
  }

foreign import compileWasmModuleImpl :: WasmBytes -> Effect (Promise WasmModule)

foreign import runWasmCliImpl :: WasmModule -> Array String -> String -> Effect (Promise WasmCliResult)

compileWasmModule :: WasmBytes -> Aff WasmModule
compileWasmModule = toAffE <<< compileWasmModuleImpl

runWasmCli :: WasmModule -> Array String -> String -> Aff WasmCliResult
runWasmCli wasmModule args stdinText =
  toAffE (runWasmCliImpl wasmModule args stdinText)

