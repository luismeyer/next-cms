import { z } from "zod";
import { DBAdapter, dbAdapter } from "../db/adapter";

export const UserFieldsSchema = z.object({
  email: z.string(),
  username: z.string(),
});

export type UserFields = z.infer<typeof UserFieldsSchema>;

export type UserConfig = {
  fieldsSchema: typeof UserFieldsSchema;
  dbAdapter: DBAdapter;
};

export function userConfig({
  db,
}: {
  db: { name: string; adapter: ReturnType<typeof dbAdapter> };
}): UserConfig {
  return {
    fieldsSchema: UserFieldsSchema,
    dbAdapter: db.adapter({ name: db.name, fieldsSchema: UserFieldsSchema }),
  };
}
