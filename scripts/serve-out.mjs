/**
 * Minimal static server for the exported `out/` directory.
 * Usage: node scripts/serve-out.mjs   (PORT=4318 by default)
 */
import { createReadStream, promises as fs } from "node:fs";
import http from "node:http";
import path from "node:path";

const root = path.resolve(process.cwd(), "out");
const port = Number(process.env.PORT || 4318);

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".md": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
};

async function resolveFile(pathname) {
  const decoded = decodeURIComponent(pathname);
  const candidate = path.resolve(root, `.${decoded}`);

  if (!candidate.startsWith(root + path.sep) && candidate !== root) {
    return null;
  }

  const attempts = [
    candidate,
    path.join(candidate, "index.html"),
    `${candidate}.html`,
  ];

  for (const attempt of attempts) {
    try {
      const stat = await fs.stat(attempt);
      if (stat.isFile()) return attempt;
    } catch {
      // try next candidate
    }
  }

  return null;
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || "/", `http://localhost:${port}`);
  let filePath = await resolveFile(url.pathname);

  if (!filePath && !path.extname(url.pathname)) {
    filePath = await resolveFile("/404.html");
  }

  const headers = {
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
  };

  if (!filePath) {
    res.writeHead(404, { ...headers, "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not found");
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  res.writeHead(200, {
    ...headers,
    "Content-Type": TYPES[ext] || "application/octet-stream",
  });
  createReadStream(filePath).pipe(res);
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Static preview: http://127.0.0.1:${port}`);
  console.log(`Serving: ${root}`);
});
