const fs = require("fs");
const path = require("path");

function parseArgs(argv, valueKeys) {
  const args = {};
  const keys = new Set(valueKeys);
  for (let i = 2; i < argv.length; i += 1) {
    const key = argv[i];
    const next = argv[i + 1];
    if (keys.has(key)) {
      if (!next || next.startsWith("--")) throw new Error(`Missing value for ${key}`);
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

function readText(file) {
  return fs.readFileSync(file, "utf8");
}

function loadJsonArray(file, label) {
  const data = JSON.parse(readText(file));
  if (!Array.isArray(data)) throw new Error(`${label} JSON must be an array`);
  return data;
}

function hasBounds(bounds) {
  return bounds
    && Number.isFinite(bounds.x)
    && Number.isFinite(bounds.y)
    && Number.isFinite(bounds.width)
    && Number.isFinite(bounds.height);
}

function isNotApplicable(rows) {
  return rows.length === 1
    && typeof rows[0].notApplicableReason === "string"
    && rows[0].notApplicableReason.trim().length >= 8;
}

function validateRequired(row, required, prefix, index, issues) {
  for (const key of required) {
    if (!(key in row) || row[key] === "" || row[key] === null) {
      issues.push(`${prefix}[${index}]: missing ${key}`);
    }
  }
}

function report(label, issues) {
  if (issues.length > 0) {
    console.error(`${label} check failed:`);
    for (const issue of issues) console.error(`- ${issue}`);
    process.exit(1);
  }
  console.log(`${label} check passed.`);
}

module.exports = {
  fs,
  path,
  parseArgs,
  readText,
  loadJsonArray,
  hasBounds,
  isNotApplicable,
  validateRequired,
  report,
};
