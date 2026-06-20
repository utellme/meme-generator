# Integration Test Instructions — Meme Generator

## Smoke test

1. Start the server: `./scripts/launch-meme-generator.sh`
2. Open [http://localhost:3848](http://localhost:3848) in a browser
3. Confirm the page loads with upload control, four preset thumbnails, text fields, slider, and disabled download button

## End-to-end checklist

- [x] Click a preset template — preview canvas appears
- [x] Enter top and bottom text — text renders live on canvas
- [x] Adjust font size slider — text size updates
- [x] Verify text is white with black outline
- [x] Upload a custom image — preview replaces preset
- [x] Click **Download meme** — `meme.png` saves and opens correctly
- [x] Long text wraps within canvas width

## API check

```bash
curl -s http://localhost:3848/api/health
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3848/templates/sunset.svg
```

Expected: health JSON with `"ok": true`, template returns `200`.