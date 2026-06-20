import {
  FONT_FAMILY,
  PADDING,
  wrapText,
  TEXT_CANVAS_WIDTH,
  TEXT_CANVAS_HEIGHT,
  DEFAULT_BACKGROUND,
} from "./meme-text.js";

export function loadImageFromSrc(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
}

function measureLineWidth(ctx, line) {
  return ctx.measureText(line).width;
}

function wrapTextForCanvas(ctx, text, maxWidth, fontSize) {
  ctx.font = `bold ${fontSize}px ${FONT_FAMILY}`;
  return wrapText(text, maxWidth, fontSize, (line) =>
    measureLineWidth(ctx, line)
  );
}

export function drawTextBlock(ctx, canvas, text, startY, direction, fontSize) {
  if (!text.trim()) return;

  const maxWidth = canvas.width * 0.9;
  const lines = wrapTextForCanvas(ctx, text, maxWidth, fontSize);
  const lineHeight = fontSize * 1.15;
  const x = canvas.width / 2;

  ctx.font = `bold ${fontSize}px ${FONT_FAMILY}`;
  ctx.textAlign = "center";
  ctx.lineWidth = Math.max(2, fontSize / 10);
  ctx.strokeStyle = "#000";
  ctx.fillStyle = "#fff";

  if (direction === "top") {
    ctx.textBaseline = "top";
    let y = startY;
    for (const line of lines) {
      ctx.strokeText(line, x, y);
      ctx.fillText(line, x, y);
      y += lineHeight;
    }
  } else {
    ctx.textBaseline = "bottom";
    let y = startY;
    for (let i = lines.length - 1; i >= 0; i -= 1) {
      ctx.strokeText(lines[i], x, y);
      ctx.fillText(lines[i], x, y);
      y -= lineHeight;
    }
  }
}

export function renderImageMeme(ctx, canvas, image, topText, bottomText, fontSize) {
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(image, 0, 0);

  drawTextBlock(ctx, canvas, topText, PADDING, "top", fontSize);
  drawTextBlock(
    ctx,
    canvas,
    bottomText,
    canvas.height - PADDING,
    "bottom",
    fontSize
  );
}

export function renderTextMeme(
  ctx,
  canvas,
  topText,
  bottomText,
  fontSize,
  backgroundColor = DEFAULT_BACKGROUND
) {
  canvas.width = TEXT_CANVAS_WIDTH;
  canvas.height = TEXT_CANVAS_HEIGHT;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (backgroundColor.toLowerCase() === "#f7f7f7") {
    ctx.fillStyle = "#111";
    ctx.strokeStyle = "#fff";
  } else {
    ctx.fillStyle = "#fff";
    ctx.strokeStyle = "#000";
  }

  drawTextBlock(ctx, canvas, topText, PADDING, "top", fontSize);
  drawTextBlock(
    ctx,
    canvas,
    bottomText,
    canvas.height - PADDING,
    "bottom",
    fontSize
  );
}

export function renderMemeToCanvas(canvas, options) {
  const ctx = canvas.getContext("2d");
  const { kind, topText, bottomText, fontSize, image, backgroundColor } =
    options;

  if (kind === "text") {
    renderTextMeme(ctx, canvas, topText, bottomText, fontSize, backgroundColor);
    return;
  }

  if (!image) return;
  renderImageMeme(ctx, canvas, image, topText, bottomText, fontSize);
}

export function canvasToBlob(canvas) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Failed to export canvas"));
    }, "image/png");
  });
}
