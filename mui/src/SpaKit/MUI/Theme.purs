module SpaKit.MUI.Theme
  ( initialThemeMode
  , storeThemeMode
  ) where

import Prelude

import Effect (Effect)

foreign import initialThemeMode :: String -> Effect String

foreign import storeThemeMode :: String -> String -> Effect Unit

