const fs = require("node:fs");
const crypto = require("node:crypto");
const path = require("node:path");

const rootDir = path.resolve(__dirname, "..");
const distDir = path.join(rootDir, "dist");

const staticFiles = [
  "app.js",
  "styles.css",
  "Magnifying glass transparent.png",
  "New magnifying glass.png",
  "data/generated-tabs.json",
  "data/whats-this-documents.json",
];

function copyFile(relativePath) {
  const targetPath = path.join(distDir, relativePath);
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.copyFileSync(path.join(rootDir, relativePath), targetPath);
}

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

fs.rmSync(distDir, { recursive: true, force: true });
fs.mkdirSync(distDir, { recursive: true });

const buildVersion = buildVersionForFiles(staticFiles);
let html = fs.readFileSync(path.join(rootDir, "index.html"), "utf8");
html = html.replace(
  '<html lang="en">',
  `<html lang="en" data-quantum-target="github-pages" data-quantum-content-version="${buildVersion}">`,
);
html = html.replace(
  'href="styles.css"',
  `href="styles.css?v=${buildVersion}"`,
);
html = html.replace(
  /src="app\.js(?:\?v=[^"]*)?"/,
  `src="app.js?v=${buildVersion}"`,
);
fs.writeFileSync(path.join(distDir, "index.html"), html);

staticFiles.forEach(copyFile);
fs.writeFileSync(path.join(distDir, ".nojekyll"), "");

console.log(`Built GitHub Pages site in ${path.relative(rootDir, distDir)}`);
