import { i } from "@instantdb/core";

const _schema = i.schema({
  entities: {
    $files: i.entity({
      path: i.string().unique().indexed(),
      url: i.string(),
    }),
    memes: i.entity({
      kind: i.string(),
      topText: i.string(),
      bottomText: i.string().optional(),
      fontSize: i.number(),
      templateId: i.string().optional(),
      backgroundColor: i.string().optional(),
      upvoteCount: i.number().optional(),
      createdAt: i.date(),
    }),
  },
  links: {
    memeImage: {
      forward: { on: "memes", has: "one", label: "image" },
      reverse: { on: "$files", has: "many", label: "memes" },
    },
  },
  rooms: {},
});

type _AppSchema = typeof _schema;
interface AppSchema extends _AppSchema {}
const schema: AppSchema = _schema;

export type { AppSchema };
export default schema;
