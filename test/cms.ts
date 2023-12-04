import "next-cms/dist/global.css";

import { n } from "next-cms";
import { z } from "zod";

/**
 * Restaurant Content Type
 */
const restaurantContentType = n.contentType({
  name: "restaurant",
  fieldsSchema: z.object({
    rating: z.number().min(1).max(5).describe("Rating from 1 to 5"),
    description: z.string().min(10).describe("Description of the restaurant"),
    dogFriendly: z.boolean().optional(),
  }),
  db: {
    name: "restaurant-db",
    adapter: n.testAdapter,
  },
});

/**
 * Restaurant Content Type
 */
const playgroundContentType = n.contentType({
  name: "playground",
  fieldsSchema: z.object({
    state: z.union([z.literal("dirty"), z.literal("clean")]),
    description: z.string(),
  }),
  db: {
    name: "playground-db",
    adapter: n.testAdapter,
  },
});

/**
 * Config
 */
export const config = n.config({
  name: "my-cms",
  link: {
    // base path for api routes
    api: "api",
    // base path for cms client routes
    cms: "cms",
  },
  user: n.userConfig({
    db: {
      name: "user",
      adapter: n.testAdapter,
    },
  }),
  contentTypes: [restaurantContentType, playgroundContentType],
});
