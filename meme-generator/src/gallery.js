import { PRESETS, BACKGROUND_COLORS } from "./meme-text.js";
import { renderMemeToCanvas, loadImageFromSrc } from "./render.js";
import { deleteMeme, upvoteMeme } from "./db.js";
import { sortMemes, SORT_NEWEST, SORT_TOP_VOTED } from "./gallery-sort.js";

function truncate(text, max = 40) {
  if (!text) return "(no text)";
  return text.length > max ? `${text.slice(0, max)}…` : text;
}

function formatDate(date) {
  if (!date) return "";
  const d = date instanceof Date ? date : new Date(date);
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

async function renderThumbnail(canvas, meme) {
  const opts = {
    kind: meme.kind,
    topText: meme.topText,
    bottomText: meme.bottomText || "",
    fontSize: meme.fontSize,
    backgroundColor: meme.backgroundColor,
  };

  if (meme.kind === "image") {
    if (meme.templateId) {
      const preset = PRESETS.find((p) => p.id === meme.templateId);
      if (preset) {
        opts.image = await loadImageFromSrc(preset.src);
      }
    } else if (meme.image?.url) {
      opts.image = await loadImageFromSrc(meme.image.url);
    }
    if (!opts.image) return;
  }

  renderMemeToCanvas(canvas, opts);
}

export function initGallery({ container, onLoadMeme }) {
  let sortMode = SORT_NEWEST;

  container.innerHTML = `
    <div class="gallery-sort" role="group" aria-label="Sort gallery">
      <button type="button" class="gallery-sort-btn active" data-sort="${SORT_NEWEST}">Newest</button>
      <button type="button" class="gallery-sort-btn" data-sort="${SORT_TOP_VOTED}">Top voted</button>
    </div>
    <p class="gallery-empty">No saved memes yet. Create one and hit Save!</p>
    <ul class="gallery-list" id="gallery-list" hidden></ul>
  `;

  const sortNewestBtn = container.querySelector(`[data-sort="${SORT_NEWEST}"]`);
  const sortTopBtn = container.querySelector(`[data-sort="${SORT_TOP_VOTED}"]`);
  const emptyEl = container.querySelector(".gallery-empty");
  const listEl = container.querySelector("#gallery-list");

  function setSortMode(mode) {
    sortMode = mode;
    sortNewestBtn.classList.toggle("active", mode === SORT_NEWEST);
    sortTopBtn.classList.toggle("active", mode === SORT_TOP_VOTED);
    sortNewestBtn.setAttribute("aria-pressed", mode === SORT_NEWEST ? "true" : "false");
    sortTopBtn.setAttribute("aria-pressed", mode === SORT_TOP_VOTED ? "true" : "false");
  }

  sortNewestBtn.addEventListener("click", () => {
    setSortMode(SORT_NEWEST);
    if (lastMemes) renderGallery(lastMemes);
  });

  sortTopBtn.addEventListener("click", () => {
    setSortMode(SORT_TOP_VOTED);
    if (lastMemes) renderGallery(lastMemes);
  });

  let lastMemes = null;

  function renderGallery(memes) {
    lastMemes = memes;
    const sorted = sortMemes(memes, sortMode);

    if (sorted.length === 0) {
      emptyEl.hidden = false;
      listEl.hidden = true;
      listEl.innerHTML = "";
      return;
    }

    emptyEl.hidden = true;
    listEl.hidden = false;
    listEl.innerHTML = "";

    for (const meme of sorted) {
      const voteCount = meme.upvoteCount ?? 0;

      const li = document.createElement("li");
      li.className = "gallery-item";

      const thumbCanvas = document.createElement("canvas");
      thumbCanvas.className = "gallery-thumb";
      thumbCanvas.width = 160;
      thumbCanvas.height = 120;
      thumbCanvas.setAttribute("aria-hidden", "true");

      const info = document.createElement("div");
      info.className = "gallery-info";

      const badge = document.createElement("span");
      badge.className = `gallery-badge gallery-badge--${meme.kind}`;
      badge.textContent = meme.kind === "text" ? "Text" : "Image";

      const title = document.createElement("p");
      title.className = "gallery-title";
      title.textContent = truncate(meme.topText);

      const meta = document.createElement("p");
      meta.className = "gallery-meta";
      meta.textContent = formatDate(meme.createdAt);

      const actions = document.createElement("div");
      actions.className = "gallery-actions";

      const upvoteBtn = document.createElement("button");
      upvoteBtn.type = "button";
      upvoteBtn.className = "gallery-btn gallery-btn--upvote";
      upvoteBtn.innerHTML = `▲ <span class="gallery-upvote-count">${voteCount}</span>`;
      upvoteBtn.setAttribute("aria-label", `Upvote (${voteCount})`);
      upvoteBtn.addEventListener("click", async (e) => {
        e.stopPropagation();
        try {
          await upvoteMeme(meme.id, voteCount);
        } catch (err) {
          console.error(err);
          alert("Failed to upvote meme.");
        }
      });

      const loadBtn = document.createElement("button");
      loadBtn.type = "button";
      loadBtn.className = "gallery-btn gallery-btn--load";
      loadBtn.textContent = "Load";
      loadBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        onLoadMeme(meme);
      });

      const deleteBtn = document.createElement("button");
      deleteBtn.type = "button";
      deleteBtn.className = "gallery-btn gallery-btn--delete";
      deleteBtn.textContent = "Delete";
      deleteBtn.addEventListener("click", async (e) => {
        e.stopPropagation();
        try {
          await deleteMeme(meme.id);
        } catch (err) {
          console.error(err);
          alert("Failed to delete meme.");
        }
      });

      actions.appendChild(upvoteBtn);
      actions.appendChild(loadBtn);
      actions.appendChild(deleteBtn);

      info.appendChild(badge);
      info.appendChild(title);
      info.appendChild(meta);
      info.appendChild(actions);

      li.appendChild(thumbCanvas);
      li.appendChild(info);

      li.addEventListener("click", () => onLoadMeme(meme));

      listEl.appendChild(li);

      renderThumbnail(thumbCanvas, meme).catch(() => {
        const ctx = thumbCanvas.getContext("2d");
        ctx.fillStyle = "#1e2230";
        ctx.fillRect(0, 0, thumbCanvas.width, thumbCanvas.height);
        ctx.fillStyle = "#9aa3b5";
        ctx.font = "12px Inter, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("Preview unavailable", 80, 60);
      });
    }
  }

  return { renderGallery };
}

export { BACKGROUND_COLORS };
