/**
 * Headless Chrome screenshot harness for visual QA.
 * No npm dependencies: uses Chrome's DevTools Protocol over Node's built-in WebSocket.
 *
 * Usage:
 *   node scripts/screenshot.mjs --path / --name home --full
 *   node scripts/screenshot.mjs --path / --name home --width 390 --height 844 --full
 *   node scripts/screenshot.mjs --path / --name home --sections "#cover,#programme,#closing"
 *
 * Requires the static preview server: `node scripts/serve-out.mjs`.
 */
import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

const CHROME =
  process.env.CHROME_PATH ||
  "C:/Program Files/Google/Chrome/Application/chrome.exe";
const BASE_URL = process.env.PREVIEW_URL || "http://127.0.0.1:4318";
const CDP_PORT = Number(process.env.CDP_PORT || 9333);
const SHOT_DIR = path.resolve(process.env.SHOT_DIR || ".screenshots");

function arg(name, fallback) {
  const index = process.argv.indexOf(`--${name}`);
  if (index === -1) return fallback;
  const value = process.argv[index + 1];
  return value && !value.startsWith("--") ? value : true;
}

const targetPath = String(arg("path", "/"));
const width = Number(arg("width", 1440));
const height = Number(arg("height", 900));
const name = String(arg("name", "page"));
const full = Boolean(arg("full", false));
const sectionsArg = arg("sections", null);
const evalExpr = arg("eval", null);
const viewportShot = Boolean(arg("viewport", false));
const motion = Boolean(arg("motion", false));
const delay = Number(arg("delay", 0));
const hoverSelector = arg("hover", null);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

class CDP {
  constructor(url) {
    this.url = url;
    this.nextId = 1;
    this.pending = new Map();
    this.events = [];
    this.ready = new Promise((resolve, reject) => {
      this.ws = new WebSocket(url);
      this.ws.addEventListener("open", resolve);
      this.ws.addEventListener("error", reject);
      this.ws.addEventListener("message", (event) => {
        const message = JSON.parse(event.data);
        if (message.id) {
          const entry = this.pending.get(message.id);
          if (!entry) return;
          this.pending.delete(message.id);
          if (message.error) entry.reject(new Error(message.error.message));
          else entry.resolve(message.result);
        } else {
          this.events.push(message);
        }
      });
    });
  }

  async send(method, params = {}) {
    await this.ready;
    const id = this.nextId++;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  close() {
    this.ws?.close();
  }
}

async function waitForDebugger() {
  const deadline = Date.now() + 20000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(`http://127.0.0.1:${CDP_PORT}/json/version`);
      if (response.ok) return await response.json();
    } catch {
      // not up yet
    }
    await sleep(250);
  }
  throw new Error("Chrome DevTools endpoint did not start");
}

