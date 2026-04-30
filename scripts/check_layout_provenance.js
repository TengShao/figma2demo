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
    "  node scripts/check_layout_provenance.js --provenance output/<demo>/layout-provenance.json",
    "",
    "Rows must include:",
    "  pageLocation, figmaNodeId, role, bounds, implementationSelector, overflowPolicy",
    "Text rows also need textBoundsLocked=true.",
    "Auto-layout/component rows also need padding, gap, itemSizing, and childBounds.",
  ].join("\n");
}

function loadRows(file) {
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  if (!Array.isArray(data)) throw new Error("Layout provenance JSON must be an array");
  return data;
}

function hasBounds(bounds) {
  return bounds
    && Number.isFinite(bounds.x)
    && Number.isFinite(bounds.y)
    && Number.isFinite(bounds.width)
    && Number.isFinite(bounds.height);
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

  if (rows.length === 0) {
    issues.push("layout provenance: expected rows for text-bearing and auto-layout regions");
  }

  rows.forEach((row, index) => {
    for (const key of required) {
      if (!(key in row) || row[key] === "" || row[key] === null) {
        issues.push(`layout[${index}]: missing ${key}`);
      }
    }

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
  const args = parseArgs(process.argv);
  if (args.help) {
    console.log(usage());
    return;
  }
  if (!args.provenance) throw new Error(`${usage()}\n\nMissing --provenance`);

  const issues = validate(loadRows(path.resolve(args.provenance)));
  if (issues.length > 0) {
    console.error("Layout provenance check failed:");
    for (const issue of issues) console.error(`- ${issue}`);
    process.exit(1);
  }

  console.log("Layout provenance check passed.");
}

try {
  main();
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
