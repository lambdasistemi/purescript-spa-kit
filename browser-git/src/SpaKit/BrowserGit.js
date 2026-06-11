import LightningFS from "@isomorphic-git/lightning-fs";
import git from "isomorphic-git";
import { Buffer } from "buffer";

if (!globalThis.Buffer) {
  globalThis.Buffer = Buffer;
}

const DIR = "/repo";
const AUTHOR = {
  name: "Browser",
  email: "browser@example.invalid",
};

export const storageBackend = "lightning-fs";

export const initRepoImpl = (namespace) => () => initRepo(namespace);

export const listFilesImpl = (repo) => () => listFiles(repo);

export const readFileImpl = (repo) => (filepath) => () =>
  repo.pfs.readFile(fullPath(filepath), { encoding: "utf8" });

export const writeAndCommitImpl = (repo) => (filepath) => (content) => (message) =>
  () => writeAndCommit(repo, filepath, content, message);

export const logImpl = (repo) => (filepath) => () => log(repo, filepath);

export const checkoutImpl = (repo) => (filepath) => (ref) => () =>
  readFileAt(repo, filepath, ref);

async function initRepo(namespace) {
  const fs = new LightningFS(namespace);
  const pfs = fs.promises;
  await mkdirp(pfs, DIR);

  const repo = { fs, pfs, dir: DIR };
  try {
    await git.resolveRef({ fs, dir: DIR, ref: "HEAD" });
  } catch (_err) {
    const hasGitDir = await exists(pfs, `${DIR}/.git`);
    if (!hasGitDir) {
      await git.init({ fs, dir: DIR, defaultBranch: "main" });
    }
  }
  await flush(repo);

  return repo;
}

async function listFiles(repo) {
  try {
    return await git.listFiles({ fs: repo.fs, dir: repo.dir });
  } catch (err) {
    if (isEmptyRepositoryError(err)) {
      return [];
    }
    throw err;
  }
}

async function writeAndCommit(repo, filepath, content, message) {
  await mkdirp(repo.pfs, parentPath(fullPath(filepath)));
  await repo.pfs.writeFile(fullPath(filepath), content, { encoding: "utf8" });
  await git.add({ fs: repo.fs, dir: repo.dir, filepath });

  const changed = await hasStagedChange(repo, filepath);
  if (!changed) {
    await flush(repo);
    return { oid: await currentHead(repo), committed: false };
  }

  const now = new Date();
  const oid = await git.commit({
    fs: repo.fs,
    dir: repo.dir,
    message,
    author: {
      ...AUTHOR,
      timestamp: Math.floor(now.getTime() / 1000),
      timezoneOffset: now.getTimezoneOffset(),
    },
  });
  await flush(repo);

  return { oid, committed: true };
}

async function log(repo, filepath) {
  try {
    const entries = await git.log({
      fs: repo.fs,
      dir: repo.dir,
      depth: 50,
    });

    const fileEntries = [];
    for (const entry of entries) {
      const blobOid = await blobOidAt(repo, entry.oid, filepath);
      if (!blobOid) {
        continue;
      }

      const parent = entry.commit.parent?.[0];
      const parentBlobOid = parent ? await blobOidAt(repo, parent, filepath) : null;
      if (blobOid === parentBlobOid) {
        continue;
      }

      fileEntries.push({
        oid: entry.oid,
        message: firstLine(entry.commit.message),
        timestamp: timestampFor(entry.commit.author),
      });
    }

    return fileEntries;
  } catch (err) {
    if (isEmptyRepositoryError(err)) {
      return [];
    }
    throw err;
  }
}

async function readFileAt(repo, filepath, ref) {
  const { blob } = await git.readBlob({
    fs: repo.fs,
    dir: repo.dir,
    oid: ref,
    filepath,
  });
  return new TextDecoder().decode(blob);
}

async function blobOidAt(repo, ref, filepath) {
  try {
    const { oid } = await git.readBlob({
      fs: repo.fs,
      dir: repo.dir,
      oid: ref,
      filepath,
    });
    return oid;
  } catch (_err) {
    return null;
  }
}

async function hasStagedChange(repo, filepath) {
  const matrix = await git.statusMatrix({
    fs: repo.fs,
    dir: repo.dir,
    filepaths: [filepath],
  });

  return matrix.some((row) => row[1] !== row[3]);
}

async function currentHead(repo) {
  try {
    return await git.resolveRef({ fs: repo.fs, dir: repo.dir, ref: "HEAD" });
  } catch (_err) {
    return "";
  }
}

async function mkdirp(pfs, path) {
  const parts = path.split("/").filter(Boolean);
  let cursor = "";
  for (const part of parts) {
    cursor += `/${part}`;
    try {
      await pfs.mkdir(cursor);
    } catch (err) {
      if (err?.code !== "EEXIST") {
        throw err;
      }
    }
  }
}

async function exists(pfs, path) {
  try {
    await pfs.stat(path);
    return true;
  } catch (_err) {
    return false;
  }
}

async function flush(repo) {
  if (typeof repo.pfs.flush === "function") {
    await repo.pfs.flush();
  }
}

function fullPath(filepath) {
  return `${DIR}/${filepath}`;
}

function parentPath(path) {
  const idx = path.lastIndexOf("/");
  return idx <= 0 ? "/" : path.slice(0, idx);
}

function firstLine(message) {
  return String(message || "").split("\n")[0];
}

function timestampFor(author) {
  const seconds = Number(author?.timestamp || 0);
  if (!seconds) {
    return "";
  }
  return new Date(seconds * 1000).toISOString();
}

function isEmptyRepositoryError(err) {
  const code = err?.code || err?.name || "";
  const message = String(err?.message || "");
  return (
    code === "NotFoundError" ||
    code === "MissingRefError" ||
    message.includes("Could not find HEAD") ||
    message.includes("Could not find ref")
  );
}
