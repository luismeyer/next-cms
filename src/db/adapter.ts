import { ZodObject, ZodRawShape, TypeOf } from "zod";

export type Fields = Record<string, number | string | boolean | unknown>;

export interface Entity<F extends Fields = Fields> {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  fields: F;
}

export type DBAdapterApi<
  S extends ZodObject<ZodRawShape> = ZodObject<ZodRawShape>,
  F extends TypeOf<S> = TypeOf<S>
> = (
  name: string,
  fieldsSchema: S
) => {
  create(fields: F): Promise<Entity<F>>;
  read(id: string): Promise<Entity<F> | undefined>;
  update(id: string, fields: F): Promise<Entity<F>>;
  list(options?: { limit?: number; offset?: number }): Promise<Entity<F>[]>;
};

export type DBAdapter<
  S extends ZodObject<ZodRawShape> = ZodObject<ZodRawShape>,
  F extends TypeOf<S> = TypeOf<S>
> = {
  name: string;
  fieldsSchema: S;
  api: ReturnType<DBAdapterApi<S, F>>;
};

export function dbAdapter<
  S extends ZodObject<ZodRawShape> = ZodObject<ZodRawShape>,
  F extends TypeOf<S> = TypeOf<S>
>(api: DBAdapterApi<S, F>) {
  return function ({
    name,
    fieldsSchema,
  }: {
    name: string;
    fieldsSchema: S;
  }): DBAdapter<S, F> {
    return {
      name,
      fieldsSchema,
      api: api(name, fieldsSchema),
    };
  };
}
