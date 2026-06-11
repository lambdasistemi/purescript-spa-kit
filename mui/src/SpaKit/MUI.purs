module SpaKit.MUI
  ( Theme
  , defaultTheme
  , themeForMode
  , cssBaseline
  , container
  , box
  , stack
  , paper
  , typography
  , button
  , iconButton
  , appBar
  , toolbar
  , drawer
  , tabs
  , tab
  , card
  , cardContent
  , cardActions
  , cardHeader
  , list
  , listItem
  , listItemButton
  , listItemText
  , chip
  , divider
  , alert
  , alertTitle
  , circularProgress
  , link
  , tooltip
  , textField
  , switch
  , checkbox
  , table
  , tableBody
  , tableCell
  , tableContainer
  , tableHead
  , tableRow
  , dialog
  , dialogTitle
  , dialogContent
  , dialogActions
  , badge
  , addIcon
  , appRegistrationIcon
  , accountCircleIcon
  , blockIcon
  , checkCircleIcon
  , closeIcon
  , darkModeIcon
  , deleteIcon
  , editIcon
  , lightModeIcon
  , manageAccountsIcon
  , playlistAddCheckIcon
  , refreshIcon
  , saveIcon
  , stopCircleIcon
  , syncIcon
  , undoIcon
  , warningAmberIcon
  , themeProvider
  , EventHandler1
  , onTabChange
  , onValueChange
  , onCheckedChange
  ) where

import Prelude

import Effect (Effect)
import React.Basic (JSX)

foreign import data Theme :: Type

foreign import defaultTheme :: Theme

foreign import themeForMode :: String -> Theme

foreign import cssBaseline :: JSX

foreign import container :: forall r. Record r -> Array JSX -> JSX
foreign import box :: forall r. Record r -> Array JSX -> JSX
foreign import stack :: forall r. Record r -> Array JSX -> JSX
foreign import paper :: forall r. Record r -> Array JSX -> JSX
foreign import typography :: forall r. Record r -> Array JSX -> JSX
foreign import button :: forall r. Record r -> Array JSX -> JSX
foreign import iconButton :: forall r. Record r -> Array JSX -> JSX
foreign import appBar :: forall r. Record r -> Array JSX -> JSX
foreign import toolbar :: forall r. Record r -> Array JSX -> JSX
foreign import drawer :: forall r. Record r -> Array JSX -> JSX
foreign import tabs :: forall r. Record r -> Array JSX -> JSX
foreign import card :: forall r. Record r -> Array JSX -> JSX
foreign import cardContent :: forall r. Record r -> Array JSX -> JSX
foreign import cardActions :: forall r. Record r -> Array JSX -> JSX
foreign import list :: forall r. Record r -> Array JSX -> JSX
foreign import listItem :: forall r. Record r -> Array JSX -> JSX
foreign import listItemButton :: forall r. Record r -> Array JSX -> JSX
foreign import alert :: forall r. Record r -> Array JSX -> JSX
foreign import themeProvider :: forall r. Record r -> Array JSX -> JSX
foreign import link :: forall r. Record r -> Array JSX -> JSX
foreign import tooltip :: forall r. Record r -> Array JSX -> JSX
foreign import tableContainer :: forall r. Record r -> Array JSX -> JSX
foreign import table :: forall r. Record r -> Array JSX -> JSX
foreign import tableHead :: forall r. Record r -> Array JSX -> JSX
foreign import tableBody :: forall r. Record r -> Array JSX -> JSX
foreign import tableRow :: forall r. Record r -> Array JSX -> JSX
foreign import tableCell :: forall r. Record r -> Array JSX -> JSX
foreign import dialog :: forall r. Record r -> Array JSX -> JSX
foreign import dialogTitle :: forall r. Record r -> Array JSX -> JSX
foreign import dialogContent :: forall r. Record r -> Array JSX -> JSX
foreign import dialogActions :: forall r. Record r -> Array JSX -> JSX
foreign import badge :: forall r. Record r -> Array JSX -> JSX

foreign import tab :: forall r. Record r -> JSX
foreign import textField :: forall r. Record r -> JSX
foreign import switch :: forall r. Record r -> JSX
foreign import checkbox :: forall r. Record r -> JSX
foreign import chip :: forall r. Record r -> JSX
foreign import divider :: forall r. Record r -> JSX
foreign import circularProgress :: forall r. Record r -> JSX
foreign import cardHeader :: forall r. Record r -> JSX
foreign import listItemText :: forall r. Record r -> JSX
foreign import alertTitle :: forall r. Record r -> JSX
foreign import addIcon :: forall r. Record r -> JSX
foreign import appRegistrationIcon :: forall r. Record r -> JSX
foreign import accountCircleIcon :: forall r. Record r -> JSX
foreign import blockIcon :: forall r. Record r -> JSX
foreign import checkCircleIcon :: forall r. Record r -> JSX
foreign import closeIcon :: forall r. Record r -> JSX
foreign import darkModeIcon :: forall r. Record r -> JSX
foreign import deleteIcon :: forall r. Record r -> JSX
foreign import editIcon :: forall r. Record r -> JSX
foreign import lightModeIcon :: forall r. Record r -> JSX
foreign import manageAccountsIcon :: forall r. Record r -> JSX
foreign import playlistAddCheckIcon :: forall r. Record r -> JSX
foreign import refreshIcon :: forall r. Record r -> JSX
foreign import saveIcon :: forall r. Record r -> JSX
foreign import stopCircleIcon :: forall r. Record r -> JSX
foreign import syncIcon :: forall r. Record r -> JSX
foreign import undoIcon :: forall r. Record r -> JSX
foreign import warningAmberIcon :: forall r. Record r -> JSX

foreign import data EventHandler1 :: Type

foreign import _onTabChange :: (Int -> Effect Unit) -> EventHandler1

foreign import _onValueChange :: (String -> Effect Unit) -> EventHandler1

foreign import _onCheckedChange :: (Boolean -> Effect Unit) -> EventHandler1

onTabChange :: (Int -> Effect Unit) -> EventHandler1
onTabChange = _onTabChange

onValueChange :: (String -> Effect Unit) -> EventHandler1
onValueChange = _onValueChange

onCheckedChange :: (Boolean -> Effect Unit) -> EventHandler1
onCheckedChange = _onCheckedChange
