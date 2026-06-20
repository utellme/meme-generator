const PRESETS = [
  { id: "sunset", label: "Sunset", src: "/templates/sunset.svg" },
  { id: "ocean", label: "Ocean", src: "/templates/ocean.svg" },
  { id: "mountain", label: "Mountain", src: "/templates/mountain.svg" },
  { id: "studio", label: "Studio", src: "/templates/studio.svg" },
];

const canvas = document.getElementById("meme-canvas");
const ctx = canvas.getContext("2d");
const emptyState = document.getElementById("empty-state");
const downloadBtn = document.getElementById("download-btn");
const presetGrid = document.getElementById("preset-grid");
const imageUpload = document.getElementById("image-upload");
const topTextInput = document.getElementById("top-text");
const bottomTextInput = document.getElementById("bottom-text");
const fontSizeInput = document.getElementById("font-size");
const fontSizeValue = document.getElementById("font-size-value");

let currentImage = null;
let activePresetId = null;

const FONT_FAMILY = 'Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif';
const PADDING = 16;

function setImageLoaded(loaded) {
  canvas.classList.toggle("visible", loaded);
  emptyState.classList.toggle("hidden", loaded);
  downloadBtn.disabled = !loaded;
}

function loadImageFromSrc(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
}

function wrapText(text, maxWidth, fontSize) {
  if (!text.trim()) return [];

  ctx.font = `bold ${fontSize}px ${FONT_FAMILY}`;
  const words = text.trim().split(/\s+/);
  const lines = [];
  let currentLine = "";

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    if (ctx.measureText(testLine).width <= maxWidth) {
      currentLine = testLine;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }

  if (currentLine) lines.push(currentLine);
  return lines;
}

function drawTextBlock(text, startY, direction) {
  if (!text.trim()) return;

  const fontSize = Number(fontSizeInput.value);
  const maxWidth = canvas.width * 0.9;
  const lines = wrapText(text, maxWidth, fontSize);
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

function renderMeme() {
  if (!currentImage) return;

  canvas.width = currentImage.naturalWidth;
  canvas.height = currentImage.naturalHeight;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(currentImage, 0, 0);

  drawTextBlock(topTextInput.value, PADDING, "top");
  drawTextBlock(bottomTextInput.value, canvas.height - PADDING, "bottom");
}

async function setCurrentImage(img, presetId = null) {
  currentImage = img;
  activePresetId = presetId;
  setImageLoaded(true);
  renderMeme();
  updatePresetSelection();
}

function updatePresetSelection() {
  presetGrid.querySelectorAll(".preset-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.id === activePresetId);
  });
}

function buildPresetGrid() {
  PRESETS.forEach((preset) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "preset-btn";
    btn.dataset.id = preset.id;
    btn.setAttribute("role", "option");
    btn.setAttribute("aria-label", preset.label);

    const img = document.createElement("img");
    img.src = preset.src;
    img.alt = preset.label;

    const label = document.createElement("span");
    label.textContent = preset.label;

    btn.appendChild(img);
    btn.appendChild(label);

    btn.addEventListener("click", async () => {
      try {
        const imgEl = await loadImageFromSrc(preset.src);
        imageUpload.value = "";
        await setCurrentImage(imgEl, preset.id);
      } catch (err) {
        console.error(err);
      }
    });

    presetGrid.appendChild(btn);
  });
}

imageUpload.addEventListener("change", async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;

  const url = URL.createObjectURL(file);
  try {
    const img = await loadImageFromSrc(url);
    await setCurrentImage(img, null);
  } catch (err) {
    console.error(err);
  } finally {
    URL.revokeObjectURL(url);
  }
});

topTextInput.addEventListener("input", renderMeme);
bottomTextInput.addEventListener("input", renderMeme);

fontSizeInput.addEventListener("input", () => {
  fontSizeValue.textContent = fontSizeInput.value;
  renderMeme();
});

downloadBtn.addEventListener("click", () => {
  if (!currentImage) return;

  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "meme.png";
    link.click();
    URL.revokeObjectURL(url);
  }, "image/png");
});

buildPresetGrid();
setImageLoaded(false);
