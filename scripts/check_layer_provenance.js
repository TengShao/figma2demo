#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i += 1) {
    const key = argv[i];
    const next = argv[i + 1];
    if (key === "--provenance") {
      if (!next || next.startsWith("--")) throw new Error(`Missing value for ${key}`);
      args.provenance = next;
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
    "  node scripts/check_layer_provenance.js --provenance output/<demo>/layer-provenance.json",
    "",
    "Provenance JSON must be an array of child-layer rows with:",
    "  region, figmaNodeId, layerName, layerType, bounds, zOrder, role, implemented, implementationSelector",
  ].join("\n");
}

function loadRows(file) {
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  if (!Array.isArray(data)) throw new Error("Layer provenance JSON must be an array");
  return data;
}

function hasBounds(bounds) {
  return bounds
    && Number.isFinite(bounds.x)
    && Number.isFinite(bounds.y)
    && Number.isFinite(bounds.width)
    && Number.isFinite(bounds.height);
}

function validate(rows) {
  const issues = [];
  const required = ["region", "figmaNodeId", "layerName", "layerType", "bounds", "zOrder", "role", "implemented", "implementationSelector"];
  const sensitiveRoles = new Set(["overlay", "mask", "clip", "opacity", "blend", "fill"]);

  if (rows.length === 0) {
    issues.push("layer provenance: expected child-layer rows for complex regions");
  }

  rows.forEach((row, index) => {
    for (const key of required) {
      if (!(key in row) || row[key] === "" || row[key] === null) {
        issues.push(`layer[${index}]: missing ${key}`);
      }
    }

    if (!hasBounds(row.bounds)) {
      issues.push(`layer[${index}]: bounds must include finite x, y, width, and height`);
    }

    if (!Number.isFinite(row.zOrder)) {
      issues.push(`layer[${index}]: zOrder must be a finite number`);
    }

    if (row.implemented !== true) {
      issues.push(`layer[${index}]: implemented must be true`);
    }

    const role = String(row.role || "").toLowerCase();
    const blendMode = String(row.blendMode || "normal").toLowerCase();
    const opacity = row.opacity;
    const isSensitive =
      sensitiveRoles.has(role)
      || row.mask === true
      || row.clipped === true
      || blendMode !== "normal"
      || (Number.isFinite(opacity) && opacity < 1);

    if (isSensitive && !row.implementationSelector && !row.assetPath) {
      issues.push(`layer[${index}]: sensitive layer needs implementationSelector or assetPath`);
    }
  });

  return issues;
}

function main() {
  const args = parseArgs(process.argv);
  if (args.help) {
    console.log(usage());
    return;
  }
  if (!args.provenance) throw new Error(`${usage()}\n\nMissing --provenance`);

  const rows = loadRows(path.resolve(args.provenance));
  const issues = validate(rows);
  if (issues.length > 0) {
    console.error("Layer provenance check failed:");
    for (const issue of issues) console.error(`- ${issue}`);
    process.exit(1);
  }

  console.log("Layer provenance check passed.");
}

try {
  main();
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
