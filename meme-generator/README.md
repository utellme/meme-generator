# Meme Generator

Create image and text-only memes in your browser, save them to a **live gallery** powered by [InstantDB](https://www.instantdb.com/), and download as PNG.

## Requirements

- Node.js 18+
- An InstantDB app (included `.env` uses app ID `4285d49b-448b-4bc0-90df-b0a82a2f20ba`)

## Quick start

From the workspace root:

```bash
./scripts/launch-meme-generator.sh
```

Then open **http://localhost:3848**

Or run directly:

```bash
cd meme-generator
npm install
npm run dev
```

## Production build

```bash
cd meme-generator
npm install
npm start
```

This builds with Vite and serves the `dist/` folder via Node.

## InstantDB setup

1. Copy `.env.example` to `.env` if needed (app ID is pre-filled).
2. Log in and push schema + permissions (one-time):

```bash
cd meme-generator
npx instant-cli@latest login
npx instant-cli@latest push schema --app 4285d49b-448b-4bc0-90df-b0a82a2f20ba -p core
npx instant-cli@latest push perms --app 4285d49b-448b-4bc0-90df-b0a82a2f20ba -p core
```

Use `-p core` for this vanilla JS app (`@instantdb/core`). If prompted interactively, choose **core** — not react.

## Features

### Image memes
- Upload your own image (JPEG, PNG, WebP, etc.)
- Four built-in template backgrounds
- Classic top and bottom meme text
- Font size slider (24–120px)
- White text with black outline

### Text-only memes
- Solid background (swatches + custom color picker)
- Same top/bottom text styling
- Fixed 800×600 canvas

### Gallery (InstantDB)
- **Save to gallery** — persists memes in real time
- **Upvote** — click ▲ on any meme to add +1 (unlimited clicks)
- **Sort** — toggle **Newest** or **Top voted** in the gallery
- **Load** — click a gallery card to restore into the editor
- **Delete** — remove memes from the shared feed
- Open two tabs to see live sync

After pulling upvote changes, push the updated schema:

```bash
npx instant-cli@latest push schema --app 4285d49b-448b-4bc0-90df-b0a82a2f20ba -p core
```

Custom uploaded images are stored in InstantDB `$files` and linked to meme records. Preset templates store only the template ID.

## Project structure

```
meme-generator/
├── index.html          # Vite entry
├── src/                # App source (main, render, db, gallery)
├── public/templates/   # SVG preset backgrounds
├── instant.schema.ts   # InstantDB data model
├── instant.perms.ts    # Open prototype permissions
├── dist/               # Vite build output (served in production)
└── server.js           # Static file server
```

## Tests

```bash
cd meme-generator
npm test
```

Runs `vite build` first, then unit tests.

## Security note

Permissions are open for prototype/demo use. Tighten `instant.perms.ts` before production (auth, ownership rules).
