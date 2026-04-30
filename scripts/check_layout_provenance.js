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
    "  node scripts/check_layout_provenance.js --provenance output/<demo>/layout-provenance.json",
    "",
    "Rows must include:",
    "  pageLocation, figmaNodeId, role, bounds, implementationSelector, overflowPolicy",
    "Text rows also need textBoundsLocked=true.",
    "Auto-layout/component rows also need padding, gap, itemSizing, and childBounds.",
    "If the page has no text-bearing or auto-layout regions, use [{\"notApplicableReason\":\"...\"}].",
  ].join("\n");
}

function hasPadding(padding) {
  return padding
    && Number.isFinite(padding.left)
    && Number.isFinite(padding.right)
    && Number.isFinite(padding.top)
    && Number.isFinite(padding.bottom);
}

function hasChildBounds(childBounds) {
  return Array.isArray(childBounds) && childBounds.length > 0 && childBounds.every((child) => {
    return child && child.name && hasBounds(child.bounds);
  });
}

function validate(rows) {
  const issues = [];
  const required = ["pageLocation", "figmaNodeId", "role", "bounds", "implementationSelector", "overflowPolicy"];
  const textRoles = new Set(["text", "heading", "label", "counter", "count", "caption"]);
  const componentRoles = new Set(["pill", "chip", "badge", "button", "control", "composer-control", "list-row", "auto-layout"]);

  if (isNotApplicable(rows)) return issues;

  if (rows.length === 0) {
    issues.push("layout provenance: expected rows for text-bearing and auto-layout regions");
  }

  rows.forEach((row, index) => {
    validateRequired(row, required, "layout", index, issues);

    if (!hasBounds(row.bounds)) {
      issues.push(`layout[${index}]: bounds must include finite x, y, width, and height`);
    }

    if (row.parentBounds && !hasBounds(row.parentBounds)) {
      issues.push(`layout[${index}]: parentBounds must include finite x, y, width, and height`);
    }

    const role = String(row.role || "").toLowerCase();
    if (textRoles.has(role) && row.textBoundsLocked !== true) {
      issues.push(`layout[${index}]: text-like rows must set textBoundsLocked=true`);
    }

    if (componentRoles.has(role)) {
      if (!hasPadding(row.padding)) {
        issues.push(`layout[${index}]: component rows must include left/right/top/bottom padding`);
      }
      if (!Number.isFinite(row.gap)) {
        issues.push(`layout[${index}]: component rows must include a finite gap`);
      }
      if (!row.itemSizing) {
        issues.push(`layout[${index}]: component rows must include itemSizing`);
      }
      if (!hasChildBounds(row.childBounds)) {
        issues.push(`layout[${index}]: component rows must include childBounds`);
      }
    }

    if (row.usesNaturalFlexSizing === true) {
      issues.push(`layout[${index}]: usesNaturalFlexSizing must not be true`);
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

  report("Layout provenance", validate(loadJsonArray(path.resolve(args.provenance), "Layout provenance")));
}

try {
  main();
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
