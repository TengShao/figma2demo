#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

function parseArgs(argv) {
  const args = {
    fps: 24,
    width: 1920,
    height: 1080,
    crf: 18,
    preset: "medium",
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

  for (const key of ["fps", "width", "height", "crf"]) {
    args[key] = Number(args[key]);
  }

  if (!args.frames) throw new Error("Missing --frames directory");
  if (!args.out) throw new Error("Missing --out MP4 path");
  if (!Number.isFinite(args.fps) || args.fps <= 0) throw new Error("--fps must be positive");
  if (!Number.isFinite(args.width) || args.width <= 0) throw new Error("--width must be positive");
  if (!Number.isFinite(args.height) || args.height <= 0) throw new Error("--height must be positive");

  return args;
}

function listFrames(framesDir) {
  const frames = fs.readdirSync(framesDir)
    .filter((name) => name.toLowerCase().endsWith(".png"))
    .sort();

  if (!frames.length) {
    throw new Error(`No PNG frames found in ${framesDir}`);
  }

  return frames;
}

function run(command, args) {
  const result = spawnSync(command, args, { stdio: "inherit" });
  return result.status === 0;
}

function encodeWith(codecArgs, args, inputGlob) {
  const ffmpegArgs = [
    "-y",
    "-framerate", String(args.fps),
    "-pattern_type", "glob",
    "-i", inputGlob,
    "-vf", `scale=${args.width}:${args.height}:flags=lanczos,format=yuv420p`,
    ...codecArgs,
    "-movflags", "+faststart",
    args.out,
  ];

  return run(args.ffmpeg || "ffmpeg", ffmpegArgs);
}

function main() {
  const args = parseArgs(process.argv);
  const framesDir = path.resolve(args.frames);
  const output = path.resolve(args.out);
  const frames = listFrames(framesDir);
  const inputGlob = path.join(framesDir, "*.png");

  fs.mkdirSync(path.dirname(output), { recursive: true });
  args.out = output;

  console.log(`encoding ${frames.length} frames at ${args.width}x${args.height} ${args.fps}fps`);

  const libx264 = [
    "-c:v", "libx264",
    "-preset", String(args.preset),
    "-crf", String(args.crf),
    "-pix_fmt", "yuv420p",
  ];
  if (encodeWith(libx264, args, inputGlob)) {
    console.log(`wrote ${output}`);
    return;
  }

  console.warn("libx264 failed; trying macOS VideoToolbox H.264.");
  const videotoolbox = [
    "-c:v", "h264_videotoolbox",
    "-b:v", "12000k",
    "-pix_fmt", "yuv420p",
  ];
  if (encodeWith(videotoolbox, args, inputGlob)) {
    console.log(`wrote ${output}`);
    return;
  }

  throw new Error("ffmpeg encoding failed with libx264 and h264_videotoolbox");
}

try {
  main();
} catch (error) {
  console.error(`error: ${error.message}`);
  process.exit(1);
}
