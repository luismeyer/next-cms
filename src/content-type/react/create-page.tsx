import { JsonSchema7ObjectType, zodToJsonSchema } from "zod-to-json-schema";

import { SchemaForm } from "../../components/schema-form";
import { createLink } from "../../next/base-url";
import { ContentType } from "../definition";
import { redirect } from "next/navigation";

type CreatePageProps = {
  contentType: ContentType;
  link: { cms: string; api: string };
};

export async function CreatePage({
  contentType: { fieldsSchema, name },
  link,
}: CreatePageProps) {
  const schema = zodToJsonSchema(fieldsSchema) as JsonSchema7ObjectType;

  const overviewPage = createLink(link.cms, name);

  async function handleSuccess() {
    "use server";

    redirect(overviewPage);
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Create {name}</h1>

      <SchemaForm
        fields={schema}
        apiEndpoint={createLink(link.api, name)}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
