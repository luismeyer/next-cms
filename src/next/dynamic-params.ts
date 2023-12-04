import { z } from "zod";

const ParamsSchema = z.object({
  params: z.record(z.string(), z.array(z.string()).optional()),
});

export function parseDynamicParams(params: unknown): string[] | undefined {
  const values = ParamsSchema.parse(params);

  if (!values.params) {
    return undefined;
  }

  return Object.values(values.params)[0];
}