async function main() {
  await fs.mkdir(SHOT_DIR, { recursive: true });
  const userDataDir = await fs.mkdtemp(path.join(os.tmpdir(), "aqg-chrome-"));

  const chrome = spawn(
    CHROME,
    [
      "--headless=new",
      "--disable-gpu",
      "--hide-scrollbars",
      "--no-first-run",
      "--no-default-browser-check",
      "--disable-extensions",
      "--mute-audio",
      "--no-sandbox",
      "--remote-allow-origins=*",
      "--force-device-scale-factor=1",
      `--user-data-dir=${userDataDir}`,
      `--remote-debugging-port=${CDP_PORT}`,
      "about:blank",
    ],
    { stdio: "ignore" }
  );

  chrome.on("exit", (code) => {
    if (code !== null) console.log(`Chrome exited with ${code}`);
  });

  let cdp;
  try {
    console.log("Waiting for Chrome DevTools…");
    await waitForDebugger();
    console.log("DevTools ready. Opening tab…");
    const url = `${BASE_URL}${targetPath}`;
    const tab = await (
      await fetch(
        `http://127.0.0.1:${CDP_PORT}/json/new?${encodeURIComponent(url)}`,
        { method: "PUT" }
      )
    ).json();
    console.log(`Tab ${tab.id} opened.`);

    cdp = new CDP(tab.webSocketDebuggerUrl);
    await cdp.ready;
    console.log("CDP connected.");

    await cdp.send("Page.enable");
    await cdp.send("Runtime.enable");
    await cdp.send("Log.enable");
    console.log("Emulating viewport + reduced motion…");
    await cdp.send("Emulation.setDeviceMetricsOverride", {
      width,
      height,
      deviceScaleFactor: 1,
      mobile: width < 768,
    });
    await cdp.send("Emulation.setEmulatedMedia", {
      features: [
        {
          name: "prefers-reduced-motion",
          value: motion ? "no-preference" : "reduce",
        },
      ],
    });

    await cdp.send("Page.navigate", { url });
    await sleep(1500);
    console.log("Page loaded. Waiting for fonts and images…");

    const ready = await cdp.send("Runtime.evaluate", {
      expression: `(async () => {
        await Promise.race([
          document.fonts.ready,
          new Promise((resolve) => setTimeout(resolve, 2000)),
        ]);

        // Next.js lazy images below the fold never load without scrolling, and
        // their load event never fires. Force eager loading and walk the page.
        document.querySelectorAll("img").forEach((img) => {
          img.loading = "eager";
          img.decoding = "async";
        });

        const fullHeight = document.documentElement.scrollHeight;
        const step = Math.max(320, Math.round(window.innerHeight * 0.8));
        for (let y = 0; y < fullHeight; y += step) {
          window.scrollTo(0, y);
          await new Promise((resolve) => setTimeout(resolve, 110));
        }
        window.scrollTo(0, 0);

        await Promise.all(
          Array.from(document.images).map((img) =>
            img.complete
              ? Promise.resolve()
              : new Promise((resolve) => {
                  const done = () => resolve();
                  img.addEventListener("load", done, { once: true });
                  img.addEventListener("error", done, { once: true });
                  setTimeout(done, 4000);
                })
          )
        );

        await new Promise((r) => setTimeout(r, 350));
        return {
          height: document.documentElement.scrollHeight,
          title: document.title,
          broken: Array.from(document.images).filter((img) => img.naturalWidth === 0).length,
        };
      })()`,
      awaitPromise: true,
      returnByValue: true,
    });

    const pageInfo = ready.result.value;
    console.log(
      `Page: ${pageInfo.title} — ${pageInfo.height}px tall, ${pageInfo.broken} broken image(s)`
    );

    const label = `${name}-${width}`;

    if (delay > 0) {
      console.log(`Waiting ${delay}ms for motion…`);
      await sleep(delay);
    }

    if (evalExpr) {
      const result = await cdp.send("Runtime.evaluate", {
        expression: String(evalExpr),
        awaitPromise: true,
        returnByValue: true,
      });
      console.log(`Eval: ${JSON.stringify(result.result?.value ?? null).slice(0, 300)}`);
      await sleep(900);
    }

    if (hoverSelector) {
      const probe = await cdp.send("Runtime.evaluate", {
        expression: `(() => {
          const el = document.querySelector(${JSON.stringify(String(hoverSelector))});
          if (!el) return null;
          const r = el.getBoundingClientRect();
          return {
            x: Math.round(r.left + r.width / 2),
            y: Math.round(r.top + Math.min(14, r.height / 3)),
          };
        })()`,
        returnByValue: true,
      });

      const point = probe.result.value;
      if (!point) {
        console.warn(`Hover target not found: ${hoverSelector}`);
      } else {
        await cdp.send("Input.dispatchMouseEvent", {
          type: "mouseMoved",
          x: point.x,
          y: Math.max(2, point.y - 40),
          buttons: 0,
          pointerType: "mouse",
        });
        await sleep(250);
        await cdp.send("Input.dispatchMouseEvent", {
          type: "mouseMoved",
          x: point.x,
          y: point.y,
          buttons: 0,
          pointerType: "mouse",
        });
        await sleep(800);
      }
    }

    if (viewportShot) {
      const shot = await cdp.send("Page.captureScreenshot", {
        format: "png",
      });
      const file = path.join(SHOT_DIR, `${label}-viewport.png`);
      await fs.writeFile(file, Buffer.from(shot.data, "base64"));
      console.log(`Saved ${path.relative(process.cwd(), file)} (viewport)`);
    }

    if (full) {
      const metrics = await cdp.send("Page.getLayoutMetrics");
      const contentHeight = Math.min(
        Math.ceil(metrics.cssContentSize.height),
        16000
      );

      const sliceHeight = 2600;
      const slices = Math.ceil(contentHeight / sliceHeight);

      for (let index = 0; index < slices; index += 1) {
        const y = index * sliceHeight;
        const height = Math.min(sliceHeight, contentHeight - y);

        const shot = await cdp.send("Page.captureScreenshot", {
          format: "png",
          captureBeyondViewport: true,
          clip: {
            x: 0,
            y,
            width,
            height,
            scale: 1,
          },
        });

        const file = path.join(
          SHOT_DIR,
          `${label}-full-${String(index + 1).padStart(2, "0")}.png`
        );
        await fs.writeFile(file, Buffer.from(shot.data, "base64"));
        console.log(
          `Saved ${path.relative(process.cwd(), file)} (${height}px slice)`
        );
      }
    }

    if (sectionsArg) {
      const selectors = String(sectionsArg)
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean);

      for (const selector of selectors) {
        const rectResult = await cdp.send("Runtime.evaluate", {
          expression: `(() => {
            const el = document.querySelector(${JSON.stringify(selector)});
            if (!el) return null;
            const r = el.getBoundingClientRect();
            window.scrollTo(0, 0);
            return { top: r.top + window.scrollY, height: r.height, width: r.width };
          })()`,
          returnByValue: true,
        });

        const rect = rectResult.result.value;
        if (!rect) {
          console.warn(`Section not found: ${selector}`);
          continue;
        }

        await sleep(250);
        const shotHeight = Math.min(Math.max(rect.height, 400), 2800);
        const shot = await cdp.send("Page.captureScreenshot", {
          format: "png",
          captureBeyondViewport: true,
          clip: {
            x: 0,
            y: Math.max(0, rect.top),
            width,
            height: shotHeight,
            scale: 1,
          },
        });

        const safe = selector.replace(/[^a-z0-9-]+/gi, "").slice(0, 32);
        const file = path.join(SHOT_DIR, `${label}-${safe}.png`);
        await fs.writeFile(file, Buffer.from(shot.data, "base64"));
        console.log(
          `Saved ${path.relative(process.cwd(), file)} (${Math.round(rect.height)}px section)`
        );
      }
    }

    const errors = cdp.events.filter(
      (event) =>
        event.method === "Runtime.exceptionThrown" ||
        (event.method === "Log.entryAdded" &&
          event.params?.entry?.level === "error") ||
        (event.method === "Runtime.consoleAPICalled" &&
          event.params?.type === "error")
    );

    const warnings = cdp.events.filter(
      (event) =>
        (event.method === "Log.entryAdded" &&
          event.params?.entry?.level === "warning") ||
        (event.method === "Runtime.consoleAPICalled" &&
          event.params?.type === "warning")
    );

    if (warnings.length) {
      console.log(`\n${warnings.length} console warning(s):`);
      for (const warning of warnings.slice(0, 12)) {
        const text =
          warning.params?.entry?.text ??
          warning.params?.args?.map((item) => item.value ?? item.description).join(" ");
        console.log(String(text).slice(0, 240));
      }
    }

    if (errors.length) {
      console.log(`\n${errors.length} runtime error(s):`);
      for (const error of errors.slice(0, 10)) {
        console.log(JSON.stringify(error.params).slice(0, 500));
      }
    } else {
      console.log("No runtime errors captured.");
    }
  } finally {
    cdp?.close();
    if (chrome.pid) {
      if (process.platform === "win32") {
        spawn("taskkill", ["/pid", String(chrome.pid), "/T", "/F"], {
          stdio: "ignore",
        }).on("error", () => {});
      } else {
        chrome.kill();
      }
    }
    await fs.rm(userDataDir, { recursive: true, force: true }).catch(() => {});
  }
}

const watchdog = setTimeout(() => {
  console.error("Screenshot harness timed out after 120s.");
  process.exit(2);
}, 120000);
watchdog.unref();

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
