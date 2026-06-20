export const SORT_NEWEST = "newest";
export const SORT_TOP_VOTED = "top-voted";

function getCreatedAtTime(meme) {
  if (!meme.createdAt) return 0;
  return new Date(meme.createdAt).getTime();
}

function getUpvoteCount(meme) {
  return meme.upvoteCount ?? 0;
}

/**
 * Sort memes for gallery display.
 * @param {Array} memes
 * @param {"newest" | "top-voted"} mode
 */
export function sortMemes(memes, mode = SORT_NEWEST) {
  const copy = [...memes];

  if (mode === SORT_TOP_VOTED) {
    return copy.sort((a, b) => {
      const voteDiff = getUpvoteCount(b) - getUpvoteCount(a);
      if (voteDiff !== 0) return voteDiff;
      return getCreatedAtTime(b) - getCreatedAtTime(a);
    });
  }

  return copy.sort(
    (a, b) => getCreatedAtTime(b) - getCreatedAtTime(a)
  );
}
