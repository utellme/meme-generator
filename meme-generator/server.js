import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3848;
const ROOT = path.join(__dirname, "dist");

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
};

function sendJson(res, status, data) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
  });
  res.end(JSON.stringify(data));
}

function serveStatic(req, res, root = ROOT) {
  const urlPath = req.url.split("?")[0];
  let filePath = path.join(root, urlPath === "/" ? "index.html" : urlPath);
  if (!filePath.startsWith(root)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }
    const ext = path.extname(filePath);
    res.writeHead(200, { "Content-Type": MIME[ext] || "text/plain" });
    res.end(data);
  });
}

function handleRequest(req, res, options = {}) {
  const port = options.port ?? PORT;

  if (req.method === "GET" && req.url === "/api/health") {
    sendJson(res, 200, { ok: true, port });
    return;
  }

  serveStatic(req, res, options.root ?? ROOT);
}

function createServer(options = {}) {
  return http.createServer((req, res) => handleRequest(req, res, options));
}

const isMain = process.argv[1] === fileURLToPath(import.meta.url);

if (isMain) {
  const server = createServer();
  server.listen(PORT, "127.0.0.1", () => {
    console.log("");
    console.log("  Meme Generator");
    console.log(`  → http://localhost:${PORT}`);
    console.log("");
    console.log("  Press Ctrl+C to stop");
    console.log("");
  });
}

export {
  PORT,
  ROOT,
  MIME,
  sendJson,
  serveStatic,
  handleRequest,
  createServer,
};
