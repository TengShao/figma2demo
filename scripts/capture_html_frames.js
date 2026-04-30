#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

function parseArgs(argv) {
  const args = {
    fps: 24,
    duration: 12,
    width: 1920,
    height: 1080,
    deviceScaleFactor: 1,
    start: 0,
  };

  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (!arg.startsWith("--")) continue;
    const key = arg.slice(2);
    const next = argv[i + 1];
    if (next && !next.startsWith("--")) {
      args[key] = next;
      i += 1;
    } else {
      args[key] = true;
    }
  }

  for (const key of ["fps", "duration", "width", "height", "deviceScaleFactor", "start"]) {
    args[key] = Number(args[key]);
  }

  if (!args.url && args.html) {
    args.url = "file://" + path.resolve(args.html);
  }
  if (!args.url) {
    throw new Error("Missing --url or --html");
  }
  if (!args.out) {
    throw new Error("Missing --out frame directory");
  }
  if (!Number.isFinite(args.fps) || args.fps <= 0) {
    throw new Error("--fps must be a positive number");
  }
  if (!Number.isFinite(args.duration) || args.duration <= 0) {
    throw new Error("--duration must be a positive number");
  }

  return args;
}

function resolvePlaywright() {
  const candidates = [
    "playwright",
    "/opt/homebrew/lib/node_modules/playwright",
    "/usr/local/lib/node_modules/playwright",
  ];

  for (const candidate of candidates) {
    try {
      return require(candidate);
    } catch (_error) {
      // Try the next candidate.
    }
  }

  throw new Error("Playwright is not available. Install it or adjust resolvePlaywright().");
}

async function seekPage(page, seconds) {
  await page.evaluate(async (time) => {
    if (typeof window.__seekDemoTime === "function") {
      await window.__seekDemoTime(time);
      return;
    }

    if (typeof window.__setDemoTime === "function") {
      await window.__setDemoTime(time);
      return;
    }

    const animations = document.getAnimations({ subtree: true });
    for (const animation of animations) {
      animation.pause();
      animation.currentTime = time * 1000;
    }

    document.documentElement.style.setProperty("--demo-time", String(time));
    window.dispatchEvent(new CustomEvent("demo:seek", { detail: { time } }));
  }, seconds);

  await page.waitForTimeout(20);
}

async function main() {
  const args = parseArgs(process.argv);
  fs.mkdirSync(args.out, { recursive: true });

  const { chromium } = resolvePlaywright();
  const browser = await chromium.launch({
    headless: true,
    executablePath: args.chrome || undefined,
  });

  try {
    const page = await browser.newPage({
      viewport: { width: args.width, height: args.height },
      deviceScaleFactor: args.deviceScaleFactor,
    });

    await page.goto(args.url, { waitUntil: "load" });
    await page.addStyleTag({
      content: `
        html, body { margin: 0 !important; overflow: hidden !important; }
        * { caret-color: transparent !important; }
      `,
    });
    await page.evaluate(() => document.fonts && document.fonts.ready);

    const frameCount = Math.round(args.duration * args.fps);
    const pad = String(frameCount).length;

    for (let index = 0; index < frameCount; index += 1) {
      const seconds = args.start + index / args.fps;
      await seekPage(page, seconds);
      const framePath = path.join(args.out, `frame_${String(index).padStart(pad, "0")}.png`);
      await page.screenshot({ path: framePath, type: "png", clip: { x: 0, y: 0, width: args.width, height: args.height } });
      if (index % args.fps === 0) {
        console.log(`captured ${index + 1}/${frameCount} @ ${seconds.toFixed(2)}s`);
      }
    }

    console.log(`captured ${frameCount} frames in ${args.out}`);
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
