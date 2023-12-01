import { z } from "zod";

import { DBAdapter } from "../db/adapter";

export type ContentTypeConfig = {
  name: string;
  fieldsSchema: z.ZodType;
  dbAdapter: DBAdapter;
};

export const createContentType = (
  name: string,
  fieldsSchema: z.ZodType,
  dbAdapter: DBAdapter
): ContentType => {
  return new ContentType(name, fieldsSchema, dbAdapter);
};

export class ContentType {
  constructor(
    public readonly name: string,
    public readonly fieldsSchema: z.ZodType,
    public readonly dbAdapter: DBAdapter
  ) {}
}
