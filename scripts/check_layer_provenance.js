#!/usr/bin/env node

const {
  path,
  parseArgs,
  loadJsonArray,
  hasBounds,
  isNotApplicable,
  validateRequired,
  report,
} = require("./check_utils");

function usage() {
  return [
    "Usage:",
    "  node scripts/check_layer_provenance.js --provenance output/<demo>/layer-provenance.json",
    "",
    "Provenance JSON must be an array of child-layer rows with:",
    "  region, figmaNodeId, layerName, layerType, bounds, zOrder, role, implemented, implementationSelector",
    "If the page has no complex regions, use [{\"notApplicableReason\":\"...\"}].",
  ].join("\n");
}

function validate(rows) {
  const issues = [];
  const required = ["region", "figmaNodeId", "layerName", "layerType", "bounds", "zOrder", "role", "implemented", "implementationSelector"];
  const sensitiveRoles = new Set(["overlay", "mask", "clip", "opacity", "blend", "fill"]);

  if (isNotApplicable(rows)) return issues;

  if (rows.length === 0) {
    issues.push("layer provenance: expected child-layer rows for complex regions");
  }

  rows.forEach((row, index) => {
    validateRequired(row, required, "layer", index, issues);

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
  const args = parseArgs(process.argv, ["--provenance"]);
  if (args.help) {
    console.log(usage());
    return;
  }
  if (!args.provenance) throw new Error(`${usage()}\n\nMissing --provenance`);

  report("Layer provenance", validate(loadJsonArray(path.resolve(args.provenance), "Layer provenance")));
}

try {
  main();
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
