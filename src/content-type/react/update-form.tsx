"use client";

import { JsonSchema7ObjectType } from "zod-to-json-schema";

import { SchemaForm } from "../../components/schema-form";
import { createLink } from "../../next/base-url";
import { Entity } from "../../db";

type FormProps = {
  fields: JsonSchema7ObjectType;
  link: { cms: string; api: string };
  entity: Entity;
  contentTypeName: string;
};

export function UpdateForm({
  fields,
  link,
  entity,
  contentTypeName,
}: FormProps) {
  const apiEndpoint = createLink(link.api, contentTypeName, entity.id);

  async function handleSubmit(formData: unknown) {
    const response = await fetch(apiEndpoint, {
      body: JSON.stringify(formData),
      method: "POST",
    });

    if (response.ok) {
      return;
    }
  }

  return (
    <div className="p-8 grid gap-8">
      <h1 className="text-2xl font-bold">Create {contentTypeName}</h1>

      <SchemaForm
        onSubmit={handleSubmit}
        fields={fields}
        defaults={entity.fields}
      />
    </div>
  );
}
