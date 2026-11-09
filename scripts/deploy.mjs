#!/usr/bin/env node
/**
 * Deploy the static export to an nginx server over SSH.
 *
 * `out/` is packed into one tarball, uploaded, extracted into a fresh
 * directory and then swapped into place — a failed or interrupted upload
 * never leaves the live site half-written.
 *
 * Usage:
 *   node scripts/deploy.mjs --build                  # rebuild, then upload
 *   node scripts/deploy.mjs                          # upload the current out/
 *   node scripts/deploy.mjs --host 1.2.3.4 --user root --path /var/www/saul-leiter
 *
 * Connection details may also live in deploy.config.json (gitignored):
 *   { "host": "", "user": "root", "path": "/var/www/saul-leiter", "port": 22 }
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const outDir = path.join(root, "out");

function arg(name) {
  const index = process.argv.indexOf(`--${name}`);
  if (index === -1) return undefined;
  const value = process.argv[index + 1];
  return value && !value.startsWith("--") ? value : "true";
}

const configFile = path.join(root, "deploy.config.json");
const saved = fs.existsSync(configFile)
  ? JSON.parse(fs.readFileSync(configFile, "utf8"))
  : {};

const host = arg("host") ?? saved.host;
const user = arg("user") ?? saved.user ?? "root";
const remotePath = arg("path") ?? saved.path;
const port = String(arg("port") ?? saved.port ?? 22);
const shouldBuild = arg("build") !== undefined;

if (!host || !remotePath) {
  console.error(
    "缺少服务器信息。请用 --host 与 --path 指定，或创建 deploy.config.json：\n" +
      '  { "host": "1.2.3.4", "user": "root", "path": "/var/www/saul-leiter" }'
  );
  process.exit(1);
}

const quote = (value) => `'${String(value).replace(/'/g, `'\\''`)}'`;
const run = (command, args, extra = {}) => {
  const result = spawnSync(command, args, {
    stdio: "inherit",
    cwd: root,
    ...extra,
  });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(`${command} 退出码 ${result.status}`);
  }
};

if (shouldBuild) {
  console.log("→ 构建静态站点");
  run("npm", ["run", "build"], { shell: true });
}

if (!fs.existsSync(path.join(outDir, "index.html"))) {
  console.error("out/index.html 不存在，请先运行 npm run build。");
  process.exit(1);
}

const stamp = new Date().toISOString().replace(/[-:T]/g, "").slice(0, 14);
const tarball = path.join(os.tmpdir(), `aqg-${stamp}.tar.gz`);
const remoteTarball = `/tmp/aqg-${stamp}.tar.gz`;

console.log("→ 打包 out/");
run("tar", ["-czf", tarball, "-C", outDir, "."]);

const target = `${user}@${host}`;
const sshOptions = [
  "-p",
  port,
  "-o",
  "StrictHostKeyChecking=accept-new",
  "-o",
  "ConnectTimeout=15",
];

try {
  const size = (fs.statSync(tarball).size / 1024 / 1024).toFixed(1);
  console.log(`→ 上传 ${size} MB 到 ${target}:${remoteTarball}`);
  run("scp", [...sshOptions, tarball, `${target}:${remoteTarball}`]);

  console.log(`→ 服务器端解压并切换 ${remotePath}`);
  const script = `
set -euo pipefail
STAGE=${quote(`${remotePath}.incoming`)}
PREV=${quote(`${remotePath}.previous`)}
TARGET=${quote(remotePath)}
mkdir -p "$(dirname "$TARGET")"
rm -rf "$STAGE"
mkdir -p "$STAGE"
tar -xzf ${quote(remoteTarball)} -C "$STAGE"
test -f "$STAGE/index.html"
rm -rf "$PREV"
if [ -d "$TARGET" ]; then mv "$TARGET" "$PREV"; fi
mv "$STAGE" "$TARGET"
chmod -R a+rX "$TARGET"
rm -f ${quote(remoteTarball)}
du -sh "$TARGET"
`;

  run("ssh", [...sshOptions, target, "bash", "-s"], { input: script });
} finally {
  fs.rmSync(tarball, { force: true });
}

console.log(`\n完成。上一版本保留在 ${remotePath}.previous`);
console.log(`如果还没配置 Nginx，把 deploy/nginx.conf 里的 root 改成 ${remotePath} 后启用。`);

try {
  const response = await fetch(`http://${host}/`, {
    signal: AbortSignal.timeout(10000),
  });
  console.log(`自检：http://${host}/ → ${response.status}`);
} catch (error) {
  console.log(`自检跳过（本机无法直连 80 端口）：${error.message}`);
}
