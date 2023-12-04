import { JsonSchema7ObjectType, zodToJsonSchema } from "zod-to-json-schema";

import { SchemaForm } from "../../components/schema-form";
import { ContentType } from "../definition";

type CreatePageProps = {
  contentType: ContentType;
  link: { cms: string; api: string };
};

export async function CreatePage({
  contentType: { fieldsSchema, name },
  link,
}: CreatePageProps) {
  const schema = zodToJsonSchema(fieldsSchema) as JsonSchema7ObjectType;

  return (
    <div className="p-8 grid gap-8">
      <h1 className="text-2xl font-bold">Create {name}</h1>

      <SchemaForm fields={schema} link={link} name={name} />
    </div>
  );
}
