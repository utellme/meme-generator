import "./styles.css";

import {
  PRESETS,
  BACKGROUND_COLORS,
  DEFAULT_BACKGROUND,
} from "./meme-text.js";
import {
  renderMemeToCanvas,
  loadImageFromSrc,
  canvasToBlob,
} from "./render.js";
import { saveMeme, subscribeMemes } from "./db.js";
import { initGallery } from "./gallery.js";

const canvas = document.getElementById("meme-canvas");
const emptyState = document.getElementById("empty-state");
const downloadBtn = document.getElementById("download-btn");
const saveBtn = document.getElementById("save-btn");
const presetGrid = document.getElementById("preset-grid");
const imageUpload = document.getElementById("image-upload");
const imagePanel = document.getElementById("image-panel");
const textBgPanel = document.getElementById("text-bg-panel");
const bgSwatches = document.getElementById("bg-swatches");
const customBgInput = document.getElementById("custom-bg");
const topTextInput = document.getElementById("top-text");
const bottomTextInput = document.getElementById("bottom-text");
const fontSizeInput = document.getElementById("font-size");
const fontSizeValue = document.getElementById("font-size-value");
const modeImageBtn = document.getElementById("mode-image");
const modeTextBtn = document.getElementById("mode-text");
const galleryContainer = document.getElementById("gallery-container");
const saveStatus = document.getElementById("save-status");

let currentMode = "image";
let currentImage = null;
let activePresetId = null;
let uploadedFile = null;
let backgroundColor = DEFAULT_BACKGROUND;
let isReady = false;

function setSaveStatus(message, isError = false) {
  saveStatus.textContent = message;
  saveStatus.classList.toggle("error", isError);
}

function setReady(ready) {
  isReady = ready;
  canvas.classList.toggle("visible", ready);
  emptyState.classList.toggle("hidden", ready);
  downloadBtn.disabled = !ready;
  saveBtn.disabled = !ready;
}

function getFontSize() {
  return Number(fontSizeInput.value);
}

function renderMeme() {
  if (currentMode === "text") {
    renderMemeToCanvas(canvas, {
      kind: "text",
      topText: topTextInput.value,
      bottomText: bottomTextInput.value,
      fontSize: getFontSize(),
      backgroundColor,
    });
    setReady(true);
    return;
  }

  if (!currentImage) {
    setReady(false);
    return;
  }

  renderMemeToCanvas(canvas, {
    kind: "image",
    topText: topTextInput.value,
    bottomText: bottomTextInput.value,
    fontSize: getFontSize(),
    image: currentImage,
  });
  setReady(true);
}

function setMode(mode) {
  currentMode = mode;
  modeImageBtn.classList.toggle("active", mode === "image");
  modeTextBtn.classList.toggle("active", mode === "text");
  modeImageBtn.setAttribute("aria-pressed", mode === "image" ? "true" : "false");
  modeTextBtn.setAttribute("aria-pressed", mode === "text" ? "true" : "false");

  imagePanel.hidden = mode !== "image";
  textBgPanel.hidden = mode !== "text";

  if (mode === "text") {
    emptyState.textContent = "Add text to preview your meme";
    renderMeme();
  } else {
    emptyState.textContent = "Upload an image or pick a template to start";
    if (!currentImage) setReady(false);
    else renderMeme();
  }
}

async function setCurrentImage(img, presetId = null, file = null) {
  currentImage = img;
  activePresetId = presetId;
  uploadedFile = file;
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
        await setCurrentImage(imgEl, preset.id, null);
      } catch (err) {
        console.error(err);
      }
    });

    presetGrid.appendChild(btn);
  });
}

function buildBgSwatches() {
  BACKGROUND_COLORS.forEach((swatch) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "bg-swatch";
    btn.style.backgroundColor = swatch.value;
    btn.title = swatch.label;
    btn.setAttribute("aria-label", swatch.label);
    btn.dataset.color = swatch.value;
    btn.addEventListener("click", () => {
      backgroundColor = swatch.value;
      customBgInput.value = swatch.value;
      updateBgSelection();
      renderMeme();
    });
    bgSwatches.appendChild(btn);
  });
  updateBgSelection();
}

function updateBgSelection() {
  bgSwatches.querySelectorAll(".bg-swatch").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.color === backgroundColor);
  });
}

async function loadMemeFromGallery(meme) {
  topTextInput.value = meme.topText || "";
  bottomTextInput.value = meme.bottomText || "";
  fontSizeInput.value = meme.fontSize || 48;
  fontSizeValue.textContent = fontSizeInput.value;

  if (meme.kind === "text") {
    backgroundColor = meme.backgroundColor || DEFAULT_BACKGROUND;
    customBgInput.value = backgroundColor;
    updateBgSelection();
    setMode("text");
    return;
  }

  setMode("image");
  uploadedFile = null;

  if (meme.templateId) {
    const preset = PRESETS.find((p) => p.id === meme.templateId);
    if (preset) {
      const img = await loadImageFromSrc(preset.src);
      await setCurrentImage(img, meme.templateId, null);
      return;
    }
  }

  if (meme.image?.url) {
    const img = await loadImageFromSrc(meme.image.url);
    await setCurrentImage(img, null, null);
    return;
  }

  currentImage = null;
  activePresetId = null;
  setReady(false);
}

imageUpload.addEventListener("change", async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;

  const url = URL.createObjectURL(file);
  try {
    const img = await loadImageFromSrc(url);
    await setCurrentImage(img, null, file);
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

customBgInput.addEventListener("input", () => {
  backgroundColor = customBgInput.value;
  updateBgSelection();
  renderMeme();
});

modeImageBtn.addEventListener("click", () => setMode("image"));
modeTextBtn.addEventListener("click", () => setMode("text"));

downloadBtn.addEventListener("click", async () => {
  if (!isReady) return;
  try {
    const blob = await canvasToBlob(canvas);
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "meme.png";
    link.click();
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error(err);
  }
});

saveBtn.addEventListener("click", async () => {
  if (!isReady) return;

  saveBtn.disabled = true;
  setSaveStatus("Saving…");

  try {
    const memeData = {
      kind: currentMode,
      topText: topTextInput.value,
      bottomText: bottomTextInput.value,
      fontSize: getFontSize(),
    };

    let fileToUpload = null;

    if (currentMode === "text") {
      memeData.backgroundColor = backgroundColor;
    } else if (uploadedFile) {
      fileToUpload = uploadedFile;
    } else if (activePresetId) {
      memeData.templateId = activePresetId;
    } else {
      const blob = await canvasToBlob(canvas);
      fileToUpload = new File([blob], "meme.png", { type: "image/png" });
    }

    await saveMeme(memeData, fileToUpload);
    setSaveStatus("Saved to gallery!");
    setTimeout(() => setSaveStatus(""), 3000);
  } catch (err) {
    console.error(err);
    setSaveStatus("Save failed. Check console.", true);
  } finally {
    saveBtn.disabled = !isReady;
  }
});

const { renderGallery } = initGallery({
  container: galleryContainer,
  onLoadMeme: loadMemeFromGallery,
});

subscribeMemes(
  (memes) => renderGallery(memes),
  (err) => console.error("Gallery error:", err)
);

buildPresetGrid();
buildBgSwatches();
setMode("image");
setReady(false);
