# API Documentation

This workspace ships two local Node.js servers with small JSON APIs. Both bind to `127.0.0.1` only and require no authentication.

## Services

| Service | Base URL | Launch | OpenAPI spec |
|---------|----------|--------|--------------|
| Vibe Coding Studio | `http://localhost:3847` | `./scripts/launch-vibecoding-landing.sh` | [openapi-vibecoding-studio.yaml](./openapi-vibecoding-studio.yaml) |
| Meme Generator | `http://localhost:3848` | `./scripts/launch-meme-generator.sh` | [openapi-meme-generator.yaml](./openapi-meme-generator.yaml) |

**Versioning:** No API version prefix. Paths are stable for v1.0 prototypes.

**Authentication:** None. Local-only services.

**Rate limiting:** None.

**CORS:** `Access-Control-Allow-Origin: *` on JSON responses.

---

## Vibe Coding Studio

### Overview

Marketing landing page plus a project catalog API. The launch endpoint returns terminal commands; it does not spawn child processes.

### Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/health` | Health check |
| `GET` | `/api/projects` | List available workspace projects |
| `POST` | `/api/launch/{projectId}` | Get launch command for a project |
| `GET` | `/*` | Static assets (`public/`) |

### Data models

**HealthResponse**

```json
{ "ok": true, "port": 3847 }
```

**Project**

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Slug for launch URL |
| `name` | string | Display name |
| `description` | string | Short summary |
| `command` | string | Shell command |
| `cwd` | string | Absolute working directory |
| `type` | string | Currently always `"terminal"` |

**LaunchResponse**

| Field | Type | Description |
|-------|------|-------------|
| `message` | string | Formatted instructions |
| `command` | string | Command only |
| `cwd` | string | Working directory |

**ErrorResponse**

```json
{ "error": "Project not found" }
```

### Examples

**Health check**

```bash
curl -s http://localhost:3847/api/health
```

```json
{"ok":true,"port":3847}
```

**List projects**

```bash
curl -s http://localhost:3847/api/projects
```

**Get launch command**

```bash
curl -s -X POST http://localhost:3847/api/launch/guess-game
```

**Error — unknown project**

```bash
curl -s -X POST http://localhost:3847/api/launch/unknown
```

```json
{"error":"Project not found"}
```

---

## Meme Generator

### Overview

Static file server for the meme editor UI. Exposes a single health endpoint; image upload, text rendering, and PNG export are entirely client-side (Canvas API).

### Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/health` | Health check |
| `GET` | `/` | Editor UI (`index.html`) |
| `GET` | `/templates/{filename}` | Preset template images |
| `GET` | `/*` | Other static assets (`public/`) |

### Data models

**HealthResponse**

```json
{ "ok": true, "port": 3848 }
```

### Examples

**Health check**

```bash
curl -s http://localhost:3848/api/health
```

**Fetch a preset template**

```bash
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3848/templates/sunset.svg
```

Expected: `200`

---

## Client usage (browser)

The Vibe Coding Studio front end (`vibecoding-studio/public/app.js`) calls all three JSON endpoints:

```javascript
// Health
const health = await fetch("/api/health").then((r) => r.json());

// Projects
const { projects } = await fetch("/api/projects").then((r) => r.json());

// Launch
const launch = await fetch("/api/launch/guess-game", { method: "POST" }).then((r) => r.json());
```

The Meme Generator front end does not call `/api/health` from JavaScript; health is intended for smoke tests and ops checks.

---

## Viewing OpenAPI specs

Paste either YAML file into [Swagger Editor](https://editor.swagger.io/) or use a local viewer:

```bash
npx @redocly/cli preview-docs aidlc-docs/api/openapi-vibecoding-studio.yaml
npx @redocly/cli preview-docs aidlc-docs/api/openapi-meme-generator.yaml
```

---

## Checklist

- [x] API overview complete
- [x] Endpoints documented
- [x] Data models defined
- [x] Usage examples provided
- [x] OpenAPI 3.0 specifications per service
