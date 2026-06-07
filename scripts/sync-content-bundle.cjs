const fs = require("node:fs");
const path = require("node:path");

const rootDir = path.resolve(__dirname, "..");
const contentFiles = [
  "data/generated-tabs.json",
  "data/whats-this-documents.json",
];
const bundlePath = path.join(rootDir, "data", "repository-content.js");

function readJsonFile(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(rootDir, relativePath), "utf8"));
}

function syncContentBundle() {
  const files = Object.fromEntries(
    contentFiles.map((relativePath) => [relativePath, readJsonFile(relativePath)]),
  );
  fs.writeFileSync(
    bundlePath,
    [
      "(() => {",
      "  window.__QUANTUM_REPOSITORY_CONTENT__ = {",
      `    files: ${JSON.stringify(files)},`,
      "  };",
      "})();",
      "",
    ].join("\n"),
  );
  return bundlePath;
}

if (require.main === module) {
  const written = syncContentBundle();
  console.log(`Synced ${path.relative(rootDir, written)}`);
}

module.exports = {
  syncContentBundle,
};
