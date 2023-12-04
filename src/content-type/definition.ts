import { ZodRawShape, z } from "zod";

import { DBAdapter, dbAdapter } from "../db/adapter";

export type ContentType = {
  name: string;
  fieldsSchema: z.ZodObject<ZodRawShape>;
  dbAdapter: DBAdapter;
};

export const contentType = ({
  db,
  fieldsSchema,
  name,
}: {
  name: string;
  fieldsSchema: z.ZodObject<ZodRawShape>;
  db: { name: string; adapter: ReturnType<typeof dbAdapter> };
}): ContentType => {
  const FieldsBase = z.object({
    status: z
      .enum(["draft", "published", "archived"])
      .default("draft")
      .describe("Name of the entity. Required for every content-type."),
    name: z
      .string()
      .min(1)
      .max(255)
      .describe("Name of the entity. Required for every content-type."),
  });

  return {
    name,
    fieldsSchema: FieldsBase.merge(fieldsSchema),
    dbAdapter: db.adapter({ name: db.name, fieldsSchema }),
  };
};
