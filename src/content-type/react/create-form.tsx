"use client";

import { useRouter } from "next/navigation";
import { JsonSchema7ObjectType } from "zod-to-json-schema";

import { SchemaForm } from "../../components/schema-form";
import { createLink } from "../../next/base-url";

type FormProps = {
  fields: JsonSchema7ObjectType;
  link: { cms: string; api: string };
  contentTypeName: string;
};

export function CreateForm({ fields, link, contentTypeName }: FormProps) {
  const router = useRouter();

  const overviewPage = createLink(link.cms, contentTypeName);
  const apiEndpoint = createLink(link.api, contentTypeName);

  async function handleSubmit(formData: unknown) {
    const response = await fetch(apiEndpoint, {
      body: JSON.stringify(formData),
      method: "PUT",
    });

    if (response.ok) {
      router.push(overviewPage);
      return;
    }
  }

  return (
    <div className="p-8 grid gap-8">
      <h1 className="text-2xl font-bold">Create {contentTypeName}</h1>

      <SchemaForm onSubmit={handleSubmit} fields={fields} />
    </div>
  );
}
