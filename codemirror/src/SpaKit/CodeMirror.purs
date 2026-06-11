module SpaKit.CodeMirror
  ( codeEditor
  ) where

import Prelude

import Effect (Effect)
import React.Basic (JSX)

foreign import codeEditor
  :: forall r
   . { value :: String
     , onChange :: String -> Effect Unit
     | r
     }
  -> JSX

