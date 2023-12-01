import { z } from "zod";
import { DBAdapter } from "../db/adapter";

export const UserFieldsSchema = z.object({
  email: z.string(),
  username: z.string(),
});

export type UserFields = z.infer<typeof UserFieldsSchema>;

export class UserConfig {
  constructor(public readonly dbAdapter: DBAdapter) {}
}
