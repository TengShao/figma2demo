#!/usr/bin/env node

const { spawnSync } = require("child_process");
const {
  fs,
  path,
  parseArgs,
} = require("./check_utils");

function usage() {
  return [
    "Usage:",
    "  node scripts/review_static.js --demo output/<demo-slug>",
    "",
    "Optional overrides:",
    "  --html output/<demo>/<demo>.html",
    "  --icon-provenance output/<demo>/icon-provenance.json",
    "  --layer-provenance output/<demo>/layer-provenance.json",
    "  --layout-provenance output/<demo>/layout-provenance.json",
    "  --review-crops output/<demo>/review-crops",
    "",
    "The static review gate checks the HTML, icon/layer/layout provenance, and focused review crops.",
  ].join("\n");
}

function resolveExisting(file, label, issues) {
  const resolved = path.resolve(file);
  if (!fs.existsSync(resolved)) {
    issues.push(`${label} does not exist: ${file}`);
  } else if (!fs.statSync(resolved).isFile()) {
    issues.push(`${label} is not a file: ${file}`);
  }
  return resolved;
}

function resolveDirectory(dir, label, issues) {
  const resolved = path.resolve(dir);
  if (!fs.existsSync(resolved)) {
    issues.push(`${label} does not exist: ${dir}`);
  } else if (!fs.statSync(resolved).isDirectory()) {
    issues.push(`${label} is not a directory: ${dir}`);
  }
  return resolved;
}

function defaultHtmlForDemo(demoDir) {
  const slug = path.basename(demoDir);
  const expected = path.join(demoDir, `${slug}.html`);
  if (fs.existsSync(expected)) return expected;

  if (!fs.existsSync(demoDir)) return expected;
  const htmlFiles = fs.readdirSync(demoDir)
    .filter((entry) => entry.toLowerCase().endsWith(".html"));
  if (htmlFiles.length === 1) return path.join(demoDir, htmlFiles[0]);
  return expected;
}

function listCropFiles(cropDir) {
  if (!fs.existsSync(cropDir) || !fs.statSync(cropDir).isDirectory()) return [];
  return fs.readdirSync(cropDir)
    .filter((entry) => /\.(?:png|jpe?g|webp)$/i.test(entry))
    .sort();
}

function runNodeScript(script, args) {
  const result = spawnSync(process.execPath, [script, ...args], {
    cwd: path.resolve(__dirname, ".."),
    stdio: "inherit",
  });
  if (result.error) {
    console.error(result.error.message);
    return 1;
  }
  return result.status || 0;
}

function main() {
  const args = parseArgs(process.argv, [
    "--demo",
    "--html",
    "--icon-provenance",
    "--layer-provenance",
    "--layout-provenance",
    "--review-crops",
  ]);

  if (args.help) {
    console.log(usage());
    return;
  }

  if (!args.demo && !args.html) {
    throw new Error(`${usage()}\n\nMissing --demo or --html`);
  }

  const issues = [];
  const demoDir = args.demo ? path.resolve(args.demo) : path.dirname(path.resolve(args.html));
  resolveDirectory(demoDir, "Demo directory", issues);

  const html = resolveExisting(args.html || defaultHtmlForDemo(demoDir), "HTML file", issues);
  const iconProvenance = resolveExisting(
    args["icon-provenance"] || path.join(demoDir, "icon-provenance.json"),
    "Icon provenance",
    issues,
  );
  const layerProvenance = resolveExisting(
    args["layer-provenance"] || path.join(demoDir, "layer-provenance.json"),
    "Layer provenance",
    issues,
  );
  const layoutProvenance = resolveExisting(
    args["layout-provenance"] || path.join(demoDir, "layout-provenance.json"),
    "Layout provenance",
    issues,
  );
  const reviewCrops = resolveDirectory(
    args["review-crops"] || path.join(demoDir, "review-crops"),
    "Review crops directory",
    issues,
  );

  const crops = listCropFiles(reviewCrops);
  if (issues.length === 0 && crops.length === 0) {
    issues.push(`Review crops directory has no PNG, JPG, JPEG, or WEBP files: ${reviewCrops}`);
  }

  if (issues.length > 0) {
    console.error("Static review preflight failed:");
    for (const issue of issues) console.error(`- ${issue}`);
    process.exit(1);
  }

  console.log("Static review inputs:");
  console.log(`- demo: ${demoDir}`);
  console.log(`- html: ${html}`);
  console.log(`- icon provenance: ${iconProvenance}`);
  console.log(`- layer provenance: ${layerProvenance}`);
  console.log(`- layout provenance: ${layoutProvenance}`);
  console.log(`- review crops: ${reviewCrops} (${crops.length} file${crops.length === 1 ? "" : "s"})`);

  const checks = [
    ["scripts/check_icon_fidelity.js", ["--html", html, "--provenance", iconProvenance]],
    ["scripts/check_layer_provenance.js", ["--provenance", layerProvenance]],
    ["scripts/check_layout_provenance.js", ["--provenance", layoutProvenance]],
  ];

  for (const [script, scriptArgs] of checks) {
    const status = runNodeScript(script, scriptArgs);
    if (status !== 0) {
      console.error(`Static review failed in ${script}.`);
      process.exit(status);
    }
  }

  console.log("Static review gate passed.");
}

try {
  main();
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
