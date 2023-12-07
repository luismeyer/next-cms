"server only";

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
    dogFriendly: z.boolean().default(false).optional(),
    veganMenu: z.boolean().default(false).optional(),
    payByCard: z.boolean().default(true).describe("Can you pay by card?"),
    email: z.string().optional().describe("Email contact of the restaurant"),
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
 * Token config
 */

function hash(value: string) {
  const salt = process.env.SALT;
  return `${salt}+${value}+${salt}`;
}

const token = n.tokenConfig({
  hash,
  tokens: [
    {
      hashedValue: process.env.HASHED_READONLY_TOKEN!,
      expiresAt: new Date("2024-01-01"),
      read: [restaurantContentType],
      write: [playgroundContentType],
    },
  ],
});

/**
 * Config
 */
export const config = n.config({
  name: "my-cms",
  link: {
    api: "api/cms",
    cms: "cms",
    login: "api/auth/signin",
  },
  token,
  contentTypes: [restaurantContentType, playgroundContentType],
});
