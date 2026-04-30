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
    "Text rows also need textBoundsLocked=true, textFitMethod, and renderedTextBounds.",
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

function hasSiblingBounds(siblingBounds) {
  return Array.isArray(siblingBounds) && siblingBounds.every((sibling) => {
    return sibling && sibling.name && hasBounds(sibling.bounds);
  });
}

function intersects(a, b) {
  return a.x < b.x + b.width
    && a.x + a.width > b.x
    && a.y < b.y + b.height
    && a.y + a.height > b.y;
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
    const isText = textRoles.has(role);
    if (isText) {
      if (row.textBoundsLocked !== true) {
        issues.push(`layout[${index}]: text-like rows must set textBoundsLocked=true`);
      }
      if (!row.textFitMethod) {
        issues.push(`layout[${index}]: text-like rows must include textFitMethod`);
      }
      if (!hasBounds(row.renderedTextBounds)) {
        issues.push(`layout[${index}]: text-like rows must include renderedTextBounds from browser geometry`);
      }
      if (String(row.textFitMethod).toLowerCase() === "generic-overflow-hidden") {
        issues.push(`layout[${index}]: textFitMethod must not be generic-overflow-hidden`);
      }
      if (String(row.overflowPolicy).toLowerCase() === "hidden"
        && row.figmaClipping !== true
        && row.figmaEllipsis !== true
        && row.figmaMask !== true) {
        issues.push(`layout[${index}]: overflowPolicy=hidden requires figmaClipping, figmaEllipsis, or figmaMask`);
      }
      if (row.textFitAffectsSiblings === true) {
        issues.push(`layout[${index}]: text fitting must not move or resize sibling nodes`);
      }
      if (row.hasSiblingControls === true && !hasSiblingBounds(row.siblingBounds)) {
        issues.push(`layout[${index}]: text/control pairs must include siblingBounds`);
      }
      if (hasBounds(row.renderedTextBounds) && hasSiblingBounds(row.siblingBounds)) {
        for (const sibling of row.siblingBounds) {
          if (intersects(row.renderedTextBounds, sibling.bounds) && row.figmaOverlap !== true) {
            issues.push(`layout[${index}]: rendered text overlaps sibling ${sibling.name}`);
          }
        }
      }
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
