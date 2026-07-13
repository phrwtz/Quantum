const fs = require("node:fs");
const path = require("node:path");
const { syncContentBundle } = require("./sync-content-bundle.cjs");

const rootDir = path.resolve(__dirname, "..");
const defaultChromeRoot = path.join(
  process.env.HOME || "",
  "Library",
  "Application Support",
  "Google",
  "Chrome",
);

const contentTargets = {
  "generated-tabs": path.join(rootDir, "data", "generated-tabs.json"),
  documents: path.join(rootDir, "data", "whats-this-documents.json"),
};

const keyPrefix = "quantum_editor_content_state_v1";

function decodeVarint(buffer, offset) {
  let result = 0;
  let shift = 0;
  let cursor = offset;
  while (cursor < buffer.length && shift <= 63) {
    const byte = buffer[cursor];
    cursor += 1;
    result += (byte & 0x7f) * 2 ** shift;
    if ((byte & 0x80) === 0) {
      return { value: result, offset: cursor };
    }
    shift += 7;
  }
  return null;
}

function decodeBlockHandle(buffer, offset) {
  const blockOffset = decodeVarint(buffer, offset);
  if (!blockOffset) {
    return null;
  }
  const blockSize = decodeVarint(buffer, blockOffset.offset);
  if (!blockSize) {
    return null;
  }
  return {
    offset: blockOffset.value,
    size: blockSize.value,
    nextOffset: blockSize.offset,
  };
}

function snappyUncompress(input) {
  const header = decodeVarint(input, 0);
  if (!header) {
    throw new Error("Invalid Snappy stream");
  }
  const output = Buffer.alloc(header.value);
  let inOffset = header.offset;
  let outOffset = 0;
  while (inOffset < input.length) {
    const tag = input[inOffset];
    inOffset += 1;
    const type = tag & 0x03;
    if (type === 0) {
      let length = tag >> 2;
      if (length < 60) {
        length += 1;
      } else {
        const byteCount = length - 59;
        length = 1;
        for (let index = 0; index < byteCount; index += 1) {
          length += input[inOffset + index] << (8 * index);
        }
        inOffset += byteCount;
      }
      input.copy(output, outOffset, inOffset, inOffset + length);
      inOffset += length;
      outOffset += length;
      continue;
    }
    let length;
    let copyOffset;
    if (type === 1) {
      length = ((tag >> 2) & 0x7) + 4;
      copyOffset = ((tag & 0xe0) << 3) | input[inOffset];
      inOffset += 1;
    } else if (type === 2) {
      length = (tag >> 2) + 1;
      copyOffset = input[inOffset] | (input[inOffset + 1] << 8);
      inOffset += 2;
    } else {
      length = (tag >> 2) + 1;
      copyOffset =
        input[inOffset] |
        (input[inOffset + 1] << 8) |
        (input[inOffset + 2] << 16) |
        (input[inOffset + 3] << 24);
      inOffset += 4;
    }
    if (copyOffset <= 0 || copyOffset > outOffset) {
      throw new Error("Invalid Snappy copy offset");
    }
    for (let index = 0; index < length; index += 1) {
      output[outOffset] = output[outOffset - copyOffset];
      outOffset += 1;
    }
  }
  if (outOffset !== output.length) {
    throw new Error("Invalid Snappy output length");
  }
  return output;
}

function readTableBlock(fileBuffer, handle) {
  const start = handle.offset;
  const end = start + handle.size;
  if (start < 0 || end + 5 > fileBuffer.length) {
    throw new Error("Invalid LevelDB block handle");
  }
  const rawBlock = fileBuffer.subarray(start, end);
  const compressionType = fileBuffer[end];
  if (compressionType === 0) {
    return rawBlock;
  }
  if (compressionType === 1) {
    return snappyUncompress(rawBlock);
  }
  throw new Error(`Unsupported LevelDB block compression ${compressionType}`);
}

function parseBlockEntries(block) {
  if (block.length < 4) {
    return [];
  }
  const restartCount = block.readUInt32LE(block.length - 4);
  const restartBytes = restartCount * 4 + 4;
  if (restartBytes > block.length) {
    return [];
  }
  const limit = block.length - restartBytes;
  const entries = [];
  let offset = 0;
  let previousKey = Buffer.alloc(0);
  while (offset < limit) {
    const shared = decodeVarint(block, offset);
    if (!shared) {
      break;
    }
    const nonShared = decodeVarint(block, shared.offset);
    if (!nonShared) {
      break;
    }
    const valueLength = decodeVarint(block, nonShared.offset);
    if (!valueLength) {
      break;
    }
    offset = valueLength.offset;
    const keyEnd = offset + nonShared.value;
    const valueEnd = keyEnd + valueLength.value;
    if (keyEnd > limit || valueEnd > limit || shared.value > previousKey.length) {
      break;
    }
    const key = Buffer.concat([
      previousKey.subarray(0, shared.value),
      block.subarray(offset, keyEnd),
    ]);
    const value = block.subarray(keyEnd, valueEnd);
    entries.push({ key, value });
    previousKey = key;
    offset = valueEnd;
  }
  return entries;
}

