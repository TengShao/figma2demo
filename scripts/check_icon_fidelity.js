#!/usr/bin/env node

const {
  fs,
  path,
  parseArgs,
  readText,
  loadJsonArray,
  isNotApplicable,
  validateRequired,
  report,
} = require("./check_utils");

function usage() {
  return [
    "Usage:",
    "  node scripts/check_icon_fidelity.js --html output/<demo>/<demo>.html --provenance output/<demo>/icon-provenance.json",
    "",
    "Provenance JSON must be an array of rows with:",
    "  pageLocation, figmaNodeId, assetPath, exportFormat, wholeNodeExport, manualRebuild, implementationSelector",
    "Fallback rows also need fallbackReason.",
    "If the page has no icon/vector rows, use [{\"notApplicableReason\":\"...\"}].",
  ].join("\n");
}

function collectLinkedCss(html, htmlFile) {
  const cssFiles = [];
  const linkPattern = /<link\b[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']+)["'][^>]*>/gi;
  for (const match of html.matchAll(linkPattern)) {
    const href = match[1];
    if (/^(https?:)?\/\//i.test(href) || href.startsWith("data:")) continue;
    const cssPath = path.resolve(path.dirname(htmlFile), href.split(/[?#]/)[0]);
    if (fs.existsSync(cssPath)) cssFiles.push(cssPath);
  }
  return cssFiles;
}

function hasException(text, sourceName) {
  const exceptionPattern = /figma2demo-icon-exception\s+node=[^\s]+\s+reason=.{6,}/i;
  return exceptionPattern.test(text) || exceptionPattern.test(sourceName);
}

function scanForbidden(text, sourceName) {
  const checks = [
    ["inline SVG", /<svg\b/i],
    ["CSS pseudo-element", /::(?:before|after)\b/i],
    ["CSS content drawing", /\bcontent\s*:\s*["'][^"']+["']/i],
    ["icon library usage", /\b(?:lucide|heroicons?|font-?awesome|material-icons?|data-lucide)\b/i],
    ["icon font element", /<i\b[^>]*class=["'][^"']*(?:icon|fa-|material-icons?)[^"']*["']/i],
    ["text arrow/operator icon", /[›‹→←➜➔➝⌘＋]/u],
    ["border-drawn icon class", /\.(?:[\w-]*icon[\w-]*|[\w-]*arrow[\w-]*|[\w-]*chevron[\w-]*)[^{]*\{[^}]*\bborder(?:-(?:top|right|bottom|left))?\s*:/i],
    ["global icon/arrow transform", /(?:^|})\s*(?:\.[^{},]*(?:icon|arrow|chevron)[^{},]*|img[^{},]*(?:icon|arrow|chevron)[^{},]*)\s*\{[^}]*\btransform\s*:/i],
  ];

  const issues = [];
  for (const [label, pattern] of checks) {
    if (pattern.test(text) && !hasException(text, sourceName)) {
      issues.push(`${sourceName}: forbidden ${label}`);
    }
  }
  return issues;
}

function validateProvenance(rows, provenanceFile) {
  const issues = [];
  const baseDir = path.dirname(provenanceFile);
  const required = ["pageLocation", "figmaNodeId", "assetPath", "exportFormat", "wholeNodeExport", "manualRebuild", "implementationSelector"];
  const assetOwners = new Map();

  if (isNotApplicable(rows)) return issues;

  rows.forEach((row, index) => {
    validateRequired(row, required, "provenance", index, issues);

    if (row.manualRebuild === true) {
      issues.push(`provenance[${index}]: manualRebuild must be false`);
    }

    if (row.wholeNodeExport !== true && !row.fallbackReason) {
      issues.push(`provenance[${index}]: non-whole-node export requires fallbackReason`);
    }

    if (typeof row.figmaNodeId === "string" && !/[A-Za-z0-9]+[:_-][A-Za-z0-9]+/.test(row.figmaNodeId)) {
      issues.push(`provenance[${index}]: figmaNodeId should be an actual instance node id`);
    }

    if (row.assetPath) {
      const assetPath = path.isAbsolute(row.assetPath)
        ? row.assetPath
        : path.resolve(baseDir, row.assetPath);
      if (!fs.existsSync(assetPath)) {
        issues.push(`provenance[${index}]: assetPath does not exist: ${row.assetPath}`);
      }
      const owner = assetOwners.get(row.assetPath);
      if (owner && owner !== row.figmaNodeId && !row.sharedAssetReason) {
        issues.push(`provenance[${index}]: assetPath is reused across different Figma nodes without sharedAssetReason: ${row.assetPath}`);
      } else {
        assetOwners.set(row.assetPath, row.figmaNodeId);
      }
    }
  });

  if (rows.length === 0) {
    issues.push("provenance: expected at least one icon/vector row");
  }

  return issues;
}

function main() {
  const args = parseArgs(process.argv, ["--html", "--provenance"]);
  if (args.help) {
    console.log(usage());
    return;
  }
  if (!args.html || !args.provenance) {
    throw new Error(`${usage()}\n\nMissing --html or --provenance`);
  }

  const htmlFile = path.resolve(args.html);
  const provenanceFile = path.resolve(args.provenance);
  const html = readText(htmlFile);
  const cssFiles = collectLinkedCss(html, htmlFile);

  const issues = [];
  issues.push(...scanForbidden(html, htmlFile));
  for (const cssFile of cssFiles) {
    issues.push(...scanForbidden(readText(cssFile), cssFile));
  }
  issues.push(...validateProvenance(loadJsonArray(provenanceFile, "Provenance"), provenanceFile));
  report("Icon fidelity", issues);
}

try {
  main();
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
