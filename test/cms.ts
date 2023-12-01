import "next-cms/dist/index.css";

import { Config, TmpDBAdapter, UserConfig, createContentType } from "next-cms";
import { z } from "zod";

/**
 * User config
 */

const userAdapter = new TmpDBAdapter("user");
const userConfig = new UserConfig(userAdapter);

/**
 * Restaurant Content Type
 */

const restaurantAdapter = new TmpDBAdapter("restaurant");

const restaurantSchema = z.object({
  rating: z.number(),
  description: z.string(),
});

const restaurantContentType = createContentType(
  "restaurant",
  restaurantSchema,
  restaurantAdapter
);

/**
 * Restaurant Content Type
 */

const playgroundAdapter = new TmpDBAdapter("playground");

const playgroundSchema = z.object({
  state: z.union([z.literal("dirty"), z.literal("clean")]),
  description: z.string(),
});

const playgroundContentType = createContentType(
  "playground",
  playgroundSchema,
  playgroundAdapter
);

/**
 * Config
 */

export const config = new Config("my-cms", userConfig);
config.registerContentType(restaurantContentType);
config.registerContentType(playgroundContentType);
