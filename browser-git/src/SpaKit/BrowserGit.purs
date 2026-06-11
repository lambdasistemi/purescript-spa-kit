module SpaKit.BrowserGit
  ( BrowserRepo
  , CommitInfo
  , WriteResult
  , initRepo
  , listFiles
  , readFile
  , writeAndCommit
  , log
  , checkout
  , storageBackend
  ) where

import Prelude

import Control.Promise (Promise, toAffE)
import Effect (Effect)
import Effect.Aff (Aff)

foreign import data BrowserRepo :: Type

type CommitInfo =
  { oid :: String
  , message :: String
  , timestamp :: String
  }

type WriteResult =
  { oid :: String
  , committed :: Boolean
  }

foreign import initRepoImpl :: String -> Effect (Promise BrowserRepo)

foreign import listFilesImpl :: BrowserRepo -> Effect (Promise (Array String))

foreign import readFileImpl :: BrowserRepo -> String -> Effect (Promise String)

foreign import writeAndCommitImpl :: BrowserRepo -> String -> String -> String -> Effect (Promise WriteResult)

foreign import logImpl :: BrowserRepo -> String -> Effect (Promise (Array CommitInfo))

foreign import checkoutImpl :: BrowserRepo -> String -> String -> Effect (Promise String)

foreign import storageBackend :: String

initRepo :: String -> Aff BrowserRepo
initRepo = toAffE <<< initRepoImpl

listFiles :: BrowserRepo -> Aff (Array String)
listFiles = toAffE <<< listFilesImpl

readFile :: BrowserRepo -> String -> Aff String
readFile repo path =
  toAffE (readFileImpl repo path)

writeAndCommit :: BrowserRepo -> String -> String -> String -> Aff WriteResult
writeAndCommit repo path content message =
  toAffE (writeAndCommitImpl repo path content message)

log :: BrowserRepo -> String -> Aff (Array CommitInfo)
log repo path =
  toAffE (logImpl repo path)

checkout :: BrowserRepo -> String -> String -> Aff String
checkout repo path ref =
  toAffE (checkoutImpl repo path ref)
