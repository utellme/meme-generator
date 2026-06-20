# Meme Generator

Create memes locally in your browser — pick a template or upload an image, add top and bottom text, adjust font size, and download as PNG.

## Requirements

- Node.js 18+

## Launch

From the workspace root:

```bash
./scripts/launch-meme-generator.sh
```

Then open **http://localhost:3848**

Or run directly:

```bash
cd meme-generator && npm start
```

## Features

- Upload your own image (JPEG, PNG, WebP, etc.)
- Four built-in template backgrounds
- Classic top and bottom meme text
- Font size slider (24–120px)
- White text with black outline
- Download finished meme as `meme.png`

## How it works

All rendering happens client-side with HTML5 Canvas. The Node server only serves static files.
