import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  PRESETS,
  PADDING,
  FONT_FAMILY,
  wrapText,
} from "../public/meme-text.js";

/** Deterministic width: 10px per character */
function charWidthMeasure(line) {
  return line.length * 10;
}

describe("PRESETS", () => {
  it("defines four templates with required fields", () => {
    assert.equal(PRESETS.length, 4);
    for (const preset of PRESETS) {
      assert.ok(preset.id, "preset must have id");
      assert.ok(preset.label, "preset must have label");
      assert.ok(preset.src.startsWith("/templates/"), "preset src must be under /templates/");
    }
  });

  it("has unique preset ids", () => {
    const ids = PRESETS.map((p) => p.id);
    assert.equal(new Set(ids).size, ids.length);
  });
});

describe("constants", () => {
  it("exports expected padding and font family", () => {
    assert.equal(PADDING, 16);
    assert.match(FONT_FAMILY, /Impact/);
  });
});

describe("wrapText", () => {
  it("returns empty array for empty or whitespace-only text", () => {
    assert.deepEqual(wrapText("", 100, 48, charWidthMeasure), []);
    assert.deepEqual(wrapText("   ", 100, 48, charWidthMeasure), []);
    assert.deepEqual(wrapText("\t\n", 100, 48, charWidthMeasure), []);
  });

  it("returns a single line when text fits within maxWidth", () => {
    const result = wrapText("HELLO WORLD", 200, 48, charWidthMeasure);
    assert.deepEqual(result, ["HELLO WORLD"]);
  });

  it("wraps text onto multiple lines when width exceeded", () => {
    // "ONE TWO THREE" = 13 chars = 130px; maxWidth 80 forces breaks
    const result = wrapText("ONE TWO THREE", 80, 48, charWidthMeasure);
    assert.deepEqual(result, ["ONE TWO", "THREE"]);
  });

  it("places an oversized single word on its own line", () => {
    const result = wrapText("SUPERCALIFRAGILISTIC", 50, 48, charWidthMeasure);
    assert.deepEqual(result, ["SUPERCALIFRAGILISTIC"]);
  });

  it("trims leading and trailing whitespace before wrapping", () => {
    const result = wrapText("  HELLO WORLD  ", 200, 48, charWidthMeasure);
    assert.deepEqual(result, ["HELLO WORLD"]);
  });

  it("handles multiple spaces between words as single split", () => {
    const result = wrapText("HELLO    WORLD", 200, 48, charWidthMeasure);
    assert.deepEqual(result, ["HELLO WORLD"]);
  });

  it("wraps each word individually when maxWidth is very narrow", () => {
    const result = wrapText("A B C", 15, 48, charWidthMeasure);
    assert.deepEqual(result, ["A", "B", "C"]);
  });
});
