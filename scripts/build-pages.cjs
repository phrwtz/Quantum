const fs = require("node:fs");
const crypto = require("node:crypto");
const path = require("node:path");
const { syncContentBundle } = require("./sync-content-bundle.cjs");

const rootDir = path.resolve(__dirname, "..");
const distDir = path.join(rootDir, "dist");
const quantumTarget = String(process.env.QUANTUM_TARGET || "github-pages")
  .trim()
  .replace(/[^a-z0-9-]/gi, "-")
  .toLowerCase() || "github-pages";

const assetFiles = [
  "app.js",
  "quantum-core.js",
  "styles.css",
  "assets/landing-lab-hero.png",
  "Magnifying glass transparent.png",
  "Wide magnifying glass transparent.png",
  "New magnifying glass.png",
  "data/generated-tabs.json",
  "data/whats-this-documents.json",
  "data/repository-content.js",
];

function copyFile(relativePath) {
  const targetPath = path.join(distDir, relativePath);
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.copyFileSync(path.join(rootDir, relativePath), targetPath);
}

fs.rmSync(distDir, { recursive: true, force: true });
fs.mkdirSync(distDir, { recursive: true });
syncContentBundle();

function buildVersionForFiles(relativePaths) {
  const hash = crypto.createHash("sha256");
  relativePaths.forEach((relativePath) => {
    hash.update(relativePath);
    hash.update("\0");
    hash.update(fs.readFileSync(path.join(rootDir, relativePath)));
    hash.update("\0");
  });
  return hash.digest("hex").slice(0, 16);
}

const buildVersion = buildVersionForFiles(assetFiles);

let html = fs.readFileSync(path.join(rootDir, "index.html"), "utf8");
html = html.replace(
  "__PUBLIC_BACKEND_URL__",
  String(process.env.PUBLIC_BACKEND_URL || ""),
);
html = html.replace(
  '<html lang="en">',
  `<html lang="en" data-quantum-target="${quantumTarget}" data-quantum-content-version="${buildVersion}">`,
);
html = html.replace(
  'href="styles.css"',
  `href="styles.css?v=${buildVersion}"`,
);
html = html.replace(
  /src="data\/repository-content\.js(?:\?v=[^"]*)?"/,
  `src="data/repository-content.js?v=${buildVersion}"`,
);
html = html.replace(
  /src="quantum-core\.js(?:\?v=[^"]*)?"/,
  `src="quantum-core.js?v=${buildVersion}"`,
);
html = html.replace(
  /src="app\.js(?:\?v=[^"]*)?"/,
  `src="app.js?v=${buildVersion}"`,
);
fs.writeFileSync(path.join(distDir, "index.html"), html);

assetFiles.forEach(copyFile);
fs.writeFileSync(path.join(distDir, ".nojekyll"), "");

console.log(
  `Built ${quantumTarget} site in ${path.relative(rootDir, distDir)}`,
);
