import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  sortMemes,
  SORT_NEWEST,
  SORT_TOP_VOTED,
} from "../src/gallery-sort.js";

const memes = [
  { id: "a", topText: "Old low votes", upvoteCount: 2, createdAt: "2026-01-01T10:00:00Z" },
  { id: "b", topText: "New high votes", upvoteCount: 10, createdAt: "2026-06-01T10:00:00Z" },
  { id: "c", topText: "New no votes", upvoteCount: undefined, createdAt: "2026-06-02T10:00:00Z" },
  { id: "d", topText: "Tie votes newer", upvoteCount: 5, createdAt: "2026-05-01T10:00:00Z" },
  { id: "e", topText: "Tie votes older", upvoteCount: 5, createdAt: "2026-04-01T10:00:00Z" },
];

describe("sortMemes", () => {
  it("sorts by createdAt desc in newest mode", () => {
    const sorted = sortMemes(memes, SORT_NEWEST);
    assert.deepEqual(sorted.map((m) => m.id), ["c", "b", "d", "e", "a"]);
  });

  it("defaults to newest mode", () => {
    const sorted = sortMemes(memes);
    assert.equal(sorted[0].id, "c");
  });

  it("sorts by upvoteCount desc in top-voted mode", () => {
    const sorted = sortMemes(memes, SORT_TOP_VOTED);
    assert.equal(sorted[0].id, "b");
    assert.equal(sorted[1].id, "d");
    assert.equal(sorted[2].id, "e");
  });

  it("uses createdAt as tiebreaker for equal upvote counts", () => {
    const sorted = sortMemes(memes, SORT_TOP_VOTED);
    const tieIds = sorted.filter((m) => m.upvoteCount === 5).map((m) => m.id);
    assert.deepEqual(tieIds, ["d", "e"]);
  });

  it("treats missing upvoteCount as zero", () => {
    const sorted = sortMemes(memes, SORT_TOP_VOTED);
    assert.equal(sorted[sorted.length - 1].id, "c");
  });

  it("does not mutate the input array", () => {
    const input = [...memes];
    sortMemes(input, SORT_TOP_VOTED);
    assert.deepEqual(input.map((m) => m.id), memes.map((m) => m.id));
  });
});
