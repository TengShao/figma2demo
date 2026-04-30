#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i += 1) {
    const key = argv[i];
    const next = argv[i + 1];
    if (key === "--html" || key === "--provenance") {
      if (!next || next.startsWith("--")) {
        throw new Error(`Missing value for ${key}`);
      }
      args[key.slice(2)] = next;
      i += 1;
    } else if (key === "--help") {
      args.help = true;
    } else {
      throw new Error(`Unknown argument: ${key}`);
    }
  }
  return args;
}

function usage() {
  return [
    "Usage:",
    "  node scripts/check_icon_fidelity.js --html output/<demo>/<demo>.html --provenance output/<demo>/icon-provenance.json",
    "",
    "Provenance JSON must be an array of rows with:",
    "  pageLocation, figmaNodeId, assetPath, exportFormat, wholeNodeExport, manualRebuild, implementationSelector",
    "Fallback rows also need fallbackReason.",
  ].join("\n");
}

function readText(file) {
  return fs.readFileSync(file, "utf8");
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
    ["text arrow/operator icon", /[›‹→←➜➔➝⌘＋+]/u],
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

function loadProvenance(file) {
  const data = JSON.parse(readText(file));
  if (!Array.isArray(data)) {
    throw new Error("Provenance JSON must be an array");
  }
  return data;
}

function validateProvenance(rows, provenanceFile) {
  const issues = [];
  const baseDir = path.dirname(provenanceFile);
  const required = ["pageLocation", "figmaNodeId", "assetPath", "exportFormat", "wholeNodeExport", "manualRebuild", "implementationSelector"];
  const assetOwners = new Map();

  rows.forEach((row, index) => {
    for (const key of required) {
      if (!(key in row) || row[key] === "" || row[key] === null) {
        issues.push(`provenance[${index}]: missing ${key}`);
      }
    }

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
  const args = parseArgs(process.argv);
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
  issues.push(...validateProvenance(loadProvenance(provenanceFile), provenanceFile));

  if (issues.length > 0) {
    console.error("Icon fidelity check failed:");
    for (const issue of issues) console.error(`- ${issue}`);
    process.exit(1);
  }

  console.log("Icon fidelity check passed.");
}

try {
  main();
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
