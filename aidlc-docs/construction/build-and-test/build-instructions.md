# Build Instructions — Meme Generator

## Prerequisites

- Node.js 18 or later

## Build

No build step required. The app is static HTML/CSS/JS served by a minimal Node server.

## Run locally

```bash
./scripts/launch-meme-generator.sh
```

Expected output:

```text
  Meme Generator
  → http://localhost:3848
```

Verify health endpoint:

```bash
curl http://localhost:3848/api/health
```

Expected: `{"ok":true,"port":3848}`
