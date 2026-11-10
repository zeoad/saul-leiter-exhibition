/**
 * Visual regression — capture deterministic viewport screenshots and assert
 * them against committed baselines, pixel by pixel.
 *
 * This turns the old "screenshot archive" into an actual gate: a run fails
 * when more than `VISUAL_THRESHOLD` of a page's pixels moved.
 *
 * Usage:
 *   node scripts/visual-regression.mjs            # capture + compare
 *   node scripts/visual-regression.mjs --update   # rewrite the baselines
 *
 * Requires a built export in `out/` and Chrome (CHROME_PATH or the default
 * Windows install). Reduced motion is forced, so CSS animations, the intro
 * and the camera's timed bubbles are stable between runs.
 */
import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";

const ROOT = process.cwd();
const BASELINE_DIR = path.resolve(
  ROOT,
  process.env.VISUAL_BASELINE || ".visual/baseline"
);
const CURRENT_DIR = path.resolve(
  ROOT,
  process.env.VISUAL_CURRENT || ".visual/current"
);
const DIFF_DIR = path.resolve(ROOT, ".visual/diff");
const PREVIEW_PORT = Number(process.env.PREVIEW_PORT || 4318);
const BASE_URL = `http://127.0.0.1:${PREVIEW_PORT}`;

/** Share of changed pixels a page may drift before the run fails. */
const THRESHOLD = Number(process.env.VISUAL_THRESHOLD || 0.003);

const UPDATE = process.argv.includes("--update");

const ROUTES = [
  { route: "/", name: "home" },
  { route: "/work/", name: "work" },
  { route: "/work/through-boards/", name: "work-detail" },
  { route: "/vision/", name: "vision" },
  { route: "/archive/", name: "archive" },
];

const VIEWPORTS = [
  { label: "desktop", width: 1440, height: 900 },
  { label: "mobile", width: 390, height: 844 },
];

/**
 * Wait for the idle-mounted camera before shooting. Without this the overlay
 * could be missing from one run and present in the next, which is a flaky diff
 * rather than a real regression.
 */
const WAIT_FOR_CAMERA = `(async () => {
  for (let i = 0; i < 60; i += 1) {
    if (document.querySelector(".little-camera")) return true;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  return false;
})()`;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function waitForServer() {
  const deadline = Date.now() + 20_000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(`${BASE_URL}/`);
      if (response.ok) return;
    } catch {
      // server not up yet
    }
    await sleep(250);
  }
  throw new Error(`Preview server did not answer on ${BASE_URL}`);
}

function capture(route, viewport) {
  const name = `${route.name}-${viewport.label}`;

  return new Promise((resolve, reject) => {
    const child = spawn(
      process.execPath,
      [
        "scripts/screenshot.mjs",
        "--path",
        route.route,
        "--name",
        name,
        "--width",
        String(viewport.width),
        "--height",
        String(viewport.height),
        "--viewport",
        "--eval",
        WAIT_FOR_CAMERA,
      ],
      {
        cwd: ROOT,
        env: {
          ...process.env,
          SHOT_DIR: CURRENT_DIR,
          PREVIEW_URL: BASE_URL,
        },
        stdio: "inherit",
      }
    );

    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) {
        resolve(`${name}-${viewport.width}-viewport.png`);
      } else {
        reject(new Error(`Capture failed for ${route.route} (${viewport.label})`));
      }
    });
  });
}

async function compare(file) {
  const baselinePath = path.join(BASELINE_DIR, file);
  const currentPath = path.join(CURRENT_DIR, file);

  let baseline;
  try {
    baseline = PNG.sync.read(await fs.readFile(baselinePath));
  } catch {
    return { file, status: "missing" };
  }

  const current = PNG.sync.read(await fs.readFile(currentPath));

  if (baseline.width !== current.width || baseline.height !== current.height) {
    return {
      file,
      status: "size",
      detail: `${baseline.width}×${baseline.height} → ${current.width}×${current.height}`,
    };
  }

  const diff = new PNG({ width: baseline.width, height: baseline.height });
  const changed = pixelmatch(
    baseline.data,
    current.data,
    diff.data,
    baseline.width,
    baseline.height,
    { threshold: 0.1 }
  );

  if (changed > 0) {
    await fs.mkdir(DIFF_DIR, { recursive: true });
    await fs.writeFile(
      path.join(DIFF_DIR, file.replace(/\.png$/, ".diff.png")),
      PNG.sync.write(diff)
    );
  }

  const ratio = changed / (baseline.width * baseline.height);
  return {
    file,
    status: ratio > THRESHOLD ? "fail" : "pass",
    ratio,
    changed,
  };
}

async function main() {
  await fs.mkdir(CURRENT_DIR, { recursive: true });

  const server = spawn(process.execPath, ["scripts/serve-out.mjs"], {
    cwd: ROOT,
    env: { ...process.env, PORT: String(PREVIEW_PORT) },
    stdio: "ignore",
  });

  try {
    await waitForServer();

    const files = [];
    for (const route of ROUTES) {
      for (const viewport of VIEWPORTS) {
        process.stdout.write(`• ${route.route} @ ${viewport.label} … `);
        files.push(await capture(route, viewport));
        console.log("shot");
      }
    }

    if (UPDATE) {
      await fs.mkdir(BASELINE_DIR, { recursive: true });
      for (const file of files) {
        await fs.copyFile(
          path.join(CURRENT_DIR, file),
          path.join(BASELINE_DIR, file)
        );
      }
      console.log(`\nBaseline updated: ${files.length} image(s) → ${path.relative(ROOT, BASELINE_DIR)}`);
      return;
    }

    const results = [];
    for (const file of files) {
      results.push(await compare(file));
    }

    console.log("\nVisual regression");
    console.log("─".repeat(64));
    for (const result of results) {
      const ratio =
        typeof result.ratio === "number"
          ? `${(result.ratio * 100).toFixed(3)}%`
          : "—";
      const label =
        result.status === "pass"
          ? "PASS"
          : result.status === "missing"
            ? "NO BASELINE"
            : result.status === "size"
              ? "SIZE CHANGED"
              : "FAIL";
      console.log(
        `${label.padEnd(13)} ${result.file.padEnd(38)} ${ratio.padStart(9)}${
          result.detail ? `  ${result.detail}` : ""
        }`
      );
    }
    console.log("─".repeat(64));
    console.log(`Threshold: ${(THRESHOLD * 100).toFixed(3)}% changed pixels`);

    const failed = results.filter(
      (result) => result.status !== "pass"
    );
    if (failed.length > 0) {
      console.error(
        `\n${failed.length} page(s) need attention. ` +
          `Review ${path.relative(ROOT, DIFF_DIR)}/, then either fix the UI or run ` +
          `\`npm run visual:update\` to accept the change.`
      );
      process.exitCode = 1;
    }
  } finally {
    server.kill();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
