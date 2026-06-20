const http = require("http");
const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

const PORT = process.env.PORT || 3847;
const ROOT = path.join(__dirname, "public");
const WORKSPACE = path.resolve(__dirname, "..");

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
};

const PROJECTS = [
  {
    id: "guess-game",
    name: "Number Guessing Game",
    description: "CLI game — random 1–100, shows each guess with hints.",
    command: "python3 guess_game.py",
    cwd: WORKSPACE,
    type: "terminal",
  },
];

function sendJson(res, status, data) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
  });
  res.end(JSON.stringify(data));
}

function serveStatic(req, res) {
  let filePath = path.join(ROOT, req.url === "/" ? "index.html" : req.url);
  if (!filePath.startsWith(ROOT)) {
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

const server = http.createServer((req, res) => {
  if (req.method === "GET" && req.url === "/api/health") {
    sendJson(res, 200, { ok: true, port: PORT });
    return;
  }

  if (req.method === "GET" && req.url === "/api/projects") {
    sendJson(res, 200, { projects: PROJECTS });
    return;
  }

  if (req.method === "POST" && req.url.startsWith("/api/launch/")) {
    const id = req.url.replace("/api/launch/", "");
    const project = PROJECTS.find((p) => p.id === id);
    if (!project) {
      sendJson(res, 404, { error: "Project not found" });
      return;
    }

    sendJson(res, 200, {
      message: `Run this in your terminal:\n\ncd ${project.cwd}\n${project.command}`,
      command: project.command,
      cwd: project.cwd,
    });
    return;
  }

  serveStatic(req, res);
});

server.listen(PORT, "127.0.0.1", () => {
  console.log("");
  console.log("  ✨ Vibe Coding landing page");
  console.log(`  → http://localhost:${PORT}`);
  console.log("");
  console.log("  Press Ctrl+C to stop");
  console.log("");
});
