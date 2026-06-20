export const PRESETS = [
  { id: "sunset", label: "Sunset", src: "/templates/sunset.svg" },
  { id: "ocean", label: "Ocean", src: "/templates/ocean.svg" },
  { id: "mountain", label: "Mountain", src: "/templates/mountain.svg" },
  { id: "studio", label: "Studio", src: "/templates/studio.svg" },
];

export const FONT_FAMILY =
  'Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif';
export const PADDING = 16;

/**
 * Word-wrap text to fit within maxWidth using the provided measureText function.
 * @param {string} text
 * @param {number} maxWidth
 * @param {number} fontSize
 * @param {(line: string) => number} measureText - returns pixel width for a line
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