function readTableEntries(filePath) {
  const fileBuffer = fs.readFileSync(filePath);
  if (fileBuffer.length < 48) {
    return [];
  }
  const footer = fileBuffer.subarray(fileBuffer.length - 48);
  const metaHandle = decodeBlockHandle(footer, 0);
  if (!metaHandle) {
    return [];
  }
  const indexHandle = decodeBlockHandle(footer, metaHandle.nextOffset);
  if (!indexHandle) {
    return [];
  }
  const indexEntries = parseBlockEntries(readTableBlock(fileBuffer, indexHandle));
  const entries = [];
  for (const indexEntry of indexEntries) {
    const dataHandle = decodeBlockHandle(indexEntry.value, 0);
    if (!dataHandle) {
      continue;
    }
    entries.push(...parseBlockEntries(readTableBlock(fileBuffer, dataHandle)));
  }
  return entries;
}

function userKeyFromInternalKey(key) {
  return key.length > 8 ? key.subarray(0, key.length - 8) : key;
}

function decodeDomStorageValue(value) {
  const payload =
    value.length > 0 && (value[0] === 0 || value[0] === 1)
      ? value.subarray(1)
      : value;
  return payload.toString("utf8");
}

function listLevelDbDirs(chromeRoot) {
  if (!fs.existsSync(chromeRoot)) {
    return [];
  }
  return fs
    .readdirSync(chromeRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) =>
      path.join(chromeRoot, entry.name, "Local Storage", "leveldb"),
    )
    .filter((candidate) => fs.existsSync(candidate));
}

function findStoredContent({ origin, contentName, chromeRoot }) {
  const storageKey = `${keyPrefix}_${contentName}`;
  const originFragment = `_${origin}`;
  const matches = [];
  for (const levelDbDir of listLevelDbDirs(chromeRoot)) {
    const files = fs
      .readdirSync(levelDbDir)
      .filter((name) => /\.(?:ldb|sst)$/.test(name))
      .map((name) => path.join(levelDbDir, name));
    for (const filePath of files) {
      let entries;
      try {
        entries = readTableEntries(filePath);
      } catch (_error) {
        continue;
      }
      for (const entry of entries) {
        const key = userKeyFromInternalKey(entry.key).toString("utf8");
        if (!key.includes(originFragment) || !key.endsWith(storageKey)) {
          continue;
        }
        const serialized = decodeDomStorageValue(entry.value);
        try {
          const state = JSON.parse(serialized);
          matches.push({
            filePath,
            levelDbDir,
            key,
            serialized,
            state,
            mtimeMs: fs.statSync(filePath).mtimeMs,
          });
        } catch (_error) {
          // Ignore stale or partially compacted values.
        }
      }
    }
  }
  return matches;
}

function newestLayoutTimestamp(state) {
  const tabs = Array.isArray(state?.tabs) ? state.tabs : [];
  return Math.max(
    0,
    ...tabs.map((tab) => Number(tab?.layout?.savedAt) || 0),
  );
}

function pickNewestMatch(matches) {
  return matches
    .slice()
    .sort((left, right) => {
      const timestampDelta =
        newestLayoutTimestamp(right.state) - newestLayoutTimestamp(left.state);
      if (timestampDelta !== 0) {
        return timestampDelta;
      }
      return right.mtimeMs - left.mtimeMs;
    })[0];
}

function parseArgs(argv) {
  const args = {
    origin: "https://qubit-lab-vawa.onrender.com",
    contentName: "generated-tabs",
    chromeRoot: defaultChromeRoot,
  };
  for (let index = 2; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--origin") {
      args.origin = argv[index + 1] || args.origin;
      index += 1;
    } else if (arg === "--content") {
      args.contentName = argv[index + 1] || args.contentName;
      index += 1;
    } else if (arg === "--chrome-root") {
      args.chromeRoot = argv[index + 1] || args.chromeRoot;
      index += 1;
    }
  }
  return args;
}

function main() {
  const args = parseArgs(process.argv);
  const outputPath = contentTargets[args.contentName];
  if (!outputPath) {
    throw new Error(
      `Unknown content "${args.contentName}". Expected one of ${Object.keys(
        contentTargets,
      ).join(", ")}`,
    );
  }
  const matches = findStoredContent(args);
  const match = pickNewestMatch(matches);
  if (!match) {
    throw new Error(
      `No ${args.contentName} editor state found for ${args.origin}`,
    );
  }
  fs.writeFileSync(outputPath, `${JSON.stringify(match.state, null, 2)}\n`);
  const bundlePath = syncContentBundle();
  const tabCount = Array.isArray(match.state.tabs) ? match.state.tabs.length : 0;
  console.log(
    JSON.stringify(
      {
        ok: true,
        content: args.contentName,
        origin: args.origin,
        source: path.relative(process.cwd(), match.filePath),
        output: path.relative(process.cwd(), outputPath),
        bundle: path.relative(process.cwd(), bundlePath),
        tabCount,
        newestLayoutTimestamp: newestLayoutTimestamp(match.state),
      },
      null,
      2,
    ),
  );
}

main();
