import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import { createServer, ROOT, MIME } from "../server.js";

function request(server, path, method = "GET") {
  return new Promise((resolve, reject) => {
    const { port } = server.address();
    const req = http.request(
      { hostname: "127.0.0.1", port, path, method },
      (res) => {
        const chunks = [];
        res.on("data", (chunk) => chunks.push(chunk));
        res.on("end", () => {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: Buffer.concat(chunks),
          });
        });
      }
    );
    req.on("error", reject);
    req.end();
  });
}

describe("createServer", () => {
  /** @type {import('node:http').Server} */
  let server;

  before(() => {
    server = createServer({ port: 0 });
    return new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  });

  after(() => new Promise((resolve) => server.close(resolve)));

  it("GET /api/health returns ok JSON with port", async () => {
    const res = await request(server, "/api/health");
    assert.equal(res.status, 200);
    assert.match(res.headers["content-type"], /application\/json/);

    const body = JSON.parse(res.body.toString());
    assert.equal(body.ok, true);
    assert.equal(typeof body.port, "number");
  });

  it("GET / serves index.html", async () => {
    const res = await request(server, "/");
    assert.equal(res.status, 200);
    assert.match(res.headers["content-type"], /text\/html/);
    assert.match(res.body.toString(), /Meme Generator/);
  });

  it("GET /app.js serves JavaScript module", async () => {
    const res = await request(server, "/app.js");
    assert.equal(res.status, 200);
    assert.match(res.headers["content-type"], /javascript/);
    assert.match(res.body.toString(), /renderMeme/);
  });

  it("GET /templates/sunset.svg serves SVG template", async () => {
    const res = await request(server, "/templates/sunset.svg");
    assert.equal(res.status, 200);
    assert.match(res.headers["content-type"], /svg/);
  });

  it("GET /missing-file returns 404", async () => {
    const res = await request(server, "/does-not-exist.png");
    assert.equal(res.status, 404);
    assert.equal(res.body.toString(), "Not found");
  });

  it("GET path traversal outside public root returns 403", async () => {
    const res = await request(server, "/../server.js");
    assert.equal(res.status, 403);
    assert.equal(res.body.toString(), "Forbidden");
  });
});

describe("MIME types", () => {
  it("maps common extensions", () => {
    assert.equal(MIME[".html"], "text/html; charset=utf-8");
    assert.equal(MIME[".js"], "application/javascript; charset=utf-8");
    assert.equal(MIME[".svg"], "image/svg+xml");
    assert.equal(MIME[".png"], "image/png");
  });
});

describe("ROOT", () => {
  it("points at the public directory", () => {
    assert.match(ROOT, /public$/);
  });
});
