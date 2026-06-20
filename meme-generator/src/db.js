import { init, id } from "@instantdb/core";
import schema from "../instant.schema.ts";

const appId = import.meta.env.VITE_INSTANT_APP_ID;

if (!appId) {
  console.warn(
    "VITE_INSTANT_APP_ID is not set. Copy .env.example to .env and add your Instant app ID."
  );
}

export const db = init({
  appId: appId || "4285d49b-448b-4bc0-90df-b0a82a2f20ba",
  schema,
  useDateObjects: true,
});

export { id };

export async function saveMeme(memeData, uploadFile = null) {
  const memeId = id();
  const txs = [
    db.tx.memes[memeId].update({
      kind: memeData.kind,
      topText: memeData.topText,
      bottomText: memeData.bottomText || "",
      fontSize: memeData.fontSize,
      templateId: memeData.templateId ?? undefined,
      backgroundColor: memeData.backgroundColor ?? undefined,
      upvoteCount: 0,
      createdAt: new Date(),
    }),
  ];

  if (uploadFile) {
    const path = `memes/${memeId}/${uploadFile.name || "upload.png"}`;
    const { data } = await db.storage.uploadFile(path, uploadFile, {
      contentType: uploadFile.type || "image/png",
    });
    txs.push(db.tx.memes[memeId].link({ image: data.id }));
  }

  await db.transact(txs);
  return memeId;
}

export async function deleteMeme(memeId) {
  await db.transact(db.tx.memes[memeId].delete());
}

export async function upvoteMeme(memeId, currentCount = 0) {
  await db.transact(
    db.tx.memes[memeId].update({ upvoteCount: currentCount + 1 })
  );
}

export function subscribeMemes(onData, onError) {
  return db.subscribeQuery({ memes: { image: {} } }, (resp) => {
    if (resp.error) {
      onError?.(resp.error);
      return;
    }
    if (resp.data) {
      onData(resp.data.memes ?? []);
    }
  });
}
