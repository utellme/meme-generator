export const PRESETS = [
  { id: "sunset", label: "Sunset", src: "/templates/sunset.svg" },
  { id: "ocean", label: "Ocean", src: "/templates/ocean.svg" },
  { id: "mountain", label: "Mountain", src: "/templates/mountain.svg" },
  { id: "studio", label: "Studio", src: "/templates/studio.svg" },
];

export const FONT_FAMILY =
  'Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif';
export const PADDING = 16;

export const TEXT_CANVAS_WIDTH = 800;
export const TEXT_CANVAS_HEIGHT = 600;

export const BACKGROUND_COLORS = [
  { id: "midnight", label: "Midnight", value: "#1a1a2e" },
  { id: "purple", label: "Purple", value: "#4a1942" },
  { id: "teal", label: "Teal", value: "#0d4f4f" },
  { id: "orange", label: "Orange", value: "#c45c26" },
  { id: "slate", label: "Slate", value: "#2d3748" },
  { id: "white", label: "White", value: "#f7f7f7" },
];

export const DEFAULT_BACKGROUND = BACKGROUND_COLORS[0].value;

/**
 * Word-wrap text to fit within maxWidth using the provided measureText function.
 */
export function wrapText(text, maxWidth, fontSize, measureText) {
  if (!text.trim()) return [];

  const words = text.trim().split(/\s+/);
  const lines = [];
  let currentLine = "";

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    if (measureText(testLine) <= maxWidth) {
      currentLine = testLine;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }

  if (currentLine) lines.push(currentLine);
  return lines;
}

export function getTextCanvasDimensions() {
  return { width: TEXT_CANVAS_WIDTH, height: TEXT_CANVAS_HEIGHT };
}
